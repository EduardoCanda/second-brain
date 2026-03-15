# Observability Lab --- OpenTelemetry + Prometheus + Grafana + Jaeger + Loki

## Objective

Build a complete observability stack locally using:

-   Spring Boot application
-   OpenTelemetry (Java Agent)
-   OpenTelemetry Collector
-   Prometheus (metrics)
-   Jaeger (traces)
-   Loki (logs)
-   Grafana (visualization)

This document explains everything step-by-step in detail.

------------------------------------------------------------------------

# 1. Architecture Overview

    Spring Boot App
        ↓
    OpenTelemetry Java Agent
        ↓
    OpenTelemetry Collector
        ├── Prometheus (metrics)
        ├── Jaeger (traces)
        └── Loki (logs)
                ↓
              Grafana

We are implementing the three pillars of observability:

-   Metrics
-   Traces
-   Logs

------------------------------------------------------------------------

# 2. Project Structure

    observability-lab/
     ├── app/
     │   ├── pom.xml
     │   └── src/
     ├── docker-compose.yml
     ├── otel-collector-config.yaml
     └── prometheus.yml

------------------------------------------------------------------------

# 3. Spring Boot Configuration

## 3.1 Dependencies (pom.xml)

Add:

-   spring-boot-starter-actuator
-   micrometer-registry-prometheus

These expose metrics automatically.

------------------------------------------------------------------------

## 3.2 Enable Log Correlation

In application.yml:

    logging:
      pattern:
        console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level trace_id=%X{trace_id} span_id=%X{span_id} %logger - %msg%n"

This injects:

-   trace_id
-   span_id

into every log line.

------------------------------------------------------------------------

# 4. Dockerfile (Application)

    FROM eclipse-temurin:21-jre

    WORKDIR /app

    COPY target/app.jar app.jar

    ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar /otel.jar

    ENTRYPOINT ["java", "-javaagent:/otel.jar", "-jar", "app.jar"]

We use the OpenTelemetry Java Agent for automatic instrumentation.

No code changes required.

------------------------------------------------------------------------

# 5. OpenTelemetry Collector

## otel-collector-config.yaml

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

Collector acts as the central router of telemetry.

------------------------------------------------------------------------

# 6. Prometheus Configuration

## prometheus.yml

    global:
      scrape_interval: 5s

    scrape_configs:
      - job_name: 'otel'
        static_configs:
          - targets: ['otel-collector:8889']

Prometheus scrapes metrics from the Collector.

------------------------------------------------------------------------

# 7. Docker Compose

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

------------------------------------------------------------------------

# 8. Running the Stack

    docker compose up --build

Access:

-   App → http://localhost:8080
-   Prometheus → http://localhost:9090
-   Jaeger → http://localhost:16686
-   Grafana → http://localhost:3000

Default Grafana login:

admin / admin

------------------------------------------------------------------------

# 9. Professional Dashboard (RED Method)

## 9.1 Throughput (Rate)

    rate(http_server_requests_seconds_count[1m])

## 9.2 Latency P95

    histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))

## 9.3 Error Rate

    rate(http_server_requests_seconds_count{status=~"5.."}[1m])
    /
    rate(http_server_requests_seconds_count[1m])

Multiply by 100 to get percentage.

------------------------------------------------------------------------

# 10. Log ↔ Trace Correlation

In Grafana Loki datasource:

Create Derived Field:

-   Name: trace_id
-   Regex: trace_id=(`\w`{=tex}+)
-   URL: http://localhost:16686/trace/\$\${\_\_value.raw}

Now clicking a log opens the trace automatically.

------------------------------------------------------------------------

# 11. What You Achieved

You built a production-style observability stack:

-   Automatic instrumentation
-   Distributed tracing
-   Log correlation
-   Professional metrics dashboard
-   RED methodology monitoring

This setup mirrors real-world cloud-native environments.

------------------------------------------------------------------------

# End of Document
