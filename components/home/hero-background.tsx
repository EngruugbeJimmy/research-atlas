"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    size: 2 + Math.random() * 2.5,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 6,
  }));
}

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Small, GPU-friendly parallax drift — image moves slower than the page.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  // Particles are generated client-side only, after mount, so the
  // server-rendered HTML never disagrees with the client (no random
  // values during SSR = no hydration mismatch).
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    setParticles(generateParticles(14));
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src="/images/hero-bluewater-basin.jpg"
          alt="Aerial view of Bluewater Basin's coastline, river delta, and forested ridgeline"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Gradient overlay: darker on the left where the headline sits,
          fading out toward the right so the photo stays vivid. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      {/* Gentle vignette so content stays readable in both themes */}
      <div className="pointer-events-none absolute inset-0 bg-ink/10 dark:bg-ink/20" />

      {/* Slow-drifting cloud-like glows */}
      <motion.div
        className="pointer-events-none absolute -top-1/4 left-1/3 h-[50vh] w-[50vh] rounded-full bg-paper/10 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/4 h-[40vh] w-[40vh] rounded-full bg-basin-300/10 blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, -15, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Subtle ocean shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-paper/10 to-transparent"
        animate={{ x: ["0%", "300%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 6 }}
      />

      {/* Ambient particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-paper/60"
            style={{ left: p.left, bottom: "5%", width: p.size, height: p.size }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.7, 0], y: [0, -220] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
