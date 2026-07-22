import type { Lesson } from "@/lib/missions/types";

export const mission00Lessons: Lesson[] = [
  {
    id: "00-1-welcome-to-bluewater-basin",
    missionId: "00-becoming-a-researcher",
    order: 1,
    title: "Welcome to Bluewater Basin",
    durationMinutes: 10,
    story: [
      "Three weeks ago, the town of Millhaven noticed something strange. The community well tastes faintly metallic. A farmer downstream says his irrigation water looks cloudier after rain. The local monitoring station shows nitrate levels creeping upward. Nobody knows yet if these things are connected, or if they are just normal ups and downs.",
      "You just joined the Bluewater Basin Research Station as a field researcher. Your job for the rest of Research Atlas is to figure out what is really happening in this watershed (an area of land where all the rain and rivers eventually drain to one place), using data instead of guesses.",
      "Bluewater Basin is a synthetic watershed (a fictional place built just for this platform, so you can explore and make mistakes without affecting anyone real). It has rivers, wetlands, forests, farmland, groundwater wells, and rain gauges, built to feel exactly like a real place a research team would study.",
    ],
    plainEnglish: [
      "Picture the basin as a shallow bowl tilted toward the sea. Rain falls on the high ridges, soaks into the soil, and slowly makes its way down to Bluewater River and out to the coast. Along the way it passes farmland, forest, and a scattering of measurement stations the research team has installed over the years.",
      "Every mission in Research Atlas adds one more piece to your understanding of this same system. Nothing you learn here is a throwaway example. The well you map in Mission 1 is the same well you will model with machine learning (teaching a computer to spot patterns in data) in Mission 7.",
    ],
    analogy: [
      "Think of Bluewater Basin like one big bathtub with the drain at the coast. Rain is water pouring in from a tap on the ridge. It takes a long and winding path through the tub before it reaches the drain, picking things up along the way, just like real water picks up minerals, chemicals, and dirt on its journey downhill.",
    ],
    visual: {
      kind: "contour",
      caption: "Bluewater Basin: ridge to coast, with monitoring stations marked.",
    },
    researchConnection: [
      "Environmental researchers rarely study one thing in isolation. A hydrologist (someone who studies how water moves), a statistician (someone who studies patterns in numbers), and a GIS analyst (someone who studies maps and locations) on a real watershed team all work from the same shared maps and data, exactly like you will do across missions here.",
    ],
    quiz: [
      {
        question: "Why does Research Atlas use one continuous fictional watershed instead of a new example for every lesson?",
        options: [
          "Because real datasets are too large to include",
          "Because real research usually builds understanding of one system over time, and switching examples constantly makes that harder to practice",
          "Because fictional data is more accurate than real data",
          "Because it is easier to write different quiz questions that way",
        ],
        correctIndex: 1,
        explanation: "Continuity mirrors how real research actually works. You build a deepening understanding of one system rather than sampling many shallow examples.",
      },
    ],
    challenge: {
      prompt: "Write down, in one sentence, what you think might be causing Millhaven's water complaints. You do not need to be right. You need a sentence you could later prove wrong.",
      hint: "A good first guess sounds like: I think X is happening because Y, not just something is wrong.",
    },
    teachBack: {
      prompt: "Explain to someone who has never heard of Bluewater Basin what it is and why researchers might study it, in three sentences or fewer.",
    },
  },
  {
    id: "00-2-how-scientists-ask-questions",
    missionId: "00-becoming-a-researcher",
    order: 2,
    title: "How Scientists Ask Questions",
    durationMinutes: 12,
    story: [
      "Before your team collects a single new measurement, your supervisor asks you a deceptively hard question: what, exactly, do you want to know? Not is something wrong with the water, since that is too vague to ever answer. She wants a question specific enough that data could actually settle it.",
      "You spend the afternoon in the station's map room turning a vague worry into a real research question: has nitrate concentration (the amount of a nitrogen-based chemical in the water) in the Millhaven community well increased over the past five years, beyond what normal year-to-year variation would explain?",
    ],
    plainEnglish: [
      "A good research question names a specific variable (the thing you are measuring, like nitrate concentration), a specific place or group (the Millhaven well), and a specific kind of change (an increase beyond normal variation). Vague questions, like is the water bad, cannot be answered with data because nobody agrees on what would count as an answer.",
      "Notice the question does not yet say why nitrate might be rising. That comes later, as a hypothesis (an educated guess you can test). The question just has to be answerable, one way or another, by looking at real measurements.",
    ],
    analogy: [
      "It is like the difference between asking a friend, are you okay, versus asking, does your stomach hurt right now. The first question is kind and caring, but it is hard to act on. The second question has a clear yes or no answer that tells you exactly what to do next. Researchers aim for the second kind of question.",
    ],
    researchConnection: [
      "Turning a vague concern into an answerable question is often the single most valuable thing an experienced researcher does before a project starts. Funding agencies, journal reviewers, and research supervisors will almost always ask a version of what, exactly, are you trying to find out, before looking at any results.",
    ],
    quiz: [
      {
        question: "Which of these is the most answerable research question?",
        options: [
          "Is Bluewater Basin healthy?",
          "Has average annual nitrate concentration at well GW-14 increased between 2020 and 2025?",
          "Why do people care about water?",
          "Is farming bad for the environment?",
        ],
        correctIndex: 1,
        explanation: "It names a specific variable, a specific location, and a specific, checkable time comparison.",
      },
      {
        question: "What is missing from the question, is the community well contaminated?",
        options: [
          "Nothing, it is already answerable",
          "A specific substance or measurement, and a threshold for what counts as contaminated",
          "A hypothesis",
          "A p-value",
        ],
        correctIndex: 1,
        explanation: "Without naming what to measure and what threshold matters, two people could look at the same data and disagree about the answer.",
      },
    ],
    challenge: {
      prompt: "Rewrite your one-sentence guess from Lesson 1 as a specific, answerable research question. Name a variable, a place, and a comparison.",
      hint: "Try the template: has [variable] at [location] changed [how] between [time A] and [time B]?",
    },
    teachBack: {
      prompt: "In your own words, explain why is the water bad is a worse research question than has nitrate at well GW-14 risen since 2020.",
    },
  },
  {
    id: "00-3-thinking-in-hypotheses",
    missionId: "00-becoming-a-researcher",
    order: 3,
    title: "Thinking in Hypotheses",
    durationMinutes: 14,
    story: [
      "With a clear question in hand, your supervisor introduces the next tool: the hypothesis (an educated guess your data could actually prove wrong). If nothing you could ever observe would change your mind, she says, it is not a real hypothesis.",
      "For the nitrate question, she has you write two paired statements. The null hypothesis (the boring guess, that nothing has really changed): nitrate at well GW-14 has not changed beyond normal year-to-year variation. The alternative hypothesis (the guess that something did happen): nitrate at well GW-14 has increased beyond normal year-to-year variation. Later missions will show you exactly how to test between them. For now, the goal is just to think this way at all.",
    ],
    plainEnglish: [
      "It feels backwards at first. Scientists usually start by assuming nothing interesting is happening, and only abandon that assumption if the evidence against it is strong. This protects you from seeing patterns that are really just random noise.",
      "A hypothesis is falsifiable (able to be proven wrong by some possible result) if there is some dataset that would force you to reject it. Nitrate levels might be affected by many factors is not falsifiable, since it fits literally any data. Nitrate has increased by more than natural variability would explain is falsifiable. Five years of stable, flat data would reject it outright.",
    ],
    analogy: [
      "Imagine you think your friend moved your favorite toy. The null hypothesis is nobody touched it, I just forgot where I put it. You do not accuse your friend until you have checked everywhere else first. That is exactly how scientists treat data: assume nothing happened until the evidence says otherwise.",
    ],
    math: {
      intro: "Researchers often write this pair of claims using the Greek letter mu (a symbol for a true average value we cannot observe directly, only estimate from samples).",
      equations: [
        {
          label: "Null hypothesis",
          latex: "H_0: \\mu_{2025} = \\mu_{2020}",
          explanation: "The true average nitrate level in 2025 equals the true average in 2020. No real change.",
        },
        {
          label: "Alternative hypothesis",
          latex: "H_1: \\mu_{2025} > \\mu_{2020}",
          explanation: "The true average nitrate level in 2025 is genuinely higher than in 2020.",
        },
      ],
    },
    researchConnection: [
      "Every statistical test you will learn from Mission 5 onward, including t-tests, regression significance, and ANOVA, is really just a formal procedure for choosing between a null and an alternative hypothesis like these. Learning to write the pair clearly now means the statistics later will feel like a natural next step.",
    ],
    quiz: [
      {
        question: "Which statement is falsifiable?",
        options: [
          "Water quality is complicated and depends on many things.",
          "Average nitrate at well GW-14 in 2025 is higher than in 2020.",
          "Nature finds a way.",
          "Some factors affect water quality more than others.",
        ],
        correctIndex: 1,
        explanation: "Only this statement makes a specific claim that a dataset could clearly contradict.",
      },
    ],
    challenge: {
      prompt: "Write a null and alternative hypothesis pair for the research question you wrote in Lesson 2.",
      hint: "Start your null hypothesis with there is no real difference or change in, and your alternative with the specific direction of change you suspect.",
    },
    teachBack: {
      prompt: "Explain why scientists default to assuming the null hypothesis is true until shown otherwise, rather than the other way around.",
    },
  },
  {
    id: "00-4-research-ethics-and-honesty",
    missionId: "00-becoming-a-researcher",
    order: 4,
    title: "Research Ethics & Honesty",
    durationMinutes: 12,
    story: [
      "Your supervisor shows you a chart from an old Bluewater Basin project. A scientist tested nitrate levels against fourteen different possible causes and only reported the one that came back significant. This is called p-hacking (testing many things in secret and only showing the one result that looks interesting), she says, and it is one of the fastest ways to publish something that is not actually true.",
      "She hands you the station's four-item integrity checklist that every researcher here signs before starting a project: decide what you are testing before you see the results, report everything you tried including what did not work, keep your data and methods available for someone else to check, and never adjust a result to match what you expected to find.",
    ],
    plainEnglish: [
      "It is tempting to try many analyses and report only the interesting one. The problem is that with enough attempts, something will look significant purely by chance, not because it is real. Deciding your test in advance, and reporting everything you tried, is what separates a genuine finding from a statistical accident.",
      "Reproducible (able to be repeated by someone else and get the same result) means someone else, or you in six months, could take your data and your documented steps and get the same answer. Every mission from here on will ask you to keep enough of a record that your own future self could reproduce today's work.",
    ],
    analogy: [
      "It is like flipping a coin fourteen times in secret and only telling your friend about the one flip that landed on heads five times in a row. It sounds impressive, but you hid all the boring flips that would have told the real story. Real researchers show every flip, not just the exciting one.",
    ],
    researchConnection: [
      "Pre-registration (publicly committing to a hypothesis and analysis plan before seeing results) and open data sharing are now standard practice at most research institutions, precisely because p-hacking and irreproducible results turned out to be widespread problems in real published science over the past two decades.",
    ],
    quiz: [
      {
        question: "What is p-hacking?",
        options: [
          "A method for cleaning messy data",
          "Trying many analyses and only reporting the one that happens to look significant",
          "A type of groundwater contamination",
          "A statistical test used in regression",
        ],
        correctIndex: 1,
        explanation: "P-hacking inflates the chance of a false positive by hiding all the attempts that did not work.",
      },
      {
        question: "What makes a research result reproducible?",
        options: [
          "It was reviewed by a senior scientist",
          "It used a large dataset",
          "Someone else could follow the documented data and steps and get the same result",
          "It confirmed the original hypothesis",
        ],
        correctIndex: 2,
        explanation: "Reproducibility is about whether the process can be independently repeated, not about whether the result was expected.",
      },
    ],
    challenge: {
      prompt: "Before you ever see Bluewater Basin's real nitrate data in later missions, write down the exact hypothesis test you would run and what result would change your mind. Then commit to not changing your test after seeing the data.",
      hint: "This is a real pre-registration. Save what you write. Mission 05 will ask you to compare it to what you actually did.",
    },
    teachBack: {
      prompt: "Explain to a friend why deciding your hypothesis before looking at the data matters, using an example that is not about Bluewater Basin.",
    },
  },
];
