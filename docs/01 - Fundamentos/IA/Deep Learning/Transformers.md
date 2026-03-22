# Transformers

## Definição clara
Transformers são arquiteturas de deep learning baseadas em mecanismo de atenção, projetadas para modelar dependências de longo alcance em sequências.

## Explicação conceitual
Diferente de RNNs, Transformers processam tokens em paralelo e aprendem relações contextuais por atenção. Isso os tornou padrão para NLP e base dos LLMs.

## Como funciona internamente
1. Texto é convertido em tokens.
2. Tokens viram embeddings + codificação posicional.
3. Blocos de self-attention calculam importância entre tokens.
4. Camadas feed-forward refinam representações.
5. Head final projeta para tarefa (geração/classificação).

## Exemplos práticos
- Chatbots com LLM.
- Tradução automática.
- Resumo de documentos técnicos.

## Quando usar
- Processamento de linguagem natural em escala.
- Tarefas com contexto longo.
- Necessidade de transfer learning com modelos pré-treinados.

## Limitações
- Alto uso de memória em contexto longo.
- Custo de inferência pode ser elevado.
- Exige estratégias para reduzir alucinação.

## Relação com outros conceitos
- Depende de [[Tokenização e Embeddings]].
- É a base para [[Prompt Engineering]] e [[Retrieval-Augmented Generation (RAG) em Produção]].
- Operação em produção requer [[Observabilidade para Aplicações com LLM]].

## Exemplos em Python quando aplicável
```python
from transformers import pipeline

gerador = pipeline("text-generation", model="distilgpt2")
saida = gerador("Explain what a feature store is", max_length=40, num_return_sequences=1)
print(saida[0]["generated_text"])
```
