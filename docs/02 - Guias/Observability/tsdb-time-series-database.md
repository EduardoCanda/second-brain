# TSDB (Time Series Database)

## Definição
TSDB (Time Series Database) é um banco de dados otimizado para armazenar, consultar e agregar dados que mudam ao longo do tempo. A unidade central de dados é uma amostra temporal, normalmente composta por `timestamp + value`, associada a uma métrica e um conjunto de labels.

Em observabilidade, um TSDB armazena séries como:
- uso de CPU por host
- uso de memória por pod
- número de requests por endpoint
- latência de resposta por serviço

A principal diferença para bancos generalistas é que o eixo do tempo é o índice primário de quase toda leitura e retenção.

## Estrutura dos dados
Um modelo conceitual comum é:

`timestamp | metric | value | labels`

Exemplo de ponto:

`cpu_usage{host="api-1",env="prod",region="us-east-1"} 0.75 @ 1710000000`

Onde:
- `metric`: nome da métrica (`cpu_usage`)
- `value`: valor numérico observado (`0.75`)
- `timestamp`: instante da coleta (`1710000000`)
- `labels`: dimensões de contexto (`host`, `env`, `region`)

Labels transformam uma métrica em múltiplas séries. Por exemplo, `http_requests_total` pode virar milhares de séries quando combinada com `service`, `instance`, `status_code`, `route` e `method`.

## Por que TSDB existe?
TSDB existe porque workloads de séries temporais têm características que bancos tradicionais não tratam de forma eficiente por padrão:
- escrita contínua e em alta frequência
- volume massivo de inserts (write-heavy)
- consultas por janelas de tempo (`últimos 5m`, `últimas 24h`, `últimos 30d`)
- necessidade frequente de agregações temporais (`avg`, `sum`, `rate`, percentis)

Em um sistema de monitoramento, cada host, pod e serviço gera novos pontos a cada poucos segundos. O banco precisa absorver esse fluxo com baixa latência de escrita e responder rápido a consultas analíticas operacionais.

## Características principais
- Alta taxa de escrita (write-heavy): ingestão contínua com padrão append-only.
- Compressão eficiente: técnicas específicas para timestamps e valores próximos reduzem I/O e custo.
- Queries baseadas em tempo: filtros por intervalos e agregações por bucket temporal.
- Retenção de dados: políticas por horizonte (ex.: 15 dias bruto, 12 meses agregado).
- Agregações nativas: funções como `avg`, `sum`, `min`, `max`, `rate`, percentis e rolling windows.

## Arquitetura interna
Em alto nível, TSDBs modernos usam uma arquitetura orientada a ingestão sequencial e leitura temporal:

- Append-only writes: novos pontos são adicionados ao fim, evitando updates randômicos.
- Storage em blocos/segmentos: dados são organizados em blocos por intervalo de tempo.
- Indexação por tempo e labels: acelera busca de séries e varreduras em janelas.
- Compaction: mescla segmentos menores em maiores, reduz fragmentação e melhora leitura.

Diagrama ASCII (conceitual):

```text
Exporters/Apps
     |
     v
 Ingestion Layer (append-only)
     |
     v
  WAL / Buffer
     |
     v
 Immutable Blocks (2h, 6h, 24h...)
     |
     +--> Index (metric + labels + time range)
     |
     v
 Compaction + Retention + Downsampling
     |
     v
 Query Engine (range queries, aggregations, alerts)
```

## Queries típicas
Exemplos conceituais comuns em observabilidade:

- Média de CPU por serviço nos últimos 15 minutos.
- Taxa de requisições por segundo por endpoint (`rate` de contador).
- p95 de latência por rota para identificar degradação de cauda.

Padrões mentais de consulta:
- Seleção: filtrar séries por labels (`service=checkout`, `env=prod`).
- Janela temporal: escolher intervalo (`now-15m` até `now`).
- Agregação: agrupar por dimensão (`by service`, `by route`).
- Função: aplicar média, soma, taxa ou percentil.

## Integração com observabilidade
No pilar de métricas, TSDB é a camada de persistência que viabiliza:
- monitoramento operacional em dashboards
- detecção de anomalias em séries
- avaliação de SLO/SLI
- alertas com base em thresholds e comportamento temporal

Fluxo típico:
1. aplicação/exporter expõe métricas
2. coletor ingere pontos no TSDB
3. query engine calcula agregações
4. dashboard e alertmanager consomem resultados

## Ferramentas reais
- Prometheus: stack de monitoramento com modelo pull, PromQL e TSDB local por nó.
- InfluxDB: banco de séries temporais com foco em ingestão, retenção e consultas temporais.
- Datadog (conceitualmente): plataforma SaaS que usa armazenamento temporal para métricas e análises operacionais.

## Pull vs Push
### Pull (Prometheus)
No modelo pull, o coletor busca ativamente métricas nos alvos.

Vantagens:
- descoberta e rastreabilidade centralizadas
- controle de cadência de coleta no servidor
- inspeção simples de endpoint de métricas

Desvantagens:
- pior aderência a workloads efêmeros sem service discovery
- restrições de rede quando o coletor não alcança os alvos

### Push
No modelo push, a aplicação/agente envia métricas ao backend.

Vantagens:
- funciona melhor em ambientes desconectados/NAT restrito
- útil para jobs curtos que terminam rápido

Desvantagens:
- risco de perda de controle central da cadência
- maior complexidade para evitar duplicidade/retries desordenados

## Retenção de dados
Retenção é uma decisão de custo e utilidade:
- dados recentes: alta resolução (ex.: 10s) para troubleshooting
- dados históricos: resolução reduzida (downsampling) para tendência

Estratégia comum:
- 7 a 30 dias em granularidade fina
- meses/anos com agregação por minuto/hora

Sem downsampling, custo de armazenamento e tempo de query crescem rapidamente com o número de séries e frequência de coleta.

## Casos de uso
- monitoramento de infraestrutura (CPU, memória, disco, rede)
- métricas de aplicações (RPS, erro, latência)
- IoT (telemetria de sensores)
- financeiro (preços, volumes, indicadores em séries temporais)

## Trade-offs
- Não substitui banco relacional para joins e queries relacionais complexas.
- Cardinalidade alta de labels pode degradar memória, indexação e custo.
- Armazenamento cresce rápido com alta frequência de coleta e muitas dimensões.

## Modelo mental
Pense no TSDB como um gravador de sinais contínuos: ele não guarda apenas “eventos isolados”, mas trilhas temporais. Cada métrica é uma linha em um gráfico vivo; labels separam as linhas por contexto. Consultar TSDB é perguntar “como esse sinal se comportou no tempo?”, não “qual é o estado atual de uma linha única”.

## Relações (Zettelkasten)
- [Observabilidade aplicada ponta-a-ponta](./01%20-%20Observabilidade%20aplicada%20ponta-a-ponta.md)
- [Prometheus - Introdução](./Prometheus/Introdu%C3%A7%C3%A3o.md)
- [Prometheus - Tipos de dados](./Prometheus/Tipos%20de%20dados.md)
- [SRE](../../03%20-%20Deep%20Dives/DevOps/SRE/SRE.md)
- [OpenTelemetry](./OpenTelemetry/OpenTelemetry.md)

## Como isso aparece na prática
Em uma API de pagamentos, você coleta continuamente:
- `cpu_usage` por instância
- `memory_working_set` por pod
- `http_requests_total` por rota e status
- `http_request_duration_seconds` para latência

No dia a dia:
1. o dashboard mostra aumento de CPU e p95 de latência na rota `/checkout`
2. a taxa de requests cresce e erros `5xx` aumentam
3. consultas por janela (`últimos 30m`) mostram correlação temporal
4. alerta dispara quando p95 ultrapassa SLO por 10 minutos

Resultado: o time identifica regressão de performance e age com rollback/tuning antes de impacto maior no negócio.

## Notas Relacionadas
- [Observabilidade aplicada ponta-a-ponta](./01%20-%20Observabilidade%20aplicada%20ponta-a-ponta.md)
- [Grafana](./Grafana/Grafana.md)
- [Loki](./Loki/Loki.md)
- [Prometheus - Introdução](./Prometheus/Introdu%C3%A7%C3%A3o.md)
- [OpenTelemetry](./OpenTelemetry/OpenTelemetry.md)
