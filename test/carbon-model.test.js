const assert = require("node:assert/strict");
const test = require("node:test");
const {
  actions,
  calculateFootprint,
  calculateSavings,
  getTopCategory,
  sumFootprint,
} = require("../carbon-model");

test("calculates all footprint categories from user inputs", () => {
  const footprint = calculateFootprint({
    carKm: 120,
    flights: 2,
    electricity: 220,
    diet: "mixed",
    shopping: "medium",
  });

  assert.equal(Object.keys(footprint).length, 5);
  assert.equal(Number(footprint.transport.toFixed(3)), 1.067);
  assert.equal(footprint.flights, 0.76);
  assert.equal(Number(footprint.energy.toFixed(3)), 1.452);
  assert.equal(footprint.food, 1.65);
  assert.equal(footprint.goods, 1.05);
});

test("identifies top category and total footprint", () => {
  const footprint = { transport: 1, flights: 0.5, energy: 2, food: 1.2, goods: 0.8 };

  assert.deepEqual(getTopCategory(footprint), ["energy", 2]);
  assert.equal(sumFootprint(footprint), 5.5);
});

test("calculates selected action savings only", () => {
  const selected = new Set(["food", "repair"]);
  const expected = actions.find((action) => action.id === "food").saving
    + actions.find((action) => action.id === "repair").saving;

  assert.equal(calculateSavings(selected), expected);
});
