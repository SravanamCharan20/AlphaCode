"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { authPageContent } from "@/data/auth-page";
import { useAuth } from "@/context/auth-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { SigninInput, SignupInput } from "@/types/auth";

type AuthMode = "signin" | "signup";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { isBootstrapping, signin, signup, user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isBootstrapping && user) {
      router.replace("/dashboard");
    }
  }, [isBootstrapping, router, user]);

  const activeContent = authPageContent[mode];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        await signup(formData);
        setSuccess("Account created. Redirecting...");
      } else {
        const signinPayload: SigninInput = {
          email: formData.email,
          password: formData.password,
        };
        await signin(signinPayload);
        setSuccess("Signed in. Redirecting...");
      }

      startTransition(() => {
        router.push("/dashboard");
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to authenticate right now.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#fffdf8_0%,_#f7efe3_50%,_#efe5d5_100%)]">
      <SiteHeader />

      <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-7xl items-center justify-center px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.2),_transparent_30%)]" />
            <div className="relative">
              <p className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                {activeContent.subtitle}
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.07em]">
                {mode === "signup"
                  ? "Create your AlphaCode identity."
                  : "Step back into your coding workspace."}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Sign in and move straight into rooms, lobby, and contest flow.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-10">
            <div className="max-w-md">
              <p className="inline-flex rounded-full border border-amber-300/60 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                {activeContent.subtitle}
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-slate-950">
                {activeContent.title}
              </h1>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-800">
                    Username
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        username: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">
                  Email
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-800">
                  Password
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  minLength={6}
                  required
                />
              </label>

              {mode === "signup" ? (
                <p className="text-sm text-slate-500">
                  Use at least 6 characters with upper, lower, and a number.
                </p>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-[#ff3b30]/15 bg-[#ff3b30]/6 px-4 py-3 text-sm text-[#d62d20]">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-2xl border border-[#34c759]/16 bg-[#34c759]/8 px-4 py-3 text-sm text-[#248a3d]">
                  {success}
                </div>
              ) : null}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isPending}
              >
                {isPending ? "Please wait..." : activeContent.cta}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {activeContent.switchLabel}{" "}
              <Link
                href={activeContent.switchHref}
                className="font-medium text-slate-950 transition hover:text-amber-700"
              >
                {activeContent.switchCta}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
