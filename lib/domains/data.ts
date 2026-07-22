/**
 * lib/domains/data.ts
 *
 * The list of research domains/faculties. Bluewater Basin (Environmental
 * Science) is the only one with real missions today — it's tagged "live"
 * and claims every existing mission ID. The other entries are placeholders
 * for future subject areas: adding a new domain later means adding one
 * object here and, eventually, mission content for it — nothing about
 * the existing missions, routes, or UI needs to change to support that.
 *
 * Not wired into any page or component yet. This is intentionally just
 * the data layer, ready for a future UI (e.g. a domain picker) to read
 * from when that's actually built.
 */

import { missions } from "@/lib/missions/data";
import type { Domain } from "./types";

export const domains: Domain[] = [
  {
    id: "environmental-science",
    name: "Environmental Science",
    tagline: "Bluewater Basin",
    description:
      "Watershed hydrology, water quality, GIS, and environmental data science, taught through one continuous fictional field investigation.",
    status: "live",
    missionIds: missions.map((m) => m.id),
  },
  {
    id: "life-sciences",
    name: "Life Sciences",
    tagline: "Coming soon",
    description:
      "Biology, ecology, and life-science research methods, taught the same mission-based way as Bluewater Basin.",
    status: "coming-soon",
    missionIds: [],
  },
  {
    id: "social-behavioral-science",
    name: "Social & Behavioral Science",
    tagline: "Coming soon",
    description:
      "Surveys, experiments, and research methods for studying people, communities, and behavior.",
    status: "coming-soon",
    missionIds: [],
  },
  {
    id: "physical-sciences-engineering",
    name: "Physical Sciences & Engineering",
    tagline: "Coming soon",
    description:
      "Physics, chemistry, and engineering research methods, modelling, and lab-adjacent data analysis.",
    status: "coming-soon",
    missionIds: [],
  },
];

/** Looks up a single domain by its ID. */
export function getDomainById(domainId: string): Domain | undefined {
  return domains.find((d) => d.id === domainId);
}

/** Finds which domain a given mission belongs to, if any. */
export function getDomainForMission(missionId: string): Domain | undefined {
  return domains.find((d) => d.missionIds.includes(missionId));
}

/** Domains with real, playable missions today. */
export function getLiveDomains(): Domain[] {
  return domains.filter((d) => d.status === "live");
}

/** Domains that are announced but don't have mission content yet. */
export function getUpcomingDomains(): Domain[] {
  return domains.filter((d) => d.status === "coming-soon");
}
