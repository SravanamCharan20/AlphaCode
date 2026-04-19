"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { clearActiveRoomCode } from "@/lib/room-session";
import type { RoomPayload, RoomState } from "@/types/room";

export function RoomArenaClient({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const { emitSocketEvent, onSocketEvent, socketStatus } = useAuth();
  const [room, setRoom] = useState<RoomState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const offSync = onSocketEvent("room:sync", (payload: unknown) => {
      const data = payload as RoomPayload;
      if (data.room) {
        setRoom(data.room);
      }
    });

    const offUpdate = onSocketEvent("room:updated", (payload: unknown) => {
      const data = payload as RoomPayload;
      if (data.room) {
        setRoom(data.room);
      }
    });

    const offStarted = onSocketEvent("room:started", (payload: unknown) => {
      const data = payload as RoomPayload;
      if (data.room) {
        setRoom(data.room);
      }
    });

    const offClosed = onSocketEvent("room:closed", () => {
      clearActiveRoomCode();
      router.push("/dashboard");
    });

    const offError = onSocketEvent("room:error", (payload: unknown) => {
      const data = payload as RoomPayload;
      setError(data.message || "Room error");
    });

    if (socketStatus === "connected") {
      emitSocketEvent("sync-room", { roomCode });
    }

    return () => {
      offSync();
      offUpdate();
      offStarted();
      offClosed();
      offError();
    };
  }, [emitSocketEvent, onSocketEvent, roomCode, router, socketStatus]);

  if (!room) {
    return (
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-8 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.35)]">
        <p className="text-sm text-slate-500">{error || "Loading arena..."}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-7 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.35)] sm:p-8">
        <p className="text-sm font-medium text-slate-500">Arena</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-950">
          Contest is live
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Everyone who joined the room is now inside the arena.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm text-slate-500">Room</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {room.roomCode.slice(0, 8)}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm text-slate-500">Question set</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {room.config.questionSet}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm text-slate-500">Questions</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {room.config.questionCount}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {room.members.map((entry) => (
            <div
              key={entry.userId}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5"
            >
              <p className="text-base font-semibold text-slate-950">{entry.username}</p>
              <p className="mt-2 text-sm text-slate-500">{entry.role}</p>
              <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                In arena
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-7 text-white shadow-[0_20px_70px_-45px_rgba(15,23,42,0.9)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.05em]">Contest details</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-slate-400">Members</p>
            <p className="mt-2 text-lg font-semibold">{room.members.length}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-slate-400">Status</p>
            <p className="mt-2 text-lg font-semibold">Live</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
