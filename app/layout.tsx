import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageTransition } from "@/components/layout/page-transition";
import { AskAtlas } from "@/components/ui/ask-atlas";
import { FloatingSupportButton } from "@/components/support/floating-support-button";
import { LaunchScreenLoader } from "@/components/launch/launch-screen-loader";
import "./globals.css";

const siteUrl = "https://research-atlas.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Research Atlas — Learn Research Like a Scientist",
    template: "%s · Research Atlas",
  },
  description:
    "A free, open-source interactive platform that takes complete beginners from zero knowledge to publishing environmental research — through one continuous investigation of Bluewater Basin.",
  keywords: ["learn statistics","learn GIS","learn machine learning","environmental data science","research methods","scientific computing"],
  authors: [{ name: "Research Atlas" }],
  openGraph: {
    title: "Research Atlas — Learn Research Like a Scientist",
    description: "Become a confident researcher by investigating one realistic watershed, Bluewater Basin, mission by mission.",
    url: siteUrl,
    siteName: "Research Atlas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Atlas — Learn Research Like a Scientist",
    description: "Statistics, GIS, ML and AI taught through one continuous environmental research expedition.",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LaunchScreenLoader />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-basin-500 focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <FloatingSupportButton />
        <AskAtlas />
        <Analytics />
      </body>
    </html>
  );
}
