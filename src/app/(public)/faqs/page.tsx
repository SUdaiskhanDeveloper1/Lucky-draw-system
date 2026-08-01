import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Faq } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/misc";
import { FaqAccordion } from "@/components/home/faq-accordion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQs — Rs.1 Lucky Draw",
  description: "Answers to frequently asked questions about our lucky draws.",
};

export default async function FaqsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const faqs = (data ?? []) as Faq[];

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="Good to know"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before you join a draw."
        />

        <FaqAccordion faqs={faqs} />

        <div className="card-surface mt-12 flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-base font-bold tracking-tight">
                Still have questions?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our support team is happy to help you out.
              </p>
            </div>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button variant="outline">Contact support</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
