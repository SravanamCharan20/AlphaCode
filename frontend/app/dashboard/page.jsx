"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dashboardNextSteps, getRoleLabel } from "@/data/dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/context/auth-context";

export default function Dashboard() {
  const router = useRouter();
  const { isBootstrapping, user } = useAuth();
  const displayName =
    user?.username?.trim() || user?.email?.split("@")[0] || "Coder";
  const roleLabel = getRoleLabel(user?.role);
  const summary = [
    {
      label: "Account",
      value: "Active",
    },
    {
      label: "Role",
      value: roleLabel,
    },
    {
      label: "Session",
      value: "Authenticated",
    },
  ];

  useEffect(() => {
    if (!isBootstrapping && !user) {
      router.replace("/auth/signin");
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
              Preparing your dashboard.
            </h1>
            <p className="body-copy mt-4 text-base">
              Checking the current session before loading the account view.
            </p>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="page-shell pb-20 pt-8">
        <section className="section-space pt-4">
          <div className="hero-panel p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">Dashboard</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-black sm:text-5xl">
                  Welcome back, {displayName}.
                </h1>
                <p className="body-copy mt-5 max-w-xl text-base">
                  Your account is active and ready. This dashboard is now
                  structured as a proper product surface with tighter spacing,
                  clearer cards, and better hierarchy.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/" className="btn-secondary">
                    Return home
                  </Link>
                  <Link href="/auth/signin" className="btn-primary">
                    Switch account
                  </Link>
                </div>
              </div>

              <div className="card p-5 sm:p-6">
                <div className="flex items-center gap-3 text-sm text-[#6e6e73]">
                  <span className="status-dot" />
                  Connected
                </div>
                <div className="mt-6 rounded-[1.5rem] border border-black/6 bg-white/70 p-5">
                  <p className="text-sm text-[#6e6e73]">Current account</p>
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
          <div className="grid gap-5 md:grid-cols-3">
            {summary.map((item) => (
              <article key={item.label} className="card p-7">
                <p className="text-sm text-[#6e6e73]">{item.label}</p>
                <p className="mt-4 text-3xl font-medium tracking-[-0.05em] text-black">
                  {item.value}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-space pt-0">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="card p-7 sm:p-8">
              <p className="eyebrow">Profile</p>
              <div className="mt-6 space-y-5">
                <div className="rounded-[1.25rem] border border-black/6 bg-white/72 p-5">
                  <p className="text-sm text-[#6e6e73]">Username</p>
                  <p className="mt-2 text-xl font-medium text-black">@{displayName}</p>
                </div>
                <div className="rounded-[1.25rem] border border-black/6 bg-white/72 p-5">
                  <p className="text-sm text-[#6e6e73]">Email</p>
                  <p className="mt-2 text-base text-black">{user.email}</p>
                </div>
                <div className="rounded-[1.25rem] border border-black/6 bg-white/72 p-5">
                  <p className="text-sm text-[#6e6e73]">Role</p>
                  <p className="mt-2 text-base text-black">{roleLabel}</p>
                </div>
              </div>
            </article>

            <div className="grid gap-6">
              <article className="card p-7 sm:p-8">
                <p className="eyebrow">Workspace</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-black sm:text-3xl">
                  A cleaner base for the competition product.
                </h2>
                <p className="body-copy mt-4 max-w-2xl text-base">
                  The layout now uses bounded sections, consistent card borders,
                  and aligned spacing so the dashboard feels like one product
                  instead of disconnected blocks.
                </p>
              </article>

              <article className="card p-7 sm:p-8">
                <p className="eyebrow">Next</p>
                <div className="mt-6 space-y-4">
                  {dashboardNextSteps.map((item) => (
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
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
