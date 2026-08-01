"use client";

import { useMemo, useState } from "react";
import { Search, Ticket, X } from "lucide-react";
import type { Campaign } from "@/lib/types/database";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/misc";
import { CampaignCard } from "@/components/shared/campaign-card";

export function CampaignsBrowser({ campaigns }: { campaigns: Campaign[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter(
      (c) =>
        c.prize_name.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q)
    );
  }, [campaigns, query]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search campaigns…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search campaigns"
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-semibold tabular-nums text-foreground">
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "campaign" : "campaigns"}
          {query ? " found" : " available"}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={query ? Search : Ticket}
          title={query ? "No matching campaigns" : "No active campaigns"}
          description={
            query
              ? "Try a different search term."
              : "Check back soon for new lucky draws."
          }
        />
      )}
    </div>
  );
}
