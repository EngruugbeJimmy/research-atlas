/**
 * lib/domains/types.ts
 *
 * A "domain" is a research faculty/subject area — Bluewater Basin's
 * environmental science track is the first one. This exists so that
 * future subject areas (life sciences, social science, physical
 * sciences, etc.) can be added later as siblings, each with their own
 * mission set, without restructuring how missions themselves work.
 *
 * This is data-layer scaffolding only — nothing in the app renders or
 * reads from this yet. See lib/domains/data.ts for the actual list.
 */

export type DomainStatus = "live" | "coming-soon";

export interface Domain {
  /** Stable slug-style identifier, e.g. "environmental-science". */
  id: string;
  /** Display name, e.g. "Environmental Science". */
  name: string;
  /** Short label shown alongside the name, e.g. "Bluewater Basin". */
  tagline: string;
  /** One or two sentences describing what this domain covers. */
  description: string;
  status: DomainStatus;
  /**
   * IDs of missions (from lib/missions/data.ts) that belong to this
   * domain. Empty for domains that don't have any missions built yet.
   */
  missionIds: string[];
}
