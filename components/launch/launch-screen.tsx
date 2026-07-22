"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { ContourField } from "@/components/simulations/contour-field";

const MESSAGES = [
  "Initializing Research Atlas...",
  "Loading Missions...",
  "Preparing Interactive Lessons...",
  "Initializing Atlas AI...",
  "Loading Scientific Visualizations...",
  "Preparing Interactive Maps...",
  "Almost Ready...",
];

const FACTS = [
  "Every great scientific discovery begins with a well-asked question.",
  "Groundwater stores nearly 30% of Earth's freshwater.",
  "Good research starts with clean data.",
  "Every model is only as good as the data behind it.",
  "A well-designed sample can outperform a much larger biased one.",
  "The word 'data' is plural — one datum, many data.",
  "P-values tell you about your data, not the truth of your hypothesis.",
];

const MESSAGE_INTERVAL_MS = 650;
const FACT_INTERVAL_MS = 4000;
const EXIT_DELAY_MS = 500;
const EXIT_DURATION_MS = 700;

/** True once the document (and its resources) have actually finished loading. */
function useAppReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.readyState === "complete") {
      setReady(true);
      return;
    }
    function onLoad() {
      setReady(true);
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return ready;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 4,
  }));
}

export function LaunchScreen() {
  const appReady = useAppReady();
  const [messageIndex, setMessageIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const particles = useMemo(() => generateParticles(22), []);

  const isLastMessage = messageIndex === MESSAGES.length - 1;

  // Advance through the loading messages at a steady cadence.
  useEffect(() => {
    if (isLastMessage) return;
    const t = setTimeout(() => setMessageIndex((i) => i + 1), MESSAGE_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [messageIndex, isLastMessage]);

  // Rotate the educational facts independently of the loading sequence.
  useEffect(() => {
    const t = setInterval(() => setFactIndex((i) => (i + 1) % FACTS.length), FACT_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  // Only finish once we've shown every message AND the app has actually
  // finished loading — this is a real readiness signal, not a fake timer.
  useEffect(() => {
    if (isLastMessage && appReady) {
      const t = setTimeout(() => setDone(true), EXIT_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [isLastMessage, appReady]);

  // Remove from the DOM only after the fade-out animation finishes.
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setHidden(true), EXIT_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [done]);

  useEffect(() => {
    // Prevent scroll behind the launch screen while it's up.
    if (hidden) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [hidden]);

  if (hidden) return null;

  const progress = done ? 100 : Math.min(96, Math.round(((messageIndex + 1) / MESSAGES.length) * 100));

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-paper dark:bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION_MS / 1000, ease: "easeInOut" }}
      role="status"
      aria-live="polite"
      aria-label="Research Atlas is loading"
    >
      {/* Ambient gradient glow */}
      <div
        className="pointer-events-none absolute -left-1/4 -top-1/4 h-[70vh] w-[70vh] rounded-full bg-basin-500/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-1/4 -right-1/4 h-[60vh] w-[60vh] rounded-full bg-signal-500/20 blur-[120px]"
        aria-hidden="true"
      />

      {/* Topographic contour background */}
      <ContourField
        className="pointer-events-none absolute inset-0 h-full w-full text-basin-500 animate-contour-breathe"
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-signal-400/50 dark:bg-basin-300/50"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: [0, -40, -80] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="relative flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-basin-500/40 blur-2xl"
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-basin-500 bg-paper text-basin-500 dark:bg-ink">
            <Compass className="h-10 w-10" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
          className="mt-6 font-display text-3xl font-medium md:text-4xl"
        >
          Research Atlas
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-basin-500"
        >
          Learn Research Like a Scientist.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-10 w-64 sm:w-80"
        >
          <div className="h-1.5 overflow-hidden rounded-full bg-basin-500/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-basin-500 to-signal-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-ink/50 dark:text-paper/50">
            <motion.span
              key={messageIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {MESSAGES[messageIndex]}
            </motion.span>
            <span>{progress}%</span>
          </div>
        </motion.div>

        {/* Rotating facts */}
        <div className="mt-8 h-10 max-w-sm sm:max-w-md">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-ink/55 dark:text-paper/55"
          >
            💡 {FACTS[factIndex]}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
