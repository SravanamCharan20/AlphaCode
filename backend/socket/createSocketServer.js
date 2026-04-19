import { Server } from "socket.io";
import jwt from "jsonwebtoken";

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

    console.log("New authenticated user connected:", socket.id, socket.user.role);

    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", socket.id, reason);
    });
  });

  return io;
}
