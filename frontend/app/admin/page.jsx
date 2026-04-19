"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { adminActions } from "@/data/dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/context/auth-context";

export default function AdminPage() {
  const router = useRouter();
  const { isBootstrapping, user } = useAuth();
  const displayName =
    user?.username?.trim() || user?.email?.split("@")[0] || "Admin";

  useEffect(() => {
    if (!isBootstrapping && !user) {
      router.replace("/auth/signin");
      return;
    }

    if (!isBootstrapping && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isBootstrapping, router, user]);

  if (isBootstrapping || !user) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <div className="page-shell flex min-h-[70vh] items-center py-20">
          <div className="hero-panel mx-auto w-full max-w-2xl p-8 text-center sm:p-10">
            <p className="eyebrow">Loading</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-black">
              Preparing admin access.
            </h1>
            <p className="body-copy mt-4 text-base">
              Checking your session and permissions.
            </p>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  if (user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="page-shell pb-20 pt-8">
        <section className="section-space pt-4">
          <div className="hero-panel p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">Admin panel</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-black sm:text-5xl">
                  Welcome, {displayName}.
                </h1>
                <p className="body-copy mt-5 max-w-xl text-base">
                  This area is reserved for admin accounts. Use it as the base
                  for contest management, moderation, and platform controls.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/dashboard" className="btn-secondary">
                    User dashboard
                  </Link>
                  <Link href="/" className="btn-primary">
                    Home
                  </Link>
                </div>
              </div>

              <div className="card p-5 sm:p-6">
                <div className="flex items-center gap-3 text-sm text-[#6e6e73]">
                  <span className="status-dot" />
                  Administrator session
                </div>
                <div className="mt-6 rounded-[1.5rem] border border-black/6 bg-white/70 p-5">
                  <p className="text-sm text-[#6e6e73]">Signed in as</p>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-black">
                    @{displayName}
                  </p>
                  <p className="mt-3 text-sm text-[#6e6e73]">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space pt-0">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="card p-7 sm:p-8">
              <p className="eyebrow">Access</p>
              <div className="mt-6 space-y-5">
                <div className="rounded-[1.25rem] border border-black/6 bg-white/72 p-5">
                  <p className="text-sm text-[#6e6e73]">Role</p>
                  <p className="mt-2 text-base text-black">Administrator</p>
                </div>
                <div className="rounded-[1.25rem] border border-black/6 bg-white/72 p-5">
                  <p className="text-sm text-[#6e6e73]">Email</p>
                  <p className="mt-2 text-base text-black">{user.email}</p>
                </div>
                <div className="rounded-[1.25rem] border border-black/6 bg-white/72 p-5">
                  <p className="text-sm text-[#6e6e73]">Route</p>
                  <p className="mt-2 text-base text-black">/admin</p>
                </div>
              </div>
            </article>

            <article className="card p-7 sm:p-8">
              <p className="eyebrow">Next</p>
              <div className="mt-6 space-y-4">
                {adminActions.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.25rem] border border-black/6 bg-white/72 px-4 py-4"
                  >
                    <p className="text-base text-black">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
