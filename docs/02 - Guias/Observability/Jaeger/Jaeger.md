# Jaeger

O **Jaeger** é uma ferramenta de **tracing distribuído** (rastreamento distribuído) usada para acompanhar o caminho de uma requisição entre múltiplos serviços.

Ele ajuda a responder perguntas como:
- Onde a requisição está lenta?
- Qual serviço falhou primeiro?
- Quanto tempo cada etapa levou?
- Qual dependência externa (DB, API, fila) causou gargalo?

---

## Conceitos fundamentais

### Trace
Um **trace** representa a jornada completa de uma requisição.

### Span
Um **span** é uma etapa dentro do trace (ex.: `GET /checkout`, chamada ao banco, chamada ao serviço de pagamento).

### Parent/Child
Spans podem ter hierarquia. Exemplo:
- Span pai: `HTTP POST /order`
- Spans filhos: `validate-cart`, `reserve-stock`, `charge-payment`

### Context propagation
Para o trace não “quebrar” entre serviços, os metadados de rastreio precisam viajar no request (headers como `traceparent`).

---

## Arquitetura simplificada do Jaeger

1. **Aplicação instrumentada** (OpenTelemetry SDK)
2. **Collector** (recebe spans)
3. **Storage** (memória, Elasticsearch, Cassandra, etc.)
4. **Query/UI** (interface para busca e visualização)

> Em ambiente de estudo, normalmente usamos `all-in-one`, que já traz collector + query + UI em um único contêiner.

---

## Subindo Jaeger com Docker (modo laboratório)

```bash
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

### O que cada porta faz
- `16686`: interface web do Jaeger
- `4317`: OTLP/gRPC (ingestão de traces)
- `4318`: OTLP/HTTP (ingestão de traces)

Acesse: `http://localhost:16686`

---

## Exemplo com Docker Compose

```yaml
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
    container_name: jaeger
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "16686:16686"
      - "4317:4317"
      - "4318:4318"
```

Subir:

```bash
docker compose up -d
```

---

## Exemplo de integração com OpenTelemetry Collector

Se você usa um collector, pode exportar traces para o Jaeger via OTLP:

```yaml
exporters:
  otlp:
    endpoint: jaeger:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

---

## Fluxo de diagnóstico na prática

1. Encontre um endpoint lento (ex.: `/checkout`).
2. Busque trace com alta latência no Jaeger.
3. Abra o trace e identifique o span com maior duração.
4. Verifique tags/attributes (`db.statement`, `http.status_code`, `error`).
5. Corrija o gargalo e compare traces antes/depois.

---

## Boas práticas

- Instrumente serviços de borda e internos.
- Garanta propagação de contexto entre HTTP, mensageria e jobs.
- Use **sampling** para balancear custo x visibilidade.
- Padronize nomes de spans (evita caos de observabilidade).
- Correlacione trace com logs (trace_id no log).

---

## Relação com Prometheus, Loki e Grafana

- **Jaeger**: responde “**onde** a requisição atrasou?”
- **Prometheus**: responde “**quanto** está degradando ao longo do tempo?”
- **Loki**: responde “**o que** foi logado no momento da falha?”
- **Grafana**: unifica visualização de métricas, logs e traces

Esse conjunto entrega observabilidade completa orientada aos 3 pilares: métricas, logs e traces.
