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
- Depende de [Tokenização e Embeddings](../NLP/Tokeniza%C3%A7%C3%A3o%20e%20Embeddings.md).
- É a base para [Prompt Engineering](../LLM%20Engineering/Prompt%20Engineering.md) e [Retrieval-Augmented Generation (RAG) em Produção](../LLM%20Engineering/Retrieval-Augmented%20Generation%20(RAG)%20em%20Produ%C3%A7%C3%A3o.md).
- Operação em produção requer [Observabilidade para Aplicações com LLM](../LLMOps/Observabilidade%20para%20Aplica%C3%A7%C3%B5es%20com%20LLM.md).

## Exemplos em Python quando aplicável
```python
from transformers import pipeline

gerador = pipeline("text-generation", model="distilgpt2")
saida = gerador("Explain what a feature store is", max_length=40, num_return_sequences=1)
print(saida[0]["generated_text"])
```
