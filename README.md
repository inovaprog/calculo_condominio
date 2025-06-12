# Calculadora de Condomínio

## Sobre o Projeto

Esta aplicação web foi desenvolvida para calcular os valores de condomínio com base no consumo de água, gás e aquecimento de água. A calculadora permite inserir leituras mensais e configurar parâmetros específicos para gerar cálculos precisos das despesas condominiais.

## Funcionalidades

- Cálculo de consumo e valor de gás
- Cálculo de consumo e valor de água e esgoto com tarifas progressivas
- Cálculo de aquecimento de água (taxa fixa e variável)
- Armazenamento local das leituras por mês
- Navegação entre meses para consulta de histórico
- Aceita números decimais com vírgula ou ponto como separador

## Fórmulas Utilizadas

### Cálculo de Gás

```
Valor do Gás = Leitura do Gás (m³) × Valor do m³ de Gás (R$)
```

### Cálculo de Água e Esgoto

O cálculo de água e esgoto utiliza um sistema de tarifas progressivas com as seguintes faixas:

1. Tarifa Base: R$ 93,28 (valor fixo)
2. Faixas de consumo:
   - 0-5 m³: R$ 0,00/m³
   - 6-10 m³: R$ 2,88/m³
   - 11-15 m³: R$ 16,08/m³
   - 16-20 m³: R$ 16,16/m³
   - 21-30 m³: R$ 16,29/m³
   - >30 m³: R$ 27,57/m³

O consumo total de água é calculado somando-se as leituras de água fria e água quente:

```
Consumo Total de Água = Leitura de Água Fria (m³) + Leitura de Água Quente (m³)
```

O valor total é a soma da tarifa base com o valor de cada faixa consumida.

### Cálculo de Aquecimento de Água

O cálculo do aquecimento de água é dividido em duas partes:

1. **Taxa Fixa**:
   ```
   Taxa Fixa = (Valor da Caldeira × 20%) ÷ 185 apartamentos
   ```

2. **Valor Variável**:
   ```
   Valor por m³ = (Valor da Caldeira × 80%) ÷ Total de Água Quente do Condomínio
   Valor Variável = Valor por m³ × Leitura de Água Quente do Apartamento
   ```

3. **Total do Aquecimento**:
   ```
   Total do Aquecimento = Taxa Fixa + Valor Variável
   ```

## Como Usar

1. Configure os valores na seção de Configurações (ícone de engrenagem)
   - Valor da Caldeira (R$)
   - Total de Água Quente do condomínio (m³)
   - Valor do m³ de Gás (R$)

2. Insira as leituras mensais:
   - Leitura do Gás (m³)
   - Leitura de Água Fria (m³)
   - Leitura de Água Quente (m³)

3. Os resultados serão calculados automaticamente e exibidos nas seções correspondentes.

4. Use os botões de navegação entre meses para consultar o histórico de leituras.
