import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="pb-10 pt-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-slate-300/70" />
        <div className="flex flex-col gap-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-700">AlphaCode</p>

          <div className="flex flex-wrap gap-5">
            <Link href="/" className="transition hover:text-slate-950">
              Home
            </Link>
            <Link href="/dashboard" className="transition hover:text-slate-950">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
