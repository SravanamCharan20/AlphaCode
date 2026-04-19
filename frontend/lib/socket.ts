import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import type { User } from "@/types/auth";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:9999";

export function createAuthenticatedSocket(user: User): Socket {
  return io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: {
      userId: user.id || user._id,
      role: user.role,
    },
  });
}
