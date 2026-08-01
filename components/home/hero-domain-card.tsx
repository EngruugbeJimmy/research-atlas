"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function HeroDomainCard({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn(
        "overflow-hidden rounded-2xl border border-ink/10 bg-paper/90 shadow-[0_1px_2px_rgba(14,27,31,0.06),0_8px_24px_-8px_rgba(14,27,31,0.10)] backdrop-blur-sm transition-shadow hover:shadow-[0_2px_4px_rgba(14,27,31,0.08),0_16px_32px_-10px_rgba(14,27,31,0.14)] dark:border-paper/10 dark:bg-ink-800/90",
        className
      )}
    >
      {children}
    </motion.div>
  );
}