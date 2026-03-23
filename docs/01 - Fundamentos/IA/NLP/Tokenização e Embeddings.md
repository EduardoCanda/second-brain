# Tokenização e Embeddings

## Definição clara
Tokenização divide texto em unidades menores (tokens). Embeddings transformam esses tokens em vetores numéricos que capturam significado semântico.

## Explicação conceitual
Em software, essa etapa é a ponte entre texto humano e computação numérica. A qualidade do embedding afeta diretamente busca semântica, classificação e geração.

## Como funciona internamente
1. Normalização de texto.
2. Tokenização (BPE, WordPiece, SentencePiece).
3. Mapeamento para IDs de vocabulário.
4. Conversão para vetores densos (embeddings).
5. Uso dos vetores em modelos downstream.

## Exemplos práticos
- Busca semântica em documentação.
- Similaridade entre tickets.
- Indexação para sistemas RAG.

## Quando usar
- Qualquer aplicação NLP moderna.
- Construção de chatbots e assistentes.
- Sistemas de recuperação de conhecimento.

## Limitações
- Perda de nuances em tokens raros.
- Limite de contexto por janela de tokens.
- Embeddings podem carregar vieses dos dados.

## Relação com outros conceitos
- Pré-requisito para [Transformers](../Deep%20Learning/Transformers.md).
- Essencial para [Retrieval-Augmented Generation (RAG) em Produção](../LLM%20Engineering/Retrieval-Augmented%20Generation%20(RAG)%20em%20Produ%C3%A7%C3%A3o.md).
- Dados vetoriais são observados em [Feature Store e Pipelines de Features](../AI%20Systems/Feature%20Store%20e%20Pipelines%20de%20Features.md).

## Exemplos em Python quando aplicável
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = model.encode([
    "deploy com blue-green",
    "estratégia de implantação sem downtime"
])
print(vectors.shape)
```
