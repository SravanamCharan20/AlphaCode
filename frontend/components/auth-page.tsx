"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useUser } from "@/app/auth/userContext";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type AuthMode = "signin" | "signup";

const content = {
  signin: {
    title: "Sign in",
    subtitle: "Access your account",
    cta: "Sign in",
    switchLabel: "Need an account?",
    switchCta: "Create one",
    switchHref: "/auth/signup",
  },
  signup: {
    title: "Create account",
    subtitle: "Get started with AlphaCode",
    cta: "Create account",
    switchLabel: "Already have an account?",
    switchCta: "Sign in",
    switchHref: "/auth/signin",
  },
} satisfies Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    cta: string;
    switchLabel: string;
    switchCta: string;
    switchHref: string;
  }
>;

export function AuthPage({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { isBootstrapping, signin, signup, user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Record<string, string>>({
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

  const activeContent = content[mode];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setSuccess("Account created. Redirecting...");
      } else {
        await signin({
          email: formData.email,
          password: formData.password,
        });
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
    <main className="min-h-screen">
      <SiteHeader />

      <div className="page-shell flex min-h-[calc(100vh-120px)] items-center justify-center pb-16 pt-8">
        <div className="w-full max-w-md">
          <div className="card p-7 sm:p-8">
            <div className="text-center">
              <p className="eyebrow">{activeContent.subtitle}</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-black">
                {activeContent.title}
              </h1>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-[#1d1d1f]">Username</span>
                  <input
                    className="input-field"
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
                <span className="mb-2 block text-sm text-[#1d1d1f]">Email</span>
                <input
                  className="input-field"
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
                <span className="mb-2 block text-sm text-[#1d1d1f]">Password</span>
                <input
                  className="input-field"
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
                <p className="text-sm text-[#6e6e73]">
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
                className="btn-primary w-full"
                disabled={isPending}
              >
                {isPending ? "Please wait..." : activeContent.cta}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6e6e73]">
              {activeContent.switchLabel}{" "}
              <Link href={activeContent.switchHref} className="text-black">
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
