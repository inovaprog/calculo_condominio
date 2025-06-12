document.addEventListener("DOMContentLoaded", function () {
  const valorCaldeiraInput = document.getElementById("valor-caldeira");
  const totalAguaQuenteInput = document.getElementById("total-agua-quente");
  const valorM3GasInput = document.getElementById("valor-m3-gas");
  const leituraGasInput = document.getElementById("leitura-gas");
  const leituraAguaFriaInput = document.getElementById("leitura-agua-fria");
  const leituraAguaQuenteInput = document.getElementById("leitura-agua-quente");

  const inputs = [
    valorCaldeiraInput,
    totalAguaQuenteInput,
    valorM3GasInput,
    leituraGasInput,
    leituraAguaFriaInput,
    leituraAguaQuenteInput,
  ];

  inputs.forEach((input) => {
    input.addEventListener("input", updateCalculations);
  });

  updateCalculations();

  function updateCalculations() {
    const valorCaldeira = parseFloat(valorCaldeiraInput.value) || 0;
    const totalAguaQuente = parseFloat(totalAguaQuenteInput.value) || 0;
    const valorM3Gas = parseFloat(valorM3GasInput.value) || 0;
    const leituraGas = parseFloat(leituraGasInput.value) || 0;
    const leituraAguaFria = parseFloat(leituraAguaFriaInput.value) || 0;
    const leituraAguaQuente = parseFloat(leituraAguaQuenteInput.value) || 0;

    updateGasCalculation(leituraGas, valorM3Gas);
    updateWaterCalculation(leituraAguaFria, leituraAguaQuente);
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
            faixa.max - faixa.min + 1,
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

    document.getElementById(
      "heating-total"
    ).textContent = `R$ ${totalAquecimentoAgua.toFixed(2)}`;

    return totalAquecimentoAgua;
  }
});
