---
tags:
  - SRE
  - NotaBibliografica
categoria: metricas
ferramenta: prometheus
linguagem: Java
---
total! dá pra controlar os buckets no [[micrometer|Spring Boot/Micrometer]] de forma bem precisa — e sem explodir a cardinalidade. Segue o caminho direto, com exemplos prontos.

# Objetivo

Criar **poucos buckets específicos** (ex.: 100 ms, 300 ms, 500 ms, 1 s, 2 s) para `http.server.requests` e **evitar** os muitos buckets “automáticos”.

## Opção A (recomendada): use **[[sli-slo-sla|SLA]] buckets** e desative o histograma automático

No `application.yml`:

```yaml
management:
  metrics:
    distribution:
      # 1) NÃO publicar o histograma automático de percentis
      percentiles-histogram:
        http.server.requests: false

      # 2) DEFINIR apenas os buckets que você quer (SLA = limites)
      slo:
        http.server.requests: 100ms,300ms,500ms,1s,2s
```

O que isso faz:

- Micrometer **publica só esses buckets** (mais o `+Inf`) para o `http_server_requests_seconds_bucket`.
    
- Você mantém compatibilidade com Prometheus (usa `histogram_quantile` no Prom/Grafana).
    
- Evita os muitos buckets do histograma automático. ([Home](https://docs.spring.io/spring-boot/docs/2.1.x/reference/html/production-ready-metrics.html?utm_source=chatgpt.com "58. Metrics"), [GitHub](https://github.com/micrometer-metrics/micrometer/issues/1947?utm_source=chatgpt.com "Timed: histogram buckets have a too high cadinality #1947"))
    

### Como verificar no [[Prometheus]]

Depois de subir a app, abra `/actuator/prometheus` ou rode a consulta:

```promql
http_server_requests_seconds_bucket
```

Você deve ver **apenas**:

```
le="0.1"  le="0.3"  le="0.5"  le="1"  le="2"  le="+Inf"
```

(Em segundos; 100 ms = 0.1, etc.)

## Opção B: manter histograma automático, mas **limitar o alcance** (reduz buckets)

Se você **precisa** do `percentiles-histogram`, limite o range:

```yaml
management:
  metrics:
    distribution:
      percentiles-histogram:
        http.server.requests: true
      minimum-expected-value:
        http.server.requests: 50ms
      maximum-expected-value:
        http.server.requests: 2s
```

Micrometer gera muitos buckets por padrão, mas **recorta** para o intervalo informado (menos séries publicadas). Útil quando você quer percentis **calculados no cliente**, sabendo que **não agregam** entre instâncias. ([docs.micrometer.io](https://docs.micrometer.io/micrometer/reference/concepts/histogram-quantiles.html?utm_source=chatgpt.com "Histograms and Percentiles"))

---

## Dúvidas comuns (e respostas curtas)

**“Posso usar SLA e percentiles-histogram ao mesmo tempo?”**  
Pode, mas **vai publicar ambos os conjuntos de buckets**, aumentando séries. Se a meta é **poucos buckets**, **desligue** o automático e use **só `sla`**. ([GitHub](https://github.com/micrometer-metrics/micrometer/issues/530?utm_source=chatgpt.com "Allow custom bucket configuration for DistributionSummary ..."))

**“E os percentis (p95/p99) no dashboard?”**  
Calcule do lado do Prometheus com seus buckets SLA:

```promql
histogram_quantile(
  0.95,
  sum by (le, uri) (rate(http_server_requests_seconds_bucket[5m]))
)
```

(Não esqueça de manter `le` no `sum by`.)

**“As unidades do `sla`?”**  
Para `Timer` (caso de HTTP), são `Duration` — você pode usar `ms`, `s`. No endpoint Prometheus, aparecem em **segundos** (ex.: `le="0.3"`). ([Home](https://docs.spring.io/spring-boot/docs/2.1.x/reference/html/production-ready-metrics.html?utm_source=chatgpt.com "58. Metrics"))

**“Ainda vejo buckets antigos no Prometheus”**  
Séries antigas somem quando expiram pela **retenção** do Prometheus; com a nova config, **não** serão mais atualizadas.

---

## Extra: definir buckets via código (se preferir)

Se quiser controlar por código (e também cobrir métricas com `@Timed`):

```java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.config.MeterFilter;
import io.micrometer.core.instrument.distribution.DistributionStatisticConfig;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;

import java.time.Duration;

@Bean
MeterRegistryCustomizer<MeterRegistry> sloBucketsForHttp() {
  return registry -> registry.config().meterFilter(new MeterFilter() {
    @Override
    public DistributionStatisticConfig configure(Meter.Id id, DistributionStatisticConfig config) {
      if (id.getName().equals("http.server.requests")) {
        return DistributionStatisticConfig.builder()
          .serviceLevelObjectives(
            Duration.ofMillis(100).toNanos(),
            Duration.ofMillis(300).toNanos(),
            Duration.ofMillis(500).toNanos(),
            Duration.ofSeconds(1).toNanos(),
            Duration.ofSeconds(2).toNanos()
          )
          .build()
          .merge(config);
      }
      return config;
    }
  });
}
```

> Dica: esse caminho é útil quando a anotação `@Timed` não te dá acesso direto a SLOs por métrica. ([GitHub](https://github.com/micrometer-metrics/micrometer/issues/1947?utm_source=chatgpt.com "Timed: histogram buckets have a too high cadinality #1947"))

---