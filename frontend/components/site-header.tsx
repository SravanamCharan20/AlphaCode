"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAuth } from "@/context/auth-context";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await logout();
    startTransition(() => {
      router.push("/");
    });
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between rounded-full border border-white/65 bg-white/78 px-4 py-3 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.5)] backdrop-blur sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
              AC
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-950">AlphaCode</p>
              <p className="text-xs text-slate-500">Product</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex ${
                pathname === "/"
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    pathname === "/dashboard"
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                  disabled={isPending}
                >
                  {isPending ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    pathname === "/auth/signin"
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
