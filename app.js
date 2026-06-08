const form = document.querySelector("#calculator-form");
const chart = document.querySelector("#footprint-chart");
const ctx = chart.getContext("2d");
const legend = document.querySelector("#legend");
const actionGrid = document.querySelector("#action-grid");
const insightPanel = document.querySelector("#insight-panel");
const { actions, labels, colors, calculateFootprint, sumFootprint, getTopCategory, calculateSavings } = window.CarbonModel;

const state = {
  selectedActions: new Set(),
};

function getValues() {
  const data = new FormData(form);
  return {
    carKm: Number(data.get("carKm")),
    flights: Number(data.get("flights")),
    electricity: Number(data.get("electricity")),
    diet: data.get("diet"),
    shopping: data.get("shopping"),
  };
}

function formatNumber(value, digits = 1) {
  return value.toFixed(digits);
}

function updateOutputs(values) {
  document.querySelector("#car-output").textContent = `${values.carKm} km`;
  document.querySelector("#flight-output").textContent = `${values.flights} ${values.flights === 1 ? "trip" : "trips"}`;
  document.querySelector("#electricity-output").textContent = `${values.electricity} kWh / month`;
}

function drawChart(data) {
  const entries = Object.entries(data);
  const total = sumFootprint(data);
  const centerX = chart.width / 2;
  const centerY = 210;
  const radius = 132;
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, chart.width, chart.height);
  ctx.fillStyle = "#fbfcf7";
  ctx.fillRect(0, 0, chart.width, chart.height);

  entries.forEach(([key, value]) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = colors[key];
    ctx.fill();
    start += slice;
  });

  ctx.beginPath();
  ctx.arc(centerX, centerY, 76, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.fillStyle = "#10231f";
  ctx.font = "800 44px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(formatNumber(total), centerX, centerY - 6);
  ctx.font = "700 16px system-ui, sans-serif";
  ctx.fillStyle = "#5d6d67";
  ctx.fillText("tCO2e / year", centerX, centerY + 24);

  legend.innerHTML = entries
    .map(([key, value]) => `<span><i style="background:${colors[key]}"></i>${labels[key]} ${formatNumber(value)}</span>`)
    .join("");
}

function updateSummary(data) {
  const total = sumFootprint(data);
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const [topKey, topValue] = getTopCategory(data);
  const savings = calculateSavings(state.selectedActions);
  const potential = Math.min(42, Math.round((savings / total) * 100));

  document.querySelector("#total-score").textContent = formatNumber(total);
  document.querySelector("#hero-score").textContent = formatNumber(total);
  document.querySelector("#hero-progress").textContent = `${potential}%`;
  document.querySelector("#saved-score").textContent = savings.toFixed(2);
  document.querySelector("#top-category").textContent = `${labels[topKey]} contributes about ${formatNumber(topValue)} tCO2e each year.`;
  document.querySelector("#summary-text").textContent =
    total < 4
      ? "Your current estimate is below many urban averages. Protect that progress with consistent low-carbon habits."
      : total < 7
        ? "Your footprint is moderate. A few high-leverage swaps can create visible yearly savings."
        : "Your footprint has several reduction opportunities. Start with the largest category for the fastest improvement.";

  const max = sorted[0][1];
  document.querySelector("#mini-bars").innerHTML = sorted
    .map(([key, value]) => `<span style="height:${Math.max(8, (value / max) * 48)}px;background:${colors[key]}"></span>`)
    .join("");
}

function renderActions() {
  actionGrid.innerHTML = actions
    .map(
      (action) => `
        <article class="action-card ${state.selectedActions.has(action.id) ? "active" : ""}">
          <div>
            <h3>${action.title}</h3>
            <p>${action.description}</p>
          </div>
          <button type="button" data-action="${action.id}">
            ${state.selectedActions.has(action.id) ? "Added" : `Add ${action.saving.toFixed(2)} tCO2e`}
          </button>
        </article>
      `,
    )
    .join("");
}

function renderInsights(data) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const insightCopy = sorted.slice(0, 3).map(([key], index) => {
    const copy = {
      transport: "Reduce solo car kilometers first. Even partial substitution compounds across the full year.",
      flights: "Flight emissions rise quickly. Replace one short flight with rail or virtual meetings when possible.",
      energy: "Target appliance efficiency and cooling behavior. Small daily changes can become dependable savings.",
      food: "Use plant-rich meals as a repeatable default instead of an all-or-nothing diet change.",
      goods: "Slow down purchases and extend product life. Repair and reuse are quiet high-impact habits.",
    };
    return `
      <div class="insight-item">
        <span class="insight-number">${index + 1}</span>
        <div>
          <strong>${labels[key]}</strong>
          <p>${copy[key]}</p>
        </div>
      </div>
    `;
  });

  insightPanel.innerHTML = insightCopy.join("");
}

function updateApp() {
  const values = getValues();
  const footprint = calculateFootprint(values);
  updateOutputs(values);
  drawChart(footprint);
  updateSummary(footprint);
  renderInsights(footprint);
}

form.addEventListener("input", updateApp);
form.addEventListener("change", updateApp);

actionGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.action;
  if (state.selectedActions.has(id)) {
    state.selectedActions.delete(id);
  } else {
    state.selectedActions.add(id);
  }

  renderActions();
  updateApp();
});

renderActions();
updateApp();
