import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { createSocketServer } from "./socket/createSocketServer.js";

const app = express();
const PORT = process.env.PORT || "9999";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const server = http.createServer(app);
createSocketServer(server, FRONTEND_URL, process.env.JWT_SECRET);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", userRouter);

const startServer = () => {
  try {
    connectDB();
    server.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
};
startServer();
