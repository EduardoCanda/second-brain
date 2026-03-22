# Redes Neurais Artificiais

## Definição clara
Redes neurais artificiais são modelos compostos por camadas de neurônios computacionais que aprendem representações complexas dos dados.

## Explicação conceitual
Para engenheiros, uma rede neural é uma função parametrizada altamente flexível. Ela substitui engenharia manual de regras por aprendizado de representações hierárquicas.

## Como funciona internamente
1. **Forward pass**: dados percorrem camadas e geram previsão.
2. **Loss**: cálculo do erro entre previsão e verdade.
3. **Backpropagation**: gradientes são propagados para trás.
4. **Otimização**: pesos atualizados (SGD/Adam).

## Exemplos práticos
- Classificação de imagens.
- Speech-to-text.
- Detecção de anomalias em séries temporais.

## Quando usar
- Dados não lineares e alta complexidade.
- Problemas com grande volume de dados.
- Casos em que desempenho supera necessidade de interpretabilidade.

## Limitações
- Alto custo computacional.
- Difícil explicabilidade em alguns cenários.
- Risco de overfitting sem regularização.

## Relação com outros conceitos
- Evolução de [[Aprendizado Supervisionado]].
- Base arquitetural para [[Transformers]].
- Requer pipeline robusto de [[Feature Store e Pipelines de Features]].

## Exemplos em Python quando aplicável
```python
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),
    nn.Linear(32, 1)
)

x = torch.randn(4, 10)
y = model(x)
print(y.shape)  # torch.Size([4, 1])
```
