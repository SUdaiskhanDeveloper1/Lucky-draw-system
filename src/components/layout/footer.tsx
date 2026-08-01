import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refund" },
  { href: "/contact", label: "Contact" },
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
    <footer className="mt-20 border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <span aria-hidden>🎟️</span>
              <span>{brand}</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Join transparent Rs.1 lucky draws and win prizes across Pakistan.
              Fair, simple, and exciting.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {socials.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {year} {brand}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
