import express from "express";
import { userAuth } from "../config/auth.js";
import { v4 as uuidv4 } from "uuid";

const roomRouter = express.Router();

const rooms = new Map();
const DEFAULT_ROOM_CONFIG = {
  maxMembers: 4,
  questionSet: "Array Basics",
  questionCount: 5,
};

roomRouter.post("/createRoom", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { maxMembers, questionSet, questionCount } = req.body || {};
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }
    const roomID = uuidv4();
    rooms.set(roomID, {
      createdBy: String(user.id),
      status: "lobby",
      config: {
        maxMembers: Number(maxMembers) || DEFAULT_ROOM_CONFIG.maxMembers,
        questionSet:
          typeof questionSet === "string" && questionSet.trim()
            ? questionSet.trim()
            : DEFAULT_ROOM_CONFIG.questionSet,
        questionCount:
          Number(questionCount) || DEFAULT_ROOM_CONFIG.questionCount,
      },
      members: [
        {
          userId: String(user.id),
          username: user.username || `User ${String(user.id).slice(-4)}`,
          role: user.role,
          isReady: false,
        },
      ],
      isActive: false,
    });
    res.json({
      message: "Room created",
      roomCode: roomID,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating room" });
  }
});

roomRouter.post("/joinRoom", userAuth, async (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = rooms.get(roomCode);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.isActive) {
      return res.status(400).json({ message: "Room is already active" });
    }
    if (room.members.length >= room.config.maxMembers) {
      return res.status(400).json({ message: "Room is already full" });
    }
    if (!room.members.some((member) => member.userId === String(req.user.id))) {
      room.members.push({
        userId: String(req.user.id),
        username: req.user.username || `User ${String(req.user.id).slice(-4)}`,
        role: req.user.role,
        isReady: false,
      });
    }

    res.json({
      message: "Joined room successfully",
      roomCode,
      room,
    });
  } catch (error) {
    res.status(500).json({ message: "Error joining room" });
  }
});

roomRouter.post("/start-room", userAuth, (req, res) => {
  try {
    const { roomCode } = req.body;

    const room = rooms.get(roomCode);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.createdBy !== String(req.user.id)) {
      return res.status(403).json({ message: "Only admin can start room" });
    }

    room.isActive = true;
    room.status = "arena";

    res.json({
      message: "Room started",
      room,
    });
  } catch (err) {
    res.status(500).json({ message: "Error starting room" });
  }
});

export default roomRouter;
