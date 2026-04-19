"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { saveActiveRoomCode } from "@/lib/room-session";
import type { RoomPayload } from "@/types/room";

const memberOptions = [4, 5, 6];
const questionSets = ["Array Basics", "Dynamic Programming", "Graphs", "Mixed Set"];
const questionCountOptions = [3, 5, 8];

const selectClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100";

export function RoomWorkspace() {
  const router = useRouter();
  const {
    emitSocketEvent,
    isSocketConnected,
    onSocketEvent,
    reconnectSocket,
    socketStatus,
    user,
  } = useAuth();
  const isAdmin = user?.role === "admin";
  const [joinCode, setJoinCode] = useState("");
  const [maxMembers, setMaxMembers] = useState("4");
  const [questionSet, setQuestionSet] = useState(questionSets[0]);
  const [questionCount, setQuestionCount] = useState("5");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const openLobby = (payload: unknown) => {
      const data = payload as RoomPayload;
      if (!data.room?.roomCode) {
        return;
      }

      saveActiveRoomCode(data.room.roomCode);
      setIsSubmitting(false);
      setError("");
      router.push(`/lobby/${data.room.roomCode}`);
    };

    const offCreated = onSocketEvent("room:created", openLobby);
    const offJoined = onSocketEvent("room:joined", openLobby);
    const offError = onSocketEvent("room:error", (payload: unknown) => {
      const data = payload as RoomPayload;
      setIsSubmitting(false);
      setError(data.message || "Room action failed.");
    });

    return () => {
      offCreated();
      offJoined();
      offError();
    };
  }, [onSocketEvent, router]);

  const handleCreateRoom = () => {
    setError("");
    setIsSubmitting(true);

    const emitted = emitSocketEvent("create-room", {
      maxMembers: Number(maxMembers),
      questionSet,
      questionCount: Number(questionCount),
    });

    if (!emitted) {
      setIsSubmitting(false);
      setError("Socket is not connected.");
    }
  };

  const handleJoinRoom = () => {
    const roomCode = joinCode.trim();

    if (!roomCode) {
      setError("Enter a room code.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const emitted = emitSocketEvent("join-room", { roomCode });
    if (!emitted) {
      setIsSubmitting(false);
      setError("Socket is not connected.");
    }
  };

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-7 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-slate-950">
              Room setup
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Admin configures the room first. Other members join with the room code.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p className="text-slate-500">Socket</p>
            <p className="mt-1 font-semibold text-slate-950">{socketStatus}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Members
            </span>
            <select
              className={selectClassName}
              value={maxMembers}
              onChange={(event) => setMaxMembers(event.target.value)}
              disabled={!isAdmin || isSubmitting}
            >
              {memberOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Questions
            </span>
            <select
              className={selectClassName}
              value={questionCount}
              onChange={(event) => setQuestionCount(event.target.value)}
              disabled={!isAdmin || isSubmitting}
            >
              {questionCountOptions.map((value) => (
                <option key={value} value={value}>
                  {value} questions
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Question set
            </span>
            <select
              className={selectClassName}
              value={questionSet}
              onChange={(event) => setQuestionSet(event.target.value)}
              disabled={!isAdmin || isSubmitting}
            >
              {questionSets.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCreateRoom}
            disabled={!isAdmin || isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create room
          </button>

          {!isSocketConnected ? (
            <button
              type="button"
              onClick={reconnectSocket}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Reconnect
            </button>
          ) : null}
        </div>

        {!isAdmin ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Only admin can create a room.
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </article>

      <article className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-7 text-white shadow-[0_20px_70px_-45px_rgba(15,23,42,0.9)] sm:p-8">
        <h2 className="text-3xl font-semibold tracking-[-0.06em]">Join room</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Paste the room code from the admin to enter the lobby.
        </p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300 focus:ring-4 focus:ring-amber-400/10"
            value={joinCode}
            onChange={(event) => setJoinCode(event.target.value)}
            placeholder="Enter room code"
          />
          <button
            type="button"
            onClick={handleJoinRoom}
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Join lobby
          </button>
        </div>
      </article>
    </section>
  );
}
