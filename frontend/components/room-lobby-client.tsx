"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { clearActiveRoomCode, saveActiveRoomCode } from "@/lib/room-session";
import type { RoomPayload, RoomState } from "@/types/room";

export function RoomLobbyClient({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const { emitSocketEvent, onSocketEvent, socketStatus, user } = useAuth();
  const [room, setRoom] = useState<RoomState | null>(null);
  const [error, setError] = useState("");
  const userId = user?.id || user?._id || "";

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
      if (data.room?.roomCode) {
        saveActiveRoomCode(data.room.roomCode);
        router.push(`/arena/${data.room.roomCode}`);
      }
    });

    const offLeft = onSocketEvent("room:left", () => {
      clearActiveRoomCode();
      router.push("/dashboard");
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
      offLeft();
      offClosed();
      offError();
    };
  }, [emitSocketEvent, onSocketEvent, roomCode, router, socketStatus]);

  const isOwner = room?.createdBy === userId;
  const member = room?.members.find((entry) => entry.userId === userId);
  const allSlotsFilled = room ? room.members.length === room.config.maxMembers : false;
  const allReady = room ? room.members.every((entry) => entry.isReady) : false;
  const canStart = Boolean(isOwner && allSlotsFilled && allReady && !room?.isActive);

  const readyCount = useMemo(
    () => room?.members.filter((entry) => entry.isReady).length || 0,
    [room],
  );

  const handleReady = (isReady: boolean) => {
    setError("");
    emitSocketEvent("set-ready", { roomCode, isReady });
  };

  const handleLeave = () => {
    emitSocketEvent("leave-room", { roomCode });
  };

  const handleStart = () => {
    emitSocketEvent("start-room", { roomCode });
  };

  if (!room) {
    return (
      <div className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-8 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.35)]">
        <p className="text-sm text-slate-500">{error || "Loading lobby..."}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-7 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Lobby</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-950">
              Room {room.roomCode.slice(0, 8)}
            </h1>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
            <p className="text-sm text-slate-500">Ready</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {readyCount}/{room.config.maxMembers}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm text-slate-500">Members</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {room.members.length}/{room.config.maxMembers}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm text-slate-500">Questions</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {room.config.questionCount}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
            <p className="text-sm text-slate-500">Set</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {room.config.questionSet}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {room.members.map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5"
            >
              <div>
                <p className="text-base font-semibold text-slate-950">
                  {entry.username}
                  {entry.userId === room.createdBy ? " (Admin)" : ""}
                </p>
                <p className="mt-1 text-sm text-slate-500">{entry.role}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  entry.isReady
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {entry.isReady ? "Ready" : "Not ready"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleReady(!(member?.isReady ?? false))}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            {member?.isReady ? "Mark not ready" : "Mark ready"}
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Leave room
          </button>
          {isOwner ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start contest
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </section>

      <aside className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-7 text-white shadow-[0_20px_70px_-45px_rgba(15,23,42,0.9)] sm:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.05em]">Status</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-slate-400">Room code</p>
            <p className="mt-2 break-all text-lg font-semibold">{room.roomCode}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-slate-400">Start condition</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Fill all {room.config.maxMembers} slots and mark every member ready.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-slate-400">Your state</p>
            <p className="mt-2 text-lg font-semibold">
              {member?.isReady ? "Ready" : "Not ready"}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
