import type { Metadata } from "next";
import { CmsPageView } from "@/components/cms/cms-page-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Refund Policy — Rs.1 Lucky Draw",
  description: "Refund and cancellation policy for Rs.1 Lucky Draw entries.",
};

export default function RefundPage() {
  return (
    <CmsPageView
      slug="refund"
      fallbackTitle="Refund Policy"
      fallbackContent={
        "This policy outlines the conditions under which refunds may be issued.\n\nEntry fees are generally non-refundable once a draw entry is confirmed. If a campaign is cancelled before its draw takes place, eligible entry fees will be refunded to your wallet.\n\nFor any refund-related questions, please contact our support team with your payment details."
      }
    />
  );
}
