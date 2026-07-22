import type { Lesson } from "@/lib/missions/types";

export const mission02Lessons: Lesson[] = [
  {
    id: "02-1-why-sampling-matters",
    missionId: "02-collecting-environmental-data",
    order: 1,
    title: "Why Sampling Matters",
    durationMinutes: 13,
    story: [
      "The Bluewater Basin Research Station has fifteen groundwater monitoring wells spread across the watershed. Your supervisor tells you this with obvious pride, it took three years of fieldwork and two rounds of grant funding to install them all. Then she asks the question that stops you cold: 'If we'd put them all in the same corner of the basin, would that tell us anything useful about the whole watershed?'",
      "The answer is no. But almost every bad environmental dataset in history, data that led to incorrect conclusions and misspent policy dollars, came from exactly this mistake: measuring in the easy places, not the right places.",
    ],
    plainEnglish: [
      "Sampling is choosing which measurements to take from a larger system you can't measure entirely. You'll never install a sensor at every square metre of Bluewater Basin, so where you do install them determines what you can truthfully claim to know.",
      "A good sample is representative (it captures the range of conditions that actually exist in the system). A bad sample is biased (it over-represents convenient or interesting locations and quietly ignores everything else). The dangerous thing about a biased sample is that the data it produces looks just as 'clean' as data from a good sample, the bias is invisible in the numbers themselves.",
    ],
    analogy: [
      "Imagine grading how much a class likes broccoli, but you only ask the three kids sitting closest to the salad bar. You will get a clean, confident number. It will also be completely wrong about the rest of the class. Where you choose to ask matters just as much as how many people you ask.",
    ],
    researchConnection: [
      "Sampling design is one of the most consequential decisions in any environmental study. The celebrated 'reproducibility crisis' in science, where many published results couldn't be replicated, is partly attributable to convenience sampling: testing only in accessible locations, recruiting only the people who showed up, or measuring only on days when weather was cooperative. The statistical methods in later missions can only be as trustworthy as the sampling design behind them.",
    ],
    quiz: [
      {
        question: "What makes a sample biased?",
        options: [
          "It contains too many data points",
          "It over-represents some parts of the system while under-representing others, in a way that isn't random",
          "It was collected in the field rather than in a lab",
          "It uses continuous rather than discrete measurements",
        ],
        correctIndex: 1,
        explanation:
          "Bias is systematic, non-random under- or over-representation. Random sampling errors average out; biases do not.",
      },
      {
        question: "Why can't you detect sampling bias just by looking at the data spreadsheet?",
        options: [
          "You can, biased data always contains obvious errors",
          "Because bias is about what's missing from the data, not what's in it",
          "Because environmental data is always noisy",
          "Because spreadsheets don't show location information",
        ],
        correctIndex: 1,
        explanation:
          "A biased dataset looks numerically normal, the problem is that the un-sampled areas are simply absent, invisible in the numbers.",
      },
    ],
    challenge: {
      prompt:
        "Look at the map of Bluewater Basin's fifteen wells. Identify one part of the watershed that appears under-sampled, somewhere you'd add a sixteenth well if you could. Explain why that location matters.",
      hint:
        "Think about where the agricultural runoff would most likely reach groundwater, is there a well near that transition zone?",
    },
    teachBack: {
      prompt:
        "Explain the difference between a 'representative' and a 'convenient' sample, using an example from outside Bluewater Basin.",
    },
  },
  {
    id: "02-2-sampling-designs",
    missionId: "02-collecting-environmental-data",
    order: 2,
    title: "Sampling Designs",
    durationMinutes: 16,
    story: [
      "Before Bluewater Basin's rain gauge network was installed, someone had to decide where to put each gauge. Three different researchers argued for three different approaches. The argument lasted two weeks and, in the end, changed where six of the gauges now stand. That argument, about sampling design, is one of the most practically important decisions in environmental science.",
    ],
    plainEnglish: [
      "Random sampling places instruments purely by chance across the study area, no location is more likely to be chosen than any other. It protects against unconscious bias but may, by chance, leave whole regions unmeasured.",
      "Systematic sampling places instruments on a regular grid, every 2 kilometres, say. It guarantees coverage but can accidentally miss patterns that repeat at exactly the same spacing as the grid.",
      "Stratified sampling divides the study area into meaningful zones first, ridge, valley floor, wetland, farmland, then samples within each zone. It's more work but ensures important sub-regions are represented, regardless of their area.",
      "In practice, Bluewater Basin uses a stratified-random design: the basin was divided into five land-cover zones, and within each zone, instrument locations were chosen randomly. This gives both systematic coverage and protection against unconscious placement bias.",
    ],
    analogy: [
      "Picture handing out one cupcake to a classroom. Random sampling is closing your eyes and pointing. Systematic sampling is giving one to every third kid in line. Stratified sampling is making sure you give one to a kid at every single table first, then handing out the rest randomly, so no table gets skipped by chance.",
    ],
    math: {
      intro:
        "The minimum number of samples needed to estimate a mean to within a desired margin of error depends on the variability of what you're measuring.",
      equations: [
        {
          label: "Minimum sample size",
          latex: "n \\geq \\left(\\frac{z_{\\alpha/2} \\cdot \\sigma}{E}\\right)^2",
          explanation:
            "n is the number of samples needed; z_{α/2} is a constant from the normal distribution (≈1.96 for 95% confidence); σ is the standard deviation of the measurements; E is the maximum acceptable error in your estimate.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "sampling_plan.py",
        snippet: `import numpy as np

# Known variability in nitrate (mg/L) from pilot measurements
sigma = 2.4

# Desired precision: estimate the mean to within ±0.5 mg/L
E = 0.5

# 95% confidence: z = 1.96
z = 1.96

n_required = np.ceil((z * sigma / E) ** 2)
print(f"Minimum samples required: {int(n_required)}")
# With this sigma and E, you need ~89 samples for 95% CI of ±0.5 mg/L`,
        walkthrough: [
          "sigma is the standard deviation, how spread out nitrate values are across the basin, estimated from a small pilot study.",
          "E is the precision we want: we're happy if our estimate of the true mean is within ±0.5 mg/L.",
          "z = 1.96 is the 95% confidence constant, we want to be 95% sure our estimate is within E of the truth.",
          "The formula squares the ratio of variability to precision, giving the minimum sample count.",
        ],
      },
    ],
    researchConnection: [
      "Environmental monitoring agencies, the USGS, Environment Agency in the UK, the European Environment Agency, all use variants of stratified or systematic sampling for their national monitoring networks. The formula above, or variations of it, appears in the design documentation for many of those networks.",
    ],
    quiz: [
      {
        question: "Bluewater Basin uses a 'stratified-random' design. What does that mean?",
        options: [
          "Instruments are placed randomly everywhere with no structure",
          "The basin is divided into zones first, then instruments are placed randomly within each zone",
          "Instruments are placed at regular grid intervals",
          "The most important zones get more sensors than others",
        ],
        correctIndex: 1,
        explanation:
          "Stratified-random combines the coverage guarantee of stratification with the bias-protection of random placement within each stratum.",
      },
      {
        question:
          "If the standard deviation of nitrate measurements doubles, what happens to the minimum required sample size?",
        options: [
          "It stays the same, standard deviation doesn't affect sample size",
          "It doubles",
          "It quadruples (increases by a factor of 4)",
          "It halves",
        ],
        correctIndex: 2,
        explanation:
          "Because n ∝ σ², doubling σ multiplies n by 2² = 4. More variable systems require disproportionately more samples.",
      },
    ],
    challenge: {
      prompt:
        "Bluewater Basin has a new research question: estimating average dissolved oxygen across the wetland zone specifically (not the whole basin). The pilot study found σ = 1.1 mg/L in the wetland. How many wetland samples are needed for ±0.25 mg/L precision at 95% confidence? Use the formula from this lesson.",
      hint:
        "Plug σ = 1.1, E = 0.25, z = 1.96 into the formula and round up to the nearest whole number.",
    },
    teachBack: {
      prompt:
        "Explain to a non-scientist colleague why it matters which sampling design you use, use the Bluewater Basin rain gauge placement argument as your example.",
    },
  },
  {
    id: "02-3-sensor-networks-and-metadata",
    missionId: "02-collecting-environmental-data",
    order: 3,
    title: "Sensor Networks & Metadata",
    durationMinutes: 14,
    story: [
      "Your supervisor hands you a USB drive containing five years of water quality data from Bluewater Basin's sensors. Then she asks you to confirm which sensor collected which file. You look at the filenames: WQ_data_final_v2_USE_THIS.csv. WQ_data_final_v3_CORRECTED.csv. WQ_data_backup_old.csv.",
      "You spend the rest of the morning trying to reconstruct what each file actually contains. 'This,' she says when you emerge, defeated, 'is why we have metadata.'",
    ],
    plainEnglish: [
      "Metadata (data that describes other data, like a label on a jar) is data about data. For each sensor in Bluewater Basin, the full metadata record includes: the sensor's unique identifier, its GPS coordinates, the date it was installed, the date of its last calibration, the measurement units it reports in, its sampling frequency, and any known issues or replacements.",
      "Without metadata, raw numbers are nearly meaningless. A reading of 8.2 means nothing until you know: 8.2 what (mg/L? mS/cm?), measured where, calibrated when. Metadata is what turns a column of numbers into scientific evidence.",
      "The Bluewater Basin network follows the Climate and Forecast conventions (CF Conventions, a shared rulebook for labeling environmental data), a widely adopted standard for describing environmental datasets so that different research groups, using different software, can understand each other's data without ambiguity.",
    ],
    analogy: [
      "A number with no metadata is like a jar of leftovers in the fridge with no label. It might be soup. It might be three weeks old. Nobody can safely use it until someone writes down what it is, when it was made, and whether it is still good.",
    ],
    code: [
      {
        language: "python",
        filename: "read_sensor_metadata.py",
        snippet: `import pandas as pd

# Load the Bluewater Basin sensor registry
sensors = pd.read_csv("bluewater_sensors.csv")
print(sensors.columns.tolist())
# ['sensor_id', 'type', 'latitude', 'longitude',
#  'install_date', 'last_calibration', 'units', 'freq_minutes', 'notes']

# Find all sensors in the wetland zone
wetland_sensors = sensors[sensors["notes"].str.contains("wetland", na=False)]
print(f"Wetland sensors: {len(wetland_sensors)}")

# Check any sensor with calibration older than 1 year
sensors["last_calibration"] = pd.to_datetime(sensors["last_calibration"])
overdue = sensors[sensors["last_calibration"] < pd.Timestamp("2024-01-01")]
print("Sensors needing recalibration:", overdue["sensor_id"].tolist())`,
        walkthrough: [
          "We load the sensor registry, a CSV that stores metadata for every instrument in the network, not the measurements themselves.",
          "sensors.columns shows us exactly what metadata is recorded; this is the first check before trusting any analysis.",
          "Filtering by 'wetland' in the notes field lets us find sensors associated with a specific zone.",
          "Converting last_calibration to a datetime lets us programmatically flag sensors whose calibration is overdue, something you'd never catch just looking at the measurement data.",
        ],
      },
    ],
    researchConnection: [
      "Real environmental monitoring agencies publish sensor metadata alongside every dataset they release. The USGS National Water Information System, for example, provides station metadata, location, equipment type, calibration records, datum, as a required companion to any streamflow or water quality download. Without it, the measurements are not scientifically reusable.",
    ],
    quiz: [
      {
        question: "A water quality sensor reports a dissolved oxygen reading of 7.8. Without metadata, what can't you determine?",
        options: [
          "The measurement is in milligrams per litre",
          "Which sensor made the reading, when it was last calibrated, and whether the units are mg/L or percent saturation",
          "Whether 7.8 is a high or a low value",
          "All of the above",
        ],
        correctIndex: 3,
        explanation:
          "Without metadata you can't confirm the units, the sensor identity, its calibration status, or even what 'high' or 'low' means for that sensor type and location.",
      },
    ],
    challenge: {
      prompt:
        "Write a metadata record for one imaginary Bluewater Basin sensor of your choice, assign it an ID, a location, a measurement type, units, sampling frequency, install date, and one note about any known issue.",
      hint:
        "Use real environmental sensor conventions: dissolved oxygen in mg/L, conductivity in µS/cm, water level in metres above datum.",
    },
    teachBack: {
      prompt:
        "Explain why metadata is not just 'extra information' but is actually part of the scientific record, using the USB drive story from this lesson.",
    },
  },
  {
    id: "02-4-field-calibration",
    missionId: "02-collecting-environmental-data",
    order: 4,
    title: "Field Calibration",
    durationMinutes: 15,
    story: [
      "The research team returns from a field trip to groundwater well GW-14, the same well with the suspected nitrate trend. They've brought back a data logger that has been recording continuously for six months. The data looks remarkable: nitrate appears to have dropped by 40% in a single week in March. A press release is being drafted.",
      "Your supervisor asks to see the calibration log first. The March logger was replaced on the 14th. The replacement unit uses a different electrode with a 12% higher sensitivity. Nobody updated the conversion factor. The 40% drop is an instrument artefact, not a real change in the water.",
    ],
    plainEnglish: [
      "Calibration (checking an instrument against a known correct answer and adjusting it) is the process of checking a sensor's readings against a known reference standard and adjusting its output accordingly. Every sensor drifts over time, chemical electrodes foul, mechanical parts wear, temperature affects electronics. Without regular calibration, a sensor's readings gradually diverge from reality, silently.",
      "A two-point calibration uses two reference standards, one at a low known value, one at a high known value, to fit a linear correction to the sensor's output. If the sensor reads 8.5 when the true value is 8.0, and reads 10.8 when the true value is 10.0, you can compute a correction slope and intercept that brings all intermediate readings back into line.",
    ],
    analogy: [
      "It is like checking a bathroom scale against two objects of known weight, say a 1kg bag of flour and a 5kg dumbbell. If the scale reads 1.1kg and 5.5kg, you now know it consistently reads about 10% high, and you can mentally correct every future reading until you fix or replace the scale.",
    ],
    math: {
      intro:
        "A two-point calibration fits a linear correction: measured = a · true + b. Inverting this gives the corrected value from any raw reading.",
      equations: [
        {
          label: "Calibration slope and intercept",
          latex: "a = \\frac{m_2 - m_1}{t_2 - t_1}, \\quad b = m_1 - a \\cdot t_1",
          explanation:
            "m₁, m₂ are the sensor's measured values at two calibration points; t₁, t₂ are the known true values. a is the slope and b the intercept of the correction.",
        },
        {
          label: "Corrected value from raw reading",
          latex: "\\text{true} = \\frac{\\text{measured} - b}{a}",
          explanation:
            "Rearranging the calibration equation: given any raw measurement, divide out the slope and subtract the intercept offset to recover the true value.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "calibrate_sensor.py",
        snippet: `# Two-point calibration for well GW-14's replacement nitrate probe
# Calibration standards (known true values in mg/L):
t1, t2 = 5.0, 20.0

# What the new probe actually reads at those standards:
m1, m2 = 5.6, 21.4

# Compute calibration coefficients
a = (m2 - m1) / (t2 - t1)
b = m1 - a * t1
print(f"Calibration: slope={a:.4f}, intercept={b:.4f}")

# Apply to raw field data
import numpy as np
raw_readings = np.array([7.2, 8.1, 9.5, 11.3, 14.0])
corrected = (raw_readings - b) / a
print("Corrected readings:", np.round(corrected, 2))`,
        walkthrough: [
          "t1 and t2 are the calibration standards, solutions with certified, known nitrate concentrations.",
          "m1 and m2 are what the probe actually reports when immersed in those standards, they should match t1 and t2 if the sensor is perfectly calibrated, but they rarely are.",
          "The slope a captures how much the sensor over- or under-reads per unit of true concentration; b is the constant offset.",
          "Applying the correction to raw_readings adjusts every measurement: slightly high readings come down, slightly low ones come up, proportionally.",
        ],
      },
    ],
    researchConnection: [
      "Calibration failures are behind many of the most costly environmental measurement errors on record, including cases where pollution events were missed, or non-existent events were reported, because sensors were used outside their calibration range or after calibration had drifted. Every major environmental monitoring standard (ISO 5667, USGS field methods guidelines) mandates calibration records as part of the data chain of custody.",
    ],
    quiz: [
      {
        question:
          "Well GW-14 shows a sudden 40% drop in nitrate in one week. Before reporting this, what should you check first?",
        options: [
          "Whether it rained that week",
          "The sensor's calibration history, especially any instrument replacements or recalibrations near that date",
          "The political sensitivity of the result",
          "Whether 40% is statistically significant",
        ],
        correctIndex: 1,
        explanation:
          "Abrupt changes, especially clean step-changes, are a classic instrument artefact signature. Calibration history is the first check before attributing any sudden jump to a real environmental event.",
      },
    ],
    challenge: {
      prompt:
        "Bluewater Basin's conductivity probe at station WQ-09 was calibrated against standards of 100 µS/cm (probe reads 103.2) and 500 µS/cm (probe reads 512.0). Compute the calibration slope a and intercept b. Then find the corrected value when the probe reads 250 µS/cm.",
      hint:
        "Use t1=100, m1=103.2, t2=500, m2=512.0 in the formula above. Then apply corrected = (250 - b) / a.",
    },
    teachBack: {
      prompt:
        "Explain to a new field technician why they must write down every instrument swap in the calibration log, even if the replacement probe seems identical to the one it replaced.",
    },
  },
  {
    id: "02-5-designing-a-monitoring-program",
    missionId: "02-collecting-environmental-data",
    order: 5,
    title: "Designing a Monitoring Program",
    durationMinutes: 15,
    story: [
      "With a sampling design, a sensor network, metadata standards, and calibration protocols in hand, your team now has everything needed to move from ad-hoc measurements to a real monitoring program, one designed, before a single measurement is collected, to answer a specific question.",
      "Your supervisor lays out the principle that ties everything together: 'The data you collect should be the minimum needed to answer your research question, collected in the way that maximizes your confidence in the answer. Every extra sensor you deploy that doesn't serve that question is money spent on noise.'",
    ],
    plainEnglish: [
      "A monitoring program is a documented plan that connects a research question to the exact data collection decisions needed to answer it: which variables to measure, where, at what frequency, using which instruments, with what QA/QC procedures, stored with what metadata format.",
      "The sampling frequency deserves special attention. Measuring nitrate once per year can tell you if it's changing slowly over decades. Measuring it once per hour can tell you if rain events cause spikes. These are different scientific questions requiring different designs, and the wrong frequency renders data useless for the question you actually care about.",
    ],
    analogy: [
      "Designing a monitoring program is like deciding how often to check on a cake in the oven. Check once at the very end and you might pull out something burnt. Check every ten seconds and you waste time and let all the heat out. You pick the checking frequency based on what you are actually trying to catch.",
    ],
    code: [
      {
        language: "python",
        filename: "monitoring_plan.py",
        snippet: `import pandas as pd

# Bluewater Basin monitoring plan, machine-readable version
plan = pd.DataFrame({
    "variable":      ["nitrate",     "dissolved_O2", "water_level",  "rainfall"],
    "sensor_type":   ["ion_probe",   "optical_DO",   "pressure_xdcr","tipping_bucket"],
    "frequency_min": [60,            15,             5,              1],
    "n_stations":    [15,            8,              12,             6],
    "zone":          ["all",         "wetland+river","river+wetland","stratified"],
    "qaqc_flag":     ["calibrate_monthly","calibrate_weekly",
                      "check_datum_monthly","clean_funnel_weekly"],
})

print(plan.to_string(index=False))

# Total data records per year
plan["records_per_year"] = (60 * 24 * 365) / plan["frequency_min"] * plan["n_stations"]
print("\\nTotal records/year:", plan["records_per_year"].astype(int).sum())`,
        walkthrough: [
          "We store the monitoring plan as a DataFrame, every measurement decision in one place, so the plan is itself documented data.",
          "frequency_min is sampling interval in minutes: nitrate every hour, DO every 15 min, rainfall every 1 min.",
          "n_stations and zone show where each variable is measured and at what density.",
          "Computing records_per_year reveals the data volume the plan generates, a reality check before committing to storage and processing infrastructure.",
        ],
      },
    ],
    researchConnection: [
      "Every peer-reviewed paper on long-term environmental monitoring includes a 'Monitoring Design' or 'Data Collection' section that documents exactly these decisions. Reviewers check whether the sampling frequency, spatial coverage, and instrument quality are adequate to support the paper's conclusions. A beautifully analysed dataset collected at the wrong frequency, or from the wrong locations, will be rejected regardless of the sophistication of the analysis.",
    ],
    quiz: [
      {
        question:
          "Your research question is: 'Do short rainfall events cause temporary nitrate spikes at well GW-14?' What minimum sampling frequency do you need for nitrate?",
        options: [
          "Once per month",
          "Once per year",
          "Hourly or more frequent, the spike could appear and disappear within hours",
          "Daily, spikes last at least 24 hours",
        ],
        correctIndex: 2,
        explanation:
          "Rainfall-driven nitrate pulses in groundwater can arrive and dissipate within hours. Daily sampling would miss the spike entirely; hourly catches it.",
      },
      {
        question:
          "What's the purpose of writing the monitoring plan before collecting any data?",
        options: [
          "To give scientists something to do before fieldwork starts",
          "To ensure the data collected can actually answer the research question, and to create a record that others can scrutinize",
          "To satisfy journal formatting requirements",
          "To estimate costs only",
        ],
        correctIndex: 1,
        explanation:
          "Pre-specified plans commit you to decisions before you see the data, protecting against p-hacking, and create the documented record that makes results reproducible.",
      },
    ],
    challenge: {
      prompt:
        "Design a monitoring plan for one specific research question you care about in Bluewater Basin: specify the variable, at least two locations, the sampling frequency, and the main QA/QC check. Write it as a brief table or list.",
      hint:
        "Choose a question from Mission 00 or 01, the hypothesis you pre-registered in Mission 00 Lesson 4 is a good starting point.",
    },
    teachBack: {
      prompt:
        "Explain the difference between 'collecting data' and 'designing a monitoring program', and why the distinction matters for the quality of conclusions you can draw.",
    },
  },
];
