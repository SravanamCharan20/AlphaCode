import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const rooms = new Map();

const DEFAULT_ROOM_CONFIG = {
  maxMembers: 4,
  questionSet: "Array Basics",
  questionCount: 5,
};

const parseCookies = (cookieHeader = "") => {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const [name, ...valueParts] = cookie.split("=");

      if (!name) {
        return cookies;
      }

      cookies[name] = decodeURIComponent(valueParts.join("="));
      return cookies;
    }, {});
};

export function createSocketServer(server, frontendUrl, jwtSecret) {
  const io = new Server(server, {
    cors: {
      origin: frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = socket.handshake.auth?.token || cookies.token;

      if (!token) {
        return next(new Error("Unauthorized - No token"));
      }

      const decoded = jwt.verify(token, jwtSecret);
      socket.user = decoded;

      next();
    } catch {
      next(new Error("Unauthorized - Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    socket.join(`role:${socket.user.role}`);

    socket.emit("socket:ready", {
      socketId: socket.id,
      userId: socket.user.id,
      role: socket.user.role,
    });

    console.log(
      "New authenticated user connected:",
      socket.id,
      socket.user.role,
    );

    const getUserId = () => String(socket.user.id);

    const buildMember = (user, overrides = {}) => ({
      userId: String(user.id),
      username: user.username || `User ${String(user.id).slice(-4)}`,
      role: user.role,
      isReady: false,
      ...overrides,
    });

    const serializeRoom = (roomCode, room) => ({
      roomCode,
      createdBy: room.createdBy,
      status: room.status,
      config: room.config,
      members: room.members.map((member) => ({ ...member })),
      isActive: room.isActive,
    });

    const getRoomForMember = (roomCode) => {
      const room = rooms.get(roomCode);
      if (!room) {
        return null;
      }

      const isMember = room.members.some((member) => member.userId === getUserId());
      return isMember ? room : null;
    };

    const emitRoomUpdate = (roomCode) => {
      const room = rooms.get(roomCode);
      if (!room) {
        return;
      }

      io.to(`room:${roomCode}`).emit("room:updated", {
        room: serializeRoom(roomCode, room),
      });
    };

    socket.on("create-room", (payload = {}) => {
      try {
        const user = socket.user;

        if (!user) {
          return socket.emit("room:error", {
            message: "Unauthorized",
          });
        }

        if (user.role !== "admin") {
          return socket.emit("room:error", {
            message: "Forbidden - Admins only",
          });
        }

        const config = {
          maxMembers: Number(payload.maxMembers) || DEFAULT_ROOM_CONFIG.maxMembers,
          questionSet:
            typeof payload.questionSet === "string" && payload.questionSet.trim()
              ? payload.questionSet.trim()
              : DEFAULT_ROOM_CONFIG.questionSet,
          questionCount:
            Number(payload.questionCount) || DEFAULT_ROOM_CONFIG.questionCount,
        };

        const roomCode = uuidv4();

        rooms.set(roomCode, {
          createdBy: String(user.id),
          config,
          status: "lobby",
          members: [buildMember(user)],
          isActive: false,
        });

        socket.join(`room:${roomCode}`);

        return socket.emit("room:created", {
          message: "Room created successfully",
          room: serializeRoom(roomCode, rooms.get(roomCode)),
        });
      } catch (error) {
        console.error(error);

        return socket.emit("room:error", {
          message: "Something went wrong while creating room",
        });
      }
    });

    socket.on("join-room", ({ roomCode }) => {
      try {
        const room = rooms.get(roomCode);
        if (!room) {
          return socket.emit("room:error", {
            message: "Room not found",
          });
        }
        if (room.isActive) {
          return socket.emit("room:error", {
            message: "Room is already active",
          });
        }

        if (room.members.length >= room.config.maxMembers) {
          return socket.emit("room:error", {
            message: "Room is already full",
          });
        }

        const userId = getUserId();
        if (!room.members.some((member) => member.userId === userId)) {
          room.members.push(buildMember(socket.user));
        }

        socket.join(`room:${roomCode}`);

        emitRoomUpdate(roomCode);

        return socket.emit("room:joined", {
          message: "Joined room successfully",
          room: serializeRoom(roomCode, room),
        });
      } catch (error) {
        console.error(error);

        return socket.emit("room:error", {
          message: "Something went wrong while joining room",
        });
      }
    });

    socket.on("sync-room", ({ roomCode }) => {
      const room = getRoomForMember(roomCode);

      if (!room) {
        return socket.emit("room:error", {
          message: "Room not found for this user",
        });
      }

      socket.join(`room:${roomCode}`);

      return socket.emit("room:sync", {
        room: serializeRoom(roomCode, room),
      });
    });

    socket.on("set-ready", ({ roomCode, isReady }) => {
      try {
        const room = getRoomForMember(roomCode);

        if (!room) {
          return socket.emit("room:error", {
            message: "Room not found for this user",
          });
        }

        const member = room.members.find((entry) => entry.userId === getUserId());
        if (!member) {
          return socket.emit("room:error", {
            message: "Member not found in room",
          });
        }

        member.isReady = Boolean(isReady);
        emitRoomUpdate(roomCode);
      } catch (error) {
        console.error(error);

        return socket.emit("room:error", {
          message: "Something went wrong while updating readiness",
        });
      }
    });

    socket.on("leave-room", ({ roomCode }) => {
      try {
        const room = getRoomForMember(roomCode);

        if (!room) {
          return socket.emit("room:error", {
            message: "Room not found for this user",
          });
        }

        room.members = room.members.filter((member) => member.userId !== getUserId());
        socket.leave(`room:${roomCode}`);

        if (room.members.length === 0 || room.createdBy === getUserId()) {
          rooms.delete(roomCode);
          io.to(`room:${roomCode}`).emit("room:closed", {
            message: "Room closed",
            roomCode,
          });
          return socket.emit("room:left", {
            roomCode,
            message: "You left the room",
          });
        }

        emitRoomUpdate(roomCode);

        return socket.emit("room:left", {
          roomCode,
          message: "You left the room",
        });
      } catch (error) {
        console.error(error);

        return socket.emit("room:error", {
          message: "Something went wrong while leaving the room",
        });
      }
    });

    socket.on("start-room", ({ roomCode }) => {
      try {
        const room = getRoomForMember(roomCode);

        if (!room) {
          return socket.emit("room:error", {
            message: "Room not found",
          });
        }
        if (room.createdBy !== getUserId()) {
          return socket.emit("room:error", {
            message: "Only admin can start the room",
          });
        }

        if (room.members.length !== room.config.maxMembers) {
          return socket.emit("room:error", {
            message: "All member slots must be filled before starting",
          });
        }

        if (room.members.some((member) => !member.isReady)) {
          return socket.emit("room:error", {
            message: "All members must be ready before starting",
          });
        }

        room.isActive = true;
        room.status = "arena";

        io.to(`room:${roomCode}`).emit("room:started", {
          message: "Room has been started",
          room: serializeRoom(roomCode, room),
        });
      } catch (error) {
        console.error(error);

        return socket.emit("room:error", {
          message: "Something went wrong while starting room",
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [roomCode, room] of rooms) {
        const member = room.members.find((entry) => entry.userId === getUserId());
        if (!member) {
          continue;
        }

        member.isReady = false;
        emitRoomUpdate(roomCode);
      }
    });
  });

  return io;
}
