"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Share2,
  Copy,
  Check,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { answerAskAtlas } from "@/lib/ask-atlas";

const suggestedPrompts = [
  "What is a table?",
  "Explain machine learning simply",
  "What is GIS?",
  "How do scientists clean data?",
  "Help me solve a research problem",
  "Quiz me on this mission",
];

const topics = ["Statistics", "GIS", "Machine Learning", "Python", "Research", "Bluewater Basin"];

const ATLAS_URL = "https://research-atlas-chi.vercel.app";

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
        "👋 Welcome to Ask Atlas! I'm your AI research tutor. I can explain concepts, answer general questions, teach statistics, mathematics, GIS, Python, R, machine learning, scientific writing, environmental science, and guide you through every Research Atlas mission. What would you like to learn today?",
    },
  ]);
  const [pending, setPending] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Once the learner has actually sent something, the onboarding chrome
  // (quick topics + suggested prompts) steps aside to give the
  // conversation itself the room — this is the "prioritize the
  // conversation" behavior the panel is built around.
  const hasStartedChat = messages.some((m) => m.role === "user");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function send(text: string) {
    if (!text.trim() || pending) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setPending(true);

    const reply = await answerAskAtlas(text);

    setMessages((m) => [...m, { role: "atlas", content: reply }]);
    setPending(false);
  }

  function shareMessage(text: string) {
    const message = `${text}\n\nLearn more with Ask Atlas\n\n${ATLAS_URL}`;

    if (navigator.share) {
      navigator.share({ title: "Ask Atlas", text: message });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }
  }

  function shareAskAtlas() {
    shareMessage(
      "🚀 I'm learning research with Ask Atlas on Research Atlas.\n\n" +
        "Ask Atlas explains Statistics, GIS, AI, Python, Machine Learning and Scientific Research in simple language.\n\n" +
        "Try it yourself:"
    );
  }

  async function copyMessage(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 1500);
    } catch {
      // Copying is a nice-to-have — fail silently rather than throwing.
    }
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
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Ask Atlas assistant"
            className="fixed bottom-6 right-6 z-50 flex h-[80vh] max-h-[80vh] w-[480px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-basin-500/20 bg-paper shadow-2xl dark:bg-ink-800"
          >
            {/* Header — fixed */}
            <div className="flex shrink-0 items-center justify-between border-b border-basin-500/15 bg-basin-500 px-4 py-3 text-paper">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-signal-400" />
                <div>
                  <p className="font-semibold">Ask Atlas</p>
                  <p className="text-xs opacity-80">Your AI Research Tutor</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={shareAskAtlas}
                  title="Share Ask Atlas"
                  aria-label="Share Ask Atlas"
                  className="rounded-full p-2 hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setOpen(false)}
                  title="Close"
                  aria-label="Close Ask Atlas"
                  className="rounded-full p-2 hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Topics — compact, collapses once the chat has started */}
            {!hasStartedChat && (
              <div className="shrink-0 border-b border-basin-500/10 px-4 py-2">
                <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap pb-0.5">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setInput(`Explain ${topic}`)}
                      className="shrink-0 rounded-full border border-basin-500/20 px-2 py-0.5 text-[11px] transition hover:bg-basin-500/10"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation — the panel's main event, flex-1 so it fills
                whatever space the fixed header/topics/input leave behind
                (roughly 75-80% of the 80vh panel in practice). */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
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
                  <div>
                    {m.content}
                    {m.role === "atlas" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => copyMessage(m.content, i)}
                          aria-label="Copy message"
                          className="text-xs"
                        >
                          {copiedIndex === i ? (
                            <Check className="h-3 w-3 text-signal-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => shareMessage(m.content)}
                          aria-label="Share message"
                          className="text-xs"
                        >
                          <Share2 className="h-3 w-3" />
                        </button>
                        <button aria-label="Helpful" className="text-xs">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {pending && (
                <div className="max-w-[85%] rounded-xl bg-basin-500/10 px-3 py-2 text-sm text-ink/60 dark:text-paper/60">
                  🤖 Atlas AI is thinking...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input — fixed at the bottom */}
            <div className="shrink-0 border-t border-basin-500/15 p-3">
              {!hasStartedChat && (
                <div className="mb-3 flex flex-wrap gap-2">
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
              )}

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
                  placeholder="Ask anything about research, science, AI, programming or this mission..."
                  className="flex-1 rounded-full border border-basin-500/25 bg-transparent px-4 py-2 text-sm outline-none focus:border-basin-500"
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