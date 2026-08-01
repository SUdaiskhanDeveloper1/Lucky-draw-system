"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function ReferralShare({ code }: { code: string }) {
  const [origin, setOrigin] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
    setOrigin(envOrigin || window.location.origin);
  }, []);

  const link = origin ? `${origin}/signup?ref=${code}` : `/signup?ref=${code}`;

  function copy(text: string, which: "code" | "link") {
    navigator.clipboard.writeText(text);
    if (which === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    toast.success("Copied to clipboard");
  }

  async function share() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Join Rs.1 Lucky Draw",
          text: `Use my referral code ${code} to sign up!`,
          url: link,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copy(link, "link");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Referral code</Label>
        <div className="flex gap-2">
          <Input value={code} readOnly className="font-mono font-semibold" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Copy code"
            onClick={() => copy(code, "code")}
          >
            {copiedCode ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div>
        <Label>Referral link</Label>
        <div className="flex gap-2">
          <Input value={link} readOnly />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Copy link"
            onClick={() => copy(link, "link")}
          >
            {copiedLink ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Button type="button" onClick={share} className="w-full sm:w-auto">
        <Share2 className="h-4 w-4" /> Share invite
      </Button>
    </div>
  );
}
