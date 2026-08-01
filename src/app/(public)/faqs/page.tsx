import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Faq } from "@/lib/types/database";
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to know before you join a draw.
        </p>
      </div>

      <FaqAccordion faqs={faqs} />
    </div>
  );
}
