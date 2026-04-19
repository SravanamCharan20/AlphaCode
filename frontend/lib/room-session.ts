const ROOM_STORAGE_KEY = "alphacode-room-code";

export function saveActiveRoomCode(roomCode: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ROOM_STORAGE_KEY, roomCode);
}

export function getActiveRoomCode() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ROOM_STORAGE_KEY) || "";
}

export function clearActiveRoomCode() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ROOM_STORAGE_KEY);
}
