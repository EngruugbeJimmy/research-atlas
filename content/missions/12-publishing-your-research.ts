import type { Lesson } from "@/lib/missions/types";

export const mission12Lessons: Lesson[] = [
  {
    id: "12-1-what-reproducible-actually-requires",
    missionId: "12-publishing-your-research",
    order: 1,
    title: "What 'Reproducible' Actually Requires",
    durationMinutes: 12,
    story: [
      "A visiting researcher asks to reproduce your nitrate trend analysis from Mission 05. You hand over a folder: a dozen scripts with names like `final2.py` and `analysis_REAL.py`, no record of which version produced the report's numbers, and a dataset you can no longer exactly recreate because you've since 'cleaned it up a bit more.' Reproducing your own six-month-old work turns out to be nearly impossible, for you, let alone them.",
    ],
    plainEnglish: [
      "Reproducibility (the ability for someone else, or future you, to redo your exact work and get the exact same answer) means someone else, or future you, could take your raw data, your documented steps, and your code, and arrive at the same result. It requires more than 'the code works': it requires a clear, unambiguous path from raw data to final figure that doesn't depend on memory, verbal explanation, or files that no longer exist in the state they were used.",
    ],
    analogy: [
      "It is like the difference between a recipe that says 'add a splash of milk, cook until it feels right' and one that says '120ml of milk, simmer for 8 minutes.' Both might make a good dish once. Only the second one can be handed to a stranger and reliably repeated.",
    ],
    researchConnection: [
      "Large-scale audits across multiple scientific fields over the past decade found that a majority of published computational results could not be reproduced by independent teams using the original authors' own described methods, a finding significant enough to be called a 'reproducibility crisis.' The practices in this mission exist specifically to prevent your work from becoming another data point in that statistic.",
    ],
    quiz: [
      {
        question: "What's missing from a project where 'the code works' but reproducibility still fails?",
        options: [
          "Nothing, working code is sufficient",
          "A clear, documented, unambiguous path from the original raw data to the final result, independent of memory or undocumented manual steps",
          "A GUI interface",
          "More comments in the code",
        ],
        correctIndex: 1,
        explanation: "Reproducibility requires the whole path to be documented and re-runnable, not just for the code itself to technically execute.",
      },
    ],
    challenge: {
      prompt: "Pick any earlier mission's code example and list, honestly, what a stranger would need beyond that snippet alone to reproduce your full result.",
      hint: "Think about the raw data file, its exact version, any manual cleaning steps, and the order scripts were run in.",
    },
    teachBack: {
      prompt: "Explain to a new researcher why 'the code runs' and 'this is reproducible' are different claims.",
    },
  },
  {
    id: "12-2-organizing-a-research-repository",
    missionId: "12-publishing-your-research",
    order: 2,
    title: "Organizing a Research Repository",
    durationMinutes: 12,
    story: [
      "You spend an afternoon reorganizing the nitrate project into a structure a stranger could actually navigate, separating raw data from processed data, numbering the analysis scripts by the order they run in, and writing a top-level README that explains what's where.",
    ],
    plainEnglish: [
      "A well-organized research repository typically separates raw data (never modified after collection) from processed data (the output of documented cleaning steps), keeps analysis code numbered or otherwise ordered to show the pipeline sequence, and includes a README (a short welcome file that orients a new visitor) that orients a stranger in under two minutes.",
    ],
    analogy: [
      "A well-organized project folder is like a well-labeled toolbox, with wrenches in one drawer, screwdrivers in another, and a card taped to the lid explaining what each drawer holds. A messy toolbox with everything dumped in one pile might still contain the same tools, but good luck finding the right one in a hurry.",
    ],
    code: [
      {
        language: "python",
        filename: "project_structure.txt",
        snippet: `bluewater-nitrate-analysis/
├── README.md                 # what this project is, how to run it
├── data/
│   ├── raw/                  # never edited after collection
│   │   └── gw14_nitrate_2020_2025.csv
│   └── processed/            # output of scripts/01_clean_data.py
│       └── gw14_nitrate_clean.csv
├── scripts/
│   ├── 01_clean_data.py
│   ├── 02_exploratory_analysis.py
│   ├── 03_hypothesis_test.py
│   └── 04_generate_figures.py
├── figures/
│   └── nitrate_trend_2025.png
├── requirements.txt           # exact package versions used
└── LICENSE`,
        walkthrough: [
          "The raw/processed split protects the original data from ever being silently altered.",
          "Numbered scripts make the pipeline order self-documenting, anyone can tell 01 runs before 04.",
          "requirements.txt pins exact package versions, since a different pandas or numpy version can subtly change results.",
        ],
      },
    ],
    researchConnection: [
      "This structure closely follows widely adopted conventions like Cookiecutter Data Science, used across academic and industry research teams specifically because ad hoc folder structures are one of the most common, preventable causes of irreproducible work.",
    ],
    quiz: [
      {
        question: "Why should raw data live in a folder that's never edited after collection?",
        options: [
          "To save disk space",
          "So there's always an unmodified source of truth to return to if a processing step later turns out to be wrong",
          "Raw data doesn't need to be kept at all",
          "It's a style preference with no practical benefit",
        ],
        correctIndex: 1,
        explanation: "If processed data ever becomes suspect, an unedited raw copy is what lets you redo the pipeline correctly instead of guessing what the original values were.",
      },
    ],
    challenge: {
      prompt: "Sketch a folder structure for your own Bluewater Basin capstone project (Lesson 5 of this mission), following the raw/processed/scripts/figures pattern above.",
      hint: "You don't need every folder to have contents yet, the structure itself is the deliverable for this challenge.",
    },
    teachBack: {
      prompt: "Explain to a teammate why numbering your analysis scripts (01_, 02_, 03_) matters for reproducibility.",
    },
  },
  {
    id: "12-3-data-and-code-availability",
    missionId: "12-publishing-your-research",
    order: 3,
    title: "Data & Code Availability",
    durationMinutes: 10,
    story: [
      "A journal's submission checklist asks for your 'data availability statement.' You realize you've never had to write one before, and that the honest answer for a fictional-but-realistic dataset like Bluewater Basin is refreshingly simple.",
    ],
    plainEnglish: [
      "A data availability statement (a short note saying exactly where to find the data behind a result) tells readers exactly where the data behind a result can be found, a public repository, a request process, or an explanation of why it can't be shared (e.g. private health data). Open data doesn't just serve abstract scientific virtue; it's what actually lets someone check your work.",
    ],
    analogy: [
      "It is like a restaurant listing where its ingredients come from, instead of just saying 'trust us, it's fresh.' Anyone who wants to can go check the source themselves. That openness is what turns a claim into something verifiable.",
    ],
    researchConnection: [
      "Many journals and funding agencies now require data and code availability statements as a condition of publication or funding, reflecting a broad shift toward open science over the past fifteen years. Choosing an open license (like this platform's own MIT license) and a stable public repository is now considered baseline practice, not an optional extra.",
    ],
    quiz: [
      {
        question: "What is the main purpose of a data availability statement?",
        options: [
          "To satisfy a bureaucratic requirement with no real function",
          "To tell readers exactly where the underlying data can be found (or why it can't be shared), enabling independent verification",
          "To advertise the dataset for sale",
          "To list every collaborator's name",
        ],
        correctIndex: 1,
        explanation: "It's a direct, practical pointer that turns 'trust me' into 'check for yourself'.",
      },
    ],
    challenge: {
      prompt: "Write a one-sentence data availability statement for your Bluewater Basin capstone project, assuming you'll publish the synthetic dataset alongside your code.",
      hint: "State where it lives (e.g. a public GitHub repository), under what license, and any format details a reader would need.",
    },
    teachBack: {
      prompt: "Explain why 'the data is available upon request' is considered a weaker practice than depositing data in a public repository.",
    },
  },
  {
    id: "12-4-preprints-and-open-review",
    missionId: "12-publishing-your-research",
    order: 4,
    title: "Preprints & Open Review",
    durationMinutes: 10,
    story: [
      "Your supervisor suggests posting the basin nitrate analysis as a preprint before submitting it anywhere formal. 'Get feedback while you can still act on it,' she says, 'not eighteen months from now after peer review finally gets back to you.'",
    ],
    plainEnglish: [
      "A preprint (a research write-up shared with everyone before it has gone through the official review process) is a research write-up shared publicly before (or alongside) formal peer review, it lets other researchers see, cite, and critique the work much earlier than the traditional publication timeline allows, while still typically going through peer review afterward for a formal journal record.",
    ],
    analogy: [
      "It is like sharing a rough cut of a short film with friends for feedback before submitting it to a festival, instead of waiting eighteen months to hear anything at all. It is not the final, polished version, but it lets useful feedback arrive while you can still act on it.",
    ],
    researchConnection: [
      "Preprint servers have become standard practice in many fields, particularly during time-sensitive research, precisely because they decouple 'sharing findings quickly' from the often slow, multi-round formal peer-review and publication process, without abandoning peer review altogether.",
    ],
    quiz: [
      {
        question: "What is a preprint?",
        options: [
          "A rejected paper",
          "A research write-up shared publicly before or alongside formal peer review, to get earlier visibility and feedback",
          "A paper that skips peer review permanently",
          "An internal-only draft never meant to be shared",
        ],
        correctIndex: 1,
        explanation: "Preprints accelerate the sharing of findings while typically still being followed by formal peer review for the eventual published version.",
      },
    ],
    challenge: {
      prompt: "List one advantage and one risk of sharing your basin analysis as a preprint before it's been peer reviewed.",
      hint: "Advantage: speed and early feedback. Risk: unreviewed claims could still contain errors that peer review would have caught.",
    },
    teachBack: {
      prompt: "Explain to someone unfamiliar with academic publishing why a preprint isn't the same thing as a finished, validated result.",
    },
  },
  {
    id: "12-5-your-bluewater-basin-report",
    missionId: "12-publishing-your-research",
    order: 5,
    title: "Your Bluewater Basin Report, Capstone",
    durationMinutes: 25,
    story: [
      "Thirteen missions ago, Millhaven's residents complained about strange-tasting water and a farmer noticed cloudy irrigation runoff. You've since mapped the basin, designed a sampling plan, cleaned real-feeling data, tested hypotheses, built regression and machine learning models, interpolated between wells with kriging, constrained a model with physics, and learned to quantify and communicate uncertainty honestly. It's time to write the report you were hired to produce on day one.",
    ],
    plainEnglish: [
      "This final lesson has no new concept, it asks you to combine everything. A complete Bluewater Basin report should state your original research question (Mission 00), show the map and data that grounds it (Mission 01-04), report your statistical findings with honest uncertainty (Mission 05-06, 10), describe any model you used and its limitations (Mission 07-09), and close with a clearly, plainly stated answer for Millhaven and the town council (Mission 11).",
    ],
    analogy: [
      "Think of everything you have built across thirteen missions as separate ingredients prepped and ready on a kitchen counter, chopped vegetables, a sauce, a protein, all individually good. This capstone is the moment you finally combine them into one finished dish and serve it to someone hungry for an answer.",
    ],
    researchConnection: [
      "This is, deliberately, what a real environmental consulting report or a academic capstone thesis looks like in miniature: one research question, followed all the way from raw data to a communicated, uncertainty-aware conclusion. Completing it is the single best evidence you have that you can now do this independently, on a new problem, without Research Atlas holding your hand.",
    ],
    quiz: [
      {
        question: "What is the primary goal of this capstone lesson?",
        options: [
          "To learn one final new statistical technique",
          "To synthesize the full pipeline, question, data, analysis, uncertainty, and communication, into one complete, honest report",
          "To memorize all thirteen mission titles",
          "To pick the single best mission",
        ],
        correctIndex: 1,
        explanation: "The capstone is integrative by design: it tests whether you can run the whole research process end-to-end, not whether you remember any one technique.",
      },
    ],
    challenge: {
      prompt: "Write your full Bluewater Basin report: a research question, the evidence (referencing at least three earlier missions' findings), your honestly stated uncertainty, and a plain-language conclusion for the Millhaven town council. Aim for 300-500 words.",
      hint: "Structure it as: Question → What we found → How confident we are → What we recommend. Use the 'finding first' paragraph structure from Mission 11.",
    },
    teachBack: {
      prompt: "In one paragraph, explain to someone who has never heard of Bluewater Basin what you actually learned to do over these thirteen missions, not facts you memorized, but things you can now do.",
    },
  },
];
