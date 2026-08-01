"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search campaigns..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState
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
