document.addEventListener("DOMContentLoaded", function () {
  // Initialize configuration toggle
  const configSection = document.querySelector(".config-section");
  const configToggle = document.querySelector(".config-toggle");

  configToggle.addEventListener("click", () => {
    configSection.classList.toggle("collapsed");
  });

  const valorCaldeiraInput = document.getElementById("valor-caldeira");
  const totalAguaQuenteInput = document.getElementById("total-agua-quente");
  const valorM3GasInput = document.getElementById("valor-m3-gas");
  const leituraGasInput = document.getElementById("leitura-gas");
  const leituraAguaFriaInput = document.getElementById("leitura-agua-fria");
  const leituraAguaQuenteInput = document.getElementById("leitura-agua-quente");

  const inputs = [
    { element: valorCaldeiraInput, key: 'valorCaldeira' },
    { element: totalAguaQuenteInput, key: 'totalAguaQuente' },
    { element: valorM3GasInput, key: 'valorM3Gas' },
    { element: leituraGasInput, key: 'leituraGas' },
    { element: leituraAguaFriaInput, key: 'leituraAguaFria' },
    { element: leituraAguaQuenteInput, key: 'leituraAguaQuente' }
  ];

  // Load saved values
  function loadSavedValues() {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const savedData = JSON.parse(localStorage.getItem('calculadoraCondominio') || '{}');
    const monthData = savedData[currentMonth] || {};
    
    inputs.forEach(({ element, key }) => {
      if (monthData[key] !== undefined) {
        element.value = monthData[key];
      }
    });
  }

  // Save values to localStorage
  function saveValues() {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const savedData = JSON.parse(localStorage.getItem('calculadoraCondominio') || '{}');
    
    if (!savedData[currentMonth]) {
      savedData[currentMonth] = {};
    }

    inputs.forEach(({ element, key }) => {
      savedData[currentMonth][key] = element.value;
    });

    localStorage.setItem('calculadoraCondominio', JSON.stringify(savedData));
  }

  // Add input event listeners
  inputs.forEach(({ element }) => {
    element.addEventListener("input", () => {
      updateCalculations();
      saveValues();
    });
  });

  // Load saved values and update calculations
  loadSavedValues();
  updateCalculations();

  function parseDecimalInput(value) {
    if (typeof value === 'string') {
      return parseFloat(value.replace(',', '.')) || 0;
    }
    return parseFloat(value) || 0;
  }

  function updateCalculations() {
    const valorCaldeira = parseDecimalInput(valorCaldeiraInput.value);
    const totalAguaQuente = parseDecimalInput(totalAguaQuenteInput.value);
    const valorM3Gas = parseDecimalInput(valorM3GasInput.value);
    const leituraGas = parseDecimalInput(leituraGasInput.value);
    const leituraAguaFria = parseDecimalInput(leituraAguaFriaInput.value);
    const leituraAguaQuente = parseDecimalInput(leituraAguaQuenteInput.value);

    updateGasCalculation(leituraGas, valorM3Gas);
    updateWaterCalculation(leituraAguaFria - leituraAguaQuente, leituraAguaQuente);
    updateHeatingCalculation(leituraAguaQuente, valorCaldeira, totalAguaQuente);
  }

  function updateGasCalculation(leituraGas, valorM3Gas) {
    const valorGas = valorM3Gas * leituraGas;

    document.getElementById(
      "gas-calculation"
    ).textContent = `${leituraGas.toFixed(2)} × ${valorM3Gas.toFixed(
      2
    )} = R$ ${valorGas.toFixed(2)}`;

    document.getElementById("gas-total").textContent = `R$ ${valorGas.toFixed(
      2
    )}`;

    return valorGas;
  }

  function updateWaterCalculation(leituraAguaFria, leituraAguaQuente) {
    const totalConsumoAgua = leituraAguaFria + leituraAguaQuente;

    // Atualiza o consumo total
    document.getElementById(
      "water-consumption"
    ).textContent = `${leituraAguaFria.toFixed(
      4
    )} + ${leituraAguaQuente.toFixed(4)} = ${totalConsumoAgua.toFixed(4)} m³`;

    const custoAguaEsgoto = calcularCustoAguaEsgoto(totalConsumoAgua);

    // Update active state and consumption of tiers
    document.querySelectorAll(".tier").forEach((tier) => {
      tier.classList.remove("active");
    });

    let consumoRestante = totalConsumoAgua;
    for (const faixa of TARIFAS_AGUA_ESGOTO.FAIXAS) {
      const tierId = `tier-${faixa.min}-${
        faixa.max === Infinity ? "plus" : faixa.max
      }`;
      const tierElement = document.getElementById(tierId);

      if (tierElement) {
        if (consumoRestante > 0 && totalConsumoAgua >= faixa.min) {
          tierElement.classList.add("active");
          const consumoNaFaixa = Math.min(
            faixa.max - faixa.min + (faixa.min === 0 ? 0 : 1),
            Math.max(0, consumoRestante)
          );

          const valorNaFaixa = consumoNaFaixa * faixa.valor;

          tierElement.querySelector(
            ".tier-consumption"
          ).textContent = `${consumoNaFaixa.toFixed(2)} m³`;
          tierElement.querySelector(
            ".tier-value"
          ).textContent = `R$ ${valorNaFaixa.toFixed(2)}`;

          consumoRestante -= consumoNaFaixa;
        } else {
          tierElement.querySelector(".tier-consumption").textContent = "0 m³";
          tierElement.querySelector(".tier-value").textContent = "R$ 0.00";
        }
      }
    }

    document.getElementById(
      "water-total"
    ).textContent = `R$ ${custoAguaEsgoto.total.toFixed(2)}`;

    return custoAguaEsgoto.total;
  }

  function updateHeatingCalculation(
    leituraAguaQuente,
    valorCaldeira,
    totalAguaQuente
  ) {
    const totalTaxaFixa = (valorCaldeira * 0.2) / 185;
    const valorPorMetroQuadradoAquecido =
      (valorCaldeira * 0.8) / totalAguaQuente;
    const valorTotalAquecimentoAgua =
      valorPorMetroQuadradoAquecido * leituraAguaQuente;
    const totalAquecimentoAgua = valorTotalAquecimentoAgua + totalTaxaFixa;

    document.getElementById(
      "fixed-rate-calculation"
    ).textContent = `${valorCaldeira.toFixed(
      2
    )} × 0.2 ÷ 185 = R$ ${totalTaxaFixa.toFixed(2)}`;

    document.getElementById(
      "rate-per-m3-calculation"
    ).textContent = `${valorCaldeira.toFixed(
      2
    )} × 0.8 ÷ ${totalAguaQuente.toFixed(
      3
    )} = R$ ${valorPorMetroQuadradoAquecido.toFixed(2)}`;

    document.getElementById(
      "variable-cost-calculation"
    ).textContent = `${valorPorMetroQuadradoAquecido.toFixed(
      2
    )} × ${leituraAguaQuente.toFixed(
      4
    )} = R$ ${valorTotalAquecimentoAgua.toFixed(2)}`;

    // Atualiza os valores nos componentes
    document.getElementById(
      "fixed-rate-total"
    ).textContent = `R$ ${totalTaxaFixa.toFixed(2)}`;
    document.getElementById(
      "variable-cost-total"
    ).textContent = `R$ ${valorTotalAquecimentoAgua.toFixed(2)}`;
    document.getElementById(
      "heating-total"
    ).textContent = `R$ ${totalAquecimentoAgua.toFixed(2)}`;

    return totalAquecimentoAgua;
  }

  // Month Navigation
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const currentMonthSpan = document.querySelector(".current-month");

  function updateMonthDisplay() {
    const prevDate = new Date(currentYear, currentMonth - 1);
    const nextDate = new Date(currentYear, currentMonth + 1);

    prevMonthBtn.textContent = `◀ ${
      months[prevDate.getMonth()]
    } ${prevDate.getFullYear()}`;
    currentMonthSpan.textContent = `${months[currentMonth]} ${currentYear}`;
    nextMonthBtn.textContent = `${
      months[nextDate.getMonth()]
    } ${nextDate.getFullYear()} ▶`;
  }

  prevMonthBtn.addEventListener("click", () => {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    updateMonthDisplay();
  });

  nextMonthBtn.addEventListener("click", () => {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    updateMonthDisplay();
  });

  updateMonthDisplay();
});
