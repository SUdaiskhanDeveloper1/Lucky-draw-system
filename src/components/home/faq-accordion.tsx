"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/types/database";
import { EmptyState } from "@/components/ui/misc";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="No FAQs yet"
        description="Frequently asked questions will appear here soon."
      />
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const open = openId === faq.id;
        return (
          <div key={faq.id} className="card-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : faq.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors hover:bg-secondary/50"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
            {open && (
              <div className="whitespace-pre-line border-t px-5 py-4 text-sm text-muted-foreground">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
