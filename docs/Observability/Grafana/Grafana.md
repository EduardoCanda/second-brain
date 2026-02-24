# Grafana

O **Grafana** é uma plataforma de visualização e exploração de observabilidade.

Ele permite conectar múltiplas fontes de dados (Prometheus, Loki, Jaeger, Elasticsearch etc.) para criar:
- Dashboards
- Alertas
- Exploração ad hoc
- Correlação entre métricas, logs e traces

---

## Conceitos principais

### Data source
É a fonte de dados conectada ao Grafana (ex.: Prometheus para métricas, Loki para logs, Jaeger para traces).

### Dashboard
Coleção de painéis que mostra indicadores relevantes (latência, erro, throughput, saturação).

### Panel
Bloco visual individual (gráfico de linha, tabela, heatmap, stat, logs).

### Alerting
Regras que disparam notificações quando um indicador cruza um limite.

### Explore
Área interativa para investigar incidentes rapidamente sem alterar dashboards oficiais.

---

## Subindo Grafana com Docker

```bash
docker run -d --name grafana \
  -p 3000:3000 \
  -v grafana-data:/var/lib/grafana \
  grafana/grafana:latest
```

Acesse: `http://localhost:3000`

Credenciais padrão:
- usuário: `admin`
- senha: `admin`

---

## Exemplo com Docker Compose

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  grafana-data:
```

Subir:

```bash
docker compose up -d
```

---

## Exemplo de stack local (Grafana + Prometheus + Loki + Jaeger)

```yaml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"

  loki:
    image: grafana/loki:latest
    command: -config.file=/etc/loki/local-config.yaml
    ports:
      - "3100:3100"

  jaeger:
    image: jaegertracing/all-in-one:latest
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "16686:16686"
      - "4317:4317"
```

Com isso, o Grafana pode receber 3 fontes:
- Prometheus (`http://prometheus:9090`)
- Loki (`http://loki:3100`)
- Jaeger (`http://jaeger:16686`)

---

## Racional de estudo para este repositório

Pelo que já existe em Observability (Prometheus + OpenTelemetry + labs), o próximo passo natural é:

1. **Prometheus**: entender séries temporais e SLI/SLO
2. **OpenTelemetry**: padronizar instrumentação
3. **Jaeger**: investigar traces distribuídos
4. **Loki**: centralizar logs e correlacionar com traces
5. **Grafana**: criar visão unificada e alertas

Essa sequência reduz complexidade e facilita o aprendizado incremental.

---

## Boas práticas de dashboard

- Comece por métricas de negócio e confiabilidade.
- Use painéis por serviço e por jornada crítica (checkout, login, pagamento).
- Evite dashboards “enciclopédia” (muito ruído).
- Nomeie painéis com perguntas operacionais reais.
- Versione dashboards como código quando possível.

---

## Checklist de aprendizado

- [ ] Conectar Prometheus no Grafana
- [ ] Criar painel de latência P95/P99
- [ ] Conectar Loki e filtrar logs por serviço
- [ ] Conectar Jaeger e navegar em traces
- [ ] Criar alerta de erro (`5xx`) e latência alta
- [ ] Correlacionar um incidente usando os 3 pilares
