"use client";

import { useState } from "react";
import Image from "next/image";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export function CampaignGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border/70 bg-gradient-to-br from-accent to-muted text-muted-foreground">
        <Gift className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-card">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="animate-fade-in object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ease-out-expo",
                i === active
                  ? "border-primary shadow-soft"
                  : "border-transparent opacity-60 hover:opacity-100 hover:shadow-xs"
              )}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
