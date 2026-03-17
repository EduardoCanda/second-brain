# Feature Store e Pipelines de Features

## Definição clara
Feature Store é um sistema para armazenar, versionar e servir features de forma consistente entre treino e inferência.

## Explicação conceitual
Ele resolve um problema clássico de engenharia: divergência entre cálculo offline e online. A mesma lógica de feature deve ser reutilizada para evitar training-serving skew.

## Como funciona internamente
1. Definição declarativa de features.
2. Pipeline batch/stream gera e materializa valores.
3. Armazenamento offline (treino) e online (baixa latência).
4. Lookup por entidade/chave durante inferência.
5. Monitoramento de frescor e qualidade.

## Exemplos práticos
- Feature "número de compras últimos 30 dias".
- Embeddings de usuário para recomendação.
- Features de risco para motor antifraude.

## Quando usar
- Múltiplos modelos reutilizando features.
- Ambientes com inferência em tempo real.
- Necessidade de governança e lineage.

## Limitações
- Custo extra de plataforma.
- Exige disciplina de versionamento de schemas.
- Complexidade com features em streaming.

## Relação com outros conceitos
- Componente essencial da [[Arquitetura de Sistemas de IA em Produção]].
- Alimenta modelos de [[Aprendizado Supervisionado]].
- Pode armazenar vetores usados em [[Tokenização e Embeddings]].

## Exemplos em Python quando aplicável
```python
# Exemplo simplificado de transformação de feature
import pandas as pd

df = pd.DataFrame({"user_id": [1, 1, 2], "valor": [100, 50, 20]})
features = df.groupby("user_id", as_index=False).agg(
    total_gasto_30d=("valor", "sum"),
    qtd_transacoes_30d=("valor", "count"),
)
print(features)
```
