import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Ticket,
  Trophy,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Banner, Campaign, Faq, Setting } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/shared/campaign-card";
import { ContactRow } from "@/components/shared/contact-row";
import { EmptyState, SectionHeading } from "@/components/ui/misc";
import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedPrize } from "@/components/home/featured-prize";
import {
  WinnersSection,
  type WinnerWithRelations,
} from "@/components/home/winners-section";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { ContactForm } from "@/components/home/contact-form";
import { PrizeShowcase } from "@/components/home/prize-showcase";

export const dynamic = "force-dynamic";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "100% Secure",
    body: "Your payments are safe and reviewed by our team.",
    tone: "bg-accent text-accent-foreground",
  },
  {
    icon: BadgeCheck,
    title: "Fair & Transparent",
    body: "Random winner selection, published for everyone.",
    tone: "bg-warning/12 text-warning",
  },
  {
    icon: Zap,
    title: "Instant Entry",
    body: "Get your ticket as soon as payment is approved.",
    tone: "bg-info/12 text-info",
  },
  {
    icon: Trophy,
    title: "Real Prizes",
    body: "Genuine products delivered to real winners.",
    tone: "bg-success/12 text-success",
  },
];

const steps = [
  {
    icon: CreditCard,
    title: "Join",
    body: "Pick a live campaign and pay the Rs.1 entry fee.",
  },
  {
    icon: Ticket,
    title: "Get your ticket",
    body: "Once approved, a unique ticket number is issued to you.",
  },
  {
    icon: Trophy,
    title: "Win",
    body: "A lucky draw runs when the campaign ends. Winners go public.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [
    bannersRes,
    featuredRes,
    campaignsRes,
    winnersRes,
    faqsRes,
    settingsRes,
    entriesRes,
    winnersCountRes,
    liveCountRes,
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
    // Showcase stats. `profiles` is own-row-only under RLS, so public
    // participation is measured from campaign entries instead.
    supabase.from("campaigns").select("entries_count"),
    supabase.from("winners").select("*", { count: "exact", head: true }),
    supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const banners = (bannersRes.data ?? []) as Banner[];
  const featured = (featuredRes.data?.[0] ?? null) as Campaign | null;
  const campaigns = (campaignsRes.data ?? []) as Campaign[];
  const winners = (winnersRes.data ?? []) as unknown as WinnerWithRelations[];
  const faqs = (faqsRes.data ?? []) as Faq[];

  const showcaseStats = {
    totalEntries: (entriesRes.data ?? []).reduce(
      (sum, c) => sum + (Number(c.entries_count) || 0),
      0
    ),
    winnersAnnounced: winnersCountRes.count ?? 0,
    liveCampaigns: liveCountRes.count ?? 0,
  };

  const settings = (settingsRes.data ?? []) as Setting[];
  const contact = (settings.find((s) => s.key === "contact")?.value ??
    {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const email = str(contact.email);
  const phone = str(contact.phone);
  const address = str(contact.address);

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-24 px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <HeroSlider banners={banners} />

        {/* Prize showcase + platform stats */}
        <div className="-mt-14 sm:-mt-16">
          <PrizeShowcase featured={featured} stats={showcaseStats} />
        </div>

        {/* Featured prize */}
        {featured && (
          <section>
            <SectionHeading
              eyebrow="Spotlight"
              title="Featured Prize"
              subtitle="Don't miss our spotlight lucky draw."
            />
            <FeaturedPrize campaign={featured} />
          </section>
        )}

        {/* Latest campaigns */}
        <section>
          <SectionHeading
            eyebrow="Live now"
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
            <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Ticket}
              title="No active campaigns"
              description="Check back soon for new lucky draws."
            />
          )}
        </section>

        {/* Why players trust us */}
        <section>
          <div className="card-surface grid gap-1 p-2 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map(({ icon: Icon, title, body, tone }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 rounded-xl p-4 transition-colors duration-300 hover:bg-secondary/60"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <SectionHeading
            eyebrow="Simple by design"
            title="How It Works"
            subtitle="Three steps between you and your next prize."
          />
          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* Connector line on desktop */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block"
            />
            {steps.map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="card-surface relative flex flex-col items-center gap-3 p-7 text-center transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" aria-hidden />
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-bold text-primary-foreground shadow-soft">
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-display text-base font-bold tracking-tight">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Winners */}
        <section>
          <SectionHeading
            eyebrow="Hall of fame"
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
            eyebrow="Good to know"
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
          <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-7 text-primary-foreground shadow-card sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <FileText className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight">
                    Play responsibly
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-primary-foreground/85">
                    Our draws are transparent and fair. Please review our terms
                    and conditions to understand how entries, draws, and prizes
                    work.
                  </p>
                </div>
              </div>
              <Link href="/terms" className="shrink-0">
                <Button
                  variant="outline"
                  className="border-white/35 bg-white/10 text-primary-foreground backdrop-blur hover:border-white/60 hover:bg-white/20 hover:text-primary-foreground"
                >
                  Read Terms <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <SectionHeading
            eyebrow="Support"
            title="Get in Touch"
            subtitle="Have a question? Send us a message."
          />
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="card-surface p-6 sm:p-8 lg:col-span-3">
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
              {address && (
                <ContactRow icon={MapPin} label="Address" value={address} />
              )}
              {!email && !phone && !address && (
                <div className="card-surface p-6 text-sm text-muted-foreground">
                  Fill out the form and our team will reach out to you.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
