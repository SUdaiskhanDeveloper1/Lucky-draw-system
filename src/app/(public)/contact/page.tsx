import type { Metadata } from "next";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Setting } from "@/lib/types/database";
import { ContactForm } from "@/components/home/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Rs.1 Lucky Draw",
  description: "Get in touch with the Rs.1 Lucky Draw team.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*");
  const settings = (data ?? []) as Setting[];

  const byKey = (key: string) =>
    (settings.find((s) => s.key === key)?.value ?? {}) as Record<
      string,
      unknown
    >;
  const str = (v: unknown) => (typeof v === "string" ? v : null);

  const contact = byKey("contact");
  const social = byKey("social");

  const email = str(contact.email);
  const phone = str(contact.phone);
  const address = str(contact.address);
  const whatsapp = str(contact.whatsapp);

  const facebook = str(social.facebook);
  const instagram = str(social.instagram);
  const youtube = str(social.youtube);

  const socials = [
    { href: facebook, icon: Facebook, label: "Facebook" },
    { href: instagram, icon: Instagram, label: "Instagram" },
    { href: youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Questions, feedback, or need help? We&apos;re here for you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card-surface p-6 sm:p-8">
          <h2 className="mb-4 text-lg font-semibold">Send a message</h2>
          <ContactForm />
        </div>

        <div className="space-y-5">
          {email && (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="font-medium hover:text-primary"
                >
                  {email}
                </a>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Phone</p>
                <a
                  href={`tel:${phone}`}
                  className="font-medium hover:text-primary"
                >
                  {phone}
                </a>
              </div>
            </div>
          )}
          {whatsapp && (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  WhatsApp
                </p>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary"
                >
                  {whatsapp}
                </a>
              </div>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Address
                </p>
                <p className="font-medium">{address}</p>
              </div>
            </div>
          )}

          {socials.length > 0 && (
            <div className="pt-2">
              <p className="mb-3 text-xs uppercase text-muted-foreground">
                Follow us
              </p>
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

          {!email && !phone && !whatsapp && !address && (
            <p className="text-sm text-muted-foreground">
              Fill out the form and our team will reach out to you shortly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
