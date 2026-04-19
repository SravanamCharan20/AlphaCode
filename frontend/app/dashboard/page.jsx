"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RoomWorkspace } from "@/components/room-workspace";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/context/auth-context";

export default function Dashboard() {
  const router = useRouter();
  const { isBootstrapping, user } = useAuth();
  const displayName =
    user?.username?.trim() || user?.email?.split("@")[0] || "Coder";

  useEffect(() => {
    if (!isBootstrapping && !user) {
      router.replace("/auth/signin");
    }
  }, [isBootstrapping, router, user]);

  if (isBootstrapping || !user) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#fffdf8_0%,_#f7efe2_55%,_#efe5d4_100%)]">
        <SiteHeader />
        <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-10">
            <p className="inline-flex rounded-full border border-amber-300/60 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
              Loading
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
              Preparing your dashboard.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Checking the current session before loading the account view.
            </p>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#fffdf7_0%,_#f6eee1_55%,_#efe4d2_100%)]">
      <SiteHeader />

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(135deg,_rgba(251,191,36,0.22),_rgba(249,115,22,0.06),_transparent)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-2xl">
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl">
                Welcome back, {displayName}.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Set up a room, bring everyone into the lobby, and move the whole
                team into the arena when every member is ready.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.9)] sm:p-6">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                Connected
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <p className="text-sm text-slate-400">Current account</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  @{displayName}
                </p>
                <p className="mt-3 text-sm text-slate-300">{user.email}</p>
              </div>
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                <p className="text-sm text-slate-400">Role</p>
                <p className="mt-2 text-base font-semibold text-white">{user.role}</p>
              </div>
            </div>
          </div>
        </section>

        <RoomWorkspace />
      </div>

      <SiteFooter />
    </main>
  );
}
