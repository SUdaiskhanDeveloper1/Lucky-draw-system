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
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Gift className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === active
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
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
