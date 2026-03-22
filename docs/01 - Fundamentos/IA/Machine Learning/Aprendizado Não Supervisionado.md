# Aprendizado Não Supervisionado

## Definição clara
Aprendizado não supervisionado identifica estruturas e padrões em dados sem rótulos explícitos.

## Explicação conceitual
É útil quando o time de engenharia possui muitos dados, mas pouco contexto rotulado. O foco deixa de ser prever um alvo e passa a ser entender distribuição e segmentação.

## Como funciona internamente
1. Extração e normalização de features.
2. Escolha de técnica: clusterização, redução de dimensionalidade, detecção de anomalia.
3. Ajuste de hiperparâmetros (ex.: número de clusters).
4. Interpretação com apoio de especialistas de domínio.

## Exemplos práticos
- Segmentação de usuários por comportamento.
- Agrupamento de incidentes similares.
- Detecção de outliers em telemetria.

## Quando usar
- Ausência de labels confiáveis.
- Fase exploratória de produto/dados.
- Necessidade de descoberta de padrões ocultos.

## Limitações
- Difícil validação objetiva.
- Clusters podem não ter significado de negócio.
- Sensível a escala e representação de features.

## Relação com outros conceitos
- Pode gerar pseudo-rótulos para [[Aprendizado Supervisionado]].
- Embeddings de [[Tokenização e Embeddings]] são base para clusterização semântica.
- Em produção, depende de [[Feature Store e Pipelines de Features]].

## Exemplos em Python quando aplicável
```python
from sklearn.cluster import KMeans

X = [[1, 2], [1, 1], [10, 10], [11, 10]]
model = KMeans(n_clusters=2, random_state=42, n_init=10)
labels = model.fit_predict(X)
print(labels)
```
