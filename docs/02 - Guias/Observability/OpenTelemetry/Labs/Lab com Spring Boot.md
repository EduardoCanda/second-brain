# 🧠 Arquitetura
```
Spring Boot
   ↓
OpenTelemetry Java Agent
   ↓
OpenTelemetry Collector
   ├── Prometheus (metrics)
   ├── Jaeger (traces)
   └── Loki (logs)
         ↓
       Grafana
```

# 📁 Estrutura do projeto
```
observability-lab/
 ├── app/
 │   ├── pom.xml
 │   └── src/...
 ├── docker-compose.yml
 └── otel-collector-config.yaml
```

---
# 1️⃣ Spring Boot com OpenTelemetry

## Dependências (pom.xml)

Se for Spring Boot 3.x:
```xml
<dependencies>

    <!-- Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- Micrometer Prometheus -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>

</dependencies>
```

Agora a parte importante: usar **OpenTelemetry Java Agent** (mais simples que SDK manual).

Não precisa mudar código.

---
# 2 Dockerfile da aplicação

```Dockerfile
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/app.jar app.jar

# Baixa o Java Agent do OpenTelemetry
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar /otel.jar

ENTRYPOINT ["java", "-javaagent:/otel.jar", "-jar", "app.jar"]
```

---
# 3 - OpenTelemetry Collector
## otel-collector-config.yaml
```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true

  loki:
    endpoint: http://loki:3100/loki/api/v1/push

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]

    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger]

    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [loki]
```

---
#  4 - docker-compose-.yml
``` yml
version: "3.9"

services:

  app:
    build: ./app
    ports:
      - "8080:8080"
    environment:
      OTEL_SERVICE_NAME: workout-api
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
      OTEL_METRICS_EXPORTER: otlp
      OTEL_TRACES_EXPORTER: otlp
      OTEL_LOGS_EXPORTER: otlp
      OTEL_INSTRUMENTATION_LOGGING_ENABLED: "true"
    depends_on:
      - otel-collector

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4318:4318"
      - "8889:8889"

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"

  loki:
    image: grafana/loki:latest
    command: -config.file=/etc/loki/local-config.yaml
    ports:
      - "3100:3100"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
```

---
# 5 - prometheus.yml
``` yml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'otel'
    static_configs:
      - targets: ['otel-collector:8889']
```


---
# Acessos
|Serviço|URL|
|---|---|
|App|[http://localhost:8080](http://localhost:8080)|
|Prometheus|[http://localhost:9090](http://localhost:9090)|
|Jaeger UI|[http://localhost:16686](http://localhost:16686)|
|Loki API|[http://localhost:3100](http://localhost:3100)|
|Grafana|[http://localhost:3000](http://localhost:3000)|
