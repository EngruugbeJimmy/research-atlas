import type { Lesson } from "@/lib/missions/types";

export const mission09Lessons: Lesson[] = [
  {
    id: "09-1-when-data-alone-isnt-enough",
    missionId: "09-physics-informed-ai",
    order: 1,
    title: "When Data Alone Isn't Enough",
    durationMinutes: 12,
    story: [
      "The basin's newest well, GW-22, sits close to an old agricultural pumping well that draws groundwater for irrigation. Your supervisor wants a model of groundwater head, the water table elevation, at any distance from the pump, but the team has only eight scattered measurements along the transect, taken over a rushed field day before a storm.",
      "You fit a flexible curve to the eight points. It matches them almost perfectly, and predicts the water table rising the further you get from an actively pumping well. Your supervisor doesn't even look at the R²: 'That's impossible. Water doesn't do that near a pump. Throw more flexible curves at this and you'll always find one more way to be wrong.'",
    ],
    plainEnglish: [
      "With only eight data points, an enormous number of curves fit almost equally well, some sensible, some physically absurd. Purely data-driven models have no way to know that water can't rise as you move away from a well that's actively drawing it down; they only know the numbers you gave them.",
      "Physics-informed modelling (teaching a model rules from real physical laws so it can never break them, even in gaps with no data) means baking known physical laws, like Darcy's Law from earlier hydrogeology work, directly into a model, so it literally cannot produce answers that violate them, no matter how sparse or noisy the data is.",
    ],
    analogy: [
      "Imagine asking a kid to connect eight dots on a page into a smooth curve, without telling them anything else. They might draw wild loops that technically touch every dot. Now tell them one extra rule: the line can only go downhill, never up. Suddenly almost all of those wild loops are impossible, and you are left with something much more sensible.",
    ],
    researchConnection: [
      "This exact problem, too little data, too much flexibility, appears throughout environmental science: climate models, disease spread models, and groundwater models all combine sparse observations with known physical or biological constraints. Physics-informed machine learning is a fast-growing research area precisely because pure data-driven models struggle when observations are limited.",
    ],
    quiz: [
      {
        question: "Why is a flexible, purely data-driven fit risky with only eight measurements?",
        options: [
          "Flexible fits are always wrong",
          "With few points, many very different curves can fit almost equally well, and nothing stops the model from choosing a physically impossible one",
          "Flexible curves are illegal in scientific papers",
          "Eight points is always too few for any model",
        ],
        correctIndex: 1,
        explanation: "Sparse data under-constrains a flexible model, physics knowledge is what narrows the space of possible curves down to plausible ones.",
      },
    ],
    challenge: {
      prompt: "Before the next lesson, write down what you already know must be true about how groundwater head changes with distance from a single pumping well, based on earlier hydrogeology concepts.",
      hint: "Think about which direction water flows relative to head, from high head to low head, and what a pump does to head near itself.",
    },
    teachBack: {
      prompt: "Explain to a teammate why 'the curve fits the data well' is not the same as 'the curve is physically plausible'.",
    },
  },
  {
    id: "09-2-darcys-law-revisited",
    missionId: "09-physics-informed-ai",
    order: 2,
    title: "Darcy's Law, Revisited",
    durationMinutes: 15,
    story: [
      "Your supervisor pulls up the Darcy's Law simulation you first saw as a homepage demo and finally explains it properly: it's not just an animation, it's the physical law that will constrain everything you build in this mission.",
    ],
    plainEnglish: [
      "Darcy's Law says groundwater flows from high head (water table elevation) to low head, at a rate set by the hydraulic gradient and the material's conductivity. Near a pumping well, head drops toward the well, creating a 'cone of depression' that gets shallower the further you travel from the well, but never reverses direction.",
      "For our transect, that means head as a function of distance must change consistently as distance increases, it can flatten out far from the well, but it cannot rise-then-fall-then-rise. That single constraint eliminates the vast majority of curves that would otherwise fit our eight noisy points.",
    ],
    analogy: [
      "Think of the dip a mattress makes when someone sits on it. Right under them, it sinks the most. Moving away from them, it gradually flattens back to normal. It never bounces back up above normal, dips again, then rises. The water table around a pumping well behaves the same predictable way.",
    ],
    math: {
      intro: "Darcy's Law in one dimension, and the physical constraint it implies for our transect:",
      equations: [
        {
          label: "Darcy's Law",
          latex: "q = -K \\frac{dh}{dl}",
          explanation: "Flow (q) is proportional to the negative gradient of head (h) over distance (l), water flows down the head gradient, scaled by conductivity K.",
        },
        {
          label: "Monotonicity constraint",
          latex: "\\frac{dh}{dl} \\geq 0 \\text{ for } l > 0 \\text{ near a single pumping well}",
          explanation: "Head cannot decrease as you move away from the well in this configuration, it only ever holds steady or rises toward its undisturbed level.",
        },
      ],
    },
    simulation: {
      component: "darcy",
      caption: "Revisit the Darcy's Law simulation, note how head always changes in one consistent direction along the flow path.",
    },
    researchConnection: [
      "Every physics-informed model starts by writing down a governing equation like this one and asking: what does it forbid? Hydrogeologists, climate scientists, and structural engineers all use this same move, turning a physical law into a hard constraint a model must respect, not just a suggestion.",
    ],
    quiz: [
      {
        question: "What does Darcy's Law imply about head near a single pumping well?",
        options: [
          "Head can rise and fall randomly",
          "Head must change monotonically toward the well, it can't reverse direction along a simple radial transect",
          "Head is unrelated to distance from the well",
          "Head only matters far from the well",
        ],
        correctIndex: 1,
        explanation: "Under steady radial flow to a single well, head consistently decreases toward the well, a physical fact any valid model must respect.",
      },
    ],
    challenge: {
      prompt: "Sketch, on paper, what a physically valid head-vs-distance curve should look like for our transect, before seeing the model output in the next lesson.",
      hint: "It should be flat far from the well and dip down (or up, depending on your axis convention) smoothly and consistently as it approaches the well.",
    },
    teachBack: {
      prompt: "In plain language, explain why a 'cone of depression' can't have a bump in the middle.",
    },
  },
  {
    id: "09-3-fitting-a-flexible-model",
    missionId: "09-physics-informed-ai",
    order: 3,
    title: "Fitting a Flexible Model",
    durationMinutes: 12,
    story: [
      "You build the naive version first, a flexible curve fit purely to the eight points, with no physics attached, exactly the one that got you in trouble in Lesson 1. Your supervisor wants you to see it fail clearly before you fix it.",
    ],
    plainEnglish: [
      "A sufficiently flexible model (like a high-degree polynomial or an unconstrained neural network) will bend to match noise as eagerly as it matches signal. With eight points and enough flexibility, it can produce a curve that technically has the lowest possible error on your data, and is still nonsense physically.",
    ],
    analogy: [
      "It is like a tailor who is told to make a suit fit eight specific measurements perfectly, with no other guidance. They might sew something that hits every number exactly but looks like nothing a human could actually wear. Getting every point right does not automatically mean the result makes sense.",
    ],
    code: [
      {
        language: "python",
        filename: "flexible_fit.py",
        snippet: `import numpy as np
from numpy.polynomial import polynomial as P

distance = np.array([2, 8, 15, 25, 40, 60, 85, 110])
head = np.array([38.1, 30.4, 27.9, 22.6, 20.1, 19.8, 21.3, 18.9])  # noisy field data

# A flexible 6th-degree polynomial will fit these 8 points almost exactly ,
# but has no idea that head "shouldn't" rise between distance=60 and 85.
coeffs = P.polyfit(distance, head, deg=6)
fitted = P.polyval(distance, coeffs)

print("Fitted values:", np.round(fitted, 2))
print("Max residual:", np.round(np.max(np.abs(fitted - head)), 3))`,
        walkthrough: [
          "We fit a degree-6 polynomial, deliberately more flexible than eight points can reliably support.",
          "polyval evaluates the fitted curve at our original distances to check the fit quality.",
          "The residuals will be tiny, which looks great by pure error metrics, but says nothing about whether the curve behaves physically between the measured points.",
        ],
      },
    ],
    researchConnection: [
      "This is a textbook case of overfitting, but with an environmental science twist: the danger isn't just poor prediction on new data, it's producing an answer that violates a law of physics the researcher already knows to be true. A policymaker acting on this curve could be told the water table is recovering when Darcy's Law says it can't be.",
    ],
    quiz: [
      {
        question: "What's the specific danger of overfitting in this hydrogeology context, beyond ordinary prediction error?",
        options: [
          "It takes longer to compute",
          "The overfit curve can violate a known physical law, producing an answer that's not just imprecise but impossible",
          "Overfitting only matters for classification, not regression",
          "There is no danger, low error is always good",
        ],
        correctIndex: 1,
        explanation: "Low training error can coexist with a curve that is physically nonsensical between data points, a problem physics-informed constraints are designed to fix.",
      },
    ],
    challenge: {
      prompt: "Using the code above, would increasing the polynomial degree to 7 make the physical violation more or less likely between distance=60 and 85? Explain your reasoning without running new code.",
      hint: "More flexibility generally means more freedom to wiggle between points, not less.",
    },
    teachBack: {
      prompt: "Explain overfitting to someone who has never heard the term, using the well-head example.",
    },
  },
  {
    id: "09-4-adding-a-physics-constraint",
    missionId: "09-physics-informed-ai",
    order: 4,
    title: "Adding a Physics Constraint",
    durationMinutes: 15,
    story: [
      "Time to fix it. Your supervisor's approach: instead of throwing away the flexible model, blend it with a version that is forced to obey Darcy's Law, a hybrid that can still bend to fit real local variation, but can never produce a physically impossible curve.",
    ],
    plainEnglish: [
      "A physics-informed model adds a penalty, sometimes called a physics loss (a scorekeeping rule that punishes the model for breaking a known physical law), that punishes the model whenever its predictions violate the governing equation, alongside the usual penalty for missing the data. The model then has to satisfy both: match the observations reasonably well, and never violate the physics, even between measurements where you have no data at all.",
    ],
    analogy: [
      "It is like grading a student on two things at once: did they get the right answer, and did they show their work following the actual rules of math. A student who gets the right number by breaking the rules still loses points. The model is graded the same way, on fitting the data and on respecting the physics.",
    ],
    math: {
      intro: "A physics-informed loss function adds a physics penalty term to the ordinary data-fitting loss:",
      equations: [
        {
          label: "Physics-informed loss",
          latex: "\\mathcal{L} = \\mathcal{L}_{\\text{data}} + \\lambda \\, \\mathcal{L}_{\\text{physics}}",
          explanation: "Total loss combines how well predictions match observed data with how much the predictions violate Darcy's Law, weighted by λ, the physics constraint weight you'll control in the simulation below.",
        },
      ],
    },
    simulation: {
      component: "neural-net-explorer",
      caption: "Drag the physics constraint weight from 0 (data only) toward 1 (fully physics-constrained) and watch the impossible curve disappear.",
    },
    researchConnection: [
      "This λ-weighted combination is exactly the structure used in real Physics-Informed Neural Networks (PINNs), a technique now used in hydrology, climate modelling, and materials science to combine sparse real-world measurements with known governing equations.",
    ],
    quiz: [
      {
        question: "What happens as λ (the physics weight) increases toward 1 in the simulation?",
        options: [
          "The model ignores the data completely",
          "The curve becomes increasingly constrained to obey Darcy's monotonic drawdown shape, even where that means fitting the noisy points less exactly",
          "Nothing changes",
          "The simulation becomes less accurate at every point",
        ],
        correctIndex: 1,
        explanation: "Higher λ trades a small amount of exact data fit for a guarantee of physical plausibility, usually the right trade when data is sparse.",
      },
    ],
    challenge: {
      prompt: "Find the smallest physics weight in the simulation where the warning message changes from a violation to a valid, monotonic curve. What does that tell you about how much physics constraint this particular dataset needs?",
      hint: "You're looking for the tipping point, not the extreme ends of the slider.",
    },
    teachBack: {
      prompt: "Explain to a non-technical stakeholder why 'blending in physics' produces a more trustworthy model than either pure data-fitting or pure physics alone.",
    },
  },
  {
    id: "09-5-hybrid-models-in-practice",
    missionId: "09-physics-informed-ai",
    order: 5,
    title: "Hybrid Models in Practice",
    durationMinutes: 12,
    story: [
      "With the hybrid model built, your supervisor asks you to write the one-paragraph summary that will go to the policymaker who originally asked about GW-22: does the water table near the agricultural pump show signs of long-term decline, or just normal seasonal drawdown?",
    ],
    plainEnglish: [
      "A hybrid physics-informed model doesn't just give you a smoother curve, it gives you predictions you can trust between your measurements, because the model was never allowed to produce answers that break known physical laws in those gaps. That's exactly the situation you're in: eight points, wide gaps, and a policy question resting on what happens between them.",
    ],
    analogy: [
      "It is like trusting a GPS to guess your route through a tunnel where it loses signal, because it knows roads do not teleport or run through solid rock. Even without a direct reading in the gap, the underlying rules make the guess trustworthy.",
    ],
    researchConnection: [
      "This mirrors the actual workflow at agencies that manage groundwater resources: sparse monitoring data is combined with known hydrogeological principles to produce management-grade estimates, because installing enough wells to make a purely data-driven approach reliable is usually far too expensive.",
    ],
    quiz: [
      {
        question: "Why might a water management agency prefer a physics-informed model over a purely flexible one, even with more advanced statistical tools available?",
        options: [
          "Physics-informed models are always more accurate on held-out data",
          "They guarantee outputs consistent with known governing equations, which matters most exactly where monitoring data is sparse and decisions still have to be made",
          "They are always faster to compute",
          "Purely flexible models are illegal to use in government reports",
        ],
        correctIndex: 1,
        explanation: "The core benefit is a guarantee of physical plausibility in exactly the gaps where you have the least data, often exactly where the important decisions live.",
      },
    ],
    challenge: {
      prompt: "Write the one-paragraph summary for the policymaker, using your hybrid model's behavior from Lesson 4 as evidence.",
      hint: "State the finding, the confidence level, and one sentence about why the model's structure supports trusting the answer between GW-22's sparse measurements.",
    },
    teachBack: {
      prompt: "In under four sentences, explain what makes a model 'physics-informed' rather than purely 'data-driven'.",
    },
  },
  {
    id: "09-6-when-physics-informed-models-fail",
    missionId: "09-physics-informed-ai",
    order: 6,
    title: "When Physics-Informed Models Fail",
    durationMinutes: 12,
    story: [
      "Your supervisor ends the mission with a warning, not a victory lap. 'Physics-informed models are only as good as the physics you chose. If we'd assumed a single pumping well, but there's actually a second, unmapped well nearby pulling water the other way, our constraint would be actively wrong, and we'd trust it more, not less, because it looks so principled.'",
    ],
    plainEnglish: [
      "The biggest risk in physics-informed modelling isn't too little constraint, it's the wrong constraint, applied with false confidence. If your governing equation doesn't actually match the real system (missing wells, unknown geological boundaries, seasonal recharge you didn't account for), the model will still produce smooth, physically 'consistent' answers, just consistent with the wrong physics.",
    ],
    analogy: [
      "It is like confidently giving someone perfect directions using an old map that is missing a brand-new road. Every instruction sounds authoritative and follows the map's rules exactly, but it is quietly wrong the whole way, because the map itself, not the reasoning, was flawed.",
    ],
    researchConnection: [
      "This is a known failure mode across physics-informed machine learning: the technique reduces one kind of error (physically implausible predictions) but can mask a different one (systematically wrong predictions from a misspecified physical model). Careful researchers always validate their governing assumptions against independent evidence, not just against the same data used to fit the model.",
    ],
    quiz: [
      {
        question: "What is the main risk specific to physics-informed models, beyond ordinary model risk?",
        options: [
          "They are too slow to train",
          "If the assumed governing equation is wrong, the model still looks confidently 'physically consistent' while being systematically wrong",
          "They can never be validated",
          "They require more data than data-only models, not less",
        ],
        correctIndex: 1,
        explanation: "A wrong-but-applied physical constraint produces smooth, plausible-looking predictions that hide the actual error, a subtler failure than an obviously bad fit.",
      },
    ],
    challenge: {
      prompt: "List one piece of independent evidence (not the eight head measurements) your team could check to confirm there really is only one significant pumping well near GW-22.",
      hint: "Think about what other Bluewater Basin datasets from earlier missions, land use records, well permits, aerial imagery, might reveal.",
    },
    teachBack: {
      prompt: "Explain to a fellow researcher why 'the model respects Darcy's Law' is not the same guarantee as 'the model is correct'.",
    },
  },
];
