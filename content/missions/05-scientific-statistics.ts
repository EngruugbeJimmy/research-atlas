import type { Lesson } from "@/lib/missions/types";

export const mission05Lessons: Lesson[] = [
  {
    id: "05-1-from-sample-to-population",
    missionId: "05-scientific-statistics",
    order: 1,
    title: "From Sample to Population",
    durationMinutes: 14,
    story: [
      "You have five years of nitrate readings from well GW-14, 2,920 individual measurements. But what you actually care about isn't those specific 2,920 numbers. You care about the true underlying nitrate level at that well: the population mean that would exist if you could measure every molecule of water that passed through it, forever. Those 2,920 readings are just your sample.",
      "This distinction, between the sample you have and the population you want to know, is the foundation of all inferential statistics. Every technique in this mission is a method for making defensible claims about the population using only the imperfect sample you were able to collect.",
    ],
    plainEnglish: [
      "The population is the complete thing you want to know about: all the water in the aquifer, every nitrate molecule, every rainfall event that will ever occur. The sample is the subset you actually observed. Because you can never measure the whole population, statistics gives you tools to estimate population properties, like the true mean, from your sample, along with honest measures of how uncertain those estimates are.",
      "The sample mean (written x̄, meaning the average of the numbers you actually collected) is your best guess at the population mean (written μ, meaning the true average you can never fully measure). It's not equal to μ, it's an estimate with uncertainty. Quantifying that uncertainty is what standard errors and confidence intervals are for.",
    ],
    analogy: [
      "Imagine tasting three spoonfuls from a huge pot of soup to guess how salty the whole pot is. The pot is the population. Your three spoonfuls are the sample. You are not measuring every drop, you are making an educated guess, and the more spoonfuls you taste, the more confident that guess becomes.",
    ],
    math: {
      intro: "The sample mean is computed the familiar way, but its uncertainty depends on both sample size and variability.",
      equations: [
        {
          label: "Sample mean",
          latex: "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i",
          explanation: "Add all n measurements and divide by n. This is your point estimate of the true population mean μ.",
        },
        {
          label: "Standard error of the mean",
          latex: "SE = \\frac{s}{\\sqrt{n}}",
          explanation: "s is the sample standard deviation (how spread out your measurements are); n is sample size. SE measures how uncertain your estimate of μ is, it shrinks as n grows.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "sample_stats.py",
        snippet: `import numpy as np

# Five years of nitrate readings from GW-14 (mg/L)
nitrate = np.load("gw14_nitrate.npy")

n    = len(nitrate)
xbar = nitrate.mean()
s    = nitrate.std(ddof=1)      # ddof=1 gives unbiased sample std dev
se   = s / np.sqrt(n)

print(f"n     = {n}")
print(f"mean  = {xbar:.3f} mg/L")
print(f"std   = {s:.3f} mg/L")
print(f"SE    = {se:.4f} mg/L")`,
        walkthrough: [
          "np.load reads the pre-cleaned nitrate array from Mission 03's cleaned dataset.",
          "ddof=1 in std() uses n-1 in the denominator, the unbiased estimator of population variance.",
          "SE = s / √n: more data or less variability → smaller SE → more precise estimate of μ.",
        ],
      },
    ],
    researchConnection: [
      "Every reported scientific measurement should come with an uncertainty quantification. The standard error is the most common one, it appears in almost every environmental science paper as error bars on figures or ± values in result tables. A mean without any uncertainty estimate is not a complete scientific result.",
    ],
    quiz: [
      {
        question: "You double your sample size from 50 to 100 measurements. By how much does the standard error decrease?",
        options: [
          "It halves, SE is proportional to 1/n",
          "It decreases by a factor of √2 ≈ 1.41",
          "It doesn't change, SE depends only on variability, not sample size",
          "It decreases by a factor of 4",
        ],
        correctIndex: 1,
        explanation: "SE = s/√n, so doubling n multiplies √n by √2, halving the SE is only achieved by quadrupling n. Doubling n reduces SE by √2.",
      },
    ],
    challenge: {
      prompt: "Using the formula SE = s/√n: if GW-14 has s = 2.3 mg/L nitrate and you take 36 measurements, what is the standard error? How many measurements would you need to cut SE in half?",
      hint: "SE = 2.3/√36. To halve SE, you need to multiply n by 4.",
    },
    teachBack: {
      prompt: "Explain in plain language why the difference between 'sample mean' and 'population mean' matters, using a concrete Bluewater Basin example.",
    },
  },
  {
    id: "05-2-confidence-intervals",
    missionId: "05-scientific-statistics",
    order: 2,
    title: "Confidence Intervals",
    durationMinutes: 16,
    story: [
      "Your team reports that the mean nitrate at GW-14 over the last year is 8.7 mg/L. A policymaker asks the obvious question: 'How sure are you it's 8.7 and not 7.2, or 10.1?' The honest scientific answer is a confidence interval, a range of values that almost certainly contains the true population mean.",
      "The WHO drinking water guideline for nitrate is 11.3 mg/L (as NO₃⁻-N). The policymaker needs to know whether the true mean at GW-14 is below that threshold, not just whether the sample mean is below it.",
    ],
    plainEnglish: [
      "A 95% confidence interval (a range of values you are pretty confident the true answer falls inside) says: if we collected 100 different samples from this well and built a 95% CI from each one, approximately 95 of those intervals would contain the true population mean μ. Any single interval either contains μ or doesn't, but you can be 95% confident before you collect your sample that the procedure will capture it.",
      "The interval is built outward from the sample mean in both directions, by a margin equal to the critical value (from a t-distribution for small samples) multiplied by the standard error.",
    ],
    analogy: [
      "It is like throwing a ring toss at a peg you can not quite see. A confidence interval is the size of ring you would need to throw so that, if you played the game 100 times, about 95 of your rings would land around the peg. It does not mean any one ring is 95% likely to have landed on the peg, it means your throwing method is reliable 95% of the time.",
    ],
    math: {
      intro: "A two-sided 95% confidence interval uses the t-distribution critical value, which depends on degrees of freedom (n-1).",
      equations: [
        {
          label: "95% Confidence Interval",
          latex: "\\bar{x} \\pm t_{\\alpha/2,\\, n-1} \\cdot SE",
          explanation: "The interval spans from x̄ minus the margin to x̄ plus the margin. t_{α/2, n-1} is the t critical value for 95% confidence with n-1 degrees of freedom, about 1.96 for large n, slightly larger for small samples.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "confidence_interval.py",
        snippet: `import numpy as np
from scipy import stats

nitrate = np.load("gw14_nitrate_year5.npy")
n, xbar, s = len(nitrate), nitrate.mean(), nitrate.std(ddof=1)
se = s / np.sqrt(n)

# 95% CI using t-distribution
alpha = 0.05
t_crit = stats.t.ppf(1 - alpha/2, df=n-1)
margin = t_crit * se

print(f"Mean:   {xbar:.3f} mg/L")
print(f"95% CI: ({xbar - margin:.3f}, {xbar + margin:.3f}) mg/L")
print(f"WHO limit: 11.3 mg/L")
print(f"CI entirely below limit: {xbar + margin < 11.3}")`,
        walkthrough: [
          "stats.t.ppf gives the t critical value for a two-tailed test at the specified α and degrees of freedom.",
          "The margin = t_crit × SE extends symmetrically in both directions from the mean.",
          "The key policy question, is the upper bound of the CI still below 11.3?, can be checked directly.",
        ],
      },
    ],
    researchConnection: [
      "Confidence intervals are preferred over bare p-values in most modern environmental science journals, because they communicate both statistical significance and practical magnitude. A very large dataset can yield a p-value of 0.001 for a difference of 0.001 mg/L, statistically significant but environmentally meaningless. The CI shows the actual range of plausible values.",
    ],
    quiz: [
      {
        question: "A 95% CI for mean nitrate at GW-14 is (7.2, 9.8) mg/L. What can you conclude about the WHO limit of 11.3 mg/L?",
        options: [
          "The mean is definitely below 11.3",
          "The entire CI is below 11.3, so you have strong evidence the true mean is below the limit",
          "You cannot conclude anything, only the sample mean matters",
          "The true mean could be exactly 11.3",
        ],
        correctIndex: 1,
        explanation: "A CI entirely below the threshold provides strong evidence that the true mean is below it, this is the correct policy-relevant interpretation.",
      },
      {
        question: "Why use a t-distribution rather than a normal distribution for small samples?",
        options: [
          "The t-distribution is more accurate for all sample sizes",
          "For small samples the estimated standard deviation is uncertain, and the t-distribution accounts for this with heavier tails",
          "The normal distribution doesn't apply to water quality data",
          "It's only a convention, both give identical results",
        ],
        correctIndex: 1,
        explanation: "The t-distribution has heavier tails than the normal, it's more conservative when n is small because s is a less reliable estimate of σ. As n grows, it converges to the normal.",
      },
    ],
    challenge: {
      prompt: "GW-14's Year 5 data: n=365, mean=8.7 mg/L, s=2.1 mg/L. Using t_crit ≈ 1.967 for df=364, compute the 95% CI. Does the upper bound exceed the WHO limit of 11.3 mg/L?",
      hint: "SE = 2.1/√365. Margin = 1.967 × SE. CI = (8.7 − margin, 8.7 + margin).",
    },
    teachBack: {
      prompt: "A colleague says 'our mean is 8.7, which is below 11.3, so we're safe.' Explain what's missing from this statement and how a confidence interval would improve it.",
    },
  },
  {
    id: "05-3-hypothesis-testing-in-practice",
    missionId: "05-scientific-statistics",
    order: 3,
    title: "Hypothesis Testing in Practice",
    durationMinutes: 18,
    story: [
      "It's been five years since Mission 00 when you pre-registered your hypothesis: 'Nitrate at well GW-14 has increased beyond normal year-to-year variation.' You now have five complete years of data. It's time to actually test it.",
      "Your supervisor reminds you of the commitment you made then: the test was specified before seeing Year 5 data. 'That's what makes the result meaningful,' she says. 'If you'd looked at the data first and then chosen which test to run, the p-value would be meaningless.'",
    ],
    plainEnglish: [
      "A hypothesis test asks: if the null hypothesis were true (no real change), how often would we see data this extreme purely by chance? If that probability, the p-value (a number that says how surprising your data would be if nothing had really changed), is very small, we have evidence against the null. We don't prove the alternative; we just show the data is hard to explain if the null is true.",
      "A two-sample t-test compares the means from two independent groups, in our case, Year 1 nitrate measurements versus Year 5 nitrate measurements, and asks whether the difference between the two sample means is larger than random variation could plausibly produce.",
    ],
    analogy: [
      "Imagine flipping a coin ten times and getting eight heads. Is the coin rigged, or did that just happen by chance? A hypothesis test is the formal version of that gut check, it calculates exactly how surprising eight heads would be from a perfectly fair coin, so you know whether to be suspicious.",
    ],
    math: {
      intro: "The t-test statistic measures how many standard errors the observed difference is away from zero.",
      equations: [
        {
          label: "Two-sample t statistic",
          latex: "t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}",
          explanation: "x̄₁ and x̄₂ are the two sample means; s₁, s₂ their standard deviations; n₁, n₂ their sizes. The larger |t|, the more the means diverge relative to their combined sampling uncertainty.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "hypothesis_test.py",
        snippet: `import numpy as np
from scipy import stats

year1 = np.load("gw14_nitrate_year1.npy")
year5 = np.load("gw14_nitrate_year5.npy")

# One-sided t-test: has the mean increased?
# alternative='greater' means H1: mu_year5 > mu_year1
t_stat, p_value = stats.ttest_ind(year5, year1, alternative="greater")

print(f"Year 1 mean: {year1.mean():.3f} mg/L (n={len(year1)})")
print(f"Year 5 mean: {year5.mean():.3f} mg/L (n={len(year5)})")
print(f"t statistic: {t_stat:.4f}")
print(f"p-value:     {p_value:.5f}")
print(f"Evidence against H0: {'Yes' if p_value < 0.05 else 'No'}")`,
        walkthrough: [
          "We use a one-sided test (alternative='greater') because our pre-registered hypothesis was directional: an increase, not just any change.",
          "stats.ttest_ind computes the Welch t-test, which doesn't assume equal variances, appropriate here.",
          "The p-value is the probability of seeing a t-statistic this large (or larger) if H0 were true.",
          "We compare to α = 0.05, the threshold we pre-registered in Mission 00.",
        ],
      },
    ],
    researchConnection: [
      "The pre-registration you completed in Mission 00 is a real scientific practice used by major environmental monitoring bodies. The US EPA and many state agencies require pre-specified statistical tests in their monitoring protocols precisely to prevent p-hacking. Your p-value from this test is trustworthy because the test was committed to before the data arrived.",
    ],
    quiz: [
      {
        question: "Your p-value is 0.031, and your pre-registered α was 0.05. What do you conclude?",
        options: [
          "The null hypothesis is proven false",
          "You reject the null hypothesis, the probability of this data under H0 is low enough to consider it implausible",
          "The alternative hypothesis is proven true",
          "The result is inconclusive, 0.031 is not small enough",
        ],
        correctIndex: 1,
        explanation: "Rejecting H0 doesn't prove H1 or disprove H0, it says the data is sufficiently unlikely under H0 to warrant abandoning it as an explanation.",
      },
      {
        question: "Why does using a one-sided versus two-sided test matter?",
        options: [
          "It doesn't, they always give the same result",
          "A one-sided test has more power for detecting changes in one specific direction, but must be justified by a pre-registered directional hypothesis",
          "A two-sided test is always more accurate",
          "One-sided tests are only valid for environmental data",
        ],
        correctIndex: 1,
        explanation: "One-sided tests concentrate all the α in one tail, more power for detecting the specified direction, but only valid if the direction was pre-specified. Using a one-sided test because you saw the data first is p-hacking.",
      },
    ],
    challenge: {
      prompt: "Compare your actual Year 5 hypothesis test result with the hypothesis you pre-registered back in Mission 00 Lesson 4. Did the test confirm, contradict, or complicate your pre-registered prediction?",
      hint: "Pull up your Mission 00 Lesson 4 teach-back notes. The question isn't whether you were 'right', it's whether you followed through on what you committed to.",
    },
    teachBack: {
      prompt: "Explain to a non-scientist what a p-value actually means, without using the phrase 'probability the null hypothesis is true'.",
    },
  },
  {
    id: "05-4-statistical-power",
    missionId: "05-scientific-statistics",
    order: 4,
    title: "Statistical Power",
    durationMinutes: 14,
    story: [
      "Your test came back non-significant: p = 0.18. Your supervisor doesn't say 'good, there's no change.' She says: 'Before we report this, we need to know if we even had enough power to detect a real change if it existed.'",
      "Statistical power (the probability your test would actually catch a real change if one truly exists) is the probability of detecting a real effect when it's there. A study with low power might miss a genuine trend, not because the trend isn't real, but because the sample was too small or too noisy to see it. Failing to reject H0 is not the same as proving H0 is true.",
    ],
    analogy: [
      "Imagine a metal detector with a dead battery. Walking over buried coins and finding nothing doesn't prove there are no coins, your detector was too weak to find them. Statistical power is the sensitivity of your test. A high-powered study that finds nothing is meaningful; a low-powered study that finds nothing is ambiguous.",
    ],
    plainEnglish: [
      "Power depends on three things: sample size (bigger is more powerful), effect size (larger effects are easier to detect), and significance threshold (stricter α requires more power). You can choose your sample size before collecting data to achieve a desired power, this is called a power analysis.",
    ],
    math: {
      intro: "Power is computed from the effect size δ (the true difference you care about detecting), standard deviation σ, sample size n, and significance level α.",
      equations: [
        {
          label: "Required sample size for target power",
          latex: "n \\geq \\frac{(z_{\\alpha/2} + z_{\\beta})^2 \\cdot 2\\sigma^2}{\\delta^2}",
          explanation: "z_{α/2} is the normal quantile for your significance level (1.96 for α=0.05); z_{β} is for your desired power (0.842 for 80% power); σ is standard deviation; δ is the smallest difference you want to reliably detect.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "power_analysis.py",
        snippet: `from scipy import stats
import numpy as np

# Parameters for Bluewater Basin nitrate trend detection
sigma = 2.1        # Estimated std dev (mg/L)
delta = 1.5        # Minimum meaningful change to detect (mg/L)
alpha = 0.05       # Significance threshold
power_target = 0.8 # 80% power desired

z_alpha = stats.norm.ppf(1 - alpha/2)
z_beta  = stats.norm.ppf(power_target)

n_required = np.ceil(((z_alpha + z_beta)**2 * 2 * sigma**2) / delta**2)
print(f"Samples per group needed: {int(n_required)}")

# Check actual power with our real sample size
n_actual = 52
power_actual = stats.norm.cdf(
    np.sqrt(n_actual / 2) * delta / sigma - z_alpha
)
print(f"Actual power with n={n_actual}: {power_actual:.3f}")`,
        walkthrough: [
          "z_alpha and z_beta are quantiles of the normal distribution corresponding to our α and 1−power thresholds.",
          "The formula gives the minimum n per group for two independent samples.",
          "We then check retrospectively: with our actual n, what power did we actually have?",
        ],
      },
    ],
    researchConnection: [
      "Power analysis is required upfront by many funding agencies and journals before a study begins, you must justify that your proposed sample size is adequate to detect the effect you care about. Retrospective power analysis (computing power after a non-significant result) is now standard practice for environmental monitoring, particularly when reporting 'no significant change' findings.",
    ],
    quiz: [
      {
        question: "A study finds p = 0.18 (not significant) with statistical power of only 25%. What is the best interpretation?",
        options: [
          "The null hypothesis is confirmed, there is no change",
          "The result is inconclusive, the study lacked sensitivity to reliably detect a real change even if one exists",
          "The effect is definitely small",
          "The significance threshold should be lowered to 0.18",
        ],
        correctIndex: 1,
        explanation: "25% power means the study had only a 1-in-4 chance of detecting a real change. A non-significant result from such a study carries very little evidential weight.",
      },
    ],
    challenge: {
      prompt: "Using the formula above (α=0.05, power=0.80, σ=2.1 mg/L), calculate the minimum sample size per group to detect a real nitrate change of 1.0 mg/L at GW-14. How does this compare to Bluewater Basin's current 365-reading/year plan?",
      hint: "z_{α/2} = 1.96, z_{β} = 0.842. Plug into the formula: n ≥ (1.96 + 0.842)² × 2 × 2.1² / 1.0²",
    },
    teachBack: {
      prompt: "Explain the difference between 'the test found no significant change' and 'there is no change', using the metal detector analogy.",
    },
  },
  {
    id: "05-5-multiple-testing-and-false-discovery",
    missionId: "05-scientific-statistics",
    order: 5,
    title: "Multiple Testing & False Discovery",
    durationMinutes: 12,
    story: [
      "Emboldened by the hypothesis test, a junior team member runs the same test on all fifteen Bluewater Basin wells and reports that two of them show significant increases (p < 0.05). Your supervisor asks: 'If there were truly no change at any well, how many would you expect to come back significant at α = 0.05?'",
      "The answer is 0.75, roughly one well. When you test fifteen hypotheses simultaneously at α = 0.05, you should expect false positives even when nothing is actually changing.",
    ],
    plainEnglish: [
      "The multiple comparisons problem (the trap of running many tests and mistaking pure luck for a real finding) arises whenever you conduct many tests simultaneously. Each test has a 5% chance of a false positive if the null is true. With 15 tests, the probability of at least one false positive approaches 54%, even if the null is true everywhere.",
      "The Bonferroni correction (a simple way to make each individual test stricter when you are running many tests at once) is the simplest fix: divide your significance threshold by the number of tests. For 15 tests at α = 0.05, require p < 0.05/15 = 0.0033 for any individual test. It's conservative but easy to apply and justify.",
    ],
    analogy: [
      "If you buy one lottery ticket, winning would be shocking. If you buy a thousand tickets, someone winning is not shocking at all, it is expected. Testing fifteen wells for a trend is like buying fifteen tickets: finding one or two 'wins' by pure chance is exactly what you should expect, not proof that something real happened.",
    ],
    math: {
      intro: "The Bonferroni-corrected threshold controls the family-wise error rate, the probability of any false positive across all m tests.",
      equations: [
        {
          label: "Bonferroni correction",
          latex: "\\alpha_{\\text{corrected}} = \\frac{\\alpha}{m}",
          explanation: "Divide your desired family-wise error rate α by the total number of tests m. Each individual test must achieve this stricter threshold to be considered significant.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "multiple_testing.py",
        snippet: `import numpy as np
from scipy import stats

# Simulate 15 hypothesis tests with truly no change (H0 true everywhere)
np.random.seed(42)
p_values = []
for _ in range(15):
    y1 = np.random.normal(5.0, 2.1, 52)  # Year 1
    y2 = np.random.normal(5.0, 2.1, 52)  # Year 5 (same distribution)
    _, p = stats.ttest_ind(y2, y1, alternative="greater")
    p_values.append(p)

uncorrected = sum(p < 0.05 for p in p_values)
bonferroni   = sum(p < 0.05/15 for p in p_values)
print(f"Significant at α=0.05 (uncorrected): {uncorrected} / 15")
print(f"Significant at Bonferroni-corrected:  {bonferroni} / 15")`,
        walkthrough: [
          "We simulate the case where H0 is true everywhere, both years are drawn from the exact same distribution.",
          "uncorrected counts how many tests produce p < 0.05 by chance alone, this is the false positive rate in practice.",
          "Bonferroni correction applies 0.05/15 ≈ 0.0033 per test, dramatically reducing false positives.",
        ],
      },
    ],
    researchConnection: [
      "Multiple testing corrections are mandatory in fields where many simultaneous tests are routine, genomics (thousands of genes), environmental monitoring (dozens of stations), neuroimaging (thousands of brain voxels). The false discovery rate (FDR), controlled by the Benjamini-Hochberg procedure, is often preferred to Bonferroni for large numbers of tests because it's less conservative while still limiting the expected proportion of false discoveries.",
    ],
    quiz: [
      {
        question: "You test 20 monitoring stations for a trend and find 3 significant at p < 0.05. How many false positives would you expect if no station were actually changing?",
        options: [
          "None, three significant results confirms real trends",
          "About 1 (20 × 0.05)",
          "About 20",
          "This depends on the sample size",
        ],
        correctIndex: 1,
        explanation: "20 tests × 5% false positive rate = 1 expected false positive under the global null. Finding 3 significant results is only moderately more than chance would produce.",
      },
    ],
    challenge: {
      prompt: "After applying Bonferroni correction to 15 wells (α = 0.05), what is the corrected threshold? If GW-14 has p = 0.012, does it survive the correction?",
      hint: "Corrected α = 0.05 / 15. Compare 0.012 to that threshold.",
    },
    teachBack: {
      prompt: "Explain to a policymaker who wants to act on any significant result why running fifteen tests and reporting the two that came back positive might be misleading.",
    },
  },
  {
    id: "05-6-non-parametric-tests",
    missionId: "05-scientific-statistics",
    order: 6,
    title: "Non-Parametric Tests",
    durationMinutes: 12,
    story: [
      "Before running the t-test, your supervisor checks the distribution of nitrate measurements. She plots a histogram. It's not symmetric, it's right-skewed, with a long tail toward high values. 'The t-test assumes the data is approximately normal,' she says. 'With this distribution and this sample size, we should check whether a non-parametric alternative changes our conclusion.'",
    ],
    plainEnglish: [
      "Parametric tests like the t-test assume the data comes from a distribution with a specific shape (usually normal). Non-parametric tests (tests that make no assumption about the shape of the data) make no such assumption, they rank the data instead of using the raw values, which makes them robust to skewness and outliers.",
      "The Mann-Whitney U test is the non-parametric counterpart to the two-sample t-test. It asks: if you drew one measurement from Year 1 and one from Year 5 at random, how often is the Year 5 value higher? If the answer is significantly more than 50% of the time, there's evidence of an increase.",
    ],
    analogy: [
      "Instead of measuring exactly how much taller every kid in class five is compared to class one, imagine lining up one kid from each class and just asking, who is taller, over and over with random pairs. You do not need exact heights to notice a pattern, just who tends to win the comparison. That is the spirit of a non-parametric test.",
    ],
    code: [
      {
        language: "python",
        filename: "nonparametric_test.py",
        snippet: `import numpy as np
from scipy import stats

year1 = np.load("gw14_nitrate_year1.npy")
year5 = np.load("gw14_nitrate_year5.npy")

# Mann-Whitney U test (non-parametric alternative to t-test)
stat, p = stats.mannwhitneyu(year5, year1, alternative="greater")

# Probability that a random Year 5 value exceeds a random Year 1 value
# This is the "common language effect size" (AUC)
auc = stat / (len(year1) * len(year5))

print(f"Mann-Whitney U: {stat:.1f}")
print(f"p-value:        {p:.5f}")
print(f"P(Y5 > Y1):     {auc:.3f}")`,
        walkthrough: [
          "mannwhitneyu computes the test statistic by ranking all measurements and comparing rank sums.",
          "alternative='greater' makes this a one-sided test matching our pre-registered hypothesis.",
          "auc (area under the ROC curve) is a highly interpretable effect size: 0.5 means no difference, 1.0 means Year 5 is always higher.",
        ],
      },
    ],
    researchConnection: [
      "Non-parametric tests are standard in environmental science precisely because environmental data is often right-skewed: pollutant concentrations, rainfall totals, and species counts all tend to have long right tails. The Mann-Whitney test is used by the US Geological Survey, Environment Canada, and most national monitoring agencies as a robust alternative to t-tests for trend detection in water quality data.",
    ],
    quiz: [
      {
        question: "When should you prefer a non-parametric test over a t-test?",
        options: [
          "Always, non-parametric tests are strictly better",
          "When the data is clearly non-normal (skewed or heavy-tailed) and n is too small for the Central Limit Theorem to guarantee the t-test is valid",
          "Only for data collected outside the lab",
          "Only for data with negative values",
        ],
        correctIndex: 1,
        explanation: "Non-parametric tests sacrifice some statistical power for robustness to distributional assumptions. They're most valuable when the normality assumption is clearly violated and n is small.",
      },
    ],
    challenge: {
      prompt: "The t-test gave p = 0.031 and the Mann-Whitney gave p = 0.027 for the same GW-14 comparison. The two tests agree. When might they meaningfully disagree, and which would you trust more in that case?",
      hint: "Think about what happens when the data is heavily skewed, which test's assumptions are still valid?",
    },
    teachBack: {
      prompt: "Explain to a colleague what the Mann-Whitney test actually compares (in plain language, without mentioning ranks), using the GW-14 nitrate data as your example.",
    },
  },
  {
    id: "05-7-effect-size-and-practical-significance",
    missionId: "05-scientific-statistics",
    order: 7,
    title: "Effect Size & Practical Significance",
    durationMinutes: 11,
    story: [
      "Your test is significant at p = 0.0001. The policymaker is alarmed. But before recommending action, your supervisor asks: 'Significant compared to what? How large is the actual change?' She pulls up the two means: Year 1 was 4.22 mg/L; Year 5 is 4.31 mg/L. The change is 0.09 mg/L, detectable with a large sample, but tiny relative to the WHO limit of 11.3 mg/L.",
      "Statistical significance tells you the effect is real. Effect size tells you whether it matters.",
    ],
    plainEnglish: [
      "A p-value measures how confident you are that an effect is non-zero. An effect size (a number that says how big the difference actually is, not just whether it exists) measures how large it is. With enough data, even a negligibly small effect will produce a tiny p-value, which is statistically significant but practically irrelevant.",
      "Cohen's d is the most common standardised effect size for comparing two means: it expresses the difference between means in units of standard deviation. A d of 0.2 is 'small', 0.5 is 'medium', 0.8 is 'large'.",
    ],
    analogy: [
      "Imagine two students both technically pass a spelling test, but one scores 60% and the other scores 99%. Both 'passed', the equivalent of a significant p-value, but the size of the difference tells a completely different story. Effect size is what tells you whether a result is a big deal or barely worth mentioning.",
    ],
    math: {
      intro: "Cohen's d standardises the raw difference between means by the pooled within-group standard deviation.",
      equations: [
        {
          label: "Cohen's d",
          latex: "d = \\frac{\\bar{x}_2 - \\bar{x}_1}{s_p}, \\quad s_p = \\sqrt{\\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}}",
          explanation: "s_p is the pooled standard deviation, a weighted average of the two groups' variabilities. d = 0 means no difference; d = 1.0 means the means are one full pooled-SD apart.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "effect_size.py",
        snippet: `import numpy as np

year1 = np.load("gw14_nitrate_year1.npy")
year5 = np.load("gw14_nitrate_year5.npy")

n1, n2 = len(year1), len(year5)
s1, s2 = year1.std(ddof=1), year5.std(ddof=1)

s_pooled = np.sqrt(((n1-1)*s1**2 + (n2-1)*s2**2) / (n1+n2-2))
d = (year5.mean() - year1.mean()) / s_pooled

print(f"Mean difference: {year5.mean()-year1.mean():.3f} mg/L")
print(f"Cohen's d:       {d:.3f}")
print(f"Interpretation: {'small' if abs(d) < 0.5 else 'medium' if abs(d) < 0.8 else 'large'}")`,
        walkthrough: [
          "s_pooled combines both groups' variance, weighted by their degrees of freedom.",
          "d is dimensionless, it tells you the effect in standard deviation units regardless of the original measurement scale.",
          "The conventional small/medium/large cutoffs are heuristics, not fixed rules, always interpret d in the context of the domain.",
        ],
      },
    ],
    researchConnection: [
      "Since 2019, the American Statistical Association has explicitly discouraged using p < 0.05 as the sole criterion for scientific conclusions, recommending that effect size and uncertainty always accompany significance tests. Nature and Science now require authors to report effect sizes and confidence intervals alongside p-values. The field is shifting toward treating statistical significance as one piece of evidence, not a binary gate.",
    ],
    quiz: [
      {
        question: "A study finds p = 0.0001 with Cohen's d = 0.08. What is the best interpretation?",
        options: [
          "The effect is both statistically and practically significant",
          "The effect is statistically significant but very small, it may not be practically meaningful",
          "The effect is large because the p-value is very small",
          "The study is underpowered",
        ],
        correctIndex: 1,
        explanation: "A tiny p-value with a tiny d means the study detected a real but very small effect, common with very large n. Whether d = 0.08 matters depends on the domain, not on the p-value.",
      },
    ],
    challenge: {
      prompt: "Calculate Cohen's d for the Year 1 vs Year 5 GW-14 comparison using the values: ȳ₁ = 4.22, ȳ₅ = 8.71, s₁ = 1.8, s₅ = 2.1, n₁ = n₅ = 365. Is this a small, medium, or large effect? Does the magnitude change how you'd advise the policymaker?",
      hint: "Compute s_pooled first, then d = (8.71 − 4.22) / s_pooled. Compare to Cohen's benchmarks.",
    },
    teachBack: {
      prompt: "Explain why a very small p-value doesn't automatically mean a large or important effect, using a hypothetical example involving water quality.",
    },
  },
];
