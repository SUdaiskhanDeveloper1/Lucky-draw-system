import Link from "next/link";
import { ArrowLeft, Ticket, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-wash flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-primary-foreground shadow-glow">
          <Ticket className="h-9 w-9" aria-hidden />
        </span>
        <span
          aria-hidden
          className="absolute -inset-4 -z-10 animate-float rounded-full bg-primary/10 blur-2xl"
        />
      </div>

      <p className="eyebrow mb-3">Error 404</p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-[0.975rem] leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Your
        luck is better in the draws.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button variant="gradient" size="lg" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Button>
        </Link>
        <Link href="/campaigns">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Trophy className="h-4 w-4" /> Browse campaigns
          </Button>
        </Link>
      </div>
    </div>
  );
}
