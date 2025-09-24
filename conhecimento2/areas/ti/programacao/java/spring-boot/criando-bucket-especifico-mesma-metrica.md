---
tags:
  - SRE
  - NotaBibliografica
  - Programacao
categoria: metricas
ferramenta: spring-boot
linguagem: Java
---
Ótima observação — por padrão o **[[micrometer|Micrometer]]** aplica os buckets do `http.server.requests` **por métrica (nome)**, não por _endpoint_. O “mercado” costuma resolver isso de 3 jeitos, dependendo do quanto você quer granularidade vs. simplicidade:

# 1) Global “bom o suficiente” + exceções por código (recomendado)

- **Deixa um conjunto global de [[sli-slo-sla|SLOs]]** enxuto (ex.: `50ms,100ms,200ms,300ms,500ms,1s,2s`) que serve para 80% dos endpoints.
    
- **Para endpoints críticos/diferentes**, aplica **buckets específicos por `uri` via `MeterFilter`**, já que o `configure(...)` recebe o `Meter.Id` **com tags**.
    

Exemplo (Spring Boot 3 / Micrometer):

```java
import io.micrometer.core.instrument.*;
import io.micrometer.core.instrument.config.MeterFilter;
import io.micrometer.core.instrument.distribution.DistributionStatisticConfig;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.context.annotation.Bean;
import java.time.Duration;

@Bean
MeterRegistryCustomizer<MeterRegistry> perEndpointBuckets() {
  return registry -> registry.config().meterFilter(new MeterFilter() {
    @Override
    public DistributionStatisticConfig configure(Meter.Id id, DistributionStatisticConfig config) {
      if (!id.getName().equals("http.server.requests")) return config;
      String uri = id.getTag("uri");          // tag padrão do Spring (templated, ex: /orders/{id})

      if ("/checkout".equals(uri)) {
        // endpoint rápido: buckets mais apertados
        return DistributionStatisticConfig.builder()
          .serviceLevelObjectives(
            Duration.ofMillis(50).toNanos(),
            Duration.ofMillis(100).toNanos(),
            Duration.ofMillis(200).toNanos(),
            Duration.ofMillis(300).toNanos(),
            Duration.ofMillis(500).toNanos(),
            Duration.ofSeconds(1).toNanos()
          ).build().merge(config);
      }

      if (uri != null && uri.startsWith("/relatorios")) {
        // endpoint pesado: buckets mais altos
        return DistributionStatisticConfig.builder()
          .serviceLevelObjectives(
            Duration.ofMillis(300).toNanos(),
            Duration.ofMillis(500).toNanos(),
            Duration.ofSeconds(1).toNanos(),
            Duration.ofSeconds(2).toNanos(),
            Duration.ofSeconds(3).toNanos(),
            Duration.ofSeconds(5).toNanos()
          ).build().merge(config);
      }

      return config; // demais endpoints usam o global (do properties)
    }
  });
}
```

No `application.properties` (global “base”):

```properties
# histograma automático desligado (padrão já é false, mas reforçando)
management.metrics.distribution.percentiles-histogram.http.server.requests=false
# SLOs globais (a maioria dos endpoints fica com isso)
management.metrics.distribution.slo.http.server.requests=50ms,100ms,200ms,300ms,500ms,1s,2s
```

**Como validar**: consulte `/actuator/prometheus` e filtre por `uri`:

```
http_server_requests_seconds_bucket{uri="/checkout",le="0.1",...}
```

Você deve ver **conjuntos de `le` diferentes** para `/checkout` vs `/relatorios`.

> Vantagens: mantém um set global simples e dá **precisão onde importa** sem criar novas métricas/nomes.

---

# 2) Métricas **dedicadas** por endpoint crítico

Para 1–3 rotas realmente sensíveis, crie **Timers dedicados** (outro nome de métrica) e configure SLOs só para eles.

```java
@Timed(value = "api.checkout", description = "Tempo do checkout")
@GetMapping("/checkout")
public ResponseEntity<?> checkout() { ... }
```

No `properties`:

```properties
management.metrics.distribution.slo.api.checkout=50ms,100ms,200ms,300ms,500ms,1s
```

E no Prometheus/Grafana, você usa `api_checkout_seconds_bucket` para p95/p99 do checkout.

> Vantagens: controle total por endpoint e **nenhuma interferência** nos buckets globais.  
> Custo: mais “nomes” de métrica e pequenos ajustes nos dashboards.

---

# 3) Percentis **no cliente** (summary) só para casos pontuais

Em vez de histogram, você pode ligar **percentis no cliente** (ex.: p95/p99 por endpoint com `@Timed(percentiles={0.95,0.99})`).

- **Prós**: super simples e preciso por instância/endpoint.
    
- **Contras**: não agrega entre instâncias no Prometheus (é _summary_).  
    Útil quando você olha **um pod ou canário específico**.
    

---

## Boas práticas que o pessoal segue

- **Mantenha o global enxuto** e **padronizado**; concentre precisão extra só em endpoints diferenciais (via `MeterFilter` ou métrica dedicada).
    
- **Use URIs templadas** (Spring já publica `uri="/orders/{id}"`), evitando explosão de cardinalidade.
    
- **Monitore se algum p99 encosta no `+Inf`** — se sim, adicione um bucket acima para esse endpoint.
    
- **≤ 10–12 buckets por endpoint** costuma ser o “sweet spot”.
    
- **Documente** no repositório quais rotas têm buckets especiais (e por quê) — ajuda muito na manutenção.
    
