"use client";

import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
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
          <div
            key={faq.id}
            className={cn(
              "card-surface overflow-hidden transition-all duration-300 ease-out-expo",
              open && "border-primary/25 shadow-card"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : faq.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-secondary/50 sm:px-6 sm:py-5"
            >
              <span
                className={cn(
                  "font-medium leading-snug transition-colors duration-200",
                  open && "text-primary"
                )}
              >
                {faq.question}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out-expo",
                  open
                    ? "rotate-45 bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Plus className="h-4 w-4" aria-hidden />
              </span>
            </button>

            {/* Grid-rows trick animates height without measuring the content. */}
            <div
              className={cn(
                "grid transition-all duration-300 ease-out-expo",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="whitespace-pre-line border-t border-border/70 px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:py-5">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
