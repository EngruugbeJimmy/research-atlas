import { DarcyLawSimulation } from "./darcy-law";
import { RegressionExplorer } from "./regression-explorer";
import { ContourBuilder } from "./contour-builder";
import { WatershedExplorer } from "./watershed-explorer";
import { DistributionExplorer } from "./distribution-explorer";
import { TimeseriesExplorer } from "./timeseries-explorer";
import { SpatialExplorer } from "./spatial-explorer";
import { RandomForestExplorer } from "./random-forest";
import { KrigingExplorer } from "./kriging-explorer";
import { HydrographExplorer } from "./hydrograph-explorer";
import { VariogramExplorer } from "./variogram-explorer";
import { NeuralNetExplorer } from "./neural-net-explorer";
import { UncertaintyExplorer } from "./uncertainty-explorer";

export const simulationRegistry = {
  darcy: DarcyLawSimulation,
  regression: RegressionExplorer,
  "contour-builder": ContourBuilder,
  watershed: WatershedExplorer,
  "distribution-explorer": DistributionExplorer,
  "timeseries-explorer": TimeseriesExplorer,
  "spatial-explorer": SpatialExplorer,
  "random-forest": RandomForestExplorer,
  "kriging-explorer": KrigingExplorer,
  "hydrograph-explorer": HydrographExplorer,
  "variogram-explorer": VariogramExplorer,
  "neural-net-explorer": NeuralNetExplorer,
  "uncertainty-explorer": UncertaintyExplorer,
} as const;

export type SimulationKey = keyof typeof simulationRegistry;
