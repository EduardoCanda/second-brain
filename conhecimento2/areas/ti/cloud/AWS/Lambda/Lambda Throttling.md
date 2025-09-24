---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
---
## 🧠 **Como resolver uma [[Lambda Detalhes|Lambda]] em throttling?**

### 📌 Primeiro, entenda o que significa "throttling"

> Throttling em AWS Lambda ocorre quando a função atinge o limite de concorrência configurado (ou o default), e a AWS rejeita invocações adicionais com o erro ThrottlingException.
> 

---

## 🔍 **Passo a passo para resolver uma Lambda em throttling**

---

### ✅ **1. Identificar o tipo de limite que está sendo atingido**

Use o **CloudWatch Metrics** da Lambda para inspecionar:

- `Throttles` (número de invocações rejeitadas)
- `ConcurrentExecutions` (execuções simultâneas)
- `Duration` (tempo médio de execução)
- `Invocations` (volume de chamadas)

> Essas métricas ajudarão a entender se o throttling é causado por pico de invocações ou por funções que estão demorando muito para concluir.
> 

---

### ✅ **2. Verificar e ajustar a concorrência**

A AWS impõe:

- Um **limite regional de concorrência padrão** (ex: 1.000 execuções simultâneas por conta por região, ajustável)
- E uma **concorrência reservada por função** (caso você tenha configurado manualmente)

### Soluções:

- **Aumentar o limite de concorrência da função (Reserved Concurrency)**:
    
    ```bash
    bash
    CopiarEditar
    aws lambda put-function-concurrency \
      --function-name my-function \
      --reserved-concurrent-executions 200
    
    ```
    
- **Solicitar aumento do limite regional via AWS Support**

---

### ✅ **3. Analisar a origem das invocações**

> Muitas vezes, a Lambda não é o problema, mas sim o serviço que a invoca em excesso, como:
> 

| Serviço             | Comportamento Típico que Causa Throttling    |
| ------------------- | -------------------------------------------- |
| [[SQS]]             | Altíssimo volume de mensagens em curto tempo |
| [[Api Gateway AWS]] | Picos de tráfego externo simultâneo          |
| [[Event Bridge]]    | Muitos eventos disparados em bursts          |
| DynamoDB Streams    | Alta taxa de escrita no banco                |

### Soluções específicas:

- **SQS**: ajustar o batch size e `maximum concurrency` do event source mapping
- **API Gateway**: usar throttling a nível de API + WAF + caching (se aplicável)
- **EventBridge**: usar retries com backoff e filtros para reduzir volume

---

### ✅ **4. Aplicar backoff e retry no cliente**

Se a invocação for feita por você (ex: outro Lambda ou serviço seu), implemente:

- **Exponential backoff com jitter**
- Retry configurável, respeitando o limite do sistema downstream

Isso é particularmente importante para chamadas assíncronas ou indiretas, como por SNS, SQS, Step Functions.

---

### ✅ **5. Reduzir tempo de execução da Lambda (otimização)**

Quanto mais tempo a função leva, **mais ela ocupa slots de execução simultânea**.

### Soluções:

- Otimizar o código (reduzir I/O, paralelizar internamente)
- Aumentar **memory allocation** (o que também melhora CPU proporcionalmente)
- Separar responsabilidades em funções menores (eventualmente com um BFF ou camada de orquestração)

---

### ✅ **6. Implementar DLQ (Dead Letter Queue) ou SQS fallback**

Para evitar perda de mensagens ou falhas silenciosas:

- Configure **DLQ** para funções com invocação assíncrona
- Configure **SQS fallback** para armazenar chamadas rejeitadas e processar posteriormente

---

### ✅ **7. Usar Lambda Function URLs ou alternativas de invocação direta com throttling controlado**

Para integrações HTTP diretas, considere:

- Usar API Gateway com **rate limiting**
- Criar **circuit breakers** via middleware
- Ou substituir Lambda por um serviço containerizado se o padrão de carga for intenso e contínuo

---

## ✅ **Conclusão para entrevista**

> “Quando uma Lambda entra em throttling, o primeiro passo é analisar as métricas no CloudWatch para entender o padrão de uso. Avalio se o problema está no volume de chamadas, tempo de execução, ou no limite de concorrência configurado. Em seguida, considero estratégias como: aumentar a concorrência reservada, otimizar o código, aplicar retries com backoff, e controlar melhor as fontes de invocação (como SQS ou EventBridge). Já resolvi casos assim ajustando o batch size, otimizando o tempo da função e isolando o processamento em filas assíncronas.”
> 

### Onde está configurada a imagem que o Docker usa?

## 🐳 **Onde está configurada a imagem que o Docker usa?**

Depende do **contexto em que o Docker está sendo utilizado** — mas, em geral, a **imagem usada por um container Docker é especificada na instrução `FROM` do `Dockerfile` ou na referência à imagem em comandos ou arquivos de orquestração.**

---

### 📄 **1. Dockerfile (`FROM`)**

No desenvolvimento ou build de imagens, a imagem base é especificada diretamente no `Dockerfile`, via:

```
dockerfile
CopiarEditar
FROM node:18-alpine

```

> Aqui o Docker usará a imagem node:18-alpine como base para construir a nova imagem.
> 

---

### 🧪 **2. Comando `docker run`**

Se você estiver executando um container manualmente, a imagem é especificada diretamente no comando:

```bash
bash
CopiarEditar
docker run nginx:1.25-alpine

```

> Aqui o Docker usa a imagem nginx:1.25-alpine e inicia o container.
> 

---

### 📦 **3. Arquivos de orquestração (Docker Compose, Kubernetes, ECS, etc.)**

### a) **Docker Compose (docker-compose.yml)**

```yaml
yaml
CopiarEditar
services:
  app:
    image: myorg/myapp:latest

```

> Aqui o Compose sabe qual imagem puxar para iniciar o serviço app.
> 

---

### b) **Kubernetes (manifests `Deployment.yaml`)**

```yaml
yaml
CopiarEditar
containers:
- name: api
  image: myorg/myapi:v1.2.0

```

> O kubelet usará a imagem informada para executar o Pod.
> 

---

### c) **AWS ECS (task definition)**

```json
json
CopiarEditar
"containerDefinitions": [
  {
    "name": "backend",
    "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/app:v3"
  }
]

```

> O ECS usará essa imagem, geralmente hospedada no ECR (Elastic Container Registry), ao iniciar a task.
> 

---

### d) **Lambda com imagem container**

Quando você usa Lambda com container image, a imagem é definida via CLI ou no console:

```bash
bash
CopiarEditar
aws lambda create-function \
  --package-type Image \
  --code ImageUri=123456789012.dkr.ecr.us-east-1.amazonaws.com/lambda-func:latest

```

---

## 🧠 **Resumo técnico: onde a imagem é definida depende de onde você está:**

| Ambiente | Local de definição da imagem |
| --- | --- |
| Docker local | `FROM` no Dockerfile / argumento no `docker run` |
| Docker Compose | Campo `image:` no `docker-compose.yml` |
| Kubernetes | Campo `image:` no manifest (`Deployment`, `Pod`) |
| AWS ECS | Campo `image` no Task Definition |
| AWS Lambda (container) | Campo `ImageUri` na configuração da função |

---

## ✅ Conclusão para entrevista

> “A imagem Docker usada em um container é definida diretamente no Dockerfile via instrução FROM, ou em configurações externas como comandos docker run, arquivos de orquestração como Docker Compose, manifests do Kubernetes, definições de task do ECS ou configuração do Lambda com container image. Em produção, normalmente usamos imagens versionadas e armazenadas em um registro como o ECR, Docker Hub ou Artifactory.”
> 

### Quando usar RabbitMQ, SQS ou Kafka?
