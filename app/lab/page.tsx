"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLabSession } from "@/hooks/use-lab-session";
import { ApolloExam } from "@/components/lab/apollo-exam";

export default function LabEntryPage() {
  const router = useRouter();
  const { hydrated, activeSession } = useLabSession();

  // ApolloExam handles the entire exam → topic → faculty-handoff flow
  // internally. Once it's assigned a faculty (recruit passed, described
  // their topic, and confirmed a supervisor), move them into the real
  // workspace at /lab/[sessionId].
  useEffect(() => {
    if (hydrated && activeSession?.faculty && activeSession.status === "in_progress") {
      router.push(`/lab/${activeSession.id}`);
    }
  }, [hydrated, activeSession, router]);

  if (!hydrated) return null;

  // No faculty assigned yet — still inside Apollo's exam/topic/handoff screens.
  if (!activeSession?.faculty) {
    return <ApolloExam />;
  }

  return null; // brief instant before the redirect effect above fires
}