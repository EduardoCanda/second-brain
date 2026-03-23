# Implementação de Retrieval-Augmented Generation (RAG) em Python

Esta nota apresenta uma implementação simples de um sistema RAG usando:

- OpenAI embeddings
- ChromaDB (vector database)
- Python

Objetivo: responder perguntas usando documentos locais.

------------------------------------------------------------------------

# Arquitetura da implementação

Fluxo:

Documentos ↓ Chunking ↓ Embeddings ↓ Vector Database ↓ Pergunta do
usuário ↓ Busca semântica ↓ Contexto recuperado ↓ LLM gera resposta

------------------------------------------------------------------------

# Instalação

pip install openai chromadb tiktoken

------------------------------------------------------------------------

# Estrutura do projeto

rag-project

documents/ docker.txt terraform.txt

rag.py

------------------------------------------------------------------------

# Exemplo de documento

documents/docker.txt

Docker é uma plataforma de containerização que permite empacotar
aplicações e suas dependências em containers portáveis.

------------------------------------------------------------------------

# Código de indexação

import chromadb from openai import OpenAI from pathlib import Path

client = OpenAI()

chroma = chromadb.Client()

collection = chroma.create_collection(name="docs")

docs_path = Path("documents")

documents = \[\] ids = \[\]

for i, file in enumerate(docs_path.glob("\*.txt")): text =
file.read_text() documents.append(text) ids.append(str(i))

embeddings = client.embeddings.create( model="text-embedding-3-small",
input=documents )

vectors = \[e.embedding for e in embeddings.data\]

collection.add( documents=documents, embeddings=vectors, ids=ids )

------------------------------------------------------------------------

# Consulta ao RAG

question = "O que é Docker?"

query_embedding = client.embeddings.create(
model="text-embedding-3-small", input=question ).data\[0\].embedding

results = collection.query( query_embeddings=\[query_embedding\],
n_results=2 )

context = "`\n`{=tex}".join(results\["documents"\]\[0\])

------------------------------------------------------------------------

# Geração da resposta

prompt = f""" Use o contexto abaixo para responder a pergunta.

Contexto: {context}

Pergunta: {question} """

response = client.responses.create( model="gpt-4.1-mini", input=prompt )

print(response.output_text)

------------------------------------------------------------------------

# Fluxo completo

User pergunta ↓ Embedding da pergunta ↓ Busca no vector database ↓
Recupera documentos relevantes ↓ Monta prompt com contexto ↓ LLM gera
resposta

------------------------------------------------------------------------

# Melhorias comuns

## Chunking de documentos

Dividir documentos grandes em partes menores:

500--1000 tokens

Isso melhora a qualidade da busca.

------------------------------------------------------------------------

## Re-ranking

Após a busca vetorial, um segundo modelo classifica os resultados mais
relevantes.

------------------------------------------------------------------------

## Hybrid Search

Combinação de:

- busca vetorial
- busca lexical (BM25)

------------------------------------------------------------------------

## Guardrails

Adicionar instruções no prompt:

Se a resposta não estiver no contexto, diga que não sabe responder.

------------------------------------------------------------------------

# Casos reais de uso

- chatbots de documentação técnica
- assistentes corporativos
- copilots de engenharia
- busca inteligente em bases internas
