import Link from "next/link";
import { ThemeToggle } from "@/components/ui/misc";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight sm:text-xl"
        >
          🎟️ Rs.1 Lucky Draw
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
