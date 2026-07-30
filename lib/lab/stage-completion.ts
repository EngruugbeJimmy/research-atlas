// lib/lab/stage-completion.ts
//
// Parses the professor's "STAGE_COMPLETE: true / STAGE_DRAFT:" block
// (format defined in shared-supervision-rules.ts) out of a response,
// separating it from the conversational reply the recruit actually sees.

const COMPLETE_MARKER = "STAGE_COMPLETE:";
const DRAFT_MARKER = "STAGE_DRAFT:";

export interface StageCompletionResult {
  stageComplete: boolean;
  stageDraft: string | null;
  cleanedText: string;
}

export function parseStageCompletion(text: string): StageCompletionResult {
  const completeIndex = text.indexOf(COMPLETE_MARKER);
  if (completeIndex === -1) {
    return { stageComplete: false, stageDraft: null, cleanedText: text };
  }

  const before = text.slice(0, completeIndex).trim();
  const afterComplete = text.slice(completeIndex + COMPLETE_MARKER.length);
  const isComplete = afterComplete.trim().toLowerCase().startsWith("true");

  if (!isComplete) {
    return { stageComplete: false, stageDraft: null, cleanedText: text };
  }

  const draftIndex = afterComplete.indexOf(DRAFT_MARKER);
  if (draftIndex === -1) {
    // Model said complete but didn't include a draft — treat cautiously,
    // don't advance without real content to save.
    return { stageComplete: false, stageDraft: null, cleanedText: text };
  }

  const stageDraft = afterComplete.slice(draftIndex + DRAFT_MARKER.length).trim();

  return {
    stageComplete: true,
    stageDraft: stageDraft || null,
    cleanedText: before || "Great — this stage is complete. Moving you to the next one.",
  };
}