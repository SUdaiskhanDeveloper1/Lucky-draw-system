import type { Metadata } from "next";
import { CmsPageView } from "@/components/cms/cms-page-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Rs.1 Lucky Draw",
  description: "Learn more about the Rs.1 Lucky Draw platform.",
};

export default function AboutPage() {
  return (
    <CmsPageView
      slug="about"
      fallbackTitle="About Us"
      fallbackContent={
        "Rs.1 Lucky Draw is a transparent lucky-draw platform where you can enter exciting prize draws for as little as Rs.1.\n\nOur mission is to make winning accessible and fair for everyone across Pakistan. Every draw is conducted transparently, and winners are announced publicly.\n\nJoin thousands of players and get your chance to win amazing prizes today."
      }
    />
  );
}
