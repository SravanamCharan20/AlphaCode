export type User = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SigninInput = {
  email: string;
  password: string;
};

export type SignupInput = SigninInput & {
  username: string;
};

export type SocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type SocketEventHandler = (...args: unknown[]) => void;
