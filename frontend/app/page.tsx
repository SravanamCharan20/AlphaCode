import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,_#fffdf8_0%,_#f6efe2_58%,_#efe5d4_100%)] text-slate-950">
      <SiteHeader />

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 px-6 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur xl:px-10 xl:py-12">
          <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,_rgba(251,191,36,0.24),_rgba(249,115,22,0.08),_transparent)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-amber-300/60 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Multiplayer coding rooms
              </p>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-6xl lg:text-7xl">
                Create rooms, fill the lobby, and launch the arena.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                AlphaCode is focused on the actual room flow: room setup, lobby
                readiness, and contest launch.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open dashboard
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_20px_70px_-35px_rgba(15,23,42,0.9)]">
              <div className="grid gap-4">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
                  <p className="text-sm text-slate-400">1. Configure</p>
                  <p className="mt-2 text-xl font-semibold">Members and questions</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
                  <p className="text-sm text-slate-400">2. Lobby</p>
                  <p className="mt-2 text-xl font-semibold">Track ready and not ready</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-5">
                  <p className="text-sm text-slate-400">3. Arena</p>
                  <p className="mt-2 text-xl font-semibold">Bring all members into contest view</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
