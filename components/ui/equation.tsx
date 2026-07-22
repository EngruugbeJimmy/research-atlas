import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import type { Equation as EquationType } from "@/lib/missions/types";

export function Equation({ label, latex, explanation }: EquationType) {
  return (
    <div className="rounded-xl border border-basin-500/15 bg-basin-50/40 p-5 dark:bg-basin-700/10">
      <p className="type-eyebrow mb-3">{label}</p>
      <div className="overflow-x-auto text-lg">
        <BlockMath math={latex} />
      </div>
      <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">{explanation}</p>
    </div>
  );
}
