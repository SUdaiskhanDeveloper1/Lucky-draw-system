import Link from "next/link";
import {
  Facebook,
  Instagram,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Youtube,
} from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refund" },
  { href: "/contact", label: "Contact" },
];

const exploreLinks = [
  { href: "/campaigns", label: "All Campaigns" },
  { href: "/winners", label: "Winners" },
  { href: "/faqs", label: "FAQs" },
  { href: "/login", label: "Sign In" },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Sparkles, label: "Transparent draws" },
  { icon: Trophy, label: "Real prizes" },
];

export function Footer({
  siteName,
  facebook,
  instagram,
  youtube,
}: {
  siteName?: string;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
}) {
  const brand = siteName || "Rs.1 Lucky Draw";
  const year = new Date().getFullYear();

  const socials = [
    { href: facebook, icon: Facebook, label: "Facebook" },
    { href: instagram, icon: Instagram, label: "Instagram" },
    { href: youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-border/70 bg-card">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-soft">
                <Ticket className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                {brand}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Join transparent Rs.1 lucky draws and win prizes across Pakistan.
              Fair, simple, and exciting.
            </p>
            <ul className="flex flex-wrap gap-2">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="chip">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <h4 className="eyebrow mb-4">Explore</h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="eyebrow mb-4">Company</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          {socials.length > 0 && (
            <div className="lg:col-span-2">
              <h4 className="eyebrow mb-4">Follow Us</h4>
              <div className="flex gap-2.5">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:text-primary hover:shadow-soft"
                  >
                    <Icon className="h-[1.15rem] w-[1.15rem]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-7 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} {brand}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Play responsibly · 18+
          </p>
        </div>
      </div>
    </footer>
  );
}
