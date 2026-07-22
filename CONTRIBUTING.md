# Contributing to Research Atlas

Thank you for helping build the world's best open-source research education platform.

## What needs building

**Highest priority:**
1. Lesson content for Missions 02–12 — see `lib/missions/types.ts` for the mandatory structure
2. New interactive simulations (kriging, variogram explorer, random forest visualizer, neural network, cross-validation)
3. Peer review of scientific accuracy in Missions 00 and 01

## The mandatory lesson structure

Every lesson **must** have all ten parts defined in `Lesson` in `lib/missions/types.ts`:

1. **Story** — real-world problem framing, no math, no code
2. **Plain English** — explain without jargon, as if the learner has no prior knowledge
3. **Math** — one or more `Equation` objects with LaTeX and a plain-English explanation of every symbol
4. **Interactive simulation** — reference a key in `simulationRegistry`; if the sim doesn't exist yet, build it first
5. **Code** — Python and/or R, with a `walkthrough` array explaining every block
6. **Research Connection** — how real scientists actually use this
7. **Mini Quiz** — minimum two `QuizQuestion` objects with four options and an `explanation`
8. **Mission Challenge** — one small practical task with a `hint`
9. **Teach Back** — a prompt asking the learner to explain the concept out loud

## Bluewater Basin data rules

- All content must reference Bluewater Basin datasets, not real-world unpublished data.
- Do not reference any real named watershed or published environmental dataset without explicit permission.
- Station identifiers (GW-14, RG-03, WQ-09, etc.) are established in Mission 01 — reuse them consistently.
- Elevations, coordinates, and sensor readings should be scientifically plausible but need not match any real place.

## Simulations

Simulations live in `components/simulations/`. They must be:
- Pure client-side TypeScript (no Python runtime, no server calls)
- Interactive — at minimum one draggable slider or clickable map
- Tied to Bluewater Basin data (use `lib/utils/synthetic-terrain.ts` as a pattern)
- Accessible: `aria-label` on canvas elements, keyboard-operable controls

After building a simulation, add it to `components/simulations/registry.tsx` and `lib/simulations/data.ts`.

## Pull request checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` produces no errors
- [ ] New lesson follows the ten-part structure
- [ ] All Bluewater Basin station IDs are consistent with existing content
- [ ] No real unpublished scientific data is used
- [ ] Simulations have `aria-label` on interactive elements

## Code style

- TypeScript strict mode — no `any`, no `// @ts-ignore`
- Server Components by default; `"use client"` only when state or browser APIs are needed
- Tailwind classes only — no inline styles, no CSS modules
- Design tokens from `tailwind.config.ts` — no raw hex values in components
