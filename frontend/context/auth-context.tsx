"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { apiRequest } from "@/lib/api";
import { createAuthenticatedSocket } from "@/lib/socket";
import type {
  SigninInput,
  SignupInput,
  SocketEventHandler,
  SocketStatus,
  User,
} from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  isBootstrapping: boolean;
  signin: (payload: SigninInput) => Promise<User>;
  signup: (payload: SignupInput) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User>;
  socketStatus: SocketStatus;
  isSocketConnected: boolean;
  socketId: string | null;
  socketError: string | null;
  reconnectSocket: () => void;
  disconnectSocket: () => void;
  emitSocketEvent: (event: string, ...args: unknown[]) => boolean;
  onSocketEvent: (event: string, handler: SocketEventHandler) => () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("idle");
  const [socketId, setSocketId] = useState<string | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const destroySocket = (targetSocket: Socket | null = socketRef.current) => {
    if (targetSocket) {
      targetSocket.removeAllListeners();
      targetSocket.disconnect();
    }

    socketRef.current = null;
    setSocketStatus("idle");
    setSocketId(null);
    setSocketError(null);
  };

  useEffect(() => {
    let ignore = false;

    async function bootstrapUser() {
      try {
        const profile = await apiRequest<User>("/auth/profile");
        if (!ignore) {
          setUser(profile);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapUser();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!user || isBootstrapping) {
      return;
    }

    const currentSocket = createAuthenticatedSocket(user);
    socketRef.current = currentSocket;

    currentSocket.on("connect", () => {
      setSocketStatus("connected");
      setSocketId(currentSocket.id || null);
      setSocketError(null);
    });

    currentSocket.on("disconnect", (reason) => {
      setSocketId(null);
      setSocketStatus(reason === "io client disconnect" ? "idle" : "disconnected");
    });

    currentSocket.on("connect_error", (error: Error) => {
      setSocketStatus("error");
      setSocketError(error.message);
      setSocketId(null);
    });

    currentSocket.on("socket:ready", (payload: unknown) => {
      if (
        typeof payload === "object" &&
        payload !== null &&
        "socketId" in payload &&
        typeof payload.socketId === "string"
      ) {
        setSocketId(payload.socketId);
      }
    });

    currentSocket.connect();

    return () => {
      destroySocket(currentSocket);
    };
  }, [isBootstrapping, user]);

  const refreshUser = async () => {
    try {
      const profile = await apiRequest<User>("/auth/profile");
      setUser(profile);
      return profile;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const signin = async ({ email, password }: SigninInput) => {
    const data = await apiRequest<{ user: User }>("/auth/signin", {
      method: "POST",
      body: { email, password },
    });

    if (data?.user) {
      setUser(data.user);
      return data.user;
    }

    return refreshUser();
  };

  const signup = async ({ username, email, password }: SignupInput) => {
    await apiRequest<{ user: User }>("/auth/signup", {
      method: "POST",
      body: { username, email, password },
    });

    return signin({ email, password });
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      destroySocket();
      setUser(null);
    }
  };

  const reconnectSocket = () => {
    const currentSocket = socketRef.current;

    if (!currentSocket) {
      return;
    }

    setSocketStatus("connecting");
    setSocketError(null);
    currentSocket.connect();
  };

  const disconnectSocket = () => {
    destroySocket();
  };

  const emitSocketEvent = (event: string, ...args: unknown[]) => {
    const currentSocket = socketRef.current;

    if (!currentSocket || !currentSocket.connected) {
      return false;
    }

    currentSocket.emit(event, ...args);
    return true;
  };

  const onSocketEvent = (event: string, handler: SocketEventHandler) => {
    const currentSocket = socketRef.current;

    if (!currentSocket) {
      return () => {};
    }

    currentSocket.on(event, handler);

    return () => {
      currentSocket.off(event, handler);
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isBootstrapping,
        signin,
        signup,
        logout,
        refreshUser,
        socketStatus,
        isSocketConnected: socketStatus === "connected",
        socketId,
        socketError,
        reconnectSocket,
        disconnectSocket,
        emitSocketEvent,
        onSocketEvent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return value;
}
