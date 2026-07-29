// hooks/use-lab-session.ts
//
// Persists Lab sessions to localStorage, mirroring the pattern already
// used by useProgress.
//
// IMPORTANT: every mutator below uses React's functional setState form
// (setStore(prev => ...)) instead of reading the `store` variable
// directly. This matters because multiple updates can fire back-to-back
// synchronously (e.g. apollo-exam.tsx's confirmHandoff calls
// assignFaculty then updateSession with no gap between them) — reading
// `store` directly in that situation reads stale data from before the
// first update applied, silently erasing it. The functional form always
// sees the truly latest state, no matter how many updates stack up.

"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  LabSession,
  LifecycleStage,
  LIFECYCLE_STAGES,
  createEmptyStages,
  ExamResult,
  Faculty,
  StageMessage,
} from "@/lib/lab/types";

const STORAGE_KEY = "research-atlas-lab-sessions";

interface LabStore {
  sessions: Record<string, LabSession>;
  activeSessionId: string | null;
}

function loadStore(): LabStore {
  if (typeof window === "undefined") return { sessions: {}, activeSessionId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { sessions: {}, activeSessionId: null };
  } catch {
    return { sessions: {}, activeSessionId: null };
  }
}

function saveStore(store: LabStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function useLabSessionInternal() {
  const [store, setStore] = useState<LabStore>({ sessions: {}, activeSessionId: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setHydrated(true);
  }, []);

  // Every write goes through this one place, using the functional form,
  // and persists to localStorage using the freshly-computed value —
  // never the possibly-stale `store` variable from the outer scope.
  const mutate = useCallback((updater: (prev: LabStore) => LabStore) => {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  }, []);

  const activeSession = store.activeSessionId ? store.sessions[store.activeSessionId] ?? null : null;

  function startNewSession(): string {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const session: LabSession = {
      id,
      createdAt: now,
      updatedAt: now,
      status: "exam_pending",
      examResult: null,
      faculty: null,
      topic: null,
      ethicsCheck: null,
      stages: createEmptyStages(),
      scorecard: null,
    };
    mutate((prev) => ({
      sessions: { ...prev.sessions, [id]: session },
      activeSessionId: id,
    }));
    return id;
  }

  function updateSession(id: string, patch: Partial<LabSession>) {
    mutate((prev) => {
      const existing = prev.sessions[id];
      if (!existing) return prev;
      const updated: LabSession = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      return { ...prev, sessions: { ...prev.sessions, [id]: updated } };
    });
  }

  function recordExamResult(id: string, result: ExamResult) {
    updateSession(id, {
      examResult: result,
      status: result.passed ? "in_progress" : "routed_to_missions",
    });
  }

  function assignFaculty(id: string, faculty: Faculty, topic: string) {
    updateSession(id, { faculty, topic });
  }

  function updateStageDraft(id: string, stage: LifecycleStage, content: string) {
    mutate((prev) => {
      const session = prev.sessions[id];
      if (!session) return prev;
      const updated: LabSession = {
        ...session,
        stages: { ...session.stages, [stage]: { ...session.stages[stage], draftContent: content } },
        updatedAt: new Date().toISOString(),
      };
      return { ...prev, sessions: { ...prev.sessions, [id]: updated } };
    });
  }

  function appendStageMessages(id: string, stage: LifecycleStage, newMessages: StageMessage[]) {
    mutate((prev) => {
      const session = prev.sessions[id];
      if (!session) return prev;
      const stageRecord = session.stages[stage];
      const updated: LabSession = {
        ...session,
        stages: {
          ...session.stages,
          [stage]: { ...stageRecord, messages: [...stageRecord.messages, ...newMessages] },
        },
        updatedAt: new Date().toISOString(),
      };
      return { ...prev, sessions: { ...prev.sessions, [id]: updated } };
    });
  }

  function completeStage(id: string, stage: LifecycleStage) {
    mutate((prev) => {
      const session = prev.sessions[id];
      if (!session) return prev;
      const stageIndex = LIFECYCLE_STAGES.indexOf(stage);
      const nextStage = LIFECYCLE_STAGES[stageIndex + 1];

      const stages = {
        ...session.stages,
        [stage]: { ...session.stages[stage], status: "complete" as const, completedAt: new Date().toISOString() },
      };
      if (nextStage) {
        stages[nextStage] = { ...stages[nextStage], status: "in_progress" as const };
      }

      const updated: LabSession = {
        ...session,
        stages,
        status: !nextStage ? "ready_for_review" : session.status,
        updatedAt: new Date().toISOString(),
      };
      return { ...prev, sessions: { ...prev.sessions, [id]: updated } };
    });
  }

  return {
    hydrated,
    sessions: store.sessions,
    activeSession,
    startNewSession,
    setActiveSessionId: (id: string) => mutate((prev) => ({ ...prev, activeSessionId: id })),
    recordExamResult,
    assignFaculty,
    updateStageDraft,
    appendStageMessages,
    completeStage,
    updateSession,
  };
}

type LabSessionContextValue = ReturnType<typeof useLabSessionInternal>;
const LabSessionContext = createContext<LabSessionContextValue | null>(null);

export function LabSessionProvider({ children }: { children: ReactNode }) {
  const value = useLabSessionInternal();
  return <LabSessionContext.Provider value={value}>{children}</LabSessionContext.Provider>;
}

export function useLabSession(): LabSessionContextValue {
  const ctx = useContext(LabSessionContext);
  if (!ctx) {
    throw new Error("useLabSession() must be used within a <LabSessionProvider> — see app/lab/layout.tsx");
  }
  return ctx;
}