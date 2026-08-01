import Link from "next/link";
import { ArrowRight, FileText, Mail, MapPin, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Banner, Campaign, Faq, Setting } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/shared/campaign-card";
import { EmptyState } from "@/components/ui/misc";
import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedPrize } from "@/components/home/featured-prize";
import {
  WinnersSection,
  type WinnerWithRelations,
} from "@/components/home/winners-section";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { ContactForm } from "@/components/home/contact-form";

export const dynamic = "force-dynamic";

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const supabase = await createClient();

  const [
    bannersRes,
    featuredRes,
    campaignsRes,
    winnersRes,
    faqsRes,
    settingsRes,
  ] = await Promise.all([
    supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("campaigns")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("winners")
      .select("*, profiles(full_name), campaigns(prize_name)")
      .order("announced_at", { ascending: false })
      .limit(6),
    supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase.from("settings").select("*"),
  ]);

  const banners = (bannersRes.data ?? []) as Banner[];
  const featured = (featuredRes.data?.[0] ?? null) as Campaign | null;
  const campaigns = (campaignsRes.data ?? []) as Campaign[];
  const winners = (winnersRes.data ?? []) as unknown as WinnerWithRelations[];
  const faqs = (faqsRes.data ?? []) as Faq[];

  const settings = (settingsRes.data ?? []) as Setting[];
  const contact = (settings.find((s) => s.key === "contact")?.value ??
    {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const email = str(contact.email);
  const phone = str(contact.phone);
  const address = str(contact.address);

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-8 sm:px-6 sm:py-10">
      {/* Hero */}
      <HeroSlider banners={banners} />

      {/* Featured prize */}
      {featured && (
        <section>
          <SectionHeading
            title="Featured Prize"
            subtitle="Don't miss our spotlight lucky draw."
          />
          <FeaturedPrize campaign={featured} />
        </section>
      )}

      {/* Latest campaigns */}
      <section>
        <SectionHeading
          title="Latest Campaigns"
          subtitle="Fresh draws you can join right now."
          action={
            <Link href="/campaigns">
              <Button variant="outline" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />
        {campaigns.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No active campaigns"
            description="Check back soon for new lucky draws."
          />
        )}
      </section>

      {/* Winners */}
      <section>
        <SectionHeading
          title="Recent Winners"
          subtitle="Real people, real prizes."
          action={
            <Link href="/winners">
              <Button variant="outline" size="sm">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <WinnersSection winners={winners} />
      </section>

      {/* FAQ */}
      <section>
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you join."
          action={
            <Link href="/faqs">
              <Button variant="outline" size="sm">
                All FAQs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <FaqAccordion faqs={faqs} />
      </section>

      {/* Terms teaser */}
      <section>
        <div className="card-surface flex flex-col items-start gap-4 bg-gradient-to-br from-accent/60 to-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Play responsibly</h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Our draws are transparent and fair. Please review our terms and
                conditions to understand how entries, draws, and prizes work.
              </p>
            </div>
          </div>
          <Link href="/terms" className="shrink-0">
            <Button variant="outline">Read Terms</Button>
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section>
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a question? Send us a message."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card-surface p-6 sm:p-8">
            <ContactForm />
          </div>
          <div className="space-y-4">
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
            {!email && !phone && !address && (
              <p className="text-sm text-muted-foreground">
                Fill out the form and our team will reach out to you.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
