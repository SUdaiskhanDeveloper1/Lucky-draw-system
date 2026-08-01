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
import { ContactRow } from "@/components/shared/contact-row";
import { PageHeader } from "@/components/ui/misc";

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
    <>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Support"
          title="Contact Us"
          subtitle="Questions, feedback, or need help? We're here for you."
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="card-surface p-6 sm:p-8 lg:col-span-3">
            <h2 className="font-display text-lg font-bold tracking-tight">
              Send a message
            </h2>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">
              Fill in the form and our team will get back to you.
            </p>
            <ContactForm />
          </div>

          <div className="space-y-3 lg:col-span-2">
            {email && (
              <ContactRow
                icon={Mail}
                label="Email"
                value={email}
                href={`mailto:${email}`}
              />
            )}
            {phone && (
              <ContactRow
                icon={Phone}
                label="Phone"
                value={phone}
                href={`tel:${phone}`}
              />
            )}
            {whatsapp && (
              <ContactRow
                icon={MessageCircle}
                label="WhatsApp"
                value={whatsapp}
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                external
              />
            )}
            {address && (
              <ContactRow icon={MapPin} label="Address" value={address} />
            )}

            {socials.length > 0 && (
              <div className="card-surface p-5">
                <p className="eyebrow mb-3.5">Follow us</p>
                <div className="flex gap-2.5">
                  {socials.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:text-primary hover:shadow-soft"
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!email && !phone && !whatsapp && !address && (
              <div className="card-surface p-6 text-sm leading-relaxed text-muted-foreground">
                Fill out the form and our team will reach out to you shortly.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
