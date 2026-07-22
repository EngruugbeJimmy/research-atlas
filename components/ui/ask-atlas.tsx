"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { answerAskAtlas } from "@/lib/ask-atlas";

const suggestedPrompts = [
  "Explain this simply",
  "Give another example",
  "Quiz me",
  "Summarize this lesson",
];

interface Message {
  role: "user" | "atlas";
  content: string;
}

export function AskAtlas() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "atlas",
      content:
        "I'm Ask Atlas. I can explain any concept on this page more simply, quiz you, or connect it back to an earlier mission. What would help?",
    },
  ]);
  const [pending, setPending] = useState(false);

  async function send(text: string) {
    if (!text.trim() || pending) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setPending(true);
    const reply = await answerAskAtlas(text);
    setMessages((m) => [...m, { role: "atlas", content: reply }]);
    setPending(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Ask Atlas assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-medium text-paper shadow-lg shadow-ink/20 transition hover:bg-basin-600 dark:bg-basin-500",
          open && "hidden"
        )}
      >
        <Sparkles className="h-4 w-4 text-signal-500" />
        Ask Atlas
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-label="Ask Atlas assistant"
            className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-basin-500/20 bg-paper shadow-2xl dark:bg-ink-800"
          >
            <div className="flex items-center justify-between border-b border-basin-500/15 bg-basin-500 px-4 py-3 text-paper">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-signal-400" />
                <span className="font-medium">Ask Atlas</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "atlas"
                      ? "bg-basin-500/10 text-ink dark:text-paper"
                      : "ml-auto bg-signal-500/20 text-ink dark:text-paper"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {pending && (
                <div className="max-w-[85%] rounded-xl bg-basin-500/10 px-3 py-2 text-sm text-ink/50 dark:text-paper/50">
                  Thinking through the basin data…
                </div>
              )}
            </div>

            <div className="border-t border-basin-500/15 p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="rounded-full border border-basin-500/25 px-2.5 py-1 text-xs text-basin-500 transition hover:bg-basin-500/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this lesson…"
                  className="flex-1 rounded-full border border-basin-500/25 bg-transparent px-3 py-2 text-sm outline-none focus:border-basin-500"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="rounded-full bg-basin-500 p-2 text-paper transition hover:bg-basin-600"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
