// hooks/use-lab-session.ts
//
// Persists Lab sessions to localStorage, mirroring the pattern already
// used by useProgress.
//
// CRITICAL: every function this hook returns is wrapped in useCallback.
// Without that, each one is a brand-new function on every render — and
// if any of them end up in a useEffect dependency array (as
// setActiveSessionId does in app/lab/[sessionId]/page.tsx), React sees
// "a dependency changed" every single render, re-runs the effect, which
// calls the function, which updates state, which re-renders, which
// creates a new function again — an infinite loop that freezes the
// entire page, including completely unrelated things like nav clicks.

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

  const mutate = useCallback((updater: (prev: LabStore) => LabStore) => {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  }, []);

  const activeSession = store.activeSessionId ? store.sessions[store.activeSessionId] ?? null : null;

  const startNewSession = useCallback((): string => {
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
  }, [mutate]);

  const updateSession = useCallback(
    (id: string, patch: Partial<LabSession>) => {
      mutate((prev) => {
        const existing = prev.sessions[id];
        if (!existing) return prev;
        const updated: LabSession = { ...existing, ...patch, updatedAt: new Date().toISOString() };
        return { ...prev, sessions: { ...prev.sessions, [id]: updated } };
      });
    },
    [mutate]
  );

  const recordExamResult = useCallback(
    (id: string, result: ExamResult) => {
      updateSession(id, {
        examResult: result,
        status: result.passed ? "in_progress" : "routed_to_missions",
      });
    },
    [updateSession]
  );

  const assignFaculty = useCallback(
    (id: string, faculty: Faculty, topic: string) => {
      updateSession(id, { faculty, topic });
    },
    [updateSession]
  );

  const updateStageDraft = useCallback(
    (id: string, stage: LifecycleStage, content: string) => {
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
    },
    [mutate]
  );

  const appendStageMessages = useCallback(
    (id: string, stage: LifecycleStage, newMessages: StageMessage[]) => {
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
    },
    [mutate]
  );

  const completeStage = useCallback(
    (id: string, stage: LifecycleStage) => {
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
    },
    [mutate]
  );

  const setActiveSessionId = useCallback(
    (id: string) => mutate((prev) => ({ ...prev, activeSessionId: id })),
    [mutate]
  );

  return {
    hydrated,
    sessions: store.sessions,
    activeSession,
    startNewSession,
    setActiveSessionId,
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