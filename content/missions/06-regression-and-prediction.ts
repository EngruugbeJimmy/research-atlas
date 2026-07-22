import type { Lesson } from "@/lib/missions/types";

export const mission06Lessons: Lesson[] = [
  {
    id: "06-1-what-regression-actually-does",
    missionId: "06-regression-and-prediction",
    order: 1,
    title: "What Regression Actually Does",
    durationMinutes: 14,
    story: [
      "A hydrological engineer wants to predict streamflow at the Bluewater River gauge from rainfall, not because she can't measure streamflow directly, but because rainfall forecasts are available 72 hours ahead and streamflow sensors sometimes fail. A predictive model would let the team anticipate flood conditions before they arrive.",
      "Linear regression is the first tool she reaches for. Not because it's always the right answer, it often isn't, but because it's transparent, interpretable, and its failures are easy to diagnose.",
    ],
    plainEnglish: [
      "Regression finds the mathematical relationship between one or more input variables (predictors) and an output variable (the response). The simplest version fits a straight line: for every 1-unit increase in rainfall, streamflow increases by some amount. That 'some amount' is the slope, the thing regression estimates.",
      "Ordinary least squares (OLS, a method for drawing the single best straight line through a cloud of dots) regression finds the line that minimises the sum of squared vertical distances from each data point to the line. Those distances are residuals (the leftover gaps between what actually happened and what the line predicted). The line that makes residuals as small as possible (in a squared sense) is the best linear fit.",
    ],
    analogy: [
      "Imagine a bunch of kids standing at slightly different heights, and you want to draw one straight ramp that comes as close as possible to touching every kid's head. Regression is the process of finding exactly where to place that ramp so the total distance between the ramp and every head is as small as it can possibly be.",
    ],
    simulation: {
      component: "regression",
      caption: "Drag the slope slider away from the OLS best fit and watch R² and residuals respond, proving visually why the OLS line is optimal.",
    },
    math: {
      intro: "OLS minimises the sum of squared residuals to find the best-fit slope (β₁) and intercept (β₀).",
      equations: [
        {
          label: "Simple linear model",
          latex: "y = \\beta_0 + \\beta_1 x + \\varepsilon",
          explanation: "y is the response (streamflow), x is the predictor (rainfall), β₀ is the intercept, β₁ is the slope, and ε is the irreducible error, the part no model can explain.",
        },
        {
          label: "OLS slope",
          latex: "\\hat{\\beta}_1 = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sum(x_i - \\bar{x})^2}",
          explanation: "The covariance of x and y divided by the variance of x. This captures how much y tends to change when x changes, relative to how much x itself varies.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "simple_regression.py",
        snippet: `import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

rainfall   = np.load("bluewater_monthly_rainfall.npy").reshape(-1, 1)
streamflow = np.load("bluewater_monthly_streamflow.npy")

model = LinearRegression().fit(rainfall, streamflow)
print(f"Intercept: {model.intercept_:.3f} m³/s")
print(f"Slope:     {model.coef_[0]:.4f} m³/s per mm of rainfall")
print(f"R²:        {model.score(rainfall, streamflow):.3f}")`,
        walkthrough: [
          "reshape(-1, 1) converts the 1D array into a column vector, sklearn expects 2D input for predictors.",
          "model.coef_[0] is β̂₁: the estimated increase in streamflow (m³/s) per additional mm of rainfall.",
          "model.score() returns R², the fraction of variance in streamflow explained by the linear rainfall relationship.",
        ],
      },
    ],
    researchConnection: [
      "Rating curves, empirical relationships between water level and streamflow, are one of the oldest and most widely used applications of regression in hydrology. Every USGS and Environment Agency streamflow estimate you'll ever see was derived using regression between a measured property (stage height) and an unmeasured one (discharge). You're building the same type of model.",
    ],
    quiz: [
      {
        question: "What does OLS regression minimise?",
        options: [
          "The sum of absolute residuals",
          "The sum of squared residuals",
          "The largest residual in the dataset",
          "The sum of squared predictor values",
        ],
        correctIndex: 1,
        explanation: "OLS minimises the sum of squared residuals, squaring penalises large errors more heavily than small ones, and makes the optimisation problem analytically solvable.",
      },
    ],
    challenge: {
      prompt: "Using the regression simulation above: find the slope value that achieves the highest R². Now drag the slope to 0.05 units above the OLS value. By how much does R² drop? What does this tell you about the sensitivity of R² near its maximum?",
      hint: "R² is relatively flat near the optimum, large slope changes are needed to cause dramatic R² drops.",
    },
    teachBack: {
      prompt: "Explain to someone who has never seen regression what a residual is, using the Bluewater rainfall-streamflow example, without using the word 'regression'.",
    },
  },
  {
    id: "06-2-model-diagnostics",
    missionId: "06-regression-and-prediction",
    order: 2,
    title: "Model Diagnostics",
    durationMinutes: 16,
    story: [
      "The regression model has R² = 0.72. Your supervisor is not satisfied. 'Before you trust any R², look at the residuals,' she says. She pulls up a plot of residuals against fitted values. Instead of random scatter, there's a clear curve, residuals are positive for low and high predicted values, negative in the middle. 'That's a nonlinearity you've missed,' she says. 'The model violates its own assumptions.'",
    ],
    plainEnglish: [
      "Linear regression assumes residuals are randomly scattered around zero, no patterns. If you see patterns in the residuals, the model is wrong in some way: a curve means nonlinearity, a funnel means heteroscedasticity (variance increases with fitted value), a time pattern means autocorrelation.",
      "The four key diagnostic plots for any linear regression are: (1) residuals vs fitted values, (2) a Q-Q plot (are residuals normally distributed?), (3) scale-location (is variance constant?), and (4) residuals vs leverage (are any single points unduly influencing the fit?).",
    ],
    analogy: [
      "Checking residuals is like checking the leftover crumbs after cutting a cake into equal slices. If the crumbs are scattered randomly everywhere, your cuts were even. If crumbs pile up in one spot, something about your cutting method is off, and looking closely at the pile tells you exactly what went wrong.",
    ],
    code: [
      {
        language: "python",
        filename: "regression_diagnostics.py",
        snippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from scipy import stats

rainfall   = np.load("bluewater_monthly_rainfall.npy").reshape(-1, 1)
streamflow = np.load("bluewater_monthly_streamflow.npy")

model     = LinearRegression().fit(rainfall, streamflow)
fitted    = model.predict(rainfall)
residuals = streamflow - fitted

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

# Residuals vs fitted
axes[0].scatter(fitted, residuals, alpha=0.6)
axes[0].axhline(0, color="red", lw=1)
axes[0].set_xlabel("Fitted values"); axes[0].set_ylabel("Residuals")
axes[0].set_title("Residuals vs Fitted")

# Q-Q plot
stats.probplot(residuals, plot=axes[1])
axes[1].set_title("Normal Q-Q")

plt.tight_layout(); plt.savefig("diagnostics.png")`,
        walkthrough: [
          "fitted = model.predict() gives the model's predictions; residuals = actual − predicted.",
          "The residuals-vs-fitted plot reveals patterns that violate the linearity or homoscedasticity assumptions.",
          "A Q-Q plot compares residual quantiles to theoretical normal quantiles, deviations from the diagonal suggest non-normality.",
        ],
      },
    ],
    researchConnection: [
      "Residual diagnostics are not optional, they're part of the scientific analysis. Many published regression models in hydrology and environmental science have had their conclusions questioned or retracted because authors skipped this step. The UK Environment Agency's statistical methods guidelines explicitly require residual plots before any regression model is accepted for decision-making.",
    ],
    quiz: [
      {
        question: "Your residuals-vs-fitted plot shows a 'U' shape (high residuals at low and high fitted values, low residuals in the middle). What does this suggest?",
        options: [
          "The model fits well, U shapes are expected",
          "The true relationship is nonlinear, a straight line is missing curvature in the data",
          "You have outliers at high values",
          "The sample size is too small",
        ],
        correctIndex: 1,
        explanation: "A systematic U shape in residuals means the model systematically under- or over-predicts at certain values, a clear sign of unmodelled nonlinearity.",
      },
    ],
    challenge: {
      prompt: "You fit a regression of streamflow on rainfall and get R² = 0.68. You then check the residuals and see a clear funnel shape (small residuals for low fitted values, large ones for high). What does this mean, and what transformation might fix it?",
      hint: "A funnel = heteroscedasticity. log-transforming either the response or the predictor often stabilises variance.",
    },
    teachBack: {
      prompt: "Explain why a high R² doesn't guarantee that a regression model is valid, using the 'curved residuals' example from this lesson.",
    },
  },
  {
    id: "06-3-multiple-regression",
    missionId: "06-regression-and-prediction",
    order: 3,
    title: "Multiple Regression",
    durationMinutes: 15,
    story: [
      "Rainfall explains 72% of streamflow variance, but 28% is still unexplained. Your supervisor suggests adding more predictors: temperature (which affects evaporation), soil moisture from the previous week, and land cover fraction. 'Each new predictor should earn its place,' she says. 'Adding variables always increases R², that doesn't mean you've improved the model.'",
    ],
    plainEnglish: [
      "Multiple regression extends the simple case to multiple predictors simultaneously. Instead of one slope, there are several, each representing the change in the response associated with a one-unit change in that predictor, holding all others constant.",
      "Adding predictors always increases R², even if those predictors are random noise. Adjusted R² corrects for this by penalising model complexity. If adding a predictor doesn't improve the model enough to offset the penalty for its added complexity, adjusted R² decreases.",
    ],
    analogy: [
      "It is like adding more ingredients to a soup hoping it gets better. Adding a good ingredient improves the flavor. Adding a random handful of something pointless might not make it worse, but it will not make it better either, and now you have a more complicated recipe for no real benefit. Adjusted R² is the taste test that only rewards ingredients that actually helped.",
    ],
    math: {
      intro: "The multiple regression model generalises the simple case to p predictors.",
      equations: [
        {
          label: "Multiple linear model",
          latex: "y = \\beta_0 + \\beta_1 x_1 + \\beta_2 x_2 + \\cdots + \\beta_p x_p + \\varepsilon",
          explanation: "Each predictor xⱼ has its own coefficient βⱼ, the partial effect of xⱼ on y when all other predictors are held constant.",
        },
        {
          label: "Adjusted R²",
          latex: "R^2_{adj} = 1 - (1-R^2) \\frac{n-1}{n-p-1}",
          explanation: "n is sample size; p is the number of predictors. Adjusted R² decreases when adding weak predictors, it only increases when a new predictor genuinely improves fit relative to its cost.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "multiple_regression.py",
        snippet: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

df = pd.read_csv("bluewater_monthly_features.csv")
# Columns: rainfall, temperature, soil_moisture, ag_fraction, streamflow

X = df[["rainfall", "temperature", "soil_moisture", "ag_fraction"]]
y = df["streamflow"]

model = LinearRegression().fit(X, y)
r2      = model.score(X, y)
n, p    = len(y), X.shape[1]
r2_adj  = 1 - (1 - r2) * (n - 1) / (n - p - 1)

for name, coef in zip(X.columns, model.coef_):
    print(f"  {name:20s}: {coef:+.4f}")
print(f"R²: {r2:.3f}   Adj-R²: {r2_adj:.3f}")`,
        walkthrough: [
          "X contains all four predictors simultaneously, each gets its own coefficient.",
          "model.coef_ gives partial slopes, e.g., the rainfall coefficient now means 'effect of rainfall, holding temperature, soil moisture, and ag_fraction constant'.",
          "Comparing R² and Adj-R² reveals whether the added predictors genuinely help or just inflate the apparent fit.",
        ],
      },
    ],
    researchConnection: [
      "Multiple regression is the workhorse of environmental modelling. Rainfall-runoff models, groundwater recharge estimates, and water quality predictions in published literature almost universally use multiple predictors. The key discipline is always the same: adjusted R², cross-validation, and residual checks, not raw R².",
    ],
    quiz: [
      {
        question: "You add a fifth predictor to a model and R² increases from 0.73 to 0.741, but adjusted R² drops from 0.718 to 0.712. What does this mean?",
        options: [
          "The fifth predictor improves the model",
          "The fifth predictor is not contributing enough genuine information to justify its added complexity",
          "The model is overfitting",
          "Both b and c",
        ],
        correctIndex: 3,
        explanation: "A drop in adjusted R² when adding a predictor means it's not contributing enough genuine signal, the model complexity cost outweighs the slight R² gain. This is a classic sign of beginning overfitting.",
      },
    ],
    challenge: {
      prompt: "Your multiple regression has R² = 0.83 and Adj-R² = 0.79 with 4 predictors. You add a 5th (atmospheric pressure) and R² becomes 0.834, Adj-R² = 0.787. Should you keep atmospheric pressure? Why or why not?",
      hint: "If Adj-R² decreases, the predictor is costing more in model complexity than it's contributing in fit.",
    },
    teachBack: {
      prompt: "Explain why R² always increases when you add a predictor, even a useless one, and why adjusted R² was invented.",
    },
  },
  {
    id: "06-4-overfitting-and-cross-validation",
    missionId: "06-regression-and-prediction",
    order: 4,
    title: "Overfitting & Cross-Validation",
    durationMinutes: 16,
    story: [
      "A colleague adds ten predictors to the streamflow model, some physically meaningful, some not, and achieves R² = 0.94 on the training data. Impressed, the team prepares to deploy the model for flood forecasting. Your supervisor asks one question before approving it: 'What's its R² on data it hasn't seen?'",
      "The colleague tests it on the next year's data. R² = 0.41. The model has learned the quirks and noise of the training set so thoroughly that it fails completely on new data. This is overfitting.",
    ],
    plainEnglish: [
      "Overfitting (when a model memorizes the exact data it was shown instead of learning the general pattern) means a model has memorised the training data rather than learned the underlying relationship. It looks brilliant on data it's seen and terrible on data it hasn't. A model with too many parameters relative to the data available will almost always overfit.",
      "Cross-validation (testing a model on data it has never seen, to check if it really learned something useful) is the cure: split your data into a training set and a test set. Fit on training, evaluate on test. The model never sees the test data during fitting, its performance there is a realistic estimate of how well it will generalise to future data.",
    ],
    analogy: [
      "It is like a student who memorizes the exact answers to last year's practice test instead of learning the underlying material. They will ace that exact practice test, but bomb the real exam, which asks similar questions in a slightly different way. Cross-validation is giving the student a brand new, unseen practice test to find out whether they actually learned anything.",
    ],
    code: [
      {
        language: "python",
        filename: "cross_validation.py",
        snippet: `import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score, KFold

df = pd.read_csv("bluewater_monthly_features.csv")
X = df.drop("streamflow", axis=1)
y = df["streamflow"]

model = LinearRegression()
kf    = KFold(n_splits=5, shuffle=True, random_state=42)
cv_r2 = cross_val_score(model, X, y, cv=kf, scoring="r2")

print(f"Train R²: {model.fit(X, y).score(X, y):.3f}")
print(f"CV R² per fold: {cv_r2.round(3)}")
print(f"Mean CV R²:  {cv_r2.mean():.3f} ± {cv_r2.std():.3f}")`,
        walkthrough: [
          "KFold divides the data into 5 equal parts ('folds'); in each iteration, 4 folds train the model and 1 fold tests it.",
          "cross_val_score fits and evaluates on each fold automatically, returning 5 R² values.",
          "The gap between train R² and mean CV R² reveals overfitting: a large gap means the model learned noise.",
        ],
      },
    ],
    researchConnection: [
      "Cross-validation is now a mandatory step in most environmental modelling workflows. The USGS's National Hydrologic Model framework, NOAA flood prediction systems, and the UK's National Flood Forecasting System all use held-out validation to report honest model performance. Quoting only training R² is considered poor practice in applied hydrology.",
    ],
    quiz: [
      {
        question: "A model has training R² = 0.94 and 5-fold cross-validation R² = 0.62. What does this mean?",
        options: [
          "The model is excellent, 0.94 training R² is very high",
          "The model is overfitting, it generalises poorly to unseen data despite looking good on training data",
          "The test data must be of lower quality",
          "5 folds is not enough for a reliable cross-validation estimate",
        ],
        correctIndex: 1,
        explanation: "A large gap between training and CV performance is the diagnostic signature of overfitting. The model has memorised training noise rather than learning the true signal.",
      },
    ],
    challenge: {
      prompt: "Your 4-predictor model has CV R² = 0.78. Adding 4 more predictors raises training R² from 0.82 to 0.91, but CV R² drops to 0.71. What would you report as the model's performance, and which model would you deploy?",
      hint: "CV R² is the honest estimate of real-world performance. Always choose the simpler model unless CV clearly improves.",
    },
    teachBack: {
      prompt: "Explain what overfitting is to a scientist who knows nothing about machine learning, using a concrete analogy that doesn't involve statistics.",
    },
  },
  {
    id: "06-5-generalised-additive-models",
    missionId: "06-regression-and-prediction",
    order: 5,
    title: "Generalised Additive Models",
    durationMinutes: 18,
    story: [
      "The residuals from the multiple regression show a mild curve, the relationship between rainfall and streamflow isn't quite linear at the extremes. Very low rainfall produces almost no streamflow regardless of the exact amount; very high rainfall produces disproportionately large events. A straight line can't capture this.",
      "Your supervisor introduces Generalised Additive Models (GAMs): a flexible extension of regression where each predictor gets its own smooth curve, fitted to the data. The curves are added together, just like in multiple regression, but they don't have to be straight.",
    ],
    plainEnglish: [
      "A GAM (a flexible regression that fits gentle curves instead of forcing everything into straight lines) replaces each linear term β · x with a smooth function s(x), a flexible curve that can bend to follow the data. The curves are estimated from the data itself, not assumed in advance. This makes GAMs much more flexible than linear regression without requiring you to guess the exact functional form.",
      "The smoothness of each curve is controlled by a penalty, too flexible and you overfit; too rigid and you miss real patterns. GAMs automatically balance this trade-off during fitting.",
    ],
    analogy: [
      "Regular regression is like being told you can only connect the dots with one straight ruler. A GAM hands you a flexible piece of wire instead, one that can bend gently to hug the actual shape of the dots, as long as it does not wiggle so wildly that it just connects every single dot exactly.",
    ],
    math: {
      intro: "A GAM replaces the linear predictor with a sum of smooth functions.",
      equations: [
        {
          label: "GAM formulation",
          latex: "y = \\beta_0 + s_1(x_1) + s_2(x_2) + \\cdots + s_p(x_p) + \\varepsilon",
          explanation: "Each s_j(x_j) is a smooth spline function fitted to the data. In a linear model, each s_j would be forced to be straight (βⱼ·xⱼ). GAMs remove that constraint while still keeping the additive structure.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "gam_model.py",
        snippet: `from pygam import LinearGAM, s
import numpy as np
import pandas as pd

df = pd.read_csv("bluewater_monthly_features.csv")
X = df[["rainfall", "temperature", "soil_moisture"]].values
y = df["streamflow"].values

gam = LinearGAM(s(0) + s(1) + s(2)).fit(X, y)

print(f"GAM R²:     {gam.statistics_['pseudo_r2']['McFadden']:.3f}")
print(f"AIC:        {gam.statistics_['AIC']:.2f}")

# Partial effects, one smooth curve per predictor
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 3, figsize=(12, 4))
titles = ["Rainfall", "Temperature", "Soil Moisture"]
for i, ax in enumerate(axes):
    XX = gam.generate_X_grid(term=i)
    ax.plot(XX[:, i], gam.partial_dependence(term=i, X=XX))
    ax.set_title(titles[i])
plt.savefig("gam_partials.png")`,
        walkthrough: [
          "s(0), s(1), s(2) tell the GAM to fit a smooth spline to each of the three columns in X.",
          "gam.fit() automatically selects smoothness penalties using cross-validation.",
          "partial_dependence() plots the estimated smooth curve for each predictor, this is what a GAM shows you that linear regression cannot.",
        ],
      },
    ],
    researchConnection: [
      "GAMs are widely used in ecology and environmental science because ecological and hydrological relationships are rarely linear. Species distribution models, pollution-response curves, and streamflow-rainfall relationships in complex basins are all commonly fitted with GAMs in peer-reviewed literature. The mgcv package in R, which implements GAMs, has over 20,000 citations.",
    ],
    quiz: [
      {
        question: "What advantage does a GAM have over multiple linear regression for the rainfall-streamflow relationship?",
        options: [
          "GAMs always have higher R²",
          "GAMs can capture nonlinear relationships without requiring you to specify the functional form in advance",
          "GAMs require fewer data points",
          "GAMs are never affected by overfitting",
        ],
        correctIndex: 1,
        explanation: "The key GAM advantage is flexibility in functional form, the smooth can follow any shape the data supports, subject to a smoothness penalty that prevents overfitting.",
      },
    ],
    challenge: {
      prompt: "A GAM on the Bluewater data shows the rainfall smooth is roughly linear for rainfall < 50 mm/month but curves sharply upward above 100 mm. What does this tell you about how the watershed responds to low vs high rainfall?",
      hint: "Think about what happens to soil storage capacity as rainfall increases, at some point the basin 'saturates' and additional rain converts almost entirely to runoff.",
    },
    teachBack: {
      prompt: "Explain the difference between linear regression and a GAM to someone who only knows regression, using a hand-drawn curve as your main illustration.",
    },
  },
  {
    id: "06-6-interpreting-and-communicating-models",
    missionId: "06-regression-and-prediction",
    order: 6,
    title: "Interpreting and Communicating Models",
    durationMinutes: 13,
    story: [
      "Your streamflow model is built, validated, and ready for the policymaker. She asks three questions in sequence: 'How accurate is it?' You say CV R² = 0.81. 'What does that mean in metres of water?' You're momentarily stumped. 'And what could make it wrong?' Now you're genuinely unsure what to say.",
      "A model isn't fully ready for use until you can answer all three questions, and in units the decision-maker understands.",
    ],
    plainEnglish: [
      "Communicating a model means three things: translating abstract metrics (R², RMSE) into plain-language descriptions of predictive accuracy; showing the actual predictions with honest uncertainty bands; and explaining the model's known limitations and the conditions under which it might fail.",
      "Root mean square error (RMSE, the typical size of a model's mistakes, measured in the same units as what it is predicting) is often more interpretable than R² because it's in the same units as the response. 'Our model predicts streamflow to within ±0.8 m³/s on average' means more to a flood engineer than 'R² = 0.81'.",
    ],
    analogy: [
      "Telling a policymaker 'R² = 0.81' is like telling someone their exam score is in the 81st percentile, technically informative, but abstract. Telling them 'RMSE = 0.8 m³/s' is like telling them 'you'll usually miss the answer by about this much', in the exact units they actually care about.",
    ],
    math: {
      intro: "RMSE summarises prediction error in the original measurement units.",
      equations: [
        {
          label: "Root Mean Square Error",
          latex: "RMSE = \\sqrt{\\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}",
          explanation: "For each observation, square the error (actual minus predicted), average them, then take the square root. RMSE is in the same units as y, making it directly interpretable.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "model_communication.py",
        snippet: `import numpy as np
from sklearn.metrics import mean_squared_error

y_actual = np.load("bluewater_streamflow_test.npy")
y_pred   = np.load("bluewater_streamflow_pred.npy")

rmse = np.sqrt(mean_squared_error(y_actual, y_pred))
mae  = np.mean(np.abs(y_actual - y_pred))

print(f"RMSE: {rmse:.3f} m³/s  (typical prediction error)")
print(f"MAE:  {mae:.3f} m³/s   (average absolute error)")
print(f"Mean flow: {y_actual.mean():.2f} m³/s")
print(f"Relative RMSE: {100*rmse/y_actual.mean():.1f}%")`,
        walkthrough: [
          "RMSE penalises large errors more than small ones because of the squaring, it's sensitive to occasional large misses.",
          "MAE treats all errors equally, less sensitive to extreme outliers.",
          "Relative RMSE (% of mean) contextualises the error: a 0.8 m³/s error means something different if mean flow is 1.0 or 100 m³/s.",
        ],
      },
    ],
    researchConnection: [
      "RMSE and MAE appear in virtually every hydrological model evaluation in published literature. The Nash-Sutcliffe Efficiency (NSE = 1 − MSE/Var(y)), equivalent to R² for predictions vs observations, is the standard skill score for streamflow models. NSE > 0.65 is generally considered 'good' for Bluewater Basin-scale watersheds.",
    ],
    quiz: [
      {
        question: "Your model has R² = 0.78 and RMSE = 4.2 m³/s. Mean streamflow is 2.1 m³/s. What does this tell you about the practical usefulness of the model?",
        options: [
          "The model is excellent, 0.78 R² is very good",
          "The model may be poor in practice, RMSE is twice the mean streamflow, meaning typical errors are very large relative to the signal",
          "The model is average",
          "Nothing can be concluded without knowing the sample size",
        ],
        correctIndex: 1,
        explanation: "RMSE of 4.2 m³/s when the mean is 2.1 m³/s means typical prediction errors are 200% of mean flow, the model frequently predicts twice the actual streamflow or near zero when the true value is moderate. A 'good' R² can hide this.",
      },
    ],
    challenge: {
      prompt: "Write a three-sentence model summary for a policymaker about the Bluewater streamflow regression model: one sentence on accuracy (in m³/s), one on what drives predictions, and one on the main limitation.",
      hint: "Use RMSE or MAE for accuracy, the top predictor coefficient for interpretation, and the cross-validation gap for the limitation.",
    },
    teachBack: {
      prompt: "Explain why RMSE is often more useful than R² for communicating model performance to a decision-maker who isn't a statistician.",
    },
  },
  {
    id: "06-7-time-series-regression",
    missionId: "06-regression-and-prediction",
    order: 7,
    title: "Time Series Regression",
    durationMinutes: 14,
    story: [
      "Your regression model treats each monthly observation as independent. But Bluewater River's streamflow in July is strongly correlated with its streamflow in June, a wet month tends to follow a wet month. This violates one of linear regression's core assumptions: that residuals are uncorrelated. Ignoring this makes your standard errors wrong and your hypothesis tests unreliable.",
    ],
    plainEnglish: [
      "Autocorrelation (when today's value is related to yesterday's value, instead of being a fresh independent surprise) means a time series is correlated with its own past values. If today's streamflow helps predict tomorrow's, the observations are not independent, and classical regression assumes they are. Ignoring autocorrelation causes the model to underestimate uncertainty, making results look more precise than they really are.",
      "The autocorrelation function (ACF) measures the correlation between a series and lagged versions of itself. A spike at lag 1 means consecutive observations are correlated; a spike at lag 12 means the same month in different years are correlated (seasonal autocorrelation).",
    ],
    analogy: [
      "It is like counting today's weather and yesterday's weather as two completely separate, independent pieces of evidence, when really a hot day is much more likely to follow another hot day. Treating connected days as if they were unrelated coin flips makes your conclusions look more certain than they really are.",
    ],
    code: [
      {
        language: "python",
        filename: "autocorrelation.py",
        snippet: `import numpy as np
import pandas as pd
from statsmodels.stats.stattools import durbin_watson
from statsmodels.graphics.tsaplots import plot_acf
import matplotlib.pyplot as plt

streamflow = np.load("bluewater_monthly_streamflow.npy")
residuals  = np.load("regression_residuals.npy")

# Durbin-Watson test: values near 2 = no autocorrelation
#                    values near 0 = positive autocorrelation
#                    values near 4 = negative autocorrelation
dw = durbin_watson(residuals)
print(f"Durbin-Watson statistic: {dw:.3f}")
if dw < 1.5:
    print("Warning: positive autocorrelation in residuals detected")

# Plot ACF of residuals
fig, ax = plt.subplots(figsize=(8, 4))
plot_acf(residuals, ax=ax, lags=24)
plt.savefig("acf_residuals.png")`,
        walkthrough: [
          "We check the residuals (not the raw data) for autocorrelation, it's only in the residuals that assumption violations matter.",
          "durbin_watson() gives a simple test statistic; values far from 2 indicate autocorrelated residuals.",
          "plot_acf() shows which lags are significant, a spike at lag 12 in monthly residuals would indicate unmodelled seasonality.",
        ],
      },
    ],
    researchConnection: [
      "Autocorrelated residuals are one of the most common violations in environmental regression. Monthly precipitation, temperature, and water quality data are almost always autocorrelated. Standard practice is to either (1) add lagged predictors to the model, (2) use GLS (Generalised Least Squares) with a correlation structure, or (3) use time-series specific models like ARIMA. Ignoring it produces over-optimistic p-values and confidence intervals.",
    ],
    quiz: [
      {
        question: "What does a Durbin-Watson statistic of 0.8 (on a scale of 0–4) indicate about your regression residuals?",
        options: [
          "No autocorrelation, residuals are independent",
          "Strong positive autocorrelation, sequential residuals are similar to each other",
          "Strong negative autocorrelation, sequential residuals alternate in sign",
          "The test failed, 0.8 is outside valid range",
        ],
        correctIndex: 1,
        explanation: "Values near 0 indicate positive autocorrelation (consecutive residuals tend to have the same sign), near 2 means independence, near 4 means negative autocorrelation.",
      },
    ],
    challenge: {
      prompt: "Your regression of nitrate on seasonal variables has autocorrelated residuals (DW = 1.1). Propose two concrete changes to the model that might reduce autocorrelation, based on what you know about Bluewater Basin's hydrology.",
      hint: "Think about what drives nitrate from one month to the next, accumulated rainfall, previous month's groundwater level, or seasonal land use patterns.",
    },
    teachBack: {
      prompt: "Explain why autocorrelated residuals make a model's standard errors 'optimistic', and why this matters for any policy decision based on that model.",
    },
  },
];
