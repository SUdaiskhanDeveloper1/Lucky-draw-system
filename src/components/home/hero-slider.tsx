"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types/database";
import { Button } from "@/components/ui/button";

export function HeroSlider({ banners }: { banners: Banner[] }) {
  const slides = banners ?? [];
  const [index, setIndex] = useState(0);

  const count = slides.length;

  const go = useCallback(
    (n: number) => {
      if (count === 0) return;
      setIndex((prev) => (prev + n + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  // Fallback hero when there are no banners.
  if (count === 0) {
    return (
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent px-6 py-20 text-center text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4" /> Win Big for Just Rs.1
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            The Rs.1 Lucky Draw
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Enter transparent lucky draws for as little as Rs.1 and stand a
            chance to win amazing prizes across Pakistan.
          </p>
          <Link href="/campaigns">
            <Button size="lg" variant="secondary">
              Explore Campaigns
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
        {slides.map((banner, i) => (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            {banner.image_url && (
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                priority={i === 0}
                sizes="(max-width:768px) 100vw, 1152px"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl space-y-4 px-6 text-white sm:px-12">
                <h1 className="text-3xl font-extrabold tracking-tight drop-shadow sm:text-5xl">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="text-base text-white/90 sm:text-lg">
                    {banner.subtitle}
                  </p>
                )}
                <Link href={banner.link_url || "/campaigns"}>
                  <Button size="lg">Join Now</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
