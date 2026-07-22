import type { SimulationKey } from "@/components/simulations/registry";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Equation {
  label: string;
  latex: string;
  explanation: string;
}

export interface CodeExample {
  language: "python" | "r";
  filename: string;
  snippet: string;
  walkthrough: string[]; // one explanation per logical block, shown alongside
}

export interface Lesson {
  id: string;
  missionId: string;
  order: number;
  title: string;
  durationMinutes: number;
  // 1. Story
  story: string[];
  // 2 & 3. Visual explanation + Plain English are combined in the UI,
  // since the plain-English copy narrates the visual.
  plainEnglish: string[];
  visual?: {
    kind: "contour" | "instrument" | "diagram";
    caption: string;
  };
  // The Analogy: a short everyday comparison (toys, food, playground games)
  // that makes the core idea click before the formal explanation continues.
  analogy?: string[];
  // 4. Mathematics
  math?: {
    intro: string;
    equations: Equation[];
  };
  // 5. Interactive simulation
  simulation?: {
    component: SimulationKey;
    caption: string;
  };
  // 6. Code
  code?: CodeExample[];
  // 7. Research connection
  researchConnection: string[];
  // 8. Mini quiz
  quiz: QuizQuestion[];
  // 9. Mission challenge
  challenge: {
    prompt: string;
    hint: string;
  };
  // 10. Teach back
  teachBack: {
    prompt: string;
  };
}

export interface Mission {
  id: string;
  lessons: Lesson[];
}
