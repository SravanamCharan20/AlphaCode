import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="pb-10 pt-4">
      <div className="page-shell">
        <div className="hairline" />
        <div className="flex flex-col gap-4 py-6 text-sm text-[#6e6e73] sm:flex-row sm:items-center sm:justify-between">
          <p>AlphaCode</p>

          <div className="flex flex-wrap gap-5">
            <Link href="/" className="transition hover:text-black">
              Home
            </Link>
            <Link href="/auth/signin" className="transition hover:text-black">
              Sign in
            </Link>
            <Link href="/auth/signup" className="transition hover:text-black">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
