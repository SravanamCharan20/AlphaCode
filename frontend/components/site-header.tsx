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
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    startTransition(() => {
      router.push("/");
    });
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="page-shell">
        <div className="glass-nav flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
              AC
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-black">AlphaCode</p>
              <p className="text-xs text-[#6e6e73]">Product</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`rounded-full px-4 py-2 text-sm transition ${
                pathname === "/" ? "text-black" : "text-[#6e6e73] hover:text-black"
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    pathname === "/dashboard" ? "bg-black text-white" : "text-[#1d1d1f]"
                  }`}
                >
                  Dashboard
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      pathname === "/admin" ? "bg-black text-white" : "text-[#1d1d1f]"
                    }`}
                  >
                    Admin
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full px-4 py-2 text-sm text-[#6e6e73] transition hover:text-black"
                  disabled={isPending}
                >
                  {isPending ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    pathname === "/auth/signin"
                      ? "text-black"
                      : "text-[#6e6e73] hover:text-black"
                  }`}
                >
                  Sign in
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
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
