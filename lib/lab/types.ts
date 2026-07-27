// lib/lab/types.ts
//
// Data model for a "Lab" research-supervision session — separate from
// Missions/lesson progress, since a Lab session tracks a much longer,
// document-producing process rather than lesson completion.

export type Faculty = "environmental" | "social" | "physical" | "life";

export const FACULTIES: Record<Faculty, { professorName: string; domain: string }> = {
  environmental: { professorName: "Prof Willey", domain: "Environmental Science" },
  social: { professorName: "Prof Adam Smith", domain: "Social Science" },
  physical: { professorName: "Prof Newton", domain: "Physical Science & Engineering" },
  life: { professorName: "Prof Darwin", domain: "Life Sciences" },
};

export type LifecycleStage =
  | "ideation"
  | "problem_identification"
  | "introduction"
  | "literature_review"
  | "methodology"
  | "results"
  | "conclusion"
  | "recommendations";

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  "ideation",
  "problem_identification",
  "introduction",
  "literature_review",
  "methodology",
  "results",
  "conclusion",
  "recommendations",
];

export interface ExamResult {
  score: number; // 0–100
  passed: boolean;
  weakAreas: string[]; // e.g. ["hypothesis framing", "sampling bias"] — drives Mission routing
  takenAt: string; // ISO timestamp
}

export interface StageMessage {
  role: "recruit" | "professor";
  content: string;
  timestamp: string;
}

export interface StageRecord {
  status: "locked" | "in_progress" | "complete";
  draftContent: string; // the accumulated written section content
  messages: StageMessage[];
  completedAt?: string;
}

export interface EthicsCheck {
  involvesRealPeopleOrCommunities: boolean;
  consentConsiderationsAddressed: boolean | null; // null = not yet asked/answered
  notes: string;
}

export interface ReadinessScorecard {
  novelty: { score: number; notes: string };
  methodologicalSoundness: { score: number; notes: string };
  clarity: { score: number; notes: string };
  ethicalCompliance: { score: number; notes: string; flagged: boolean };
  overallRecommendation: "ready_for_human_review" | "needs_more_work";
  generatedAt: string;
}

export type LabSessionStatus =
  | "exam_pending"
  | "routed_to_missions"
  | "in_progress"
  | "ready_for_review"
  | "matched_with_reviewer";

export interface LabSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: LabSessionStatus;
  examResult: ExamResult | null;
  faculty: Faculty | null;
  topic: string | null;
  ethicsCheck: EthicsCheck | null;
  stages: Record<LifecycleStage, StageRecord>;
  scorecard: ReadinessScorecard | null;
}

export function createEmptyStages(): Record<LifecycleStage, StageRecord> {
  return Object.fromEntries(
    LIFECYCLE_STAGES.map((stage, i) => [
      stage,
      { status: i === 0 ? "in_progress" : "locked", draftContent: "", messages: [] } as StageRecord,
    ])
  ) as Record<LifecycleStage, StageRecord>;
}