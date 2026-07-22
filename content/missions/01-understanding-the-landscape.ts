import type { Lesson } from "@/lib/missions/types";

export const mission01Lessons: Lesson[] = [
  {
    id: "01-1-reading-elevation",
    missionId: "01-understanding-the-landscape",
    order: 1,
    title: "Reading Elevation",
    durationMinutes: 15,
    story: [
      "Your first field assignment: understand the shape of Bluewater Basin before you trust a single measurement taken inside it. Your supervisor hands you a grid of numbers, a Digital Elevation Model (a big grid where every number is the height of the ground at that spot), or DEM for short, covering the whole watershed.",
      "It looks like nothing at first: just rows and columns of numbers. Then she shows you what happens when you connect all the points at the same elevation with a line. Suddenly the ridge, the river valley, and the coastal flats appear.",
    ],
    plainEnglish: [
      "A DEM is just a very fine grid of height measurements, like a spreadsheet where every cell is one patch of ground and its value is how high that patch sits above sea level. Nothing about it is complicated except its size: Bluewater Basin's DEM has over 2 million such cells.",
      "A contour line (a line drawn through every spot that shares the same height) connects every point at exactly the same elevation, the same way a contour on a weather map connects every point at the same temperature. Where contour lines are close together, the land is steep; where they're far apart, it's flat. You can learn to read an entire landscape's shape from these lines alone, without ever seeing a photo of it.",
    ],
    analogy: [
      "A DEM is like a muffin tin turned upside down and covered in a bedsheet. If you traced a marker around the sheet everywhere it sits at exactly the same height above the table, you would draw a contour line. Tight rings around one muffin mean a steep bump. Wide, spread-out rings mean the sheet barely rises at all.",
    ],
    visual: {
      kind: "contour",
      caption: "Contour lines of Bluewater Basin, tightly packed near the ridge, widely spaced near the coastal flats.",
    },
    math: {
      intro: "Elevation data is usually stored as a raster: a 2D grid where each cell has a row index i, a column index j, and a value z for elevation.",
      equations: [
        {
          label: "Grid cell elevation",
          latex: "z_{i,j} = \\text{elevation at row } i, \\text{ column } j",
          explanation: "Every pixel in the DEM is one elevation reading, the entire map is just this repeated over ~2 million cells.",
        },
      ],
    },
    simulation: {
      component: "contour-builder",
      caption: "Drag the elevation threshold to draw your own contour line across Bluewater Basin.",
    },
    code: [
      {
        language: "python",
        filename: "read_dem.py",
        snippet: `import numpy as np

# dem is a 2D array: dem[row, col] = elevation in meters
dem = np.load("bluewater_dem.npy")

print("Grid shape:", dem.shape)
print("Highest point:", dem.max(), "m")
print("Lowest point:", dem.min(), "m")
print("Elevation at the ridge station (row 12, col 340):", dem[12, 340], "m")`,
        walkthrough: [
          "We load the DEM as a NumPy array, a fast grid of numbers, exactly like the spreadsheet analogy from the lesson.",
          "dem.shape tells us how many rows and columns the grid has.",
          "dem.max() and dem.min() find the highest ridge and lowest coastal point in the whole basin.",
          "Indexing dem[row, col] reads the elevation at one specific location, the same way you'd click one cell in a spreadsheet.",
        ],
      },
    ],
    researchConnection: [
      "DEMs are the foundation of almost every environmental analysis you'll do in Research Atlas: slope (Lesson 2), watershed delineation (Lesson 3), and even the flood-risk model in Mission 7 all start from this same grid. Real research agencies like the USGS and ESA distribute DEMs for the entire planet at resolutions down to 10-30 meters per cell.",
    ],
    quiz: [
      {
        question: "What does a single cell in a DEM actually store?",
        options: [
          "A photograph of that location",
          "The elevation of the ground at that location",
          "The land use type at that location",
          "The rainfall total at that location",
        ],
        correctIndex: 1,
        explanation: "A DEM stores elevation only, other properties like land cover or rainfall are separate datasets.",
      },
      {
        question: "Where are contour lines closest together?",
        options: [
          "On flat ground",
          "On steep ground",
          "Only near rivers",
          "Only at the coastline",
        ],
        correctIndex: 1,
        explanation: "Steep terrain packs many elevation changes into a short horizontal distance, so contour lines bunch together.",
      },
    ],
    challenge: {
      prompt: "Using the contour-builder simulation above, find the elevation threshold where the contour line first separates the ridge from the rest of the basin into its own closed loop.",
      hint: "Closed loops appear around local high points, try dragging slowly near the top of the elevation range.",
    },
    teachBack: {
      prompt: "Explain what a contour line is to someone who has never seen a topographic map, without using the word 'elevation' more than once.",
    },
  },
  {
    id: "01-2-slope-and-aspect",
    missionId: "01-understanding-the-landscape",
    order: 2,
    title: "Slope and Aspect",
    durationMinutes: 15,
    story: [
      "A farmer near the basin's agricultural zone reports that one of his fields floods every time it rains hard, while an identical field fifty meters away stays dry. Same soil, same crop, same rainfall, so what's different? Your supervisor points at the DEM: 'Look at the slope, not just the elevation.'",
    ],
    plainEnglish: [
      "Slope measures how steeply the ground rises or falls, not how high it is. Two locations can be at the same elevation but have completely different slopes, and water behaves very differently on each: it pools on flat ground and runs off quickly on steep ground.",
      "Aspect (which compass direction a slope faces) matters because slopes facing the sun dry out faster, which affects everything from soil moisture to which plants grow where.",
    ],
    analogy: [
      "Think of a playground slide. Elevation is how tall the slide is. Slope is how steep the slide feels when you sit at the top. A tall slide can still be gentle, and a short slide can still be terrifyingly steep. Water, like a marble, cares about the steepness, not the height.",
    ],
    math: {
      intro: "Slope is calculated from how much elevation changes over a short horizontal distance, in both the east-west and north-south directions.",
      equations: [
        {
          label: "Slope (percent)",
          latex: "\\text{slope} = \\frac{\\Delta z}{\\Delta x} \\times 100",
          explanation: "The rise in elevation (Δz) divided by the horizontal distance traveled (Δx), expressed as a percentage, a 10% slope rises 10 meters over 100 meters of horizontal distance.",
        },
      ],
    },
    code: [
      {
        language: "python",
        filename: "compute_slope.py",
        snippet: `import numpy as np

cell_size_m = 10  # each DEM cell covers 10m x 10m

dz_dx, dz_dy = np.gradient(dem, cell_size_m)
slope_percent = np.sqrt(dz_dx**2 + dz_dy**2) * 100

print("Steepest cell in the basin:", slope_percent.max(), "%")
print("Slope at the flooding field (row 210, col 88):", slope_percent[210, 88], "%")`,
        walkthrough: [
          "np.gradient computes how elevation changes cell-to-cell in both directions at once.",
          "Combining both directions with the Pythagorean-style formula gives the steepest direction of change at each cell.",
          "Multiplying by 100 converts the ratio into a percentage slope, matching the equation above.",
        ],
      },
    ],
    researchConnection: [
      "Slope maps drive real flood-risk and erosion models: the same np.gradient approach here is the basis of tools like ArcGIS's Slope function and QGIS's terrain analysis plugin. You're using a simplified version of the exact method professional hydrologists rely on.",
    ],
    quiz: [
      {
        question: "Two fields have the same elevation. Can they still have different slopes?",
        options: [
          "No, elevation determines slope",
          "Yes, slope depends on how elevation changes nearby, not on the elevation value itself",
          "Only if they have different soil types",
          "Only near the coast",
        ],
        correctIndex: 1,
        explanation: "Slope is about the rate of change in elevation across nearby cells, which is independent of the absolute elevation value.",
      },
    ],
    challenge: {
      prompt: "Using the code pattern above, predict whether the flooding field or the dry field has a lower slope percentage, then explain why that alone could account for the farmer's observation.",
      hint: "Lower slope means water has less driving force to run off, so it tends to pool instead.",
    },
    teachBack: {
      prompt: "Explain the difference between elevation and slope to someone standing on a hillside, pointing at things.",
    },
  },
  {
    id: "01-3-watersheds-and-drainage",
    missionId: "01-understanding-the-landscape",
    order: 3,
    title: "Watersheds and Drainage",
    durationMinutes: 15,
    story: [
      "Your supervisor asks the question that gives this mission its name: 'If a single raindrop lands anywhere in this basin, can you tell me exactly where it ends up?' It sounds impossible until she shows you that the DEM already contains the answer, you just need to trace it.",
    ],
    plainEnglish: [
      "A watershed (or drainage basin, meaning all the land that drains to the same outlet) is all the land where rainfall eventually flows to the same point, usually a river mouth or lake. Every drop of rain, given enough time, moves downhill toward its watershed's outlet.",
      "Delineating a watershed (mapping out its exact boundary) means using the DEM to trace, for every cell, which direction water would flow, always toward the lowest neighboring cell, until you can group cells into the areas that drain to the same outlet.",
    ],
    analogy: [
      "A watershed works like the funnel of a bathtub drain, but stretched across an entire landscape. No matter where you pour water onto that funnel, gravity walks it toward the same drain. The ridge lines are the rim of the funnel; cross over one and your water heads toward a completely different drain instead.",
    ],
    simulation: {
      component: "watershed",
      caption: "Click anywhere on the basin to trace the flow path a raindrop would take to the coast.",
    },
    researchConnection: [
      "Watershed boundaries define almost every environmental policy decision in the real world, from water rights to pollution regulation, because contamination or land use anywhere inside a watershed can affect the water quality at its outlet, even miles away. This is exactly why Bluewater Basin's agricultural zone (upstream) matters for Millhaven's water quality (downstream at the outlet).",
    ],
    quiz: [
      {
        question: "What defines the boundary of a watershed?",
        options: [
          "Political borders like county lines",
          "The ridge lines that separate land draining to one outlet from land draining to another",
          "The location of rain gauges",
          "Where forest turns into farmland",
        ],
        correctIndex: 1,
        explanation: "Watershed boundaries follow the terrain's ridges, the highest points that split drainage in different directions, not human-drawn borders.",
      },
      {
        question: "Why does farmland upstream matter for Millhaven's water quality, even though Millhaven is miles away?",
        options: [
          "It doesn't, only nearby sources matter",
          "Because Millhaven is inside the same watershed, so water (and anything dissolved in it) eventually flows there",
          "Because of wind patterns",
          "Because farmland always causes contamination",
        ],
        correctIndex: 1,
        explanation: "Anywhere inside a shared watershed is hydrologically connected to the outlet, regardless of surface distance.",
      },
    ],
    challenge: {
      prompt: "Use the watershed simulation to trace flow paths from three different starting points. Do any of them converge before reaching the coast?",
      hint: "Points on the same hillside almost always converge into the same stream before the outlet.",
    },
    teachBack: {
      prompt: "Explain why two farms on opposite sides of a ridge, only 200 meters apart, might drain into completely different rivers.",
    },
  },
  {
    id: "01-4-land-cover-and-coordinates",
    missionId: "01-understanding-the-landscape",
    order: 4,
    title: "Land Cover & Coordinate Systems",
    durationMinutes: 15,
    story: [
      "With terrain understood, your supervisor adds another layer to the map: land cover, forest, wetland, farmland, and urban area across the basin. But before you can combine it with the DEM, she warns you about a mistake that has ruined more GIS projects than any other: assuming two maps use the same coordinate system when they don't.",
    ],
    plainEnglish: [
      "A coordinate reference system (CRS, meaning the rulebook a map uses to turn a spot on Earth into two numbers) is the agreed-upon way of turning a location on Earth's curved surface into numbers you can plot on a flat map. Different datasets are often recorded in different CRSs, one might use latitude and longitude, another a local flat projection measured in meters.",
      "If you plot two datasets in different CRSs on the same map without converting them, they will not line up, sometimes by a few meters, sometimes by hundreds of kilometers, even though every individual number is 'correct' in its own system.",
    ],
    analogy: [
      "It is like two people describing the same seat at a stadium, one using row and seat number, the other using GPS coordinates. Both are correct. But if you tried to plot them on the same seating chart without translating one into the other, you would think they were talking about two completely different seats.",
    ],
    code: [
      {
        language: "python",
        filename: "reproject_landcover.py",
        snippet: `import geopandas as gpd

landcover = gpd.read_file("bluewater_landcover.geojson")
print("Original CRS:", landcover.crs)

# Reproject to match the DEM's coordinate system before combining them
landcover_matched = landcover.to_crs("EPSG:32619")
print("Reprojected CRS:", landcover_matched.crs)`,
        walkthrough: [
          "geopandas reads spatial data along with its coordinate reference system metadata.",
          "Printing .crs shows exactly which system the data currently uses, always check this before combining datasets.",
          "to_crs() mathematically converts every coordinate to match another system, here UTM zone 19N (EPSG:32619), which Bluewater Basin's DEM uses.",
        ],
      },
    ],
    researchConnection: [
      "CRS mismatches are one of the most common real-world GIS errors, they've caused everything from misaligned emergency-response maps to incorrect area calculations in published research. Checking and matching coordinate systems before any spatial analysis is standard professional practice, not an optional detail.",
    ],
    quiz: [
      {
        question: "What happens if you plot two datasets with different, unconverted coordinate systems on the same map?",
        options: [
          "Nothing, coordinates always mean the same thing everywhere",
          "They may not align correctly, even though each dataset's numbers are individually correct",
          "The map will fail to render at all",
          "Only elevation data is affected by this",
        ],
        correctIndex: 1,
        explanation: "Each CRS defines its own mapping from Earth's surface to numbers, mixing them without conversion causes silent misalignment.",
      },
    ],
    challenge: {
      prompt: "Bluewater Basin's rain gauge network was recorded in latitude/longitude (EPSG:4326), but the DEM uses UTM zone 19N (EPSG:32619). Write the one line of code you'd add before combining them.",
      hint: "You need to reproject one dataset to match the other, look at the to_crs() call above.",
    },
    teachBack: {
      prompt: "Explain to a teammate why 'the coordinates are correct' doesn't guarantee 'the map is correct'.",
    },
  },
  {
    id: "01-5-building-your-first-map",
    missionId: "01-understanding-the-landscape",
    order: 5,
    title: "Building Your First Map",
    durationMinutes: 20,
    story: [
      "It's time to combine everything: elevation, slope, watershed boundaries, land cover, and coordinate-matched station locations, into one map of Bluewater Basin. Your supervisor calls this your 'basemap', every later mission will overlay new data on top of exactly this map.",
    ],
    plainEnglish: [
      "Building a basemap (the single trusted map every later mission will build on top of) isn't about making something pretty, it's about making sure every future layer of data lines up correctly and means what you think it means. A basemap you trust is what lets you say, later, 'the well with rising nitrate sits at the base of a steep agricultural slope' and know that claim is actually true.",
    ],
    analogy: [
      "A basemap is like the foundation of a house. Nobody visits a house to admire the foundation, but every wall, room, and roof depends on it being level and solid. Get it wrong, and every floor you build on top inherits the same crack.",
    ],
    simulation: {
      component: "watershed",
      caption: "Your completed basemap: elevation, watershed boundary, and all monitoring stations of Bluewater Basin.",
    },
    researchConnection: [
      "Every GIS-heavy research paper includes a 'study area' figure built exactly this way, terrain, boundaries, and sampling locations combined into one map before any statistics appear. Reviewers often check this figure first, because a wrong basemap undermines every result that follows from it.",
    ],
    quiz: [
      {
        question: "Why does the basemap matter for every later mission in Research Atlas?",
        options: [
          "It doesn't, each mission uses independent data",
          "Because later missions overlay new analysis on this same spatial foundation, so errors here would propagate forward",
          "It's only used for the homepage animation",
          "Because it looks nice",
        ],
        correctIndex: 1,
        explanation: "A shared, trusted basemap is what lets later missions' results about specific wells, slopes, or land cover actually be correct.",
      },
    ],
    challenge: {
      prompt: "Identify one monitoring station on your basemap and write one sentence connecting its terrain (elevation, slope, watershed position) to what you'd expect from its data, you'll test this prediction with real data starting in Mission 2.",
      hint: "For example: a station low in the watershed, downhill from farmland, might be more exposed to agricultural runoff.",
    },
    teachBack: {
      prompt: "In under four sentences, explain what a basemap is and why building it carefully now saves work in every later mission.",
    },
  },
];
