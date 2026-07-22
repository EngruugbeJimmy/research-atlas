import type { Lesson } from "@/lib/missions/types";

export const mission08Lessons: Lesson[] = [
  {
    id: "08-1-the-problem-of-space",
    missionId: "08-spatial-analysis-and-gis",
    order: 1,
    title: "The Problem of Space",
    durationMinutes: 13,
    story: [
      "Your supervisor pins a printed map to the wall: fifteen coloured dots marking Bluewater Basin's groundwater monitoring wells, each with a number, the nitrate concentration measured last month. The dots range from 2.8 mg/L near the forest reserve to 13.2 mg/L at well GW-14, near the agricultural zone.",
      "A policymaker across the table points to a gap between wells GW-14 and GW-06, roughly 8 kilometres of unmonitored aquifer. 'What's the nitrate level there?' she asks. Your regression model can't answer this: it predicts a number from other variables, not from spatial position. A different kind of model is needed, one that understands that nearby things tend to be more similar than distant things.",
    ],
    plainEnglish: [
      "Spatial analysis exploits a powerful and empirically well-supported idea called Tobler's First Law of Geography: 'everything is related to everything else, but near things are more related than distant things.' In practice, this means a well 200 metres from GW-14 is far more likely to have similar nitrate levels than a well 8 kilometres away.",
      "The field that formalises this intuition is geostatistics (the study of how measurements vary and relate to each other across physical space). Rather than ignoring spatial position, geostatistics treats location as a fundamental variable and models not just values but the spatial structure of their variation, how similarity decays with distance.",
    ],
    analogy: [
      "Think about how loud music sounds as you walk away from a speaker at a party. Right next to it, it is deafening. A few steps away, it is a bit quieter. Across the yard, you can barely hear it. Nitrate levels near a well behave the same way, values close to a known measurement tend to resemble it, and that resemblance fades the farther away you go.",
    ],
    researchConnection: [
      "Tobler's First Law is one of the most cited concepts in all of geography, and it underlies everything from weather forecasting (nearby weather stations are correlated) to remote sensing (adjacent pixels share information) to environmental modelling (contamination spreads in spatially structured patterns). Recognising when your data has spatial structure, and accounting for it, is one of the most frequently missed steps in environmental data analysis.",
    ],
    quiz: [
      {
        question: "What does Tobler's First Law of Geography state?",
        options: [
          "Every location on Earth is equally important",
          "Near things tend to be more similar to each other than distant things",
          "Space can be ignored if you have enough samples",
          "Spatial data always follows a normal distribution",
        ],
        correctIndex: 1,
        explanation: "Tobler's First Law formalises the intuition that spatial proximity implies statistical similarity, the foundation of geostatistics.",
      },
    ],
    challenge: {
      prompt: "Look at the kriging simulation. GW-14 has 13.2 mg/L. Without touching the simulation, predict whether the unmonitored area directly between GW-14 and GW-08 (8.6 mg/L) will be closer to 8.6, 13.2, or some value between them. Then check with the simulation.",
      hint: "Apply Tobler's Law: what do you expect about a point equidistant from both wells?",
    },
    teachBack: {
      prompt: "Explain Tobler's First Law of Geography using temperature as your example instead of nitrate.",
    },
  },
  {
    id: "08-2-spatial-autocorrelation",
    missionId: "08-spatial-analysis-and-gis",
    order: 2,
    title: "Spatial Autocorrelation",
    durationMinutes: 16,
    story: [
      "Before you interpolate anything, you need to check whether there actually is spatial structure in the Bluewater Basin nitrate data, or whether the well values are randomly scattered with no spatial pattern. If nitrate concentrations are spatially random, kriging would be meaningless. If they're spatially clustered, high near high, low near low, kriging will work.",
      "Your supervisor introduces the test for this: Moran's I (a single number that says whether nearby wells look more alike than random chance would explain), a statistic that measures whether nearby wells are more similar than you'd expect by chance. You run it on the fifteen well values and get I = 0.71, with a p-value of 0.003. High positive value, highly significant: the basin's nitrate is spatially clustered, not random.",
    ],
    plainEnglish: [
      "Moran's I ranges from -1 to +1. Positive values (like our 0.71) mean nearby locations tend to have similar values, spatial clustering. Negative values mean nearby locations tend to have dissimilar values, a checkerboard pattern. Zero means no spatial pattern at all.",
      "The p-value from a permutation test answers: if you randomly shuffled all the well values among the fifteen locations, how often would you get a Moran's I this high or higher? With p=0.003, it would happen by chance only 0.3% of the time, strong evidence that the spatial pattern is real, not coincidental.",
    ],
    analogy: [
      "Imagine shuffling a deck of cards labeled with everyone's height and dealing them out to random seats in a classroom. If tall kids still ended up sitting mostly next to other tall kids, you would be suspicious the shuffle did not really happen at random. That suspicion is exactly what the p-value here is measuring.",
    ],
    math: {
      intro: "Moran's I compares each pair of locations using a spatial weights matrix W, where w_ij encodes how 'connected' locations i and j are (often 1 if they're close, 0 otherwise):",
      equations: [
        {
          label: "Moran's I",
          latex: "I = \\frac{n}{\\sum_{i}\\sum_{j} w_{ij}} \\cdot \\frac{\\sum_{i}\\sum_{j} w_{ij}(z_i - \\bar{z})(z_j - \\bar{z})}{\\sum_i (z_i - \\bar{z})^2}",
          explanation: "z_i and z_j are nitrate values at wells i and j; z̄ is the mean across all wells; w_ij is 1 if the wells are considered 'neighbours' and 0 otherwise. I ≈ +1 when neighbours have similar values; I ≈ -1 when they're dissimilar.",
        },
      ],
    },
    simulation: {
      component: "spatial-explorer",
      caption: "Toggle between nitrate, dissolved oxygen, and conductivity. Does the spatial pattern look clustered or random for each variable?",
    },
    code: [
      {
        language: "python",
        filename: "spatial_autocorrelation.py",
        snippet: `import libpysal
from esda.moran import Moran
import geopandas as gpd

wells_gdf = gpd.read_file("bluewater_wells.geojson")

# Build a spatial weights matrix: each well 'neighbours' its k nearest wells
w = libpysal.weights.KNN.from_dataframe(wells_gdf, k=4)
w.transform = "r"  # row-standardise: each row sums to 1

# Moran's I for nitrate
moran = Moran(wells_gdf["nitrate_mgl"], w, permutations=999)
print(f"Moran's I: {moran.I:.4f}")
print(f"p-value (permutation): {moran.p_sim:.4f}")
print(f"z-score: {moran.z_sim:.4f}")`,
        walkthrough: [
          "KNN.from_dataframe builds the weights matrix by connecting each well to its 4 nearest neighbours, a common choice for sparse monitoring networks.",
          "Row-standardising (transform='r') makes each well's neighbours contribute equally regardless of how many they have.",
          "permutations=999 means we randomly shuffle the data 999 times to build the null distribution, the p_sim value tells us how often a random shuffle beats our observed I.",
          "A z-score above ~2.0 confirms the pattern is statistically significant.",
        ],
      },
    ],
    researchConnection: [
      "Moran's I is routinely used to diagnose spatial autocorrelation before any spatial model is built. It's also used to check residuals after a model is fitted, if the residuals are still spatially correlated, the model hasn't fully captured the spatial structure, and its confidence intervals will be too narrow.",
    ],
    quiz: [
      {
        question: "Moran's I = 0.71 for Bluewater Basin nitrate. What does this mean?",
        options: [
          "71% of wells have nitrate above the threshold",
          "Nearby wells tend to have similar nitrate values, strong spatial clustering",
          "The nitrate data is 71% accurate",
          "The wells are 71% of the way to perfect spatial coverage",
        ],
        correctIndex: 1,
        explanation: "High positive Moran's I means nearby wells are more similar than chance would predict, the spatial pattern is clustered.",
      },
    ],
    challenge: {
      prompt: "If Moran's I for Bluewater Basin nitrate were 0.02 with p = 0.62, what would that tell you about whether kriging was appropriate, and what would you do instead?",
      hint: "Low I, high p-value means no detectable spatial pattern. If location doesn't predict the value, distance-weighted interpolation won't work well.",
    },
    teachBack: {
      prompt: "Explain why you'd bother checking spatial autocorrelation before interpolating, rather than just kriging directly.",
    },
  },
  {
    id: "08-3-variograms",
    missionId: "08-spatial-analysis-and-gis",
    order: 3,
    title: "Variograms: Measuring How Similarity Decays",
    durationMinutes: 18,
    story: [
      "Kriging needs to know exactly how the similarity between two wells decays with distance, and that relationship needs to be quantified, not guessed. The tool that describes it is the variogram (a chart that shows how quickly two measurements stop resembling each other as the distance between them grows). You spend an afternoon calculating the semivariance between every pair of wells in the basin at every separation distance, then plotting the result. The shape that emerges looks like a rising curve that eventually flattens, near pairs are similar, distant pairs are not, and beyond a certain range, they're no more correlated than random strangers.",
    ],
    analogy: [
      "Think of dropping a stone in a pond and watching the ripples. Right where the stone lands, the water moves a lot. A little farther out, it still moves, just a bit less. Far enough away, the water is completely still again. A variogram is a chart of exactly that fade-out, except instead of ripples it is tracking how much nitrate values differ as distance grows.",
    ],
    plainEnglish: [
      "The experimental variogram is built by taking every pair of wells, computing the squared difference in their nitrate values, halving it (hence 'semi'-variance), and plotting it against the distance between them. Nearby wells have small squared differences (low semivariance), far-apart wells have larger differences (higher semivariance).",
      "Three numbers summarise the variogram shape: the nugget (the semivariance at distance zero, non-zero if there's measurement error or fine-scale variability), the sill (the plateau semivariance reached at large distances), and the range (the distance at which semivariance stops increasing, beyond the range, the wells are no longer spatially correlated).",
    ],
    math: {
      intro: "The experimental semivariance γ(h) at separation distance h is the average squared difference between all well pairs separated by approximately h:",
      equations: [
        {
          label: "Experimental semivariogram",
          latex: "\\hat{\\gamma}(h) = \\frac{1}{2|N(h)|} \\sum_{(i,j) \\in N(h)} [z_i - z_j]^2",
          explanation: "N(h) is the set of all pairs of wells separated by distance h (within a tolerance band). z_i and z_j are the nitrate values at those wells. The factor of 1/2 is the 'semi' in semivariance.",
        },
        {
          label: "Exponential variogram model",
          latex: "\\gamma(h) = c_0 + (c_1 - c_0)\\left(1 - e^{-h/a}\\right)",
          explanation: "c₀ is the nugget, c₁ is the sill, and a is the practical range parameter. This smooth curve is fitted to the experimental points and used by the kriging algorithm to assign weights.",
        },
      ],
    },
    simulation: {
      component: "kriging-explorer",
      caption: "Adjust the influence range, notice how the prediction surface changes as you expand the range, effectively changing the variogram's range parameter.",
    },
    code: [
      {
        language: "python",
        filename: "variogram.py",
        snippet: `import numpy as np
from skgstat import Variogram

# Well coordinates and nitrate values
coords = wells_gdf[["x_utm", "y_utm"]].values
nitrate = wells_gdf["nitrate_mgl"].values

# Fit an exponential variogram model
V = Variogram(
    coordinates=coords,
    values=nitrate,
    model="exponential",
    n_lags=8,
)

print(f"Nugget:  {V.parameters[2]:.3f} (mg/L)²")
print(f"Sill:    {V.parameters[0]:.3f} (mg/L)²")
print(f"Range:   {V.parameters[1]:.0f} m")
print(f"RMSE of variogram fit: {V.rmse:.4f}")

V.plot()  # Shows experimental points and fitted curve`,
        walkthrough: [
          "Variogram() takes UTM coordinates (metres) and nitrate values, computes all pairwise distances and squared differences, and bins them.",
          "model='exponential' fits the standard exponential variogram curve to the experimental points.",
          "The three parameters (sill, range, nugget) are what kriging will use to assign spatial weights, the range tells it how far spatial correlation extends.",
          "V.plot() gives the diagnostic plot you always check: are the experimental points following the model curve smoothly?",
        ],
      },
    ],
    researchConnection: [
      "Variogram fitting is one of the most craft-dependent steps in geostatistics, there's no single right answer, and expert practitioners often disagree on the best model. The choice of variogram model (exponential, Gaussian, spherical) and its parameters can meaningfully change the kriging predictions, which is why publishing variogram diagnostics is standard practice in environmental science papers using spatial interpolation.",
    ],
    quiz: [
      {
        question: "The variogram range for Bluewater Basin nitrate is 4,200 m. What does this mean practically?",
        options: [
          "Nitrate measurements are reliable within 4,200 m of a well",
          "Wells more than 4,200 m apart show no more similarity than random pairs, spatial correlation doesn't extend beyond this distance",
          "The kriging prediction grid must use 4,200 m cell size",
          "Nitrate cannot travel more than 4,200 m through the aquifer",
        ],
        correctIndex: 1,
        explanation: "The range is the distance at which semivariance plateaus, beyond it, pairs are essentially uncorrelated. Distance beyond the range contributes no additional information to interpolation.",
      },
    ],
    challenge: {
      prompt: "If Bluewater Basin had a very high nugget (close to the sill value) in its variogram, what would that tell you about the spatial structure of the data and the reliability of kriging predictions?",
      hint: "High nugget means the data looks almost random at short distances, there's little 'smooth' spatial structure to exploit.",
    },
    teachBack: {
      prompt: "Explain the nugget, sill, and range of a variogram to a hydrologist colleague using a physically intuitive interpretation for each term.",
    },
  },
  {
    id: "08-4-ordinary-kriging",
    missionId: "08-spatial-analysis-and-gis",
    order: 4,
    title: "Ordinary Kriging",
    durationMinutes: 20,
    story: [
      "With the variogram fitted, you have everything needed for ordinary kriging (a smart way of estimating a value at an unmeasured spot by carefully weighing all the nearby known measurements): an estimate of how spatial correlation decays with distance, and a set of known well values. Kriging combines these to predict nitrate at any unmonitored point, not by a simple distance-weighted average, but by solving a small system of equations that optimally weights each well according to both its distance from the prediction point and its correlation with all the other wells.",
      "The result is a complete nitrate map of the aquifer, and crucially, a matching uncertainty map showing exactly where your predictions are reliable and where they're speculative. The policymaker who asked about the gap between GW-14 and GW-06 now has her answer.",
    ],
    analogy: [
      "Picture guessing the temperature at a spot on a map using three nearby weather stations. You would not just average the three numbers evenly, you would give more weight to the closest station and less to the ones farther away or clustered together telling you the same thing twice. Kriging is that weighting process, done with exact math instead of a gut feeling.",
    ],
    plainEnglish: [
      "What makes kriging 'optimal' is that the weights it assigns to each well are chosen to minimise the expected prediction error, the kriging variance. A well directly adjacent to the prediction point gets high weight. A well far away gets low weight. But also: a well that's positioned close to another well provides less unique information, so it's down-weighted relative to a well that 'covers' a different part of the basin.",
      "The kriging standard error at each prediction point gives you the uncertainty of that prediction. Near a well, the standard error is small. In the middle of a large monitoring gap, like between GW-14 and GW-06, the standard error is large. This is not a failure of kriging; it's an honest quantification of what you don't know.",
    ],
    math: {
      intro: "Ordinary kriging finds weights λ_i for each well that minimise prediction variance, subject to the constraint that the weights sum to 1:",
      equations: [
        {
          label: "Kriging prediction",
          latex: "\\hat{z}(x_0) = \\sum_{i=1}^{n} \\lambda_i z(x_i)",
          explanation: "The prediction at unmonitored location x₀ is a weighted average of the n well values z(x_i). The weights λ_i are not arbitrary, they're computed from the variogram.",
        },
        {
          label: "Kriging variance (uncertainty)",
          latex: "\\sigma^2_K(x_0) = c_0 + c_1 - \\sum_{i=1}^{n} \\lambda_i \\gamma(x_i, x_0)",
          explanation: "σ²_K is the prediction uncertainty at x₀. It equals the sill minus the weighted sum of semivariances between x₀ and each well. Points far from all wells, or in clusters of closely-spaced wells, have higher uncertainty.",
        },
      ],
    },
    simulation: {
      component: "kriging-explorer",
      caption: "Hover each well to see its influence radius. The colour map shows predicted nitrate, note how uncertainty would be highest in the gaps between wells.",
    },
    code: [
      {
        language: "python",
        filename: "kriging.py",
        snippet: `from pykrige.ok import OrdinaryKriging
import numpy as np

# Fit ordinary kriging using the exponential variogram we built
OK = OrdinaryKriging(
    wells_gdf["x_utm"],
    wells_gdf["y_utm"],
    wells_gdf["nitrate_mgl"],
    variogram_model="exponential",
    variogram_parameters={
        "psill": 12.8,   # sill from our variogram fit
        "range": 4200,   # range in metres
        "nugget": 1.1,   # nugget from our variogram fit
    },
    verbose=False,
)

# Predict on a fine grid over the basin
x_grid = np.linspace(x_min, x_max, 100)
y_grid = np.linspace(y_min, y_max, 100)
z_pred, z_var = OK.execute("grid", x_grid, y_grid)

print("Mean predicted nitrate:", z_pred.mean().round(2), "mg/L")
print("Max kriging std error: ", np.sqrt(z_var).max().round(3))
# z_var is kriging variance; sqrt gives standard error in same units as nitrate`,
        walkthrough: [
          "OrdinaryKriging takes the well coordinates, values, and pre-fitted variogram parameters.",
          "execute('grid', ...) predicts over every point on the 100×100 grid covering the basin.",
          "z_pred is the nitrate surface; z_var is the kriging variance at every grid point, the square root gives standard error in mg/L.",
          "Large z_var values identify monitoring gaps, locations where adding a new well would most reduce prediction uncertainty.",
        ],
      },
    ],
    researchConnection: [
      "Kriging maps and their associated uncertainty surfaces are standard outputs in hydrogeological contamination assessments. Regulatory bodies often require both the predicted concentration map and the standard error map before deciding whether remediation is warranted, because a prediction of 'contaminated' with high uncertainty warrants more sampling before expensive intervention.",
    ],
    quiz: [
      {
        question: "What does a high kriging standard error at a prediction point mean?",
        options: [
          "The kriging algorithm made an error",
          "Nitrate is very high at that point",
          "The prediction is uncertain, the point is far from wells or in a data-sparse region",
          "The variogram was fitted incorrectly",
        ],
        correctIndex: 2,
        explanation: "Kriging standard error quantifies spatial prediction uncertainty, it's high where monitoring coverage is sparse, not where the predicted value is high.",
      },
    ],
    challenge: {
      prompt: "Using the kriging simulation, identify the location in Bluewater Basin where adding a single new well would most reduce prediction uncertainty, describe its position relative to existing wells.",
      hint: "Look for the largest gap between existing wells in the part of the basin with the highest predicted nitrate concentrations.",
    },
    teachBack: {
      prompt: "A policymaker asks 'how confident are you in the nitrate prediction for the area between GW-14 and GW-06?' Explain kriging uncertainty in plain language.",
    },
  },
];
