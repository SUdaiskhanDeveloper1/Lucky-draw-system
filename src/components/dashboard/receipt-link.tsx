"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ExternalLink, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ReceiptLink({ path }: { path: string | null }) {
  const [loading, setLoading] = useState(false);

  if (!path) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  // If it's already a full URL, just link to it.
  const isUrl = /^https?:\/\//i.test(path);

  async function view() {
    if (isUrl) {
      window.open(path!, "_blank", "noopener,noreferrer");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("payment-receipts")
      .createSignedUrl(path!, 60 * 5);
    setLoading(false);
    if (error || !data?.signedUrl) {
      toast.error("Could not open receipt");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Button variant="outline" size="sm" onClick={view} loading={loading}>
      {!loading &&
        (isUrl ? (
          <ExternalLink className="h-3.5 w-3.5" />
        ) : (
          <FileText className="h-3.5 w-3.5" />
        ))}
      View
    </Button>
  );
}
