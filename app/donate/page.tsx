import type { Metadata } from "next";
import { DonateCard } from "@/components/DonateCard";

export const metadata: Metadata = {
  title: "Support Research Atlas",
  description:
    "Your donation helps us provide free AI-powered research education, tutorials, tools and resources for students and researchers worldwide.",
};

export default function DonatePage() {
  return (
    <main className="min-h-[80vh] bg-[#F7FBFC] px-4 py-16 md:px-8">
      <DonateCard />
    </main>
  );
}
