# Carbon Compass

Carbon Compass is a carbon footprint awareness platform built for PromptWars Virtual Main Challenge 3. It helps individuals estimate, understand, and reduce their yearly carbon footprint through a calculator, category insights, and an action tracker.

## Chosen Challenge Vertical

[Challenge 3] Carbon Footprint Awareness Platform

## Approach and Logic

The solution follows a simple habit-first flow:

1. The user enters approximate lifestyle inputs for travel, electricity, diet, and shopping.
2. The app estimates yearly emissions in tonnes of CO2 equivalent.
3. The interface highlights the user's largest category so they know where to start.
4. The user selects practical actions and sees estimated yearly savings.

This keeps the experience quick, educational, and personalized enough to guide real behavior.

## Features

- Personal carbon footprint calculator for transport, flights, energy, diet, and shopping.
- Live emissions breakdown chart rendered with Canvas.
- Personalized top-impact insights based on the user's largest categories.
- Action tracker that estimates yearly carbon savings.
- Responsive, accessible static web interface.
- No backend or external API required.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js built-in test runner for logic tests

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server.

```bash
python -m http.server 5173
```

Then visit:

```text
http://localhost:5173
```

## Test

Run logic tests:

```bash
npm test
```

Run syntax checks:

```bash
npm run check
```



## Notes

The calculator uses simple educational estimates rather than a formal audit. It is designed for awareness, comparison, and habit planning.

## Assumptions

- Car travel uses an average passenger vehicle estimate.
- Flights are represented as average short-to-medium trip estimates.
- Electricity uses a simple grid-emissions approximation.
- Diet and shopping are modeled as lifestyle bands.
- Savings values are approximate and intended for planning, not certification.
