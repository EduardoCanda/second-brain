# Retrieval-Augmented Generation (RAG)

## Definição

Retrieval-Augmented Generation (RAG) é uma técnica utilizada em sistemas de IA generativa onde um modelo de linguagem (LLM) gera respostas utilizando **informações recuperadas de uma base de conhecimento externa**.

Em vez de depender apenas do conhecimento adquirido durante o treinamento, o modelo recebe **contexto adicional recuperado dinamicamente** antes de gerar a resposta.

Esse processo melhora:

- precisão
- atualização do conhecimento
- confiabilidade das respostas

---

## Problema que o RAG resolve

Modelos de linguagem possuem algumas limitações:

1. Conhecimento limitado ao momento do treinamento
2. Possibilidade de **alucinação**
3. Incapacidade de acessar **dados internos de uma empresa**

O RAG resolve isso adicionando um mecanismo de **busca de informações relevantes** antes da geração da resposta.

---

## Fluxo de funcionamento

O fluxo básico de um sistema RAG é:

Pergunta do usuário
↓
Conversão da pergunta em embedding
↓
Busca semântica em banco vetorial
↓
Recuperação de documentos relevantes
↓
Envio dos documentos + pergunta para o LLM
↓
Geração da resposta
---

## Componentes principais

### 1. Base de conhecimento

Coleção de documentos que o sistema pode consultar.

Exemplos:

- PDFs
- documentação técnica
- wiki interna
- base de código
- artigos
- logs

Esses documentos são normalmente divididos em **chunks menores** antes da indexação.

---

### 2. Embeddings

Embeddings são representações vetoriais de texto que capturam **significado semântico**.

Exemplo:
“como iniciar container docker”
“como subir um container docker”

Essas frases terão embeddings próximos no espaço vetorial.

Isso permite **busca semântica**, não apenas por palavras-chave.

---

### 3. Vector Database

Banco especializado para armazenar embeddings e realizar busca por similaridade.

Função principal:
encontrar os vetores mais próximos de uma consulta

Exemplos:

- Pinecone
- Weaviate
- Milvus
- Chroma
- Qdrant

---

### 4. Retrieval (recuperação)

Quando o usuário faz uma pergunta:

1. a pergunta vira um embedding
2. o sistema busca vetores similares
3. retorna os **top-k documentos mais relevantes**

---

### 5. Generation (LLM)

Os documentos recuperados são enviados para o modelo de linguagem como **contexto adicional**.

Exemplo de prompt interno:
Contexto:
[trechos de documentos]

Pergunta:
Como criar um container Docker?

Responda usando apenas o contexto acima.
O modelo gera a resposta com base nesses dados.

---

## Arquitetura típica
User
↓
API
↓
Embedding Model
↓
Vector Database
↓
Top-K documentos
↓
LLM
↓
Resposta
---

## Vantagens do RAG

### Conhecimento atualizado

Não é necessário treinar novamente o modelo.

Basta adicionar novos documentos à base.

---

### Integração com dados internos

Permite criar assistentes baseados em:

- documentação interna
- bases de conhecimento
- sistemas corporativos

---

### Redução de alucinações

O modelo responde usando **informação real recuperada**.

---

## Casos de uso comuns

- assistentes de documentação
- chatbots corporativos
- busca inteligente em bases de conhecimento
- suporte técnico automatizado
- copilots de engenharia

---

## Comparação

### Fine-tuning

Treinar o modelo novamente com novos dados.

Problemas:

- caro
- lento
- difícil de atualizar

---

### RAG

Adicionar dados externos e recuperar contexto dinamicamente.

Vantagens:

- atualização rápida
- menor custo
- mais controle
