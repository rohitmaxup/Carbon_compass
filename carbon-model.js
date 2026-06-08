(function attachCarbonModel(root) {
  const labels = {
    transport: "Ground transport",
    flights: "Flights",
    energy: "Home energy",
    food: "Food",
    goods: "Goods",
  };

  const colors = {
    transport: "#3d6fb6",
    flights: "#2aa6a1",
    energy: "#f3c969",
    food: "#e76f51",
    goods: "#1f8a5b",
  };

  const actions = [
    {
      id: "transit",
      title: "Swap two car trips",
      description: "Use public transit, cycling, walking, or carpooling twice per week.",
      saving: 0.32,
    },
    {
      id: "energy",
      title: "Lower home energy",
      description: "Shift to efficient bulbs, mindful AC use, and unplug idle devices.",
      saving: 0.24,
    },
    {
      id: "food",
      title: "Plant-rich weekdays",
      description: "Make weekday meals mostly plant-based without changing every meal.",
      saving: 0.41,
    },
    {
      id: "repair",
      title: "Buy less, repair more",
      description: "Choose repair, reuse, and slower purchases for clothing and gadgets.",
      saving: 0.18,
    },
  ];

  function calculateFootprint(values) {
    const dietFactors = { plant: 0.9, mixed: 1.65, meat: 2.35 };
    const shoppingFactors = { low: 0.55, medium: 1.05, high: 1.75 };

    return {
      transport: (Number(values.carKm) * 52 * 0.171) / 1000,
      flights: Number(values.flights) * 0.38,
      energy: (Number(values.electricity) * 12 * 0.55) / 1000,
      food: dietFactors[values.diet],
      goods: shoppingFactors[values.shopping],
    };
  }

  function sumFootprint(footprint) {
    return Object.values(footprint).reduce((sum, value) => sum + value, 0);
  }

  function getTopCategory(footprint) {
    return Object.entries(footprint).sort((a, b) => b[1] - a[1])[0];
  }

  function calculateSavings(selectedIds) {
    return actions
      .filter((action) => selectedIds.has(action.id))
      .reduce((sum, action) => sum + action.saving, 0);
  }

  const model = {
    actions,
    labels,
    colors,
    calculateFootprint,
    sumFootprint,
    getTopCategory,
    calculateSavings,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = model;
  }

  root.CarbonModel = model;
})(typeof globalThis !== "undefined" ? globalThis : window);
