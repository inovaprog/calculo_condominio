const VALOR_M3_GAS = 6.5048;
const LEITURA_GAS_COZINHA = 5;
const LEITURA_AGUA_QUENTE = 10.194;
const LEITURA_AGUA_FRIA = 11.748;
const VALOR_CALDEIRA = 50302.38;
const TOTAL_SOMA_AGUA_QUENTE = 667.012;

const TARIFAS_AGUA_ESGOTO = {
  BASE: 93.28,
  FAIXAS: [
    { min: 0, max: 5, valor: 0.0 },
    { min: 6, max: 10, valor: 2.88 },
    { min: 11, max: 15, valor: 16.08 },
    { min: 16, max: 20, valor: 16.16 },
    { min: 21, max: 30, valor: 16.29 },
    { min: 31, max: Infinity, valor: 27.57 },
  ],
};

function calcularCustoAguaEsgoto(consumoTotal) {
  if (consumoTotal <= 0) {
    return { agua: 0, esgoto: 0, total: 0 };
  }

  let custoAgua = TARIFAS_AGUA_ESGOTO.BASE;
  let consumoRestante = consumoTotal;

  for (const faixa of TARIFAS_AGUA_ESGOTO.FAIXAS) {
    if (consumoRestante > 0 && consumoTotal >= faixa.min) {
      const consumoNaFaixa = Math.min(
        faixa.max - faixa.min + 1,
        Math.max(0, consumoRestante)
      );
      custoAgua += consumoNaFaixa * faixa.valor;
      consumoRestante -= consumoNaFaixa;
    }
  }

  return {
    total: custoAgua,
  };
}

//GAS
const valorGas = VALOR_M3_GAS * LEITURA_GAS_COZINHA;
console.log(`Custo total gas: R$ ${valorGas.toFixed(2)}`);

//AGUA
const totalConsumoAgua = LEITURA_AGUA_FRIA + LEITURA_AGUA_QUENTE;
console.log(`Consumo total de água: ${totalConsumoAgua} m³`);
const custoAguaEsgoto = calcularCustoAguaEsgoto(totalConsumoAgua);
console.log(
  `Custo total água + esgoto: R$ ${custoAguaEsgoto.total.toFixed(2)}`
);

// AQUECIMENTO DE ÁGUA
const totalTaxaFixa = (VALOR_CALDEIRA * 0.2) / 185; // quantidade de apartamentos
const valorPorMetroQuadradoAquecido =
  (VALOR_CALDEIRA * 0.8) / TOTAL_SOMA_AGUA_QUENTE;
const valorTotalAquecimentoAgua =
  valorPorMetroQuadradoAquecido * LEITURA_AGUA_QUENTE;
console.log(
  `Custo total varivavel aquecimento água: R$ ${valorTotalAquecimentoAgua.toFixed(
    2
  )}`
);
console.log(`Custo total taxa fixa: R$ ${totalTaxaFixa.toFixed(2)}`);
const totalAquecimentoAgua = valorTotalAquecimentoAgua + totalTaxaFixa;
console.log(
  `Custo total aquecimento água: R$ ${totalAquecimentoAgua.toFixed(2)}`
);
