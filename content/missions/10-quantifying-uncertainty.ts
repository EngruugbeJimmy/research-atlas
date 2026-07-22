import type { Lesson } from "@/lib/missions/types";

export const mission10Lessons: Lesson[] = [
  {
    id: "10-1-every-model-is-wrong",
    missionId: "10-quantifying-uncertainty",
    order: 1,
    title: "Every Model Is Wrong",
    durationMinutes: 10,
    story: [
      "Your regression model from Mission 06 predicts streamflow will hit 14.2 m³/s next month. A town councillor asks the obvious follow-up: 'is that going to happen, or might it be way off?' You realize your model has never once told you how confident to be, only what to guess.",
    ],
    plainEnglish: [
      "The statistician George Box's famous line, 'all models are wrong, but some are useful', isn't cynicism, it's a starting point. No model captures reality exactly. The question worth answering isn't 'is this model right?' but 'how wrong might this model be, and in which direction?'",
      "Quantifying uncertainty means attaching an honest range, not just a single number, to every prediction, so the people using your work know how much weight to put on it.",
    ],
    analogy: [
      "It is like a friend who says they will arrive at 'exactly 6:00pm' versus one who says 'somewhere between 5:45 and 6:15, probably around 6:00.' The second friend sounds less precise, but they are actually giving you more honest, more useful information about what to actually expect.",
    ],
    researchConnection: [
      "Every credible scientific forecast, weather, climate, epidemiology, economics, reports uncertainty alongside its central estimate. A single number without a range is not more scientific; it's less informative, and often misleading about how much confidence is actually warranted.",
    ],
    quiz: [
      {
        question: "Why is a single-number prediction, with no uncertainty range, potentially misleading?",
        options: [
          "Single numbers are always wrong",
          "It implies a level of precision the model may not actually have, hiding how much the prediction could reasonably vary",
          "Numbers should never be reported to non-experts",
          "It's not misleading, ranges are only needed for large datasets",
        ],
        correctIndex: 1,
        explanation: "A bare number invites false confidence, the range is what tells the reader how seriously to weight the estimate.",
      },
    ],
    challenge: {
      prompt: "Write the question the town councillor should have asked instead of 'is that going to happen?', one that a model could actually answer honestly.",
      hint: "Think in terms of a range or probability, not a yes/no.",
    },
    teachBack: {
      prompt: "Explain George Box's phrase 'all models are wrong, but some are useful' to someone hearing it for the first time.",
    },
  },
  {
    id: "10-2-confidence-vs-credible-intervals",
    missionId: "10-quantifying-uncertainty",
    order: 2,
    title: "Confidence vs. Credible Intervals",
    durationMinutes: 15,
    story: [
      "You mention 'confidence interval' in a meeting and a colleague trained in Bayesian statistics corrects you: 'You mean credible interval, they're not interchangeable, and mixing them up changes what you're allowed to claim.'",
    ],
    plainEnglish: [
      "A confidence interval (frequentist) says: if we repeated this sampling process many times, 95% of the intervals we'd construct would contain the true value. It is a statement about the procedure, not about this specific interval containing the truth with 95% probability.",
      "A credible interval (Bayesian) says something more directly useful, and more intuitive: given the data and our prior beliefs, there's a 95% probability the true value falls in this exact range. The difference is subtle in wording but matters in interpretation, Bayesian credible intervals let you make direct probability statements about the unknown quantity itself.",
    ],
    analogy: [
      "A confidence interval is like a fishing net you know catches the right fish 95% of the time, but you can't tell just by looking whether this particular cast succeeded. A credible interval is more like a friend telling you directly, 'I'm 95% sure the fish is right here in this spot.' Both are useful, but they are answering slightly different questions.",
    ],
    math: {
      intro: "The formal definitions side by side, using θ for an unknown true parameter:",
      equations: [
        {
          label: "Confidence interval (frequentist)",
          latex: "P(\\theta \\in [L, U] \\mid \\text{repeated sampling}) = 0.95",
          explanation: "A statement about how often the interval-construction procedure would capture the true value across many hypothetical repeats, not a probability about this one interval.",
        },
        {
          label: "Credible interval (Bayesian)",
          latex: "P(\\theta \\in [L, U] \\mid \\text{data}) = 0.95",
          explanation: "A direct probability statement: given the data we actually observed, there's a 95% chance the true value lies in this range.",
        },
      ],
    },
    researchConnection: [
      "Misinterpreting a confidence interval as a direct probability statement is one of the most common statistical errors in published research and science journalism. Being precise about which kind of interval you're reporting, and what it actually licenses you to claim, is a mark of statistical maturity.",
    ],
    quiz: [
      {
        question: "What does a 95% confidence interval technically claim?",
        options: [
          "There's a 95% probability the true value is in this specific interval",
          "95% of intervals constructed this way, across repeated sampling, would contain the true value",
          "95% of the data falls within this range",
          "The model is 95% accurate",
        ],
        correctIndex: 1,
        explanation: "It's a statement about the long-run behavior of the procedure, which is subtly but importantly different from a direct probability about the one interval in front of you.",
      },
    ],
    challenge: {
      prompt: "Rewrite a confidence-interval claim you've heard before (in the news, a paper, or a class) using precise language that doesn't overstate what it means.",
      hint: "Avoid saying 'there's a 95% chance the true value is in this range' unless you're explicitly using a Bayesian credible interval.",
    },
    teachBack: {
      prompt: "Explain the difference between a confidence interval and a credible interval to someone who's never studied statistics, without using the word 'frequentist' or 'Bayesian'.",
    },
  },
  {
    id: "10-3-bootstrap-ensembles",
    missionId: "10-quantifying-uncertainty",
    order: 3,
    title: "Bootstrap Ensembles",
    durationMinutes: 15,
    story: [
      "You don't have a closed-form formula handy for the uncertainty of your streamflow regression's predictions at every rainfall value. Your supervisor suggests a trick that works almost regardless of the model: resample your data with replacement, refit, and repeat, many times.",
    ],
    plainEnglish: [
      "Bootstrapping (a trick where you repeatedly re-draw your own data with replacement to see how much your results would wobble) simulates 'what if I'd collected a slightly different dataset by chance?' by drawing new samples, with replacement, from your existing data and refitting your model each time. The spread across all those refits, the ensemble, is a direct, empirical picture of your uncertainty, without needing any assumption about the shape of that uncertainty.",
    ],
    analogy: [
      "Imagine you have a bag of 20 marbles and want to know how much the average color mix might wobble by chance. You reach in, grab a handful, note the mix, put them back, and grab again, over and over. The spread across all those handfuls tells you how much to trust any single handful as a picture of the whole bag.",
    ],
    simulation: {
      component: "uncertainty-explorer",
      caption: "Watch the prediction band emerge from an ensemble of bootstrap-resampled regression fits. Increase the ensemble size and see the band stabilize.",
    },
    code: [
      {
        language: "python",
        filename: "bootstrap_uncertainty.py",
        snippet: `import numpy as np

rainfall = np.array([...])   # from Mission 06's dataset
streamflow = np.array([...])
n_boot = 500
predictions_at_100mm = []

rng = np.random.default_rng(seed=42)
for _ in range(n_boot):
    idx = rng.integers(0, len(rainfall), size=len(rainfall))
    x_sample, y_sample = rainfall[idx], streamflow[idx]
    slope, intercept = np.polyfit(x_sample, y_sample, deg=1)
    predictions_at_100mm.append(slope * 100 + intercept)

lower, upper = np.percentile(predictions_at_100mm, [2.5, 97.5])
print(f"95% bootstrap interval at 100mm rainfall: [{lower:.2f}, {upper:.2f}] m3/s")`,
        walkthrough: [
          "rng.integers draws random row indices with replacement, the core of bootstrap resampling.",
          "We refit a simple linear regression on each resample, exactly as in Mission 06.",
          "Collecting the prediction at one specific rainfall value (100mm) across 500 resamples gives us an empirical distribution of plausible predictions.",
          "The 2.5th and 97.5th percentiles of that distribution form a 95% bootstrap interval, no formula required.",
        ],
      },
    ],
    researchConnection: [
      "Bootstrapping is used across environmental science whenever the underlying uncertainty formula is unavailable, intractable, or the model violates the assumptions a formula would require. It's one of the most broadly applicable uncertainty quantification techniques in a researcher's toolkit.",
    ],
    quiz: [
      {
        question: "What does resampling 'with replacement' mean in bootstrapping?",
        options: [
          "Each new sample is a completely different, independently collected dataset",
          "Data points are drawn randomly from the original set, and the same point can be selected more than once in a single resample",
          "Missing values are replaced with the mean",
          "Old data is deleted and replaced with new data",
        ],
        correctIndex: 1,
        explanation: "With replacement means the original dataset is the pool, and a single resample of the same size can include duplicates of some points and omit others entirely, this variability is exactly what generates the ensemble spread.",
      },
    ],
    challenge: {
      prompt: "In the simulation, increase the ensemble size from 5 to 60. Does the prediction band get wider or narrower, and why does that make sense?",
      hint: "More resamples make the estimate of the band's edges more stable, it's not about the true uncertainty growing.",
    },
    teachBack: {
      prompt: "Explain bootstrapping to a colleague as if you were describing it as a physical process with index cards, not code.",
    },
  },
  {
    id: "10-4-bayesian-updating",
    missionId: "10-quantifying-uncertainty",
    order: 4,
    title: "Bayesian Updating",
    durationMinutes: 15,
    story: [
      "Before this year's data arrived, your team's best guess was that 10% of Bluewater Basin's rain gauges would need recalibration in any given year, based on five years of maintenance logs. This year, 3 of the basin's 12 gauges failed calibration checks. Should your belief stay at 10%, jump to 25%, or land somewhere between?",
    ],
    plainEnglish: [
      "Bayesian updating (a formal way of blending what you already believed with new evidence to form an updated belief) combines what you believed before seeing new data (your prior, meaning your starting belief) with what the new data actually shows (the likelihood, meaning how well the new evidence fits different possible truths) to produce an updated belief (the posterior, meaning your revised belief after seeing the evidence). It's a formal version of something people do informally all the time: adjusting an estimate as new evidence comes in, without either ignoring the new evidence or discarding everything you knew before.",
    ],
    analogy: [
      "Imagine you think a friend is generally on time, but then they show up late three days in a row. You do not throw out everything you knew about them, and you do not ignore the new evidence either. You land somewhere in between, updating your belief a bit toward 'maybe they are running late this week.' That blending of old belief and new evidence is exactly what Bayesian updating formalizes.",
    ],
    math: {
      intro: "Bayes' theorem, applied to our gauge failure-rate question:",
      equations: [
        {
          label: "Bayes' theorem",
          latex: "P(\\theta \\mid \\text{data}) = \\frac{P(\\text{data} \\mid \\theta)\\, P(\\theta)}{P(\\text{data})}",
          explanation: "The posterior belief about the failure rate θ, given this year's data, is proportional to how likely that data was under θ, times how plausible θ seemed beforehand.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "bayesian_update.py",
        snippet: `from scipy.stats import beta

# Prior: five years of maintenance logs suggested ~10% failure rate,
# encoded as a Beta(2, 18) distribution (weak prior, centered near 0.1)
prior_alpha, prior_beta = 2, 18

# This year's data: 3 failures out of 12 gauges checked
failures, checked = 3, 12

# Conjugate update: posterior is just prior + observed counts
post_alpha = prior_alpha + failures
post_beta = prior_beta + (checked - failures)

posterior = beta(post_alpha, post_beta)
print("Posterior mean failure rate:", round(posterior.mean(), 3))
print("95% credible interval:", [round(x, 3) for x in posterior.interval(0.95)])`,
        walkthrough: [
          "We encode last year's belief as a Beta distribution, a natural choice for modelling an unknown proportion.",
          "The Beta-Binomial conjugate update means we can update our belief with simple addition: add the observed failures and successes to the prior's parameters.",
          "The resulting posterior distribution gives both a best-guess failure rate and a full credible interval, not just a point estimate.",
        ],
      },
    ],
    researchConnection: [
      "This conjugate-update pattern, the mathematical shortcut that lets Bayesian updating happen via simple addition, is exactly why Beta-Binomial models are a standard tool for monitoring failure rates, defect rates, and detection probabilities in engineering and environmental monitoring alike.",
    ],
    quiz: [
      {
        question: "In Bayesian updating, what does the posterior represent?",
        options: [
          "Only what the new data says, ignoring prior belief",
          "Only the original prior belief, unchanged",
          "A combination of prior belief and new evidence, weighted by how much data each represents",
          "A random guess",
        ],
        correctIndex: 2,
        explanation: "The posterior blends prior and likelihood, with more data, the posterior increasingly reflects the new evidence; with less, it stays closer to the prior.",
      },
    ],
    challenge: {
      prompt: "Using the code pattern above, would a weaker prior (say Beta(1,1), representing no prior knowledge) move the posterior mean closer to or further from the raw 3/12 = 25% observed rate? Explain why.",
      hint: "A weaker prior carries less 'pull' toward its own center, letting the data dominate more.",
    },
    teachBack: {
      prompt: "Explain Bayesian updating to a friend using a non-statistical example from everyday life, forming an opinion about a new restaurant, for instance.",
    },
  },
  {
    id: "10-5-calibration",
    missionId: "10-quantifying-uncertainty",
    order: 5,
    title: "Calibration",
    durationMinutes: 12,
    story: [
      "Your model has been producing '90% prediction intervals' for six months of streamflow forecasts. Your supervisor asks: 'has the true value actually landed inside your interval about 90% of the time, or are we just saying 90% and hoping?'",
    ],
    plainEnglish: [
      "A model is well-calibrated (its confidence claims actually match how often it turns out to be right) if its stated uncertainty matches its actual error rate: a well-calibrated 90% interval really does contain the truth about 90% of the time, checked retrospectively against real outcomes. A model can have impressively narrow intervals and still be badly calibrated if those narrow intervals are wrong more often than they claim to be.",
    ],
    analogy: [
      "Think of a weather forecaster who says '90% chance of rain' every single day, rain or shine, regardless of the actual weather. If it only rains on 40% of those days, the forecaster is badly calibrated, their confidence numbers do not match reality, even if they sound precise every time.",
    ],
    code: [
      {
        language: "python",
        filename: "check_calibration.py",
        snippet: `import numpy as np

# For each of 24 past months: was the true streamflow inside the stated 90% interval?
lower_bounds = np.array([...])
upper_bounds = np.array([...])
true_values = np.array([...])

covered = (true_values >= lower_bounds) & (true_values <= upper_bounds)
coverage_rate = covered.mean()

print(f"Stated interval: 90%")
print(f"Actual coverage over 24 months: {coverage_rate * 100:.1f}%")`,
        walkthrough: [
          "We check, for every historical prediction, whether the true observed value actually fell inside the interval that was claimed at the time.",
          "Averaging that yes/no coverage across all 24 months gives the empirical coverage rate.",
          "Comparing 90% (stated) against the empirical rate tells us directly whether the model is honest about its own uncertainty.",
        ],
      },
    ],
    researchConnection: [
      "Calibration checks are standard practice for any operational forecasting system, weather services, disease forecasting dashboards, and financial risk models are all routinely audited this way, because a model that is confidently wrong is often more dangerous than one that admits high uncertainty.",
    ],
    quiz: [
      {
        question: "What does it mean for a model to be 'badly calibrated'?",
        options: [
          "It makes inaccurate point predictions",
          "Its stated uncertainty (e.g. a 90% interval) doesn't match its actual empirical coverage rate over time",
          "It runs too slowly",
          "It was trained on too much data",
        ],
        correctIndex: 1,
        explanation: "Calibration is specifically about whether stated confidence matches real-world accuracy of that confidence, separate from how accurate the central prediction itself is.",
      },
    ],
    challenge: {
      prompt: "If a check like the one above found your 90% intervals actually contained the truth only 65% of the time, what would you recommend doing before using this model for any more forecasts?",
      hint: "Consider whether the intervals need to be widened, or whether the underlying model needs revisiting.",
    },
    teachBack: {
      prompt: "Explain calibration to someone using a weather forecaster analogy: what would it mean for a forecaster's '70% chance of rain' claims to be well-calibrated?",
    },
  },
  {
    id: "10-6-communicating-uncertainty-honestly",
    missionId: "10-quantifying-uncertainty",
    order: 6,
    title: "Communicating Uncertainty Honestly",
    durationMinutes: 12,
    story: [
      "Your final task for this mission: brief the town council on next month's streamflow forecast, including uncertainty, in language that won't be misunderstood as either false precision or unhelpful vagueness.",
    ],
    plainEnglish: [
      "Communicating uncertainty well means resisting two opposite failures: hiding the uncertainty to sound more authoritative than the evidence supports, and burying the answer in so many caveats that nobody can act on it. Good uncertainty communication states a clear central estimate, a clear range, and one plain sentence about what that range means for the decision at hand.",
    ],
    analogy: [
      "A good uncertainty statement is like a doctor telling you 'recovery usually takes 4 to 6 weeks, most likely around 5,' instead of either promising an exact date they cannot really know, or listing every conceivable complication until you have no idea what to plan for.",
    ],
    researchConnection: [
      "Public-facing scientific communication, hurricane forecast cones, epidemic case projections, economic forecasts, succeeds or fails largely on how well it balances these two failure modes. Mission 11 will go deeper into scientific communication generally; this lesson is the uncertainty-specific piece of that skill.",
    ],
    quiz: [
      {
        question: "What are the two opposite failure modes in communicating uncertainty?",
        options: [
          "Using too much math, and using too little math",
          "Overstating certainty to sound authoritative, and drowning the message in caveats until it's unusable",
          "Speaking too quickly, and speaking too slowly",
          "There is only one failure mode: being wrong",
        ],
        correctIndex: 1,
        explanation: "Effective communication sits between false confidence and unusable vagueness, a clear estimate, a clear range, and a clear implication.",
      },
    ],
    challenge: {
      prompt: "Write the exact two sentences you'd say to the town council about next month's streamflow, including your uncertainty, in language a non-statistician would find both clear and honest.",
      hint: "Try: 'We expect streamflow near X. Based on similar past months, the true value will likely fall between Y and Z.'",
    },
    teachBack: {
      prompt: "Explain, in your own words, why 'the model says 14.2 m³/s' is a worse thing to tell a policymaker than 'we expect roughly 12-16 m³/s, with 14.2 as our best estimate'.",
    },
  },
];
