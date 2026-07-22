import type { Lesson } from "@/lib/missions/types";

export const mission04Lessons: Lesson[] = [
  {
    id: "04-1-look-before-you-model",
    missionId: "04-exploring-patterns",
    order: 1,
    title: "Look Before You Model",
    durationMinutes: 12,
    story: [
      "The Bluewater Basin dataset is finally clean. Your team has fifteen wells, six rain gauges, twelve stream sensors, and five years of data, all quality-checked, unit-corrected, and gap-documented. It took six weeks. Now your supervisor delivers the surprising instruction: 'Before you run a single model, spend a week just looking at it.'",
      "She tells you about a famous cautionary tale: a research team spent three months building an elaborate regression model to explain nitrate variability in their watershed, published the results, and only later discovered that nitrate at the most important well simply tracked the agricultural calendar, fertiliser application in spring, crop uptake in summer, leaching in autumn. The pattern was visible in the first scatter plot. The elaborate model added nothing.",
    ],
    plainEnglish: [
      "Exploratory Data Analysis (EDA, meaning just looking closely at your data before doing anything fancy to it) is the discipline of systematically looking at your data, distributions, correlations, seasonal patterns, spatial patterns, before committing to any statistical model. Its purpose is to let the data tell you what questions are worth asking rather than imposing a hypothesis before you know what the data contains.",
      "EDA isn't a preliminary chore. It's where most real discoveries happen. Unexpected patterns, missed cleaning errors, contradictions between stations, these all show up in plots before they show up in models. A model can confirm a pattern you already understand; it cannot discover a pattern you've never looked for.",
    ],
    analogy: [
      "It is like walking around a new house before you start rearranging furniture. If you shove a couch against the wall before noticing where the windows and doors are, you will probably have to move it again. A few minutes of just looking saves hours of redoing work later.",
    ],
    researchConnection: [
      "John Tukey, the statistician who coined 'exploratory data analysis' in 1977, wrote that the greatest value of a picture is when it forces us to notice what we never expected to see. This is as true in environmental science today as it was then. Major discoveries, El Niño's global fingerprint, the ozone hole, declining stream flows, were all identified visually in raw data plots before any formal statistical confirmation.",
    ],
    quiz: [
      {
        question:
          "What is the main purpose of Exploratory Data Analysis (EDA)?",
        options: [
          "To produce publication-quality figures",
          "To systematically look at the data and let patterns emerge before imposing a model",
          "To test a pre-specified hypothesis",
          "To clean and gap-fill the dataset",
        ],
        correctIndex: 1,
        explanation:
          "EDA is about discovery, not confirmation. Its job is to reveal structure, surprise, and anomaly in the data before you decide which model to build.",
      },
    ],
    challenge: {
      prompt:
        "Before this lesson's simulation, write down two patterns you would expect to find in Bluewater Basin's nitrate data based on what you already know about the watershed. Then check whether you find them in the exploration exercises below.",
      hint:
        "Think about the agricultural zone, seasonal fertiliser application, and the locations of wells relative to farmland.",
    },
    teachBack: {
      prompt:
        "Explain why building a regression model before doing EDA is risky, what specific bad outcome could result?",
    },
  },
  {
    id: "04-2-distributions",
    missionId: "04-exploring-patterns",
    order: 2,
    title: "Distributions",
    durationMinutes: 16,
    story: [
      "You plot a histogram of all five years of nitrate readings from Bluewater Basin's fifteen wells. The shape surprises you: instead of a smooth bell curve, there's a long right tail, most readings cluster between 2 and 15 mg/L, but a small number extend out to 60, 80, even 120 mg/L.",
      "Your supervisor points at the tail. 'That's not random noise. Those extreme values almost certainly come from specific wells, specific seasons, or specific rainfall events. A mean of the whole distribution would tell you almost nothing useful, you need to know what's driving the tail.'",
    ],
    plainEnglish: [
      "A distribution (the overall pattern of how spread out and clustered a set of values is) is the pattern of values a variable takes, how spread out they are, where they concentrate, whether they're symmetric or skewed. Understanding a distribution before any modelling is essential because most statistical models make assumptions about distribution shape (especially normality, meaning a classic symmetric bell-curve shape) and can produce badly wrong results when those assumptions are violated.",
      "Environmental data is almost never normally distributed. Nitrate, streamflow, and pollutant concentrations all tend to be right-skewed (lopsided, with a long tail of rare high values): most values are low, but rare extreme events create a long right tail. The mean of a skewed distribution is pulled toward the tail and doesn't represent 'typical' well, the median (the middle value when everything is lined up in order) is often more useful.",
    ],
    analogy: [
      "Picture the take-home pay of everyone in a small town, including one billionaire who happens to live there. The average income looks huge, skewed upward by one person. The median, the income of the person right in the middle of the line, tells you what a typical resident actually earns. Nitrate levels behave the same way: a few extreme readings can drag the average far from what is typical.",
    ],
    simulation: {
      component: "distribution-explorer",
      caption:
        "Drag the skewness and sample size sliders to see how Bluewater Basin's nitrate distribution changes, and when the mean diverges from the median.",
    },
    math: {
      intro: "Three key statistics describe where a distribution is centred and how spread it is:",
      equations: [
        {
          label: "Sample mean",
          latex: "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i",
          explanation:
            "The arithmetic average. Pulled toward extreme values in skewed distributions.",
        },
        {
          label: "Sample variance",
          latex: "s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2",
          explanation:
            "The average squared deviation from the mean. We divide by n−1 (not n) to get an unbiased estimate of the population variance.",
        },
        {
          label: "Skewness",
          latex:
            "\\text{skew} = \\frac{1}{n} \\sum_{i=1}^{n} \\left(\\frac{x_i - \\bar{x}}{s}\\right)^3",
          explanation:
            "Positive skew means a long right tail (more extreme high values than low). Most environmental concentrations have positive skew.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "explore_distribution.py",
        snippet: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

nitrate = pd.read_csv("bluewater_nitrate_clean.csv")["nitrate_mgL"]

print("=== Distribution summary ===")
print(f"Mean:    {nitrate.mean():.2f} mg/L")
print(f"Median:  {nitrate.median():.2f} mg/L")
print(f"Std dev: {nitrate.std():.2f} mg/L")
print(f"Skew:    {nitrate.skew():.2f}")
print(f"Min/Max: {nitrate.min():.1f} / {nitrate.max():.1f} mg/L")

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

# Raw histogram
ax1.hist(nitrate, bins=40, color="#1D6E73", alpha=0.8)
ax1.axvline(nitrate.mean(), color="#D4A72C", linestyle="--", label="Mean")
ax1.axvline(nitrate.median(), color="#A97452", linestyle="-", label="Median")
ax1.legend()
ax1.set_title("Nitrate distribution, all wells")

# Log-transform for right-skewed data
ax2.hist(np.log1p(nitrate), bins=40, color="#4C7A6B", alpha=0.8)
ax2.set_title("Log-transformed (more symmetric)")
plt.tight_layout()
plt.savefig("nitrate_distribution.png", dpi=150)`,
        walkthrough: [
          "We compute the five-number summary plus skewness: if skew > 1, the distribution is substantially right-tailed.",
          "Plotting both raw and log-transformed data side by side reveals whether log-transformation brings the distribution closer to symmetric.",
          "Marking both the mean and median shows how far they diverge, large divergence signals skew that matters for modelling choices later.",
          "plt.savefig saves the figure for the methods section of the eventual research paper.",
        ],
      },
    ],
    researchConnection: [
      "Most water quality variables, nitrate, phosphorus, turbidity, bacterial counts, follow approximately log-normal distributions in real watersheds. Many regression and statistical test procedures work better after log-transforming these variables, because the transformed data is closer to normal. Understanding your distribution in EDA directly informs which model you'll choose in Mission 06.",
    ],
    quiz: [
      {
        question:
          "Bluewater Basin's nitrate data has a mean of 14.2 mg/L and a median of 8.7 mg/L. What does this tell you?",
        options: [
          "There is probably an error in the data",
          "The distribution is left-skewed",
          "The distribution is right-skewed, extreme high values are pulling the mean above the median",
          "The mean and median should always be equal",
        ],
        correctIndex: 2,
        explanation:
          "When mean > median, extreme high values (the right tail) are pulling the mean up. This is right skew, typical of pollutant concentration data.",
      },
    ],
    challenge: {
      prompt:
        "The five wells closest to the agricultural zone have nitrate readings: [18.3, 22.7, 31.4, 8.9, 45.2]. The five wells furthest from farmland have: [4.1, 3.8, 5.2, 4.6, 6.1]. Calculate the mean and median for each group. What does this tell you about where the nitrate is coming from?",
      hint:
        "Sort each list, find the middle value for median, add and divide by 5 for mean. The difference between groups is the signal.",
    },
    teachBack: {
      prompt:
        "Explain to a non-statistician why the median can be more informative than the mean for environmental concentration data, using Bluewater Basin as your example.",
    },
  },
  {
    id: "04-3-time-series-patterns",
    missionId: "04-exploring-patterns",
    order: 3,
    title: "Time-Series Patterns",
    durationMinutes: 16,
    story: [
      "You plot five years of nitrate at well GW-14 as a time series. Immediately, three things are visible that no summary statistic could show: values peak every spring (fertiliser application), drop in summer (crop uptake), and have been drifting gradually upward across the whole five years. One event stands out, a sharp spike in March 2022, during a heavy rainfall week.",
      "These are three completely different patterns, seasonal, trend, and event, layered on top of each other. Treating them as one undifferentiated 'variability' would be like trying to explain the total in one number.",
    ],
    plainEnglish: [
      "A time series (any set of measurements recorded one after another over time) is any measurement recorded sequentially over time. Almost all environmental data is a time series. Decomposing a time series (splitting it apart into its separate ingredients) means separating it into its components: the long-term trend (is nitrate rising over years?), the seasonal cycle (does it peak every spring?), and the residuals (what's left over after removing trend and season, random variation, individual events).",
      "Each component needs different tools and different interpretations. The trend answers 'is there a long-term change?', the question the research station was set up to answer. The seasonal component answers 'when in the year does this happen?', important for monitoring design. The residuals may contain the most scientifically interesting events.",
    ],
    analogy: [
      "Think of a kid's height measured every month on a doorframe. There is a steady upward trend as they grow. There might be a tiny seasonal wobble, taller after a growth spurt in summer. And there is noise, since standing up a little straighter one day can nudge the mark up a few millimeters. Separating those three things tells you what is really going on instead of one confusing wiggly line.",
    ],
    simulation: {
      component: "timeseries-explorer",
      caption:
        "Toggle the trend, seasonal, and residual layers on the Bluewater Basin nitrate time series to see what each component contributes.",
    },
    code: [
      {
        language: "python",
        filename: "timeseries_decompose.py",
        snippet: `import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose

df = pd.read_csv("GW14_nitrate_monthly.csv", parse_dates=["month"])
df = df.set_index("month")

# Decompose into trend, seasonal, and residual components
result = seasonal_decompose(df["nitrate_mgL"], model="additive", period=12)

print("Trend range (min to max):")
print(f"  {result.trend.dropna().min():.2f} → {result.trend.dropna().max():.2f} mg/L")
print(f"Seasonal peak-to-trough swing: {result.seasonal.max() - result.seasonal.min():.2f} mg/L")
print(f"Largest residual: {result.resid.dropna().abs().max():.2f} mg/L")`,
        walkthrough: [
          "seasonal_decompose separates the time series into three components using a moving average for the trend.",
          "period=12 tells the function the seasonal cycle repeats every 12 months.",
          "model='additive' assumes trend, season, and residual add together, appropriate when the seasonal swing doesn't grow as the overall level increases.",
          "Printing ranges for each component quantifies how much of the total variability each one explains.",
        ],
      },
    ],
    researchConnection: [
      "Time-series decomposition is used by government environment agencies worldwide to separate long-term trends (what the public and policymakers care about) from seasonal cycles (which mask trends if not removed) and random variation. The UK Environment Agency uses this approach for reporting on long-term trends in river water quality under the Water Framework Directive.",
    ],
    quiz: [
      {
        question:
          "Bluewater Basin's nitrate shows a consistent spring peak every year. After removing the seasonal component, nitrate still trends upward over five years. What can you conclude?",
        options: [
          "The spring peaks explain the entire upward trend",
          "There is a long-term trend beyond what seasonal variation accounts for",
          "The data needs to be cleaned more thoroughly",
          "The sensor is drifting upward",
        ],
        correctIndex: 1,
        explanation:
          "If the trend persists after removing the seasonal cycle, it reflects a real long-term directional change independent of seasonality, exactly the kind of slow-onset pollution signal the station was designed to detect.",
      },
    ],
    challenge: {
      prompt:
        "From the time-series simulation above, identify: (1) the approximate month of the annual nitrate peak; (2) whether the long-term trend over five years is upward, downward, or flat; (3) the single highest residual event and its approximate date.",
      hint:
        "Use the toggle controls to isolate each component so you can read each one cleanly.",
    },
    teachBack: {
      prompt:
        "Explain what time-series decomposition reveals that a simple scatter plot or histogram of the same data would not.",
    },
  },
  {
    id: "04-4-correlations-and-scatter-plots",
    missionId: "04-exploring-patterns",
    order: 4,
    title: "Correlations & Scatter Plots",
    durationMinutes: 15,
    story: [
      "You plot nitrate at well GW-14 against cumulative rainfall from the nearest rain gauge (RG-03). There's a positive relationship, higher rainfall corresponds to higher nitrate, but it's messy. Then you plot the same data split by season: the spring relationship is strong; the summer relationship is almost flat. The correlation that appeared to be about total rainfall is actually about when the rainfall falls.",
      "'This is why we look at scatter plots,' your supervisor says. 'Correlation coefficients tell you there's a relationship. Scatter plots tell you what kind.'",
    ],
    plainEnglish: [
      "Pearson's correlation coefficient r (a single number from -1 to +1 that says how tightly two things move together in a straight-line way) measures the strength and direction of a linear relationship between two variables, ranging from −1 (perfect inverse linear relationship) to +1 (perfect positive linear relationship). Zero means no linear relationship, but it does not mean no relationship at all. Two variables can have r = 0 and still be strongly related in a non-linear way.",
      "Always plot your data before computing a correlation. Anscombe's Quartet, four datasets with nearly identical means, variances, and correlation coefficients, but completely different scatter-plot shapes, is the classic demonstration that summary statistics can be misleading without the visual.",
    ],
    analogy: [
      "Think of two kids on a seesaw. When one goes up, the other reliably goes down, that is a strong negative correlation. If they bounce around with no connection to each other at all, that is close to zero correlation. Correlation just tells you whether two things tend to move together, not why, and not whether one is causing the other.",
    ],
    math: {
      intro: "Pearson's correlation coefficient r:",
      equations: [
        {
          label: "Pearson correlation",
          latex:
            "r = \\frac{\\sum_{i=1}^{n}(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_{i=1}^{n}(x_i - \\bar{x})^2 \\cdot \\sum_{i=1}^{n}(y_i - \\bar{y})^2}}",
          explanation:
            "r is the covariance of x and y divided by the product of their standard deviations. It ranges from −1 to +1. Values near ±1 indicate strong linear relationships; near 0 indicates weak or no linear relationship.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "correlation_matrix.py",
        snippet: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("bluewater_monthly_summary.csv")

# Select water quality and climate variables
cols = ["nitrate_mgL", "rainfall_mm", "temp_C", "water_level_m", "DO_mgL"]
corr = df[cols].corr()

print("Correlation matrix:")
print(corr.round(2))

# Strongest correlation pairs (absolute r > 0.4)
corr_long = corr.stack().reset_index()
corr_long.columns = ["var1", "var2", "r"]
strong = corr_long[(corr_long["r"].abs() > 0.4) & (corr_long["var1"] != corr_long["var2"])]
print("\\nStrong correlations (|r| > 0.4):")
print(strong.sort_values("r", ascending=False))`,
        walkthrough: [
          "df[cols].corr() computes Pearson r for every pair of variables at once, the result is a matrix where each cell is one pairwise correlation.",
          "Values on the diagonal are always 1.0 (a variable is perfectly correlated with itself).",
          "Stacking the matrix and filtering for |r| > 0.4 extracts only the meaningful correlations, making the matrix easier to scan.",
          "This is a screening step, strong correlations get plotted as scatter plots next, to confirm the relationship is genuinely linear.",
        ],
      },
    ],
    researchConnection: [
      "Correlation matrices are the standard first step in multivariate environmental analysis. They tell you which variables move together (and might therefore be measuring the same underlying process) and which to include as independent predictors in a regression model. Including two highly correlated predictors in the same model (multicollinearity) causes instability, the correlation matrix warns you in advance.",
    ],
    quiz: [
      {
        question:
          "Rainfall and nitrate at GW-14 have r = 0.62. What does this tell you, and what does it not tell you?",
        options: [
          "It tells you rainfall causes nitrate; it proves a causal mechanism",
          "It tells you there is a moderate positive linear relationship between the two; it does not tell you whether rainfall causes nitrate or vice versa, or whether a third factor drives both",
          "It tells you 62% of nitrate variability is explained by rainfall",
          "It tells you the relationship is exactly linear",
        ],
        correctIndex: 1,
        explanation:
          "r describes the strength and direction of linear co-movement only. Causation, non-linearity, and the role of third variables all require separate investigation.",
      },
    ],
    challenge: {
      prompt:
        "Given these five paired values of monthly rainfall (mm) and nitrate (mg/L): (45,6.1), (80,9.3), (120,14.8), (30,5.2), (95,11.4), compute the mean of each variable, then by hand (or by code) compute r. Is it positive or negative?",
      hint:
        "Compute mean_x and mean_y first. Then for each point compute (xᵢ − x̄)(yᵢ − ȳ), square each deviation separately, sum them, and apply the formula.",
    },
    teachBack: {
      prompt:
        "Explain to a colleague why r = 0 does not mean there is no relationship between two variables. Use a sketch or an example.",
    },
  },
  {
    id: "04-5-spatial-patterns",
    missionId: "04-exploring-patterns",
    order: 5,
    title: "Spatial Patterns",
    durationMinutes: 15,
    story: [
      "One final view of the Bluewater Basin data before any formal modelling: plot every well's average nitrate as a dot on the basin map, sized and coloured by concentration. The pattern is immediate and stark: the four highest-nitrate wells all sit within 500 metres of the agricultural zone's eastern boundary, downslope from the main fertilised fields. Two of the lowest-nitrate wells sit in the wetland buffer, immediately downstream from the same zone.",
      "No statistical model told you this. No correlation coefficient showed it. A map did. And now you know exactly where to focus the regression analysis in Mission 06.",
    ],
    plainEnglish: [
      "Spatial patterns are patterns in how measurements vary across geography rather than across time. Environmental processes almost always have spatial structure: pollution sources are localised, geology drives groundwater chemistry zone by zone, land cover transitions create gradients in runoff.",
      "Visualising data spatially, plotting measurements on a map rather than a chart, is one of the most powerful exploratory tools in environmental science. It connects abstract numbers to the physical processes that generate them, and it can reveal structure that time-series and correlation analysis completely misses.",
    ],
    analogy: [
      "It is like the famous story of a doctor in London who marked every cholera case on a street map during an outbreak, and saw the cases cluster tightly around one water pump. A list of addresses and case counts would never have shown that. The map made the invisible pattern impossible to miss.",
    ],
    simulation: {
      component: "spatial-explorer",
      caption:
        "Explore Bluewater Basin's nitrate measurements mapped spatially, select a variable and see how concentrations distribute across the watershed.",
    },
    code: [
      {
        language: "python",
        filename: "spatial_eda.py",
        snippet: `import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt

# Load well locations and their average nitrate
wells = gpd.read_file("bluewater_wells.geojson")
nitrate_avg = pd.read_csv("nitrate_well_averages.csv")
wells = wells.merge(nitrate_avg, on="sensor_id")

# Load basin boundary and land cover for context
basin = gpd.read_file("bluewater_boundary.geojson")
landcover = gpd.read_file("bluewater_landcover.geojson")

fig, ax = plt.subplots(figsize=(10, 8))
landcover.plot(ax=ax, column="land_type", alpha=0.4, legend=True)
basin.boundary.plot(ax=ax, color="#1D6E73", linewidth=1.5)

# Bubble plot: location, size, and colour all encode nitrate
wells.plot(
    ax=ax,
    column="nitrate_avg_mgL",
    markersize=wells["nitrate_avg_mgL"] * 3,
    cmap="YlOrRd",
    legend=True,
    legend_kwds={"label": "Mean nitrate (mg/L)"},
)
ax.set_title("Mean nitrate by well, Bluewater Basin")
plt.savefig("spatial_nitrate_eda.png", dpi=150)`,
        walkthrough: [
          "We use geopandas, which handles spatial data the same way pandas handles tabular data, to merge well locations with their computed nitrate averages.",
          "Plotting land cover as a base layer provides the visual context for where agricultural zones, wetlands, and forests sit.",
          "wells.plot with both column (colour) and markersize (size) encoding nitrate creates a bubble map, two visual channels for the same variable reinforces high-value locations.",
          "This plot goes into the EDA section of the eventual paper, before any modelling results appear.",
        ],
      },
    ],
    researchConnection: [
      "Spatial EDA is the foundation of the geostatistical analysis in Mission 08. The spatial patterns you identify here, clusters of high values, gradients, barriers, directly inform variogram modelling and kriging in later missions. Real geostatisticians always look at the spatial distribution of data before fitting any model.",
    ],
    quiz: [
      {
        question:
          "You find that the four highest-nitrate wells cluster near the agricultural zone's eastern boundary. What does this spatial pattern suggest?",
        options: [
          "The eastern boundary sensors are miscalibrated",
          "Nitrate is entering the groundwater system near the agricultural zone and moving downslope, worth investigating as a source-pathway-receptor chain",
          "Random variation happens to cluster there",
          "The agricultural zone sensors measure a different variable",
        ],
        correctIndex: 1,
        explanation:
          "Spatial clustering near a potential source is the clearest EDA evidence of a source-pathway-receptor link, it doesn't prove causation but directly motivates the spatial modelling in later missions.",
      },
    ],
    challenge: {
      prompt:
        "Based on what you've found in this mission's EDA, distributions, time series, correlations, and spatial patterns, write a one-paragraph summary of what Bluewater Basin's nitrate data is telling you before any formal statistical testing. What do you now believe, and what do you still need to confirm?",
      hint:
        "Reference the spring seasonal peak, the long-term trend, the correlation with rainfall, and the spatial clustering near the agricultural zone.",
    },
    teachBack: {
      prompt:
        "Explain why spatial EDA is a separate, essential step from time-series and correlation EDA, what kind of pattern would the latter two completely miss?",
    },
  },
];
