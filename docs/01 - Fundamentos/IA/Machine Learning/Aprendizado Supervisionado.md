# Aprendizado Supervisionado

## Definição clara
Aprendizado supervisionado é o treinamento de modelos com dados rotulados, onde cada entrada possui uma saída esperada.

## Explicação conceitual
É o paradigma mais próximo de problemas clássicos de software orientados a contrato: dado `X`, aprender função `f(X)=y`. Muito usado para classificação e regressão.

## Como funciona internamente
1. Coleta de dataset `(features, label)`.
2. Divisão em treino/validação/teste.
3. Otimização dos parâmetros para minimizar erro.
4. Avaliação com métricas adequadas.
5. Deploy e monitoramento de drift.

## Exemplos práticos
- Previsão de churn.
- Detecção de fraude.
- Classificação de sentimento.

## Quando usar
- Labels disponíveis ou viáveis de anotar.
- Métrica de negócio clara (precisão, recall, MAE).
- Necessidade de previsões reproduzíveis.

## Limitações
- Custo alto de rotulagem.
- Overfitting em datasets pequenos.
- Sensível a desbalanceamento de classes.

## Relação com outros conceitos
- Usa [[Métricas de Avaliação em Machine Learning]] para decisão técnica.
- Pode ser implementado com [[Redes Neurais Artificiais]].
- Em NLP moderno, conecta com [[Transformers]].

## Exemplos em Python quando aplicável
```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

X = [[0, 1], [1, 1], [1, 0], [0, 0]]
y = [1, 1, 0, 0]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
preds = model.predict(X_test)
print(classification_report(y_test, preds, zero_division=0))
```
