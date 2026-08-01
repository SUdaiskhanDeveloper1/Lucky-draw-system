import type { Metadata } from "next";
import { CmsPageView } from "@/components/cms/cms-page-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions — Rs.1 Lucky Draw",
  description: "Terms and conditions for using the Rs.1 Lucky Draw platform.",
};

export default function TermsPage() {
  return (
    <CmsPageView
      slug="terms"
      fallbackTitle="Terms & Conditions"
      fallbackContent={
        "By using Rs.1 Lucky Draw, you agree to the following terms and conditions.\n\nEntries are final once submitted. Draws are conducted transparently and winners are selected at random. You must be of legal age to participate.\n\nWe reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of any changes."
      }
    />
  );
}
