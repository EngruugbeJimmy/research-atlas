import type { Lesson } from "@/lib/missions/types";

export const mission03Lessons: Lesson[] = [
  {
    id: "03-1-the-reality-of-raw-data",
    missionId: "03-cleaning-scientific-data",
    order: 1,
    title: "The Reality of Raw Data",
    durationMinutes: 12,
    story: [
      "You open the first raw data file from Bluewater Basin's water quality network. Station WQ-09, twelve months of dissolved oxygen readings at fifteen-minute intervals, 35,040 rows. The first thing you notice is a value of -9999. Then another. Then a whole week where every reading is exactly 0.000. Then a column labelled 'DO_mgL' that contains the text 'MAINTENANCE' in row 14,837.",
      "Welcome to real scientific data. Your supervisor has seen your expression before. 'Every dataset I've ever worked with,' she says, 'looked like this on first open. Cleaning it is not a failure of the fieldwork, it is the fieldwork.'",
    ],
    plainEnglish: [
      "Raw sensor data is almost always imperfect. Sensors go offline, get clogged with sediment, lose power, get swapped mid-deployment, or simply malfunction for no documented reason. When this happens, data loggers record whatever they can, sometimes a sentinel value like -9999 to flag 'no reading', sometimes zero, sometimes nothing at all.",
      "Data cleaning, or Quality Assurance / Quality Control (QA/QC, meaning the checks that catch and fix bad data before anyone trusts it), is the process of identifying and handling these problems in a principled, documented way. The goal is not to make the data look better; it is to make the data accurately represent what was actually measured, so that later analysis isn't fooled by instrument artefacts.",
    ],
    analogy: [
      "Raw data is like produce straight from the farm: some of it is perfect, some has bruises, and a few pieces are rotten all the way through. Cleaning is the sorting table before anything goes in the basket. Skipping it does not mean you avoided the rotten piece, it means it ends up in someone's soup.",
    ],
    researchConnection: [
      "It's widely estimated that environmental data scientists spend 50–80% of their project time on data cleaning rather than analysis. This is not inefficiency, it is science. A single undetected -9999 value, passed through to a mean calculation, would produce a result orders of magnitude wrong. Professional data quality guidelines (ISO 5667-14, USGS QA/QC manuals) treat cleaning as a core scientific activity, not a preprocessing chore.",
    ],
    quiz: [
      {
        question:
          "A dissolved oxygen sensor records -9999 for three hours during a scheduled maintenance visit. What does this value most likely mean?",
        options: [
          "Dissolved oxygen genuinely dropped to -9999 mg/L during that period",
          "The sensor was not measuring, -9999 is a sentinel value flagging missing data",
          "The water was severely polluted",
          "The sensor's battery was low",
        ],
        correctIndex: 1,
        explanation:
          "-9999 is a classic sentinel, a chosen impossible value used to flag 'no valid reading'. It must be removed before any calculation.",
      },
    ],
    challenge: {
      prompt:
        "List three types of 'wrong' values you might encounter in a real environmental dataset, other than -9999. For each one, describe how it might get into the data and how you'd detect it.",
      hint: "Think about sensor failures, unit changes, transmission errors, and sensor replacement.",
    },
    teachBack: {
      prompt:
        "Explain to a colleague why data cleaning is a scientific activity rather than a technical chore, using one concrete example from this lesson.",
    },
  },
  {
    id: "03-2-identifying-missing-values",
    missionId: "03-cleaning-scientific-data",
    order: 2,
    title: "Identifying Missing Values",
    durationMinutes: 16,
    story: [
      "Bluewater Basin's data logger at station RG-03 (Rain Gauge 3, in the agricultural zone) went offline for eleven days in August, a circuit board failure. When it came back online, the device resumed recording as if nothing had happened. There is no record of the gap in the CSV file: the timestamps simply jump from August 4 to August 15.",
      "If you calculate August's total rainfall from this file without noticing the gap, you'll undercount rainfall by roughly 30% for that month, the highest-rainfall month of the year. Every downstream analysis depending on August precipitation data will be quietly, invisibly wrong.",
    ],
    plainEnglish: [
      "Missing values in sensor data come in two forms. Explicit gaps (missing spots that are clearly labeled as missing) are flagged by a sentinel (-9999, NaN, 'NULL'), easy to find, easy to handle. Implicit gaps (missing spots with no label at all) are simply absent: the timestamps show a jump, and nothing in the file marks it as a problem. Implicit gaps are far more dangerous because automated processing ignores them.",
      "The standard practice is to check the expected number of records against the actual number before doing anything else with a dataset. If your sensor samples every 15 minutes for 30 days, you expect 2,880 records. If you have 2,614, there are 266 missing, roughly 11 days, and you need to find out when.",
    ],
    analogy: [
      "It is like checking attendance in a classroom. If your register clearly says 'absent' next to a name, that is easy to spot. But if a page of the register is simply torn out and nobody notices, you might think every kid showed up every day. Implicit gaps are the torn-out page.",
    ],
    code: [
      {
        language: "python",
        filename: "find_gaps.py",
        snippet: `import pandas as pd

df = pd.read_csv("RG03_rainfall.csv", parse_dates=["timestamp"])
df = df.set_index("timestamp").sort_index()

# Expected: one record every 15 minutes
expected_freq = "15min"
full_index = pd.date_range(df.index.min(), df.index.max(), freq=expected_freq)

# Find which timestamps are present vs absent
missing_timestamps = full_index.difference(df.index)
print(f"Expected records: {len(full_index)}")
print(f"Actual records:   {len(df)}")
print(f"Missing records:  {len(missing_timestamps)}")

# Find the start and end of each continuous gap
gaps = pd.Series(missing_timestamps).diff()
gap_starts = missing_timestamps[gaps > pd.Timedelta("30min")]
print("\\nGap starts:", gap_starts.values[:5])`,
        walkthrough: [
          "We parse the timestamp column as actual datetime objects, not strings, so we can do time arithmetic.",
          "pd.date_range generates the complete set of timestamps we'd expect if the sensor had worked perfectly.",
          "Taking the difference tells us exactly which timestamps are absent, these are implicit gaps.",
          "Grouping consecutive missing timestamps finds where each gap starts and ends, so we can decide how to handle each one.",
        ],
      },
    ],
    researchConnection: [
      "Gap-checking is one of the first automated steps in every professional environmental data pipeline. Tools like the USGS's AQUARIUS platform and the international CUAHSI HydroShare network require gap logs as part of data submission, without them, other researchers downloading the dataset can't know what's missing.",
    ],
    quiz: [
      {
        question:
          "A sensor file has 2,880 expected records but only 2,614 actual records. What's the most important next step?",
        options: [
          "Delete the file and re-collect the data",
          "Proceed with analysis using only the available records",
          "Identify when the missing records occurred, then decide how to handle each gap",
          "Fill all gaps with the dataset mean",
        ],
        correctIndex: 2,
        explanation:
          "You need to know whether gaps cluster at critical times (storm events, seasonal peaks) before deciding how to handle them. A gap during a major rainfall event is far more consequential than one during a dry spell.",
      },
    ],
    challenge: {
      prompt:
        "Bluewater Basin's water level sensor at the streamflow gauge has 30-day records sampled every 5 minutes. How many records do you expect? If you receive 7,840 records, how many are missing, and what's the approximate total duration of missing data?",
      hint: "Total expected = (60/5) × 24 × 30. Missing duration in hours = missing_count × 5 / 60.",
    },
    teachBack: {
      prompt:
        "Explain the difference between an explicit and an implicit data gap, and why implicit gaps are more dangerous, in plain language.",
    },
  },
  {
    id: "03-3-detecting-outliers",
    missionId: "03-cleaning-scientific-data",
    order: 3,
    title: "Detecting Outliers",
    durationMinutes: 16,
    story: [
      "With missing values identified, you turn to the values that are present, and some of them are strange. Well GW-07 shows a nitrate reading of 847 mg/L on a Tuesday afternoon, surrounded by values between 6 and 14. The WHO drinking-water guideline is 50 mg/L. Your first instinct is to delete the 847 immediately.",
      "Your supervisor stops you. 'Is it an instrument error, or did a fertiliser tanker spill upslope that afternoon? You need evidence before you touch it.' She's right. An outlier is not automatically an error, sometimes it's the most important data point in the dataset.",
    ],
    plainEnglish: [
      "An outlier (a value that sits far away from most of the other values) is a value that sits far from the bulk of the data. It might be an instrument error (sensor malfunction, unit conversion mistake, data entry error), or it might be a genuine extreme event (a pollution spike, a flood, a drought).",
      "The IQR method flags values outside the range [Q1 − 1.5×IQR, Q3 + 1.5×IQR] as potential outliers, where Q1 and Q3 are the 25th and 75th percentiles and IQR = Q3 − Q1. This is robust because it uses the middle 50% of the data to define 'typical', so extreme values don't distort the boundary.",
      "Z-scores flag values more than k standard deviations from the mean. This works well for normally distributed data but can fail when the data is skewed, because extreme values pull the mean toward themselves.",
    ],
    math: {
      intro:
        "Two common outlier detection statistics for environmental data:",
      equations: [
        {
          label: "IQR method bounds",
          latex:
            "\\text{lower} = Q_1 - 1.5 \\cdot \\text{IQR}, \\quad \\text{upper} = Q_3 + 1.5 \\cdot \\text{IQR}",
          explanation:
            "Q1 and Q3 are the 25th and 75th percentiles. IQR = Q3 − Q1. Values outside [lower, upper] are flagged.",
        },
        {
          label: "Z-score",
          latex: "z_i = \\frac{x_i - \\bar{x}}{s}",
          explanation:
            "x̄ is the sample mean, s is the standard deviation. A z-score tells you how many standard deviations a value sits from the mean. |z| > 3 is a common flagging threshold.",
        },
      ],
    },
    analogy: [
      "Imagine every kid in class is between 120cm and 150cm tall, except one kid who is 210cm. Do not immediately assume the measuring tape broke. Maybe it did. Or maybe that kid is genuinely, wonderfully tall, and is exactly the interesting fact you were supposed to notice.",
    ],
    code: [
      {
        language: "python",
        filename: "detect_outliers.py",
        snippet: `import pandas as pd
import numpy as np

nitrate = pd.read_csv("GW07_nitrate.csv")["nitrate_mgL"]

# IQR method
Q1, Q3 = nitrate.quantile(0.25), nitrate.quantile(0.75)
IQR = Q3 - Q1
lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
iqr_outliers = nitrate[(nitrate < lower) | (nitrate > upper)]

# Z-score method
z = (nitrate - nitrate.mean()) / nitrate.std()
zscore_outliers = nitrate[z.abs() > 3]

print(f"IQR flags:     {len(iqr_outliers)} values")
print(f"Z-score flags: {len(zscore_outliers)} values")
print("\\nIQR-flagged values:")
print(iqr_outliers)`,
        walkthrough: [
          "quantile(0.25) and quantile(0.75) give Q1 and Q3 without being influenced by extreme values.",
          "The IQR bounds are computed; any reading outside them is flagged, not deleted, just flagged for investigation.",
          "The Z-score method divides each deviation from the mean by the standard deviation; absolute values above 3 are unusual.",
          "We print the flagged values rather than removing them, the decision about what to do comes after a human investigates.",
        ],
      },
    ],
    researchConnection: [
      "Professional environmental data workflows always flag rather than delete outliers in a first pass. Flagged data is reviewed against field notes, calibration records, and nearby sensors before any removal decision. This workflow, detect, investigate, decide, document, is codified in the USGS Guidelines for Quality Assurance and Quality Control for Environmental Monitoring.",
    ],
    quiz: [
      {
        question:
          "Well GW-07 shows a nitrate value of 847 mg/L flagged as an outlier. What should you do first?",
        options: [
          "Delete the row immediately to avoid contaminating the analysis",
          "Replace it with the surrounding mean",
          "Cross-check it against the field notes, nearby sensors, and calibration records for that date",
          "Average it with the values either side",
        ],
        correctIndex: 2,
        explanation:
          "An outlier is evidence, not necessarily an error. Investigation first, deletion only if you can document why it's not a real event.",
      },
    ],
    challenge: {
      prompt:
        "For Bluewater Basin's nitrate dataset below, compute Q1, Q3, IQR, and the outlier bounds. Then identify which, if any, values are flagged: [4.2, 5.1, 6.8, 7.2, 8.1, 9.3, 10.2, 11.1, 12.8, 847.0]",
      hint:
        "Sort the data, find the 25th and 75th percentile positions, compute IQR = Q3 − Q1, then set bounds at Q1 − 1.5×IQR and Q3 + 1.5×IQR.",
    },
    teachBack: {
      prompt:
        "Explain why an outlier might be the most important data point in a dataset, using a real-world environmental scenario as your example.",
    },
  },
  {
    id: "03-4-handling-missing-data",
    missionId: "03-cleaning-scientific-data",
    order: 4,
    title: "Handling Missing Data",
    durationMinutes: 16,
    story: [
      "You've identified all the gaps in Bluewater Basin's rainfall records, now you have to decide what to do with them. There are five options on the whiteboard: delete the rows, fill with zeros, fill with the monthly mean, interpolate from nearby stations, or mark them as missing and leave them out of calculations that require complete records.",
      "Each option is right for some questions and catastrophically wrong for others. Filling a dry-season gap with the monthly mean is reasonable for annual totals; it's disastrous for studying short-duration rainfall events.",
    ],
    plainEnglish: [
      "The right approach to missing data depends on why the data is missing and what you're going to do with it. Missing completely at random, the sensor failed for no reason related to what it was measuring, is the safest case; simple methods like mean imputation introduce less bias. Missing not at random, the sensor failed during the most extreme events, exactly when you most needed it, is the dangerous case; any imputation introduces systematic error.",
      "Linear interpolation (guessing a missing value by drawing a straight line between the point before and the point after it) fills a gap by assuming the variable changed smoothly between the last known value before the gap and the first known value after it. It's appropriate for short gaps in slowly-changing variables (groundwater level) and terrible for spiky, event-driven variables (rainfall).",
    ],
    analogy: [
      "It is like guessing your friend's height on their tenth birthday if you only know their height at nine and eleven. Drawing a straight line between those two points is a reasonable guess for something that grows steadily. It would be a terrible guess for something spiky, like guessing how much ice cream they ate on a random Tuesday just from what they ate on Monday and Wednesday.",
    ],
    math: {
      intro: "Linear interpolation across a gap:",
      equations: [
        {
          label: "Linear gap interpolation",
          latex:
            "x_t = x_{t_0} + (x_{t_1} - x_{t_0}) \\cdot \\frac{t - t_0}{t_1 - t_0}",
          explanation:
            "x_{t₀} and x_{t₁} are the known values before and after the gap; t₀ and t₁ are their timestamps; t is the timestamp of the missing value you want to fill. The formula linearly weights between the two known values based on time position.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "handle_missing.py",
        snippet: `import pandas as pd
import numpy as np

df = pd.read_csv("GW14_water_level.csv", parse_dates=["timestamp"])
df = df.set_index("timestamp").sort_index()

# Replace sentinel values with real NaN
df["level_m"] = df["level_m"].replace(-9999, np.nan)

# Strategy 1: flag only (don't fill), safest for event-driven variables
df["level_flag"] = df["level_m"].isna().map({True: "MISSING", False: "OK"})

# Strategy 2: linear interpolation, reasonable for slowly-varying water level
# Only interpolate gaps up to 2 hours (8 × 15-min records)
df["level_interpolated"] = df["level_m"].interpolate(
    method="time", limit=8
)

# Document what we did
n_filled = df["level_m"].isna().sum()
print(f"NaN values: {n_filled}")
print(f"Interpolated (limit 8 records): {df['level_interpolated'].notna().sum() - df['level_m'].notna().sum()}")`,
        walkthrough: [
          "replace(-9999, np.nan) converts sentinel flags to proper NaN values, the standard 'not a number' marker Python's data tools recognise.",
          "We create a flag column first, marking which values are real vs missing, before modifying any numbers.",
          "interpolate(method='time') fills gaps using timestamps rather than row position, so irregularly-spaced records are handled correctly.",
          "limit=8 caps interpolation at 8 steps (2 hours), longer gaps remain NaN, because interpolating a 3-day gap in water level would be scientific fiction.",
        ],
      },
    ],
    researchConnection: [
      "Multiple imputation, generating several plausible filled datasets and analysing each, then combining results, is the gold standard for handling missing data in peer-reviewed research. For environmental monitoring, simpler methods are accepted when gaps are short and clearly random, but the gap-filling method must always be documented in the paper's data methods section.",
    ],
    quiz: [
      {
        question:
          "A rainfall gauge has a 3-day gap in August, a potentially high-rainfall month. Which gap-filling method introduces the least bias?",
        options: [
          "Fill with the annual mean daily rainfall",
          "Linear interpolation from the readings either side",
          "Spatial interpolation from nearby rain gauges that were recording during that period",
          "Fill with zeros",
        ],
        correctIndex: 2,
        explanation:
          "Nearby gauges are the best substitute for a failed gauge during the same storm event. The annual mean would underestimate wet-season gaps; interpolation assumes smooth variation when rainfall is inherently spiky.",
      },
    ],
    challenge: {
      prompt:
        "Bluewater Basin's well GW-14 water level record has a 4-hour gap (16 records at 15-min intervals) between 14:00 and 18:00. The reading at 14:00 is 3.42 m and at 18:00 is 3.38 m. Compute the interpolated value at 16:00 (exactly midway through the gap).",
      hint: "t − t₀ = 2 hrs, t₁ − t₀ = 4 hrs. The interpolated value is at the halfway point.",
    },
    teachBack: {
      prompt:
        "Explain why filling a rainfall gap with the monthly mean is appropriate for some analyses but wrong for others. Give one specific example of each.",
    },
  },
  {
    id: "03-5-documenting-cleaning-decisions",
    missionId: "03-cleaning-scientific-data",
    order: 5,
    title: "Documenting Cleaning Decisions",
    durationMinutes: 12,
    story: [
      "Six months after you finish cleaning Bluewater Basin's dataset, a new researcher joins the team and asks to replicate your nitrate trend analysis. She opens your cleaned data file. She can see the numbers but has no way of knowing: which outliers you removed and why, which gaps you interpolated vs left as NaN, which calibration corrections you applied, or what the raw data looked like before cleaning.",
      "Without documentation, your cleaned dataset is scientifically incomplete, not wrong, just opaque. Another researcher cannot reproduce your work, check your decisions, or build on it with confidence.",
    ],
    plainEnglish: [
      "Every cleaning decision must be documented in a data log: what you changed, why, when, and what the original value was. The best practice is to never modify the raw data file, instead, write a cleaning script that reads the raw file and produces a cleaned file, so anyone can re-run the script and get the same result.",
      "This is what 'reproducible research' means at the data level: the path from raw sensor output to analysis-ready data is fully traceable. Anyone with the raw file and the cleaning script can arrive at exactly the same cleaned dataset.",
    ],
    analogy: [
      "A cleaning log is like a recipe card taped to a dish, instead of just leaving a finished casserole on the counter. Anyone can taste the casserole. Only the recipe card lets someone else make it again, or spot the exact step where too much salt got added.",
    ],
    code: [
      {
        language: "python",
        filename: "cleaning_pipeline.py",
        snippet: `"""
Bluewater Basin – WQ-09 dissolved oxygen cleaning pipeline
Author: Your Name
Date: 2025-03-01
Raw input: data/raw/WQ09_DO_raw.csv
Clean output: data/clean/WQ09_DO_clean.csv
Change log: docs/WQ09_cleaning_log.md
"""
import pandas as pd
import numpy as np

RAW = "data/raw/WQ09_DO_raw.csv"
CLEAN = "data/clean/WQ09_DO_clean.csv"

df = pd.read_csv(RAW, parse_dates=["timestamp"])
df = df.set_index("timestamp").sort_index()
changes = []

# Step 1: Replace sentinel values
sentinel_count = (df["do_mgL"] == -9999).sum()
df["do_mgL"] = df["do_mgL"].replace(-9999, np.nan)
changes.append(f"Replaced {sentinel_count} sentinel (-9999) values with NaN")

# Step 2: Flag IQR outliers (do not remove, flag only)
Q1, Q3 = df["do_mgL"].quantile([0.25, 0.75])
IQR = Q3 - Q1
df["flag"] = "OK"
outlier_mask = (df["do_mgL"] < Q1 - 1.5*IQR) | (df["do_mgL"] > Q3 + 1.5*IQR)
df.loc[outlier_mask, "flag"] = "OUTLIER_IQR"
changes.append(f"Flagged {outlier_mask.sum()} IQR outliers (not removed)")

# Step 3: Interpolate short gaps (≤ 1 hour = 4 records at 15-min)
before = df["do_mgL"].isna().sum()
df["do_mgL"] = df["do_mgL"].interpolate(method="time", limit=4)
filled = before - df["do_mgL"].isna().sum()
changes.append(f"Interpolated {filled} short gaps (≤1 hr); {df['do_mgL'].isna().sum()} remain NaN")

df.to_csv(CLEAN)
for line in changes:
    print("•", line)`,
        walkthrough: [
          "The docstring at the top is part of the documentation: it names the input, output, author, date, and where the change log lives.",
          "We accumulate a changes list as we go, each step appends a plain-English description of what was done.",
          "Sentinel replacement, outlier flagging, and interpolation are each separate documented steps rather than one combined operation.",
          "Saving the clean file is the last step, the raw file is never touched, so the cleaning is always reproducible.",
        ],
      },
    ],
    researchConnection: [
      "The FAIR data principles, Findable, Accessible, Interoperable, Reusable, now govern data publication at most journals and funding agencies. The 'R' in FAIR specifically requires that data is accompanied by sufficient documentation for someone else to understand and reuse it. A cleaning script and a change log are the minimum required to meet FAIR standards for a processed dataset.",
    ],
    quiz: [
      {
        question:
          "Why should you never modify the original raw data file during cleaning?",
        options: [
          "Raw files are usually too large to edit",
          "So the cleaning process is reversible and independently reproducible by anyone with the raw file and the cleaning script",
          "Because raw files are protected by copyright",
          "It doesn't matter, either approach is fine",
        ],
        correctIndex: 1,
        explanation:
          "Preserving raw data means anyone can reproduce your exact cleaned version, or challenge a cleaning decision, from first principles. Modifying the raw file destroys that chain of evidence.",
      },
    ],
    challenge: {
      prompt:
        "Write a short data cleaning log entry for one decision from an earlier lesson in this mission, the calibration correction, an outlier decision, or a gap-fill. Include: what you changed, the original value, why you changed it, and the date.",
      hint:
        "Use the format: 'Date: [date] | Step: [step name] | Action: [what] | Original: [value or count] | Reason: [why]'",
    },
    teachBack: {
      prompt:
        "Explain the concept of a 'reproducible cleaning pipeline' to a researcher who currently edits their raw data files directly in Excel.",
    },
  },
  {
    id: "03-6-unit-conversion-and-consistency",
    missionId: "03-cleaning-scientific-data",
    order: 6,
    title: "Unit Conversion & Consistency",
    durationMinutes: 12,
    story: [
      "Bluewater Basin's water quality network has been running for eleven years. Three years ago, the team switched from one dissolved oxygen probe model to another. The old probe reported in percent saturation; the new one reports in mg/L. Nobody flagged this in the sensor metadata. Half the dataset is in one unit; half is in the other. The two halves look completely different when plotted, there appears to be a dramatic drop in dissolved oxygen exactly when the probe was replaced.",
      "This is a unit consistency error: not a sensor failure, not a calibration drift, but a change in the quantity being reported. It's one of the most common silent errors in long-term environmental datasets.",
    ],
    plainEnglish: [
      "Percent saturation and mg/L both measure dissolved oxygen, but they're not the same number. Percent saturation tells you what fraction of the water's maximum possible oxygen content is actually present; mg/L tells you the absolute mass of oxygen per litre. The conversion between them depends on water temperature, warm water holds less oxygen, so 100% saturation in summer corresponds to fewer mg/L than 100% saturation in winter.",
      "Before combining data from multiple instruments, multiple sites, or multiple time periods, you must verify that every column represents the same quantity in the same units. If not, convert everything to one standard unit before doing any analysis.",
    ],
    analogy: [
      "It is like two people arguing about who ran farther, but one measured in miles and the other in kilometers, and both are quietly assuming the numbers already mean the same thing. Until you convert them onto the same scale, you are not comparing distances, you are just comparing two different units that happen to look like numbers.",
    ],
    math: {
      intro: "Converting dissolved oxygen from percent saturation to mg/L:",
      equations: [
        {
          label: "DO conversion (simplified)",
          latex:
            "\\text{DO}_{\\text{mg/L}} \\approx \\frac{\\text{DO}_{\\%}}{100} \\cdot \\text{DO}_{\\text{sat}}(T)",
          explanation:
            "DO_sat(T) is the saturation concentration at temperature T (°C), approximately 14.6 mg/L at 0°C and 7.6 mg/L at 30°C. Multiply percent saturation by this temperature-dependent maximum.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "unit_conversion.py",
        snippet: `import pandas as pd
import numpy as np

df = pd.read_csv("WQ09_DO_combined.csv", parse_dates=["timestamp"])

# DO saturation concentration as a function of temperature (simplified)
def do_sat_mgL(temp_C):
    # Benson & Krause (1984) approximation
    return 14.621 - 0.3898 * temp_C + 0.006969 * temp_C**2 - 0.00005898 * temp_C**3

# Flag which rows use old probe (percent saturation) vs new probe (mg/L)
old_probe_mask = df["timestamp"] < "2022-07-14"

# Convert old probe readings from % to mg/L
df.loc[old_probe_mask, "DO_mgL"] = (
    df.loc[old_probe_mask, "DO_raw"] / 100.0
    * do_sat_mgL(df.loc[old_probe_mask, "temp_C"])
)

# New probe readings are already in mg/L
df.loc[~old_probe_mask, "DO_mgL"] = df.loc[~old_probe_mask, "DO_raw"]

print("Units harmonised. DO range after conversion:")
print(df["DO_mgL"].describe())`,
        walkthrough: [
          "do_sat_mgL() uses a polynomial approximation of the oxygen saturation curve, DO_sat depends on temperature, so we need the concurrent temperature record.",
          "We use the probe swap date (July 14, 2022, from the calibration log) to separate old and new measurements.",
          "Old readings are converted by multiplying (percent/100) × DO_sat(T); new readings pass through unchanged.",
          "After conversion, both halves of the dataset live in the same unit, mg/L, and the artificial 'drop' at the swap date disappears.",
        ],
      },
    ],
    researchConnection: [
      "Unit inconsistency errors have appeared in peer-reviewed papers and caused retractions. The Mars Climate Orbiter spacecraft was lost in 1999 because one engineering team used metric units and another used imperial, the same category of error that causes real harm in environmental datasets when different time periods or instruments record the same variable in different units without documentation.",
    ],
    quiz: [
      {
        question:
          "A long-term dissolved oxygen dataset shows an apparent 30% drop on the exact date the probe model was replaced. The most likely explanation is:",
        options: [
          "A sudden real pollution event",
          "A unit or calibration change between the old and new probe models",
          "Seasonal warming",
          "Data entry error",
        ],
        correctIndex: 1,
        explanation:
          "Step-changes on instrument replacement dates are a unit or calibration inconsistency signature. Real environmental changes are almost never this abrupt or exactly timed to maintenance events.",
      },
    ],
    challenge: {
      prompt:
        "The old WQ-09 probe recorded 88% saturation at a water temperature of 18°C. Using the formula from this lesson, convert this to mg/L. (Use the simplified DO_sat values: at 18°C, DO_sat ≈ 9.5 mg/L.)",
      hint: "DO_mg/L ≈ (88/100) × 9.5",
    },
    teachBack: {
      prompt:
        "Explain why a unit conversion error is more dangerous than an obvious sensor failure, and what you'd put in a monitoring plan to prevent it.",
    },
  },
];
