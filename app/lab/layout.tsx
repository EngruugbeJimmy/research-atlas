// app/lab/layout.tsx
//
// Wraps every /lab route in one shared LabSessionProvider, so
// app/lab/page.tsx and app/lab/[sessionId]/page.tsx — and every
// component inside them — see the exact same session state.

import { LabSessionProvider } from "@/hooks/use-lab-session";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <LabSessionProvider>{children}</LabSessionProvider>;
}