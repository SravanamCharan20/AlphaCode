import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RoomArenaClient } from "@/components/room-arena-client";

export default async function ArenaPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#fffdf7_0%,_#f6eee1_55%,_#efe4d2_100%)]">
      <SiteHeader />
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <RoomArenaClient roomCode={roomCode} />
      </div>
      <SiteFooter />
    </main>
  );
}
