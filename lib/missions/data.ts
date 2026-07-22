export type MissionStatus = "available" | "locked";

export interface MissionSummary {
  id: string;
  number: number;
  title: string;
  field: string;
  summary: string;
  skills: string[];
  station: string; // the Bluewater Basin field station this mission is set at
  estimatedMinutes: number;
  lessonCount: number;
  builtOut: boolean; // whether full lesson content exists yet (Phase 1 flag)
}

export const missions: MissionSummary[] = [
  {
    id: "00-becoming-a-researcher",
    number: 0,
    title: "Becoming a Researcher",
    field: "Scientific Thinking",
    summary:
      "Meet the Bluewater Basin watershed and the research team. Learn how scientists actually ask questions, form hypotheses, and avoid fooling themselves.",
    skills: ["Scientific method", "Hypotheses", "Research ethics", "Observation"],
    station: "Basin Field Station",
    estimatedMinutes: 45,
    lessonCount: 4,
    builtOut: true,
  },
  {
    id: "01-understanding-the-landscape",
    number: 1,
    title: "Understanding the Landscape",
    field: "GIS & Remote Sensing",
    summary:
      "Read the land like a scientist: elevation, slope, watersheds, and land cover. Build your first map of Bluewater Basin.",
    skills: ["DEMs", "Contour maps", "Watershed delineation", "Coordinate systems"],
    station: "Ridge Overlook",
    estimatedMinutes: 60,
    lessonCount: 5,
    builtOut: true,
  },
  {
    id: "02-collecting-environmental-data",
    number: 2,
    title: "Collecting Environmental Data",
    field: "Research Design",
    summary:
      "Design a sampling plan for rainfall, groundwater, and water quality stations without introducing bias.",
    skills: ["Sampling design", "Instrumentation", "Sensor networks", "Metadata"],
    station: "Rain Gauge Network",
    estimatedMinutes: 55,
    lessonCount: 5,
    builtOut: true,
  },
  {
    id: "03-cleaning-scientific-data",
    number: 3,
    title: "Cleaning Scientific Data",
    field: "Data Science",
    summary:
      "Real sensors fail, drift, and lie. Learn to detect outliers, handle missing values, and document every decision.",
    skills: ["Data QA/QC", "Missing data", "Outlier detection", "Reproducibility"],
    station: "Data Lab",
    estimatedMinutes: 60,
    lessonCount: 6,
    builtOut: true,
  },
  {
    id: "04-exploring-patterns",
    number: 4,
    title: "Exploring Patterns",
    field: "Exploratory Data Analysis",
    summary:
      "Before you model anything, look at it. Distributions, correlations, and the plots that reveal what the basin is doing.",
    skills: ["EDA", "Distributions", "Correlation", "Data visualization"],
    station: "Field Notebook",
    estimatedMinutes: 50,
    lessonCount: 5,
    builtOut: true,
  },
  {
    id: "05-scientific-statistics",
    number: 5,
    title: "Scientific Statistics",
    field: "Statistics",
    summary:
      "Hypothesis testing, confidence intervals, and p-values — grounded in whether Bluewater Basin's water quality is really changing.",
    skills: ["Hypothesis testing", "Confidence intervals", "p-values", "Statistical power"],
    station: "Water Quality Lab",
    estimatedMinutes: 70,
    lessonCount: 7,
    builtOut: true,
  },
  {
    id: "06-regression-and-prediction",
    number: 6,
    title: "Regression & Prediction",
    field: "Statistical Modelling",
    summary:
      "Predict streamflow from rainfall. Linear regression, model diagnostics, and why R² can lie to you.",
    skills: ["Linear regression", "Model diagnostics", "Multivariate regression", "GAMs"],
    station: "Streamflow Gauge",
    estimatedMinutes: 75,
    lessonCount: 7,
    builtOut: true,
  },
  {
    id: "07-machine-learning",
    number: 7,
    title: "Machine Learning",
    field: "Machine Learning",
    summary:
      "Random forests and cross-validation to predict flood risk across the basin from terrain and rainfall features.",
    skills: ["Decision trees", "Random forests", "Cross-validation", "Feature importance"],
    station: "Flood Risk War Room",
    estimatedMinutes: 80,
    lessonCount: 5,
    builtOut: true,
  },
  {
    id: "08-spatial-analysis-and-gis",
    number: 8,
    title: "Spatial Analysis & GIS",
    field: "Geostatistics",
    summary:
      "Kriging, variograms, and spatial autocorrelation to map groundwater contamination between monitoring wells.",
    skills: ["Kriging", "Variograms", "Spatial autocorrelation", "Interpolation"],
    station: "Groundwater Monitoring Grid",
    estimatedMinutes: 80,
    lessonCount: 4,
    builtOut: true,
  },
  {
    id: "09-physics-informed-ai",
    number: 9,
    title: "Physics-Informed AI",
    field: "Physics-Informed ML",
    summary:
      "Blend Darcy's Law with neural networks so predictions never violate the physics of groundwater flow.",
    skills: ["Darcy's Law", "Physics-informed ML", "Neural networks", "Hybrid modelling"],
    station: "Aquifer Simulation Lab",
    estimatedMinutes: 85,
    lessonCount: 6,
    builtOut: true,
  },
  {
    id: "10-quantifying-uncertainty",
    number: 10,
    title: "Quantifying Uncertainty",
    field: "Bayesian Statistics",
    summary:
      "Every model is wrong to some degree — learn to say precisely how much, with Bayesian credible intervals and ensembles.",
    skills: ["Bayesian inference", "Credible intervals", "Ensembles", "Calibration"],
    station: "Uncertainty Chamber",
    estimatedMinutes: 75,
    lessonCount: 6,
    builtOut: true,
  },
  {
    id: "11-scientific-communication",
    number: 11,
    title: "Scientific Communication",
    field: "Scientific Writing",
    summary:
      "Turn your analysis into a figure and a paragraph that a policymaker, and a peer reviewer, can both trust.",
    skills: ["Data visualization ethics", "Scientific writing", "Figures", "Storytelling with data"],
    station: "Communications Studio",
    estimatedMinutes: 55,
    lessonCount: 5,
    builtOut: true,
  },
  {
    id: "12-publishing-your-research",
    number: 12,
    title: "Publishing Your Research",
    field: "Open Science",
    summary:
      "Package your Bluewater Basin investigation as a reproducible, open, citable piece of research.",
    skills: ["Reproducible research", "Open data", "Preprints", "Research ethics"],
    station: "Basin Field Station — Archive Room",
    estimatedMinutes: 50,
    lessonCount: 5,
    builtOut: true,
  },
];

export function getMissionById(id: string) {
  return missions.find((m) => m.id === id);
}

export function getAdjacentMissions(id: string) {
  const index = missions.findIndex((m) => m.id === id);
  return {
    previous: index > 0 ? missions[index - 1] : undefined,
    next: index < missions.length - 1 ? missions[index + 1] : undefined,
  };
}
