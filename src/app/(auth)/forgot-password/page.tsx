"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/12 text-success ring-1 ring-inset ring-success/20">
            <MailCheck className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Check your email
          </h2>
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            If an account exists for{" "}
            <span className="font-semibold text-foreground">{email}</span>,
            you&apos;ll receive a link to reset your password.
          </p>
          <Link href="/login" className="mt-7">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <KeyRound className="h-5 w-5" aria-hidden />
        </span>
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Send reset link
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
