# Research Atlas

**Learn Research Like a Scientist.**

Research Atlas is a free, open-source interactive learning platform that takes complete beginners from zero knowledge to publishing environmental research — using statistics, GIS, machine learning, AI, and scientific modelling — through one continuous investigation of the **Bluewater Basin** watershed.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## The Idea

Most people learn statistics, GIS, and machine learning as separate subjects, each with disconnected toy examples. Research Atlas is built around a single fictional investigation — *is something changing in Bluewater Basin's water, and why?* — so every new skill has an immediate, concrete job to do. The groundwater well you map in Mission 1 is the same well whose trend you test in Mission 5 and predict with machine learning in Mission 7.

Bluewater Basin is a fictional but scientifically realistic coastal watershed. All datasets are synthetic. No real unpublished data is used.

---

## Learning Structure

Learning is organized into **Missions**, not chapters. Each mission is a milestone in a real scientific investigation.

| # | Mission | Field |
|---|---------|-------|
| 00 | Becoming a Researcher | Scientific Thinking |
| 01 | Understanding the Landscape | GIS & Remote Sensing |
| 02 | Collecting Environmental Data | Research Design |
| 03 | Cleaning Scientific Data | Data Science |
| 04 | Exploring Patterns | Exploratory Data Analysis |
| 05 | Scientific Statistics | Statistics |
| 06 | Regression & Prediction | Statistical Modelling |
| 07 | Machine Learning | Machine Learning |
| 08 | Spatial Analysis & GIS | Geostatistics |
| 09 | Physics-Informed AI | Physics-Informed ML |
| 10 | Quantifying Uncertainty | Bayesian Statistics |
| 11 | Scientific Communication | Scientific Writing |
| 12 | Publishing Your Research | Open Science |

Every lesson follows a strict ten-part structure: Story → Plain English → Math → Interactive Simulation → Code → Research Connection → Mini Quiz → Mission Challenge → Teach Back.

**All 13 missions and 70 lessons are fully written**, along with 13 interactive simulations (Darcy's Law, regression, watershed tracing, contour building, distributions, time series, spatial data, random forests, kriging, variograms, hydrographs, physics-informed fitting, and bootstrap uncertainty).

---

## Tech Stack

- **Next.js 15** with App Router and React Server Components
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — Bluewater Basin design tokens
- **Framer Motion** — page and simulation animations
- **Radix UI** — accessible primitives (slider, accordion, tabs, dialog)
- **KaTeX** — beautiful mathematical typesetting
- **D3 primitives** — data manipulation for simulations
- **Vercel Analytics** — anonymous, cookieless page analytics
- **Anthropic API** — optional, powers the Ask Atlas assistant

No database. Progress is stored locally in `localStorage`.

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/your-org/research-atlas.git
cd research-atlas

# 2. Install
npm install

# 3. Configure (optional — Ask Atlas degrades gracefully without a key)
cp .env.example .env.local
# Add ANTHROPIC_API_KEY=sk-ant-... to .env.local

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

One-click on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/research-atlas)

Add `ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings to enable the live Ask Atlas assistant. The platform builds and runs without it.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The highest-value contributions right now are:

- New lesson content for Missions 02–12 following the ten-part structure
- Additional interactive simulations (kriging, variogram, random forest, neural network)
- Peer review of scientific content in Missions 00 and 01

All new content must use Bluewater Basin data and follow the lesson structure in `lib/missions/types.ts`.

---

## Project Structure

```
research-atlas/
├── app/                      # Next.js App Router pages
│   ├── api/ask-atlas/        # Ask Atlas API route
│   ├── missions/             # Mission + lesson pages
│   ├── simulations/          # Standalone simulation pages
│   ├── curriculum/
│   ├── about/
│   └── ...
├── components/
│   ├── layout/               # Header, footer
│   ├── missions/             # Mission roadmap, lesson view
│   ├── simulations/          # Darcy, regression, contour, watershed
│   └── ui/                   # Quiz, code block, equation, Ask Atlas, FAQ
├── content/missions/         # Lesson content arrays (Missions 00 & 01 complete)
├── hooks/                    # useProgress (localStorage)
├── lib/
│   ├── missions/             # Data model + types
│   ├── simulations/          # Simulation catalog
│   └── utils/                # cn(), synthetic-terrain
└── public/                   # favicon, static assets
```

---

## License

MIT — see [LICENSE](LICENSE).
