// hooks/use-lab-session.ts
//
// Persists Lab sessions to localStorage, mirroring the pattern already
// used by useProgress.
//
// IMPORTANT: this is now Context-backed, not a plain useState hook. If
// every component that calls useLabSession() got its own independent
// localStorage-backed state, one component's update (e.g. ApolloExam
// recording an exam result) would never be visible to a sibling/parent
// component (e.g. the page deciding what screen to show next) until a
// full page reload. Wrapping in a Context makes all consumers share one
// real state instance. The public API below (useLabSession()) is
// unchanged — existing components using it don't need any edits.

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

  const persist = useCallback((next: LabStore) => {
    setStore(next);
    saveStore(next);
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
    persist({ sessions: { ...store.sessions, [id]: session }, activeSessionId: id });
    return id;
  }

  function updateSession(id: string, patch: Partial<LabSession>) {
    const existing = store.sessions[id];
    if (!existing) return;
    const updated: LabSession = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    persist({ ...store, sessions: { ...store.sessions, [id]: updated } });
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
    const session = store.sessions[id];
    if (!session) return;
    updateSession(id, {
      stages: { ...session.stages, [stage]: { ...session.stages[stage], draftContent: content } },
    });
  }

  function appendStageMessages(id: string, stage: LifecycleStage, newMessages: StageMessage[]) {
    const session = store.sessions[id];
    if (!session) return;
    const stageRecord = session.stages[stage];
    updateSession(id, {
      stages: {
        ...session.stages,
        [stage]: { ...stageRecord, messages: [...stageRecord.messages, ...newMessages] },
      },
    });
  }

  function completeStage(id: string, stage: LifecycleStage) {
    const session = store.sessions[id];
    if (!session) return;
    const stageIndex = LIFECYCLE_STAGES.indexOf(stage);
    const nextStage = LIFECYCLE_STAGES[stageIndex + 1];

    const stages = {
      ...session.stages,
      [stage]: { ...session.stages[stage], status: "complete" as const, completedAt: new Date().toISOString() },
    };
    if (nextStage) {
      stages[nextStage] = { ...stages[nextStage], status: "in_progress" as const };
    }

    updateSession(id, {
      stages,
      status: !nextStage ? "ready_for_review" : session.status,
    });
  }

  return {
    hydrated,
    sessions: store.sessions,
    activeSession,
    startNewSession,
    setActiveSessionId: (id: string) => persist({ ...store, activeSessionId: id }),
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

/** Unchanged public API — every existing component using this still works as-is. */
export function useLabSession(): LabSessionContextValue {
  const ctx = useContext(LabSessionContext);
  if (!ctx) {
    throw new Error("useLabSession() must be used within a <LabSessionProvider> — see app/lab/layout.tsx");
  }
  return ctx;
}