# Métricas de Avaliação em Machine Learning

## Definição clara
Métricas de avaliação medem, de forma quantitativa, a qualidade preditiva de um modelo para orientar decisões de engenharia e negócio.

## Explicação conceitual
Sem métricas, não há critério de promoção para produção. A escolha da métrica depende do custo de erro: falso positivo, falso negativo, erro absoluto etc.

## Como funciona internamente
1. Geração de previsões em dados de validação/teste.
2. Comparação entre `y_true` e `y_pred`.
3. Cálculo de métricas (accuracy, precision, recall, F1, AUC, MAE, RMSE).
4. Definição de thresholds operacionais.

## Exemplos práticos
- Anti-fraude: priorizar recall para capturar fraudes.
- Triagem médica: otimizar sensibilidade.
- Recomendação: combinar métricas offline e A/B testing.

## Quando usar
- Sempre que houver modelo preditivo.
- Antes de deploy e em monitoramento contínuo.
- Em comparações entre versões de modelo.

## Limitações
- Métrica única pode mascarar comportamento ruim.
- Teste offline pode divergir do ambiente real.
- Datasets enviesados distorcem avaliação.

## Relação com outros conceitos
- Critério central em [[Aprendizado Supervisionado]].
- Avaliações online conectam com [[Observabilidade para Aplicações com LLM]].
- Em LLMs, também envolve [[Avaliação e Guardrails para LLMs]].

## Exemplos em Python quando aplicável
```python
from sklearn.metrics import precision_score, recall_score, f1_score

y_true = [1, 0, 1, 1, 0]
y_pred = [1, 0, 0, 1, 1]

print("precision", precision_score(y_true, y_pred))
print("recall", recall_score(y_true, y_pred))
print("f1", f1_score(y_true, y_pred))
```
