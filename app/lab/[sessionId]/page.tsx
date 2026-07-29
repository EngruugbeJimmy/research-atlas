"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLabSession } from "@/hooks/use-lab-session";
import { LabSidebar } from "@/components/lab/lab-sidebar";
import { StageSupervision } from "@/components/lab/stage-supervision";
import { ExportActions } from "@/components/lab/export-actions";
import { LIFECYCLE_STAGES, type LifecycleStage } from "@/lib/lab/types";

export default function LabWorkspacePage() {
  const params = useParams<{ sessionId: string }>();
  const { hydrated, sessions, setActiveSessionId } = useLabSession();
  const [activeStage, setActiveStage] = useState<LifecycleStage>(LIFECYCLE_STAGES[0]);

  const session = sessions[params.sessionId];

  useEffect(() => {
    if (hydrated && session) setActiveSessionId(params.sessionId);
  }, [hydrated, session, params.sessionId, setActiveSessionId]);

  useEffect(() => {
    if (!session) return;
    const firstIncomplete = LIFECYCLE_STAGES.find((s) => session.stages[s].status !== "complete");
    if (firstIncomplete) setActiveStage(firstIncomplete);
  }, [session?.id]);

  if (!hydrated) return null;

  if (!session) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="font-display text-2xl">Session not found</h1>
        <p className="mt-2 text-ink/60 dark:text-paper/60">
          This Lab session doesn't exist in this browser — sessions aren't shared across devices.
        </p>
        <a href="/lab" className="mt-6 inline-block text-basin-500 hover:underline">
          ← Start a new session
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <LabSidebar session={session} activeStage={activeStage} onSelectStage={setActiveStage} />
      <div className="flex flex-1 flex-col">
        <StageSupervision sessionId={session.id} session={session} stage={activeStage} />
        {session.status === "ready_for_review" && (
          <div className="border-t border-basin-500/15 p-4">
            <ExportActions session={session} />
          </div>
        )}
      </div>
    </div>
  );
}