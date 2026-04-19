import { AuthProvider } from "@/context/auth-context";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fffdf8] text-slate-950 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
