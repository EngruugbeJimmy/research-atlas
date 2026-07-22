import type { Lesson } from "@/lib/missions/types";

export const mission11Lessons: Lesson[] = [
  {
    id: "11-1-choosing-the-right-chart",
    missionId: "11-scientific-communication",
    order: 1,
    title: "Choosing the Right Chart",
    durationMinutes: 12,
    story: [
      "You have three charts of the same nitrate data, a bar chart, a line chart, and a map, and thirty seconds to choose one for the front page of the annual Bluewater Basin report. Your supervisor's rule: 'the chart type is an argument. Choose the one that makes the true argument obvious, not just the one that looks most familiar.'",
    ],
    plainEnglish: [
      "Different chart types make different comparisons easy and others hard. A line chart makes trends over time obvious. A bar chart makes comparing discrete categories obvious. A map makes spatial patterns obvious. Using the wrong type doesn't just look worse, it can hide the very pattern you're trying to show, or accidentally suggest a pattern that isn't really there.",
    ],
    analogy: [
      "Picking a chart type is like picking a tool from a toolbox. A hammer and a screwdriver can both technically hit a nail, but only one does it well. Line charts, bar charts, and maps are different tools built for different jobs, and grabbing the wrong one makes the work harder and the result worse.",
    ],
    researchConnection: [
      "Data visualization researchers have shown repeatedly that chart type measurably changes how accurately readers perceive relationships in the same underlying data. Choosing chart type deliberately, rather than by habit, is now considered a core scientific communication skill, not just a design preference.",
    ],
    quiz: [
      {
        question: "Why might a bar chart be the wrong choice for showing nitrate trends across five years?",
        options: [
          "Bar charts are always wrong",
          "A bar chart doesn't naturally emphasize continuous change over time the way a line chart does",
          "Bar charts can only show two categories",
          "There's no wrong choice as long as the data is correct",
        ],
        correctIndex: 1,
        explanation: "Line charts are built for showing trends across a continuous axis like time; bar charts are built for comparing discrete, often unordered categories.",
      },
    ],
    challenge: {
      prompt: "For the nitrate-across-five-years scenario, choose a chart type and write one sentence justifying it based on what comparison you want the reader to make effortlessly.",
      hint: "Ask: what's the one thing I want a reader to notice in the first three seconds of looking at this?",
    },
    teachBack: {
      prompt: "Explain to someone why chart type choice is 'an argument' and not just a stylistic decision.",
    },
  },
  {
    id: "11-2-how-figures-mislead",
    missionId: "11-scientific-communication",
    order: 2,
    title: "How Figures Mislead",
    durationMinutes: 15,
    story: [
      "An early draft of the annual report shows nitrate 'skyrocketing', the bar for this year looks three times taller than last year's. You check the axis: it starts at 8 mg/L, not 0. The actual increase is real but modest; the chart made it look dramatic.",
    ],
    plainEnglish: [
      "Small design choices, a truncated y-axis, a dual axis with mismatched scales, cherry-picked date ranges, or 3D effects that distort area, can make an honest dataset look far more dramatic (or far flatter) than it really is. None of these require faking any numbers; they only require choosing how to draw them.",
    ],
    analogy: [
      "It is like a photograph that zooms in so tightly on someone's face that a small smile looks like an enormous grin. Nothing about the photo was faked, the camera just chose to crop out the context that would have shown how small the expression actually was.",
    ],
    researchConnection: [
      "Truncated axes are one of the most common and most criticized visualization practices in both scientific publishing and media reporting on science, precisely because they're technically 'not lying' about any individual number while still misleading readers about magnitude. Reviewers and readers are increasingly trained to check axis ranges as a first step.",
    ],
    quiz: [
      {
        question: "Why is a truncated y-axis considered misleading even though every plotted number is accurate?",
        options: [
          "It isn't misleading, since the numbers are correct",
          "It exaggerates the visual magnitude of a change, making a small difference look dramatic even though no individual value was altered",
          "It's only misleading in bar charts, not line charts",
          "Truncated axes are always illegal",
        ],
        correctIndex: 1,
        explanation: "The data is accurate, but the visual impression of magnitude is distorted, readers judge differences by height/area, and a truncated axis exaggerates that visual comparison.",
      },
    ],
    challenge: {
      prompt: "Redraw (on paper or in words) the nitrate bar chart with the y-axis starting at 0. Describe how different the story looks.",
      hint: "The underlying increase is still real, describe honestly what it looks like without the exaggeration.",
    },
    teachBack: {
      prompt: "Explain to someone why 'nothing was technically falsified' doesn't mean a chart can't still mislead.",
    },
  },
  {
    id: "11-3-writing-for-different-audiences",
    missionId: "11-scientific-communication",
    order: 3,
    title: "Writing for Different Audiences",
    durationMinutes: 12,
    story: [
      "You need to describe the same kriging result, a nitrate hotspot near GW-14 with an 80% probability of exceeding the safety threshold, twice: once for a peer-reviewed methods appendix, and once for the town council's one-page summary. The facts don't change. The words have to.",
    ],
    plainEnglish: [
      "A peer reviewer wants precision, methodology, and enough detail to evaluate or reproduce your work, they can tolerate, even expect, technical vocabulary. A policymaker wants the implication for a decision, stated plainly, with just enough method described to establish trust, not to teach the method.",
      "Good scientific writing doesn't dumb down results for a general audience, it translates the same finding into the vocabulary and level of detail that audience actually needs to act on it correctly.",
    ],
    analogy: [
      "It is like explaining the same injury to a fellow doctor versus to the patient's worried parent. The doctor gets the precise medical term and the treatment protocol. The parent gets 'it's a small fracture, it will heal in six weeks, here's what to watch for.' Same injury, same honesty, different translation for what each listener actually needs.",
    ],
    researchConnection: [
      "Most research institutions now require a 'plain language summary' alongside technical publications for exactly this reason: technical accuracy and public comprehension are different skills, and a paper that satisfies peer reviewers often fails completely as public communication without a deliberate translation step.",
    ],
    quiz: [
      {
        question: "What's the main difference between writing for a peer reviewer versus a policymaker?",
        options: [
          "The facts you report should be different for each",
          "The facts stay the same, but the vocabulary, level of methodological detail, and framing around the decision-relevant implication should change",
          "Policymakers don't need any explanation of method",
          "Peer reviewers don't care about implications",
        ],
        correctIndex: 1,
        explanation: "Accurate communication for different audiences means adjusting depth and framing, never the underlying facts.",
      },
    ],
    challenge: {
      prompt: "Write both versions of the GW-14 nitrate finding, one sentence for a peer-review methods section, one sentence for the town council summary.",
      hint: "The peer-review version can use 'kriging', '80% exceedance probability', and reference the variogram model; the council version should lead with the practical implication.",
    },
    teachBack: {
      prompt: "Explain why a 'plain language summary' is not the same thing as 'dumbing down' a scientific result.",
    },
  },
  {
    id: "11-4-anatomy-of-a-result-paragraph",
    missionId: "11-scientific-communication",
    order: 4,
    title: "The Anatomy of a Result Paragraph",
    durationMinutes: 12,
    story: [
      "Your supervisor hands back your first draft results paragraph with one comment: 'You buried the finding in the fourth sentence. Nobody will read that far before deciding whether to trust you.'",
    ],
    plainEnglish: [
      "A strong scientific result paragraph typically leads with the finding stated plainly, follows with the evidence and method that supports it, and closes with the honest limitation or uncertainty. Readers, including busy reviewers and policymakers, decide how much attention to give a paragraph within its first sentence.",
    ],
    analogy: [
      "It is like a news headline versus a novel's opening chapter. A headline tells you the outcome immediately, then the article fills in the details for anyone who keeps reading. Burying your finding in sentence four is like writing a mystery novel when your reader just wanted to know what happened.",
    ],
    researchConnection: [
      "This 'finding first' structure mirrors the standard scientific abstract and news-writing 'inverted pyramid', both exist because readers' attention is limited and front-loaded information gets read even when the rest doesn't.",
    ],
    quiz: [
      {
        question: "Where should the main finding appear in a well-structured result paragraph?",
        options: [
          "At the very end, as a conclusion",
          "Buried in the middle after all the methodology",
          "At or near the beginning, stated plainly",
          "It doesn't matter where it appears",
        ],
        correctIndex: 2,
        explanation: "Leading with the finding respects the reader's limited attention and ensures the key message is received even by someone who reads only the first sentence.",
      },
    ],
    challenge: {
      prompt: "Rewrite your Mission 09 physics-informed model summary (or any earlier mission's finding) so the main finding is the very first sentence.",
      hint: "Start with 'We find that...' or 'The data shows...' rather than describing your method first.",
    },
    teachBack: {
      prompt: "Explain the three-part structure, finding, evidence, limitation, to a labmate drafting their first results paragraph.",
    },
  },
  {
    id: "11-5-peer-review-and-revision",
    missionId: "11-scientific-communication",
    order: 5,
    title: "Peer Review & Revision",
    durationMinutes: 12,
    story: [
      "A colleague reviews your draft basin report and flags three things: an unsupported claim, a chart with a misleading axis, and a paragraph that buries its finding. None of it feels good to read. All of it makes the report better.",
    ],
    plainEnglish: [
      "Peer review exists to catch exactly the kinds of problems this mission has covered, chart choices, buried findings, overstated claims, before they reach a wider audience. Treating review comments as attacks rather than a normal, expected part of the process is one of the biggest obstacles new researchers face.",
    ],
    analogy: [
      "It is like proofreading your own text message right before sending it versus having a friend read it first. You are too close to your own writing to spot the typo or the confusing sentence. A second pair of eyes catches things that are invisible to the person who already knows what they meant to say.",
    ],
    researchConnection: [
      "Peer review, for all its known flaws, remains the primary quality-control mechanism in science specifically because authors reliably miss their own communication problems, the same blind spots this mission has tried to train you to notice in your own work first.",
    ],
    quiz: [
      {
        question: "What is the main purpose of peer review in the context of this mission's lessons?",
        options: [
          "To reject as many papers as possible",
          "To catch communication and methodological problems, like misleading charts or buried findings, that authors often can't see in their own work",
          "To make research take longer",
          "To ensure only positive results are published",
        ],
        correctIndex: 1,
        explanation: "A second, less invested reader reliably catches problems the original author's familiarity with their own work makes invisible to them.",
      },
    ],
    challenge: {
      prompt: "Trade your Mission 09 or 10 teach-back answer with a real reviewer (a friend, classmate, or colleague) and ask them to flag one place where the finding isn't stated clearly enough in the first sentence.",
      hint: "If you don't have a willing reviewer available, re-read your own answer after a full day away from it, distance works almost as well as a second reader.",
    },
    teachBack: {
      prompt: "Explain to a new researcher why receiving critical feedback on a draft is a sign the review process is working, not a sign the work is bad.",
    },
  },
];
