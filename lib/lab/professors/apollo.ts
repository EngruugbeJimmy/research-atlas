// lib/lab/professors/apollo.ts
//
// Prof Apollo is the Lab's single entry point: runs the diagnostic exam,
// decides pass/fail, names specific weak areas (for Mission routing),
// and — on a pass — determines which of the four domain professors
// should take over supervision based on the recruit's stated topic.

export const APOLLO_SYSTEM_PROMPT = `
You are Prof Apollo, the intake supervisor for Research Atlas Lab.

Your job has exactly two parts, never both loosely combined:

1. BEFORE a recruit has passed the diagnostic exam: you administer and
   discuss the exam only. You do not discuss their research topic, offer
   research advice, or speculate about publishability yet. If they ask
   about their topic before passing, redirect them warmly to finish the
   exam first — this isn't gatekeeping for its own sake, it's making sure
   the supervision that follows actually lands on solid ground.

2. AFTER a recruit has passed: your only remaining job is to have a short
   conversation about what real-world problem or community they're
   interested in, then hand them off by name to exactly one of:
   - Prof Willey (Environmental Science)
   - Prof Adam Smith (Social Science)
   - Prof Newton (Physical Science & Engineering)
   - Prof Darwin (Life Sciences)
   Make the handoff explicit and warm: name the professor, say why their
   topic fits that faculty, and tell them supervision continues there.

TONE: encouraging but honest. If someone fails the exam, never frame it
as rejection — frame it as "here's exactly what to strengthen first,"
and name the specific Missions that address each weak area.

NEVER claim a research topic "will be publishable" — that determination
belongs to a qualified human reviewer, not you. This applies even before
the exam, if someone asks.

FORMATTING: plain text, no markdown headers, conversational, short
responses (under 150 words) unless walking through exam feedback.
`;

export interface ApolloExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** Used to route to specific Missions when this question is answered wrong. */
  weakAreaTag: string;
  weakAreaMissionHint: string; // human-readable pointer, e.g. "STN 01 — Statistical Thinking"
}

export const APOLLO_EXAM_QUESTIONS: ApolloExamQuestion[] = [
  {
    id: "q1",
    question:
      "A researcher wants to know if a new fertilizer increases crop yield. Which is the strongest research question?",
    options: [
      "Is fertilizer good for plants?",
      "Does Fertilizer X increase tomato yield compared to no fertilizer, under the same growing conditions?",
      "What do farmers think about fertilizer?",
      "How much does fertilizer cost?",
    ],
    correctIndex: 1,
    weakAreaTag: "research_question_framing",
    weakAreaMissionHint: "STN 01 — Statistical Thinking",
  },
  {
    id: "q2",
    question:
      "A study finds that towns with more ice cream shops also have more drowning deaths. What's the most likely explanation?",
    options: [
      "Ice cream causes drowning",
      "Drowning causes ice cream sales",
      "A third factor (like hot weather) increases both",
      "The data must be wrong",
    ],
    correctIndex: 2,
    weakAreaTag: "correlation_vs_causation",
    weakAreaMissionHint: "STN 01 — Statistical Thinking",
  },
  {
    id: "q3",
    question:
      "You survey only people who visit a gym to ask about exercise habits in the general population. What's the main problem?",
    options: [
      "The survey questions are probably worded badly",
      "Sampling bias — gym visitors aren't representative of the general population",
      "There's no problem, gym visitors know about exercise",
      "The sample size is too large",
    ],
    correctIndex: 1,
    weakAreaTag: "sampling_bias",
    weakAreaMissionHint: "STN 02 — Regression & Estimation (sampling fundamentals)",
  },
  {
    id: "q4",
    question: "A p-value of 0.03 in a study most directly tells you:",
    options: [
      "There's a 3% chance the hypothesis is false",
      "The effect is large and important",
      "If there were truly no effect, results this extreme would occur about 3% of the time by chance",
      "The study is 97% accurate",
    ],
    correctIndex: 2,
    weakAreaTag: "statistical_inference",
    weakAreaMissionHint: "STN 05 — Uncertainty Quantification",
  },
  {
    id: "q5",
    question: "Which of these is a testable, falsifiable hypothesis?",
    options: [
      "Nature is beautiful",
      "Plants grown under blue light will grow taller, on average, than plants grown under red light",
      "Some plants like sunlight",
      "Photosynthesis is important",
    ],
    correctIndex: 1,
    weakAreaTag: "hypothesis_framing",
    weakAreaMissionHint: "STN 01 — Statistical Thinking",
  },
  {
    id: "q6",
    question: "A literature review's main purpose is to:",
    options: [
      "Prove your idea is completely original",
      "Show you read a lot of papers",
      "Establish what's already known and identify a genuine gap your research addresses",
      "List every paper on the general topic",
    ],
    correctIndex: 2,
    weakAreaTag: "literature_review_purpose",
    weakAreaMissionHint: "STN 07 — Teaching & Communication",
  },
  {
    id: "q7",
    question:
      "Your study collects data from real community members about a sensitive topic. What must happen before data collection?",
    options: [
      "Nothing, as long as your intentions are good",
      "You should get informed consent and consider ethics review",
      "Just anonymize the data afterward",
      "Only needed if you plan to publish",
    ],
    correctIndex: 1,
    weakAreaTag: "research_ethics",
    weakAreaMissionHint: "General research ethics — flagged for Lab's ethics check, not a single Mission",
  },
  {
    id: "q8",
    question: "A confidence interval of [2.1, 9.8] for an effect estimate means:",
    options: [
      "The true effect is definitely between 2.1 and 9.8",
      "There's a range of plausible values for the true effect, given the data and method used",
      "The effect could be anything, the study failed",
      "2.1 and 9.8 are the only two possible outcomes",
    ],
    correctIndex: 1,
    weakAreaTag: "confidence_intervals",
    weakAreaMissionHint: "STN 05 — Uncertainty Quantification",
  },
  {
    id: "q9",
    question: "Why is a control group important in an experiment?",
    options: [
      "It makes the study look more scientific",
      "It's required by law",
      "It provides a baseline to compare against, isolating the effect of what you changed",
      "It's optional if your sample is large enough",
    ],
    correctIndex: 2,
    weakAreaTag: "experimental_design",
    weakAreaMissionHint: "STN 02 — Regression & Estimation",
  },
  {
    id: "q10",
    question: "A dataset has several missing values and a few extreme outliers. Before analysis, you should:",
    options: [
      "Ignore them, they won't matter",
      "Delete the entire dataset and start over",
      "Investigate and document how you handle them, since the choice affects your results",
      "Always delete outliers immediately",
    ],
    correctIndex: 2,
    weakAreaTag: "data_cleaning",
    weakAreaMissionHint: "STN 00/01 — Foundations & Statistical Thinking (data cleaning basics)",
  },
];

const PASS_THRESHOLD = 70; // percent

export interface ApolloExamOutcome {
  score: number;
  passed: boolean;
  weakAreas: { tag: string; missionHint: string }[];
}

export function scoreApolloExam(answerIndices: (number | null)[]): ApolloExamOutcome {
  let correct = 0;
  const weakAreas: { tag: string; missionHint: string }[] = [];

  APOLLO_EXAM_QUESTIONS.forEach((q, i) => {
    if (answerIndices[i] === q.correctIndex) {
      correct += 1;
    } else {
      weakAreas.push({ tag: q.weakAreaTag, missionHint: q.weakAreaMissionHint });
    }
  });

  const score = Math.round((correct / APOLLO_EXAM_QUESTIONS.length) * 100);
  return { score, passed: score >= PASS_THRESHOLD, weakAreas };
}

// Lightweight keyword pre-filter for faculty handoff. This is a fallback/
// hint only — Apollo (the LLM) should make the real handoff decision
// through conversation, since a keyword match can't understand nuance
// (e.g. "water pollution's effect on fish populations" spans both
// environmental and life sciences). Use this to pre-select a likely
// faculty in the UI, but let the conversation confirm or override it.
const FACULTY_KEYWORDS: Record<string, string[]> = {
  environmental: ["climate", "water", "pollution", "groundwater", "ecosystem", "sustainability", "coastal"],
  social: ["community", "behavior", "policy", "education", "economic", "society", "survey", "culture"],
  physical: ["engineering", "physics", "energy", "materials", "mechanical", "structural", "chemistry"],
  life: ["biology", "health", "disease", "genetics", "ecology", "medicine", "organism", "species"],
};

export function suggestFacultyFromTopic(topic: string): string | null {
  const lower = topic.toLowerCase();
  let best: string | null = null;
  let bestCount = 0;
  for (const [faculty, keywords] of Object.entries(FACULTY_KEYWORDS)) {
    const count = keywords.filter((k) => lower.includes(k)).length;
    if (count > bestCount) {
      best = faculty;
      bestCount = count;
    }
  }
  return best;
}