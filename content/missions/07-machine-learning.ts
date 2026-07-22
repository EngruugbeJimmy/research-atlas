import type { Lesson } from "@/lib/missions/types";

export const mission07Lessons: Lesson[] = [
  {
    id: "07-1-from-rules-to-learning",
    missionId: "07-machine-learning",
    order: 1,
    title: "From Rules to Learning",
    durationMinutes: 12,
    story: [
      "Your regression model from Mission 6 predicts streamflow from rainfall reasonably well, but your supervisor poses a harder problem: predicting which of Bluewater Basin's 847 land parcels will flood during the next major storm event. There are dozens of variables, slope, upstream drainage area, soil type, land cover, distance to river, previous soil moisture, and no simple equation that combines them in the right way.",
      "She slides a folder across the table: ten years of post-flood field surveys, where crews drove the basin after every major event and recorded which parcels flooded and which didn't. 'We already have the answer for the past,' she says. 'Can we teach a computer to learn the pattern and predict the future?'",
    ],
    plainEnglish: [
      "Traditional modelling writes the rules explicitly: you decide which variables matter and how to combine them. Machine learning inverts this, it finds the rules itself by looking at historical examples where the answer was known, and extracts patterns the human analyst might miss.",
      "This only works if the historical examples are representative of the future. The algorithm is only as smart as the data you feed it. Garbage in, garbage out applies to machine learning harder than anywhere else, because the algorithm can't tell you when the data is wrong.",
    ],
    analogy: [
      "It is like the difference between programming a robot with a rigid rulebook for chess versus letting it play a thousand games and figure out good moves on its own. Machine learning is that second approach: instead of writing the rules yourself, you show the computer a pile of past examples and let it work out the pattern.",
    ],
    researchConnection: [
      "The shift from rule-based to machine-learning models transformed environmental science over the 2010s. Random forests, the algorithm you'll build in this mission, became the workhorse model for flood risk, species distribution, soil contamination, and wildfire spread, largely because they're accurate, relatively easy to interpret, and handle the messy, mixed-type data that real fieldwork produces.",
    ],
    quiz: [
      {
        question: "What is the core difference between traditional modelling and machine learning?",
        options: [
          "Machine learning only works on large datasets",
          "Traditional modelling requires a computer; ML doesn't",
          "Traditional modelling encodes rules explicitly; ML infers rules from labelled examples",
          "Machine learning is always more accurate than traditional models",
        ],
        correctIndex: 2,
        explanation: "ML learns patterns from labelled data rather than having rules hand-coded by the analyst.",
      },
    ],
    challenge: {
      prompt: "List three variables about a land parcel that you'd expect to predict flood risk, and explain why each one matters physically.",
      hint: "Think about what controls where water goes when rain falls, slope, drainage, and soil absorption are the main physical mechanisms.",
    },
    teachBack: {
      prompt: "Explain what 'learning from labelled examples' means, using the flood survey data as your example.",
    },
  },
  {
    id: "07-2-decision-trees",
    missionId: "07-machine-learning",
    order: 2,
    title: "Decision Trees",
    durationMinutes: 16,
    story: [
      "Before building a forest, you need to understand one tree. Your supervisor draws a flowchart on the whiteboard: 'If slope is less than 4%, go left. If upstream drainage area is greater than 15 km², go left again. Now, did it flood?' The flowchart is a decision tree, the simplest machine learning model and also the most interpretable.",
      "You trace your finger through the chart for a specific parcel, the one at the base of the agricultural slope near monitoring well GW-14. Slope 2.1%, drainage area 23 km², soil drainage index 3.2. It lands in the 'flooded' leaf. The field record confirms it flooded in three of the last five major events.",
    ],
    plainEnglish: [
      "A decision tree is a sequence of binary yes/no questions about the input variables. At each step it asks one question about one variable, splits the data into two groups, and then asks another question about the best variable in each group, continuing until the groups are pure enough to make a confident prediction.",
      "The tree 'learns' by finding the question at each step that best separates flooded from non-flooded parcels. The measurement it uses for 'best' is called Gini impurity (a score for how mixed-up a group is, zero means everyone in the group has the same answer), a number that is zero when a group is perfectly pure (all one outcome) and highest when the group is exactly half-and-half.",
    ],
    analogy: [
      "A decision tree plays a game like Twenty Questions. Is it bigger than a bread box? Does it have fur? Each yes/no question narrows down the possibilities until you can confidently guess the answer. The tree just picks the most useful question to ask at each step, the one that splits the remaining possibilities most cleanly.",
    ],
    math: {
      intro: "Gini impurity measures how mixed a group is. If a node contains parcels where the proportion that flooded is p, Gini impurity is:",
      equations: [
        {
          label: "Gini impurity",
          latex: "G = 1 - p^2 - (1-p)^2 = 2p(1-p)",
          explanation: "G is 0 when all examples have the same label (p=0 or p=1) and 0.5 when they're exactly split (p=0.5). The tree always picks the split that minimises G in the resulting child nodes.",
        },
        {
          label: "Weighted Gini after a split",
          latex: "G_{split} = \\frac{n_L}{n} G_L + \\frac{n_R}{n} G_R",
          explanation: "nL and nR are the number of samples going left and right. The split is weighted by group size so a split that creates one tiny pure group and one huge mixed group isn't rated highly.",
        },
      ],
    },
    simulation: {
      component: "random-forest",
      caption: "Click 'Grow tree' to add T1. Explore the splits the single tree makes, note which feature it uses at the root.",
    },
    code: [
      {
        language: "python",
        filename: "decision_tree.py",
        snippet: `from sklearn.tree import DecisionTreeClassifier, export_text
import pandas as pd

# Load Bluewater Basin flood survey data
df = pd.read_csv("bluewater_flood_survey.csv")
features = ["slope_pct", "upstream_area_km2", "soil_drainage", "dist_to_river_m"]
X = df[features]
y = df["flooded"]  # True/False

# Fit a single decision tree, max depth 4
tree = DecisionTreeClassifier(max_depth=4, random_state=42)
tree.fit(X, y)

# Human-readable text representation of the tree
print(export_text(tree, feature_names=features))
print(f"Training accuracy: {tree.score(X, y):.3f}")`,
        walkthrough: [
          "We load the flood survey: each row is one land parcel with four terrain features and a flooded label.",
          "DecisionTreeClassifier with max_depth=4 builds a tree at most 4 splits deep, deep enough to capture real patterns but shallow enough to inspect.",
          "export_text() prints the full tree as a human-readable if/else structure, you can trace any parcel through it by hand.",
          "tree.score() returns the proportion of training examples predicted correctly, but beware: a tree that's memorised the training data would score 1.0 without being useful for new data.",
        ],
      },
    ],
    researchConnection: [
      "Decision trees are used directly in environmental management when interpretability matters as much as accuracy, a flood risk model presented to a local council needs to be explainable in plain English, not a black box. The same split logic you're seeing here drives operational flood-warning systems in multiple countries.",
    ],
    quiz: [
      {
        question: "What is Gini impurity measuring?",
        options: [
          "The total number of samples at a node",
          "How far a prediction is from the true value",
          "How mixed the class labels are in a group, 0 means pure, 0.5 means perfectly mixed",
          "The depth of the tree at that point",
        ],
        correctIndex: 2,
        explanation: "Gini impurity is zero for a perfectly pure group and maximal when both classes are equally represented.",
      },
      {
        question: "Why does a very deep tree risk being misleading?",
        options: [
          "It takes too long to compute",
          "It may memorise the training data (overfitting) and fail on new examples",
          "Deep trees always have lower accuracy than shallow ones",
          "They can only handle numerical, not categorical data",
        ],
        correctIndex: 1,
        explanation: "A tree with no depth limit can create a separate leaf for every training example, perfectly accurate on known data, but useless for prediction.",
      },
    ],
    challenge: {
      prompt: "Using the simulation, note the exact split values for the root node (first split) of T1. Could you apply that same rule by hand to a new parcel description? Try it.",
      hint: "Look at the feature name and threshold shown at the top of the tree diagram.",
    },
    teachBack: {
      prompt: "Explain Gini impurity to someone without maths background, using a bag of coloured marbles as your analogy.",
    },
  },
  {
    id: "07-3-random-forests",
    missionId: "07-machine-learning",
    order: 3,
    title: "From One Tree to a Forest",
    durationMinutes: 18,
    story: [
      "A single decision tree has a flaw: it's brittle. One different training example and the root split might change entirely, taking every prediction below it with it. Your supervisor demonstrates this by rerunning the tree on a slightly different subset of the survey data, the tree structure shifts noticeably.",
      "'The solution,' she says, 'is the same one used by survey teams, juries, and committees everywhere, ask many independent judges and take the majority vote.' A random forest (a big group of decision trees that each vote, so no single tree's mistake wins) is an ensemble of decision trees, each trained on a different random sample of the data. The individual trees are noisy; the ensemble is stable.",
    ],
    analogy: [
      "It is like asking a hundred different friends to independently guess how many jellybeans are in a jar, instead of trusting just one guess. Each individual friend might be way off, but averaging all hundred guesses together usually lands remarkably close to the true number, because their individual mistakes tend to cancel out.",
    ],
    plainEnglish: [
      "A random forest builds many trees independently, each on a bootstrap sample, a random sample with replacement from the training data, about the same size as the original. Some parcels appear multiple times; others are left out entirely. This means each tree sees a slightly different view of the data and makes different errors.",
      "When you need to predict a new parcel, every tree in the forest votes: flooded or not flooded. The forest predicts whichever class gets more votes. The individual trees' errors tend to cancel out in the majority vote, this is called variance reduction through ensembling.",
    ],
    math: {
      intro: "Bootstrap sampling and the aggregation of predictions (bagging) are what separate a forest from a single tree:",
      equations: [
        {
          label: "Bootstrap sample",
          latex: "\\mathcal{D}_b \\sim \\text{Sample with replacement}(\\mathcal{D}, n)",
          explanation: "Each tree b is trained on a new bootstrap dataset Db drawn by sampling n times with replacement from the original data D. About 63% of original examples appear; the rest are 'out-of-bag'.",
        },
        {
          label: "Forest prediction",
          latex: "\\hat{y} = \\text{mode}\\{f_1(x), f_2(x), \\ldots, f_B(x)\\}",
          explanation: "The final prediction is the majority vote across all B trees. For regression (predicting a number instead of a class) it's the average instead of the mode.",
        },
      ],
    },
    simulation: {
      component: "random-forest",
      caption: "Grow the forest tree by tree. Watch feature importance stabilise as more trees vote, and notice that no single tree dominates the decision.",
    },
    code: [
      {
        language: "python",
        filename: "random_forest.py",
        snippet: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import numpy as np

rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
rf.fit(X_train, y_train)

# Cross-validated accuracy (5-fold)
cv_scores = cross_val_score(rf, X, y, cv=5, scoring="accuracy")
print(f"CV accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# Feature importance
for feat, imp in sorted(zip(features, rf.feature_importances_), key=lambda x: -x[1]):
    print(f"  {feat:30s}: {imp:.3f}")`,
        walkthrough: [
          "RandomForestClassifier with n_estimators=100 builds 100 trees, each on a different bootstrap sample.",
          "cross_val_score with cv=5 is 5-fold cross-validation: we'll explain this fully in the next lesson. The ± gives the uncertainty of the accuracy estimate.",
          "rf.feature_importances_ shows how much each feature contributed to splits across all trees, a data-driven way to identify which variables actually drive flood risk.",
        ],
      },
    ],
    researchConnection: [
      "Random forests are one of the most widely deployed ML models in environmental science because they handle mixed variable types, are robust to outliers, provide built-in feature importance, and require relatively little tuning compared to neural networks. A 2019 meta-analysis found random forests outperformed all other methods on 68% of environmental prediction benchmarks.",
    ],
    quiz: [
      {
        question: "Why does bootstrap sampling help a random forest?",
        options: [
          "It makes each tree faster to build",
          "It ensures each tree sees the full dataset",
          "It introduces variation between trees, so their errors are independent and cancel out in the ensemble vote",
          "It prevents the forest from using irrelevant features",
        ],
        correctIndex: 2,
        explanation: "Independent errors are the key: if all trees made the same errors, voting wouldn't help. Bootstrap sampling creates different trees with different mistakes.",
      },
    ],
    challenge: {
      prompt: "Grow the forest to 12 trees in the simulation. Note which feature has the highest importance. Does this match what you'd expect physically from a flooding perspective?",
      hint: "Slope controls how fast water moves; upstream area controls how much water arrives. Both should matter, which matters more?",
    },
    teachBack: {
      prompt: "Explain why a majority vote of 100 noisy trees is more reliable than one carefully built tree, without using any technical terms.",
    },
  },
  {
    id: "07-4-cross-validation",
    missionId: "07-machine-learning",
    order: 4,
    title: "Cross-Validation",
    durationMinutes: 17,
    story: [
      "Your random forest gets 94% accuracy on the training data. Your supervisor is unimpressed. 'Show me the accuracy on data the model has never seen.' You pull up the model's predictions on the full 847-parcel dataset, restricting to the parcels that weren't used for training, and the number drops to 81%. Still good, but different enough to matter for real decisions.",
      "She explains the trap: any model evaluated on the same data it was trained on will look better than it really is. The model has seen those examples, it's like giving students the exam questions in advance and reporting their test score as a measure of how much they learned.",
    ],
    analogy: [
      "Cross-validation is like giving a student five separate pop quizzes on material they have never seen, instead of one exam they got to preview. Some students get lucky on one quiz and unlucky on another, but averaging all five gives a much more honest picture of what they actually know.",
    ],
    plainEnglish: [
      "Cross-validation solves this by repeatedly splitting the data into training and testing sets, in 5-fold cross-validation, the data is split into 5 equal parts. The model is trained on 4 parts and evaluated on the 1 held-out part, then the process repeats for each part in turn. You get 5 independent estimates of real-world accuracy and can average them.",
      "The spread of those 5 estimates tells you something important too: if they range from 62% to 95%, the model's performance is unstable, it's very sensitive to which specific parcels happen to be in the training set. A stable model shows much tighter spread.",
    ],
    math: {
      intro: "In k-fold cross-validation, each of the k folds takes a turn as the held-out test set:",
      equations: [
        {
          label: "k-fold CV score",
          latex: "\\text{CV}(k) = \\frac{1}{k} \\sum_{i=1}^{k} \\text{Score}(f_{-i}, \\mathcal{D}_i)",
          explanation: "f_{-i} is the model trained on all folds except i; D_i is fold i used as the test set. Score(·) is whatever metric matters, accuracy, AUC, RMSE. We average k independent estimates.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "cross_validation.py",
        snippet: `from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import make_scorer, f1_score

# Stratified k-fold: each fold has the same flood/non-flood ratio as the full data
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

results = cross_validate(
    rf, X, y,
    cv=cv,
    scoring={
        "accuracy": "accuracy",
        "f1": make_scorer(f1_score),
    },
    return_train_score=True,
)

print("Test accuracy:  ", results["test_accuracy"].round(3))
print("Train accuracy: ", results["train_accuracy"].round(3))
# Large gap between train and test = overfitting`,
        walkthrough: [
          "StratifiedKFold ensures every fold has the same proportion of flooded parcels, important when one class is rarer than the other.",
          "cross_validate returns both train and test scores. A large train-test gap is the diagnostic fingerprint of overfitting.",
          "F1 score is the harmonic mean of precision and recall, more informative than accuracy when flooded parcels are rarer than non-flooded ones.",
          "Printing all 5 test scores (not just the mean) lets you see stability, are some folds much worse than others?",
        ],
      },
    ],
    researchConnection: [
      "Cross-validation is now mandatory in most environmental ML publications. A model reported only with training accuracy is considered unreliable by reviewers, just as a self-marking exam would be considered invalid. Spatial cross-validation (where test and training folds are geographically separated) is increasingly required for spatial prediction tasks to prevent optimistic estimates from nearby data points leaking information.",
    ],
    quiz: [
      {
        question: "Why is evaluating a model on its training data misleading?",
        options: [
          "Training data is always noisier than test data",
          "The model has already seen those examples, so it performs better on them than it would on genuinely new data",
          "Training data is usually smaller than test data",
          "It only works for classification, not regression",
        ],
        correctIndex: 1,
        explanation: "Evaluating on training data measures memorisation, not generalisation. The goal is prediction on unseen examples.",
      },
      {
        question: "What does a large gap between training accuracy and cross-validated test accuracy indicate?",
        options: [
          "The model needs more training data",
          "The model is underfitting",
          "The model is overfitting, it has memorised the training data without learning general patterns",
          "Cross-validation was run incorrectly",
        ],
        correctIndex: 2,
        explanation: "Train-test gap is the defining diagnostic of overfitting.",
      },
    ],
    challenge: {
      prompt: "Given a Bluewater Basin random forest with 98% training accuracy and 76% 5-fold CV accuracy, what would you recommend, and what would you investigate first?",
      hint: "The gap is large. Think about max_depth, n_estimators, and whether more data would help versus whether the features are genuinely predictive.",
    },
    teachBack: {
      prompt: "Explain cross-validation to a non-technical colleague using an exam analogy, without using the words 'training', 'testing', or 'fold'.",
    },
  },
  {
    id: "07-5-feature-importance-and-interpretation",
    missionId: "07-machine-learning",
    order: 5,
    title: "Feature Importance & Interpretation",
    durationMinutes: 14,
    story: [
      "Your random forest predicts flood risk well, but the regional water authority wants to know why, which factors should they focus mitigation efforts on? Planting cover crops helps with soil erosion but costs money; diverting drainage channels is expensive but faster. Which intervention will most reduce flood probability?",
      "The answer is encoded in the forest itself: you can measure how much each feature contributed to the splits across all 100 trees, and rank them. The ranking tells you which variables the model relied on most, and, with care, something about what the underlying system is actually doing.",
    ],
    plainEnglish: [
      "Feature importance scores (a ranking of which input variables the model actually leaned on to make its decisions) tell you how much predictive power each variable provided. A variable used in many splits near the root of many trees gets a high score; a variable rarely chosen or only used in low-impact leaf splits gets a low score.",
      "Important caveat: high feature importance does not mean the variable causes flooding. It means the variable was statistically useful for predicting it. Slope and upstream area are causally related to flooding. A variable like 'parcel ID' would get zero importance, unless parcel numbers happened to encode geography, in which case it might score high for entirely the wrong reason.",
    ],
    analogy: [
      "Imagine grading which ingredients mattered most for a recipe's success by looking at a hundred past attempts. If 'used fresh basil' shows up in every single successful dish, it scores high in importance. That does not necessarily mean basil alone causes success, maybe the cooks who bothered with fresh basil also did everything else more carefully too.",
    ],
    code: [
      {
        language: "python",
        filename: "feature_importance.py",
        snippet: `import matplotlib.pyplot as plt
import shap  # SHapley Additive exPlanations

# Standard mean-decrease-impurity importance (comes free with sklearn)
importances = rf.feature_importances_

# SHAP values: more rigorous, shows direction of effect
explainer = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_test)

# Summary plot: each point is one prediction, coloured by feature value
shap.summary_plot(shap_values[1], X_test, feature_names=features)
# Points to the right = feature pushed prediction toward 'flooded'
# Red = high feature value, blue = low`,
        walkthrough: [
          "rf.feature_importances_ gives a single importance score per feature, quick but doesn't tell you direction of effect.",
          "SHAP values (Shapley Additive exPlanations) decompose each individual prediction into contributions from each feature, showing both magnitude and direction.",
          "shap.summary_plot shows all test predictions at once: red points mean high feature value, right position means it pushed the prediction toward flooding. This reveals e.g. high slope pushing away from flooding (water runs off faster) while high upstream area pushes toward it.",
        ],
      },
    ],
    researchConnection: [
      "SHAP values are now standard practice in environmental ML papers because they provide model-agnostic, theoretically grounded explanations that stakeholders can interrogate. Regulators increasingly require explanations alongside predictions for any model informing environmental policy decisions.",
    ],
    quiz: [
      {
        question: "If 'slope' has the highest feature importance in the flood prediction model, does this prove slope causes flooding?",
        options: [
          "Yes, high importance means causal effect",
          "No, importance measures statistical usefulness for prediction, not causal effect",
          "Only if the model has 90%+ accuracy",
          "Only if SHAP values were also computed",
        ],
        correctIndex: 1,
        explanation: "Feature importance is a statistical measure of predictive utility, not a causal claim. Causation requires controlled experiments or causal inference methods beyond standard ML.",
      },
    ],
    challenge: {
      prompt: "Imagine slope had low feature importance but upstream drainage area had very high importance. What would you tell the water authority about where to focus flood mitigation investment?",
      hint: "High upstream area = large drainage network feeding the point. What kind of infrastructure intervention addresses that?",
    },
    teachBack: {
      prompt: "In three sentences, explain what feature importance tells you and what it does NOT tell you, using the flood prediction example.",
    },
  },
];
