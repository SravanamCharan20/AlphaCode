export type RoomMember = {
  userId: string;
  username: string;
  role: string;
  isReady: boolean;
};

export type RoomConfig = {
  maxMembers: number;
  questionSet: string;
  questionCount: number;
};

export type RoomState = {
  roomCode: string;
  createdBy: string;
  status: "lobby" | "arena";
  config: RoomConfig;
  members: RoomMember[];
  isActive: boolean;
};

export type RoomPayload = {
  message?: string;
  room?: RoomState;
  roomCode?: string;
  userId?: string;
};
