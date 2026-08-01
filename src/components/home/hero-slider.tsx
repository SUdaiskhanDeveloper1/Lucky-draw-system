"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
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
      <section className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-20 text-primary-foreground sm:px-12 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 animate-float rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-black/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl space-y-7 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden /> Trusted by thousands of
            players
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
            The{" "}
            <span className="relative inline-block">
              Rs.1
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-white/40"
              />
            </span>{" "}
            Lucky Draw
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            Enter transparent lucky draws for as little as Rs.1 and stand a
            chance to win amazing prizes across Pakistan.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
            <Link href="/campaigns" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full bg-white text-brand-700 hover:bg-white/90 sm:w-auto"
              >
                Explore Campaigns <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/winners" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/35 bg-white/10 text-primary-foreground backdrop-blur hover:border-white/60 hover:bg-white/20 hover:text-primary-foreground sm:w-auto"
              >
                <Trophy className="h-4 w-4" /> See Winners
              </Button>
            </Link>
          </div>
          <p className="flex items-center justify-center gap-2 pt-2 text-xs text-primary-foreground/70">
            <ShieldCheck className="h-4 w-4" aria-hidden /> 100% secure payments
            · Winners announced publicly
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="group relative overflow-hidden rounded-3xl shadow-card">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        {slides.map((banner, i) => (
          <div
            key={banner.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out-expo",
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
                className={cn(
                  "object-cover transition-transform duration-[8000ms] ease-out",
                  i === index ? "scale-105" : "scale-100"
                )}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/10" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl space-y-5 px-6 py-8 text-white sm:px-12 lg:px-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden /> Live now
                </span>
                <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight drop-shadow-sm sm:text-5xl lg:text-[3.5rem]">
                  {banner.title}
                </h1>
                {banner.subtitle && (
                  <p className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                    {banner.subtitle}
                  </p>
                )}
                <Link
                  href={banner.link_url || "/campaigns"}
                  className="inline-block pt-1"
                >
                  <Button size="lg" variant="gradient">
                    Join Now <ArrowRight className="h-4 w-4" />
                  </Button>
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
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 backdrop-blur transition-all duration-300 ease-out-expo hover:bg-black/55 focus-visible:opacity-100 group-hover:opacity-100 sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 backdrop-blur transition-all duration-300 ease-out-expo hover:bg-black/55 focus-visible:opacity-100 group-hover:opacity-100 sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 ease-out-expo",
                  i === index ? "w-7 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
