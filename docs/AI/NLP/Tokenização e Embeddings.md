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
- Pré-requisito para [[Transformers]].
- Essencial para [[Retrieval-Augmented Generation (RAG) em Produção]].
- Dados vetoriais são observados em [[Feature Store e Pipelines de Features]].

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
