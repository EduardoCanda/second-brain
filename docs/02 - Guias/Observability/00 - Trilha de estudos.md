# Observability — Trilha de estudos e racional

Esta trilha organiza o aprendizado de observabilidade em passos progressivos, alinhada com o racional do repositório: **aprender fundamentos primeiro e depois integrar ferramentas**.

## Onde você estava

A pasta já tinha:
- **Prometheus** (base de métricas)
- **OpenTelemetry** (instrumentação e telemetria)
- **Labs** práticos

## Próximo passo natural (o que foi adicionado)

1. **Jaeger**: foco em traces distribuídos
2. **Loki**: foco em logs centralizados
3. **Grafana**: camada de visualização e correlação

## Linha do tempo sugerida de aprendizagem

### Fase 1 — Métricas (Prometheus)
Objetivo: aprender séries temporais, queries e alertas básicos.

### Fase 2 — Instrumentação (OpenTelemetry)
Objetivo: padronizar coleta de telemetria em aplicações.

### Fase 3 — Traces (Jaeger)
Objetivo: entender latência ponta a ponta e dependências entre serviços.

### Fase 4 — Logs (Loki)
Objetivo: diagnosticar erros com contexto e histórico.

### Fase 5 — Correlação (Grafana)
Objetivo: navegar entre métricas, logs e traces no mesmo fluxo de investigação.

---

## Mapa mental rápido

- **Prometheus**: “quanto degradou e quando degradou?”
- **Jaeger**: “onde a requisição ficou lenta?”
- **Loki**: “qual erro ocorreu exatamente naquele momento?”
- **Grafana**: “como juntar tudo em uma visão operacional?”

---

## Exercício prático recomendado

1. Suba uma API simples com Docker.
2. Instrumente com OpenTelemetry.
3. Envie traces para Jaeger.
4. Exponha métricas para Prometheus.
5. Envie logs para Loki.
6. Monte dashboard no Grafana.
7. Gere falha proposital e investigue ponta a ponta.

Se você conseguir explicar a causa raiz usando os 3 pilares, o aprendizado foi consolidado.
