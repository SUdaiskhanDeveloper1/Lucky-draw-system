import type { Metadata } from "next";
import { CmsPageView } from "@/components/cms/cms-page-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy — Rs.1 Lucky Draw",
  description: "How Rs.1 Lucky Draw collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <CmsPageView
      slug="privacy"
      fallbackTitle="Privacy Policy"
      fallbackContent={
        "Your privacy matters to us. This policy explains how we collect, use, and protect your personal information.\n\nWe collect only the information needed to operate the platform, such as your name, contact details, and payment records. We never sell your data to third parties.\n\nYou may request access to or deletion of your personal data at any time by contacting our support team."
      }
    />
  );
}
