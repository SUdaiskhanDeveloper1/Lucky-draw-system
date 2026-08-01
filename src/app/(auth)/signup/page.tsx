"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, MailCheck, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SignupForm() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...(ref ? { ref } : {}),
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
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
            Verify your email
          </h2>
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Click the link in that email to activate your account.
          </p>
          <Link href="/login" className="mt-7">
            <Button variant="outline">Back to sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <UserPlus className="h-5 w-5" aria-hidden />
        </span>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <p className="text-sm text-muted-foreground">
          Join and start winning for just Rs.1.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Ali Khan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create account
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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

function SignupFallback() {
  return (
    <Card className="shadow-card">
      <CardContent className="space-y-5 p-6">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupForm />
    </Suspense>
  );
}
