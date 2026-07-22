"use client";

import dynamic from "next/dynamic";

const LaunchScreen = dynamic(
  () => import("@/components/launch/launch-screen").then((m) => m.LaunchScreen),
  { ssr: false }
);

export function LaunchScreenLoader() {
  return <LaunchScreen />;
}
