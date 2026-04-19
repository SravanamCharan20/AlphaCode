import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const features = [
  {
    title: "Fast entry",
    detail: "Users go from landing to account to dashboard without extra noise.",
  },
  {
    title: "Clean dashboard",
    detail: "A focused product surface with room for contests, rankings, and history.",
  },
  {
    title: "Backend ready",
    detail: "The frontend stays connected to your existing auth flow and session model.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="page-shell pb-20 pt-8">
        <section className="section-space pt-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">Competitive coding platform</p>
            <h1 className="display-title mt-6 text-5xl font-semibold text-black sm:text-6xl lg:text-7xl">
              Build, compete, and manage coding sessions in one product.
            </h1>
            <p className="body-copy mx-auto mt-6 max-w-2xl text-base sm:text-lg">
              A cleaner product interface for users who want to sign in, enter
              the platform, and get straight to the experience.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/signup" className="btn-primary">
                Create account
              </Link>
              <Link href="/auth/signin" className="btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space pt-4">
          <div className="hero-panel overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="max-w-2xl">
                <p className="eyebrow">Product preview</p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
                  A simpler front end that behaves like a product, not a brochure.
                </h2>
                <p className="body-copy mt-5 max-w-xl text-base">
                  The landing page stays short, the auth pages stay standard,
                  and the rest of the product can scale from here.
                </p>
              </div>

              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6e6e73]">AlphaCode</p>
                    <p className="mt-1 text-xl font-medium text-black">
                      Dashboard preview
                    </p>
                  </div>
                  <span className="status-dot" />
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-black/6 bg-white/80 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6e6e73]">Active session</p>
                      <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-black">
                        Signed in
                      </p>
                    </div>
                    <div className="rounded-full bg-black px-3 py-1 text-xs text-white">
                      Live
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f5f5f7] p-4">
                      <p className="text-sm text-[#6e6e73]">Contests</p>
                      <p className="mt-2 text-lg font-medium text-black">Ready</p>
                    </div>
                    <div className="rounded-2xl bg-[#f5f5f7] p-4">
                      <p className="text-sm text-[#6e6e73]">Ranking</p>
                      <p className="mt-2 text-lg font-medium text-black">Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space pt-4">
          <div className="grid gap-5 lg:grid-cols-3">
            {features.map((item) => (
              <article key={item.title} className="card p-7">
                <p className="text-2xl font-medium tracking-[-0.04em] text-black">
                  {item.title}
                </p>
                <p className="body-copy mt-4 text-sm">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
