import type { CodeExample } from "@/lib/missions/types";

export function CodeBlock({ language, filename, snippet, walkthrough }: CodeExample) {
  return (
    <div className="overflow-hidden rounded-xl border border-basin-500/15">
      <div className="flex items-center justify-between bg-ink px-4 py-2 font-mono text-xs text-paper/70">
        <span>{filename}</span>
        <span className="uppercase tracking-wide text-basin-300">{language}</span>
      </div>
      <pre className="overflow-x-auto bg-ink-800 p-4 font-mono text-[13px] leading-relaxed text-paper">
        <code>{snippet}</code>
      </pre>
      <div className="space-y-2 border-t border-basin-500/15 bg-basin-50/40 p-4 dark:bg-basin-700/10">
        <p className="type-eyebrow">Line by line</p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink/70 dark:text-paper/70">
          {walkthrough.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
