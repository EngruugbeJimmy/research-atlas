"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/hooks/use-progress";

const FLUSH_INTERVAL_MS = 20_000;
// Don't count idle tabs as study time: if a page sits open longer than
// this without the user coming back, ignore the extra time.
const MAX_SINGLE_FLUSH_MS = 5 * 60 * 1000;

/**
 * Tracks how long a learner has this lesson/mission open and periodically
 * saves that time to progress storage, so "hours studied" reflects reality
 * instead of staying at zero forever.
 */
export function useTimeTracking(missionId: string) {
  const { addTimeSpent } = useProgress();
  const lastFlushRef = useRef<number>(Date.now());

  useEffect(() => {
    lastFlushRef.current = Date.now();

    function flush() {
      const now = Date.now();
      const elapsed = Math.min(now - lastFlushRef.current, MAX_SINGLE_FLUSH_MS);
      lastFlushRef.current = now;
      if (document.visibilityState === "visible") {
        addTimeSpent(missionId, elapsed);
      }
    }

    const interval = window.setInterval(flush, FLUSH_INTERVAL_MS);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", flush);

    return () => {
      flush();
      window.clearInterval(interval);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", flush);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId]);
}
