import type { SimulationKey } from "@/components/simulations/registry";

export interface SimulationEntry {
  slug: string;
  title: string;
  field: string;
  description: string;
  component: SimulationKey;
}

export const simulations: SimulationEntry[] = [
  {
    slug: "darcys-law",
    title: "Darcy's Law Visualizer",
    field: "Hydrogeology",
    description: "Adjust hydraulic conductivity and gradient to see how fast groundwater moves through Bluewater Basin's aquifer, and watch q = K·(dh/dl) update live.",
    component: "darcy",
  },
  {
    slug: "regression-explorer",
    title: "Regression Explorer",
    field: "Statistics",
    description: "Fit a line to rainfall vs. streamflow data from the Bluewater River gauge. Drag the slope away from the OLS best fit and watch R² drop.",
    component: "regression",
  },
  {
    slug: "watershed-explorer",
    title: "Watershed Explorer",
    field: "GIS",
    description: "Click anywhere on the basin and trace exactly where a raindrop landing there would flow, cell by cell, to the outlet.",
    component: "watershed",
  },
  {
    slug: "contour-builder",
    title: "Contour Builder",
    field: "GIS",
    description: "Drag an elevation threshold to draw your own contour line across the basin's terrain — see exactly what a contour line traces.",
    component: "contour-builder",
  },
  {
    slug: "distribution-explorer",
    title: "Distribution Explorer",
    field: "Statistics",
    description: "Adjust skewness and sample size to see how Bluewater Basin's nitrate distribution changes — and when the mean diverges from the median.",
    component: "distribution-explorer",
  },
  {
    slug: "timeseries-explorer",
    title: "Time Series Explorer",
    field: "EDA",
    description: "Toggle trend, seasonal, and residual layers on the Bluewater Basin nitrate time series to see what each component contributes to the signal.",
    component: "timeseries-explorer",
  },
  {
    slug: "spatial-explorer",
    title: "Spatial Data Explorer",
    field: "GIS",
    description: "Explore Bluewater Basin nitrate, dissolved oxygen, and conductivity mapped across all fifteen monitoring wells.",
    component: "spatial-explorer",
  },
  {
    slug: "random-forest",
    title: "Random Forest Explorer",
    field: "Machine Learning",
    description: "Grow trees one at a time and watch the ensemble vote on flood risk. See feature importance stabilise as the forest grows.",
    component: "random-forest",
  },
  {
    slug: "variogram-explorer",
    title: "Variogram Explorer",
    field: "Geostatistics",
    description: "Fit nugget, sill, and range parameters to the experimental semivariogram computed from Bluewater Basin's fifteen monitoring wells.",
    component: "variogram-explorer",
  },
  {
    slug: "kriging-explorer",
    title: "Kriging Explorer",
    field: "Geostatistics",
    description: "Adjust the influence range and distance power to interpolate nitrate concentrations between wells. Hover each well to see its influence radius.",
    component: "kriging-explorer",
  },
  {
    slug: "hydrograph-explorer",
    title: "Hydrograph Explorer",
    field: "Hydrology",
    description: "Adjust lag time, peak magnitude, and baseflow to see how Bluewater River responds to three rainfall events over 72 hours.",
    component: "hydrograph-explorer",
  },
  {
    slug: "neural-net-explorer",
    title: "Physics-Informed Fit Explorer",
    field: "Physics-Informed ML",
    description: "Blend a flexible data-only curve with Darcy's Law's monotonic drawdown constraint, and watch physically impossible fits disappear.",
    component: "neural-net-explorer",
  },
  {
    slug: "uncertainty-explorer",
    title: "Uncertainty Explorer",
    field: "Bayesian Statistics",
    description: "Bootstrap the rainfall-streamflow regression and watch the honest prediction interval emerge from an ensemble of resampled fits.",
    component: "uncertainty-explorer",
  },
];

export function getSimulation(slug: string) {
  return simulations.find((s) => s.slug === slug);
}
