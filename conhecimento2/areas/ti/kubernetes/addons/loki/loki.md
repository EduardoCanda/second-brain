---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: loki
---
Aqui vai o “mapa mental” do Grafana Loki — o que é, como funciona e como você o usa no dia a dia (especialmente em Kubernetes).

# O que é o Grafana Loki

Loki é um sistema de **agregação e consulta de logs** pensado para ser barato e simples de operar. Ele é “inspirado no Prometheus”: em vez de indexar o conteúdo inteiro das linhas de log (como o Elasticsearch), **indexa só os metadados (labels)** de cada fluxo de log. Resultado: custo menor, menos pressão em disco/CPU e uma experiência de consulta bem integrada ao Grafana.

# Ideia central (por que ele é barato)

- Cada conjunto de labels (ex.: `app`, `namespace`, `pod`, `container`, `cluster`, `level`) define um **stream**.
    
- Somente esses labels entram no índice; as linhas de log ficam em **chunks** comprimidos no storage.
    
- Você filtra primeiro por labels, e só então faz **busca textual/regex** dentro do pequeno conjunto de streams retornados.
    

# Componentes (modo moderno)

- **Agent** (Promtail, Fluent Bit, etc.): coleta logs e envia para o Loki.
    
- **Distributor**: recebe os pushes e distribui por hash dos labels.
    
- **Ingester**: guarda logs em memória, fecha **chunks** e “despeja” no storage (S3/GCS/Azure/File) e no índice (TSDB/Boltdb-shipper).
    
- **Querier**: executa as consultas lendo índice e chunks.
    
- **Query-frontend/Query-scheduler**: cache, paralelização, divisão de janelas longas.
    
- **Ruler**: regras/alertas baseadas em consultas LogQL.
    
- **Compactor**: compação/retention dos índices e chunks.
    

Você pode rodar tudo em **single-binary** (simples) ou em **microserviços** (escala).

# Fluxo (Kubernetes típico)

1. DaemonSet (Promtail ou Fluent Bit) lê `/var/log/containers` e/ou `systemd-journal`.
    
2. O agente anexa labels úteis (ex.: `namespace`, `pod`, `container`, `app`, `cluster`).
    
3. Envia para `loki:3100`.
    
4. Loki indexa **só os labels** e grava as linhas comprimidas no storage.
    
5. No **Grafana**, você usa a data source Loki para explorar/plotar/alertar com LogQL.
    

# Consultas com LogQL (o “PromQL dos logs”)

Seleção por labels + filtros na linha:

```logql
{app="contas", namespace="prod"} |= "ERROR"
{app="nginx"} |~ "timeout|circuit"
```

Parse e enriquecimento no pipeline:

```logql
{app="api"} 
| json                             # extrai campos JSON
| label_format level={{.level}}    # promove a campo/label
|= "failed"
```

Contar linhas por status (ex.: NGINX):

```logql
sum by (status) (
  count_over_time({app="nginx"} 
    | regexp "status=(?P<status>\\d{3})" [5m]
  )
)
```

“Metricas a partir de logs” (rate/erro por app):

```logql
sum by (app)(
  rate({app=~"payments|orders"} |= "error" [5m])
)
```

Percentis em valores numéricos extraídos do log (ex.: tempo em ms):

```logql
quantile_over_time(0.95,
  {app="api"} 
  | json | unwrap duration_ms [5m]
)
```

> Dica: **`|=`** (substring), **`|~`** (regex), **`!~`** (negação), **`json`/`logfmt`/`regex`** (parsers), **`unwrap`** (transforma um campo numérico em série métrica).

# Agents: Promtail x Fluent Bit

- **Promtail** (da Grafana): tem _pipeline stages_ ricos (regex, json, multiline, timestamp, drop, relabel). Integra “de fábrica” com Kubernetes (service discovery).
    
- **Fluent Bit**: leve e muito rápido; possui **output nativo para Loki**. Bom se você já padroniza o agente.  
    _Resumo prático:_ se quer o caminho mais documentado com Loki, use **Promtail**; se já padroniza **Fluent Bit**, apenas use o **output Loki**.
    

# Boas práticas (evite dor de cabeça)

- **Cardinalidade de labels**: mantenha poucos e estáveis (ex.: `cluster`, `namespace`, `pod`, `container`, `app`, `level`). **Nunca** coloque IDs únicos (request_id, usuário, hash…) como label.
    
- **Multiline**: ative para stacks Java, etc., no agente (junte stack trace numa linha “lógica”).
    
- **Retention**: use compaction/retention por tenant. Logs de app: dias/semanas; auditoria: mais tempo, mas talvez em bucket separado.
    
- **Particionamento/escala**: streams equilibrados (labels) facilitam distribuição entre ingesters.
    
- **Multitenancy**: Loki suporta multi-tenant via cabeçalho `X-Scope-OrgID`. Útil para separar times/ambientes.
    

# Quando escolher Loki (vs. ELK)

- Você quer **custos menores** e **integração fluida com Grafana/Prometheus**.
    
- Suas buscas são naturalmente guiadas por **labels** (k8s metadata) + alguns filtros de conteúdo.
    
- Você curte a ideia de **gerar métricas a partir de logs** (SLOs, taxas de erro) sem manter outro stack de métricas.
    

# Exemplo rápido de uso (K8s)

**Promtail (trecho simplificado):**

```yaml
scrape_configs:
- job_name: kubernetes-pods
  kubernetes_sd_configs: [{role: pod}]
  pipeline_stages:
    - docker: {}
    - json: {}
    - multiline:
        firstline: '^\d{4}-\d{2}-\d{2}T'
  relabel_configs:
    - action: replace
      source_labels: [__meta_kubernetes_namespace]
      target_label: namespace
    - action: replace
      source_labels: [__meta_kubernetes_pod_name]
      target_label: pod
    - action: replace
      source_labels: [__meta_kubernetes_pod_label_app]
      target_label: app
```

No Grafana Explore:

```logql
{app="contas", namespace="prod"} |= "NullPointerException"
```

# Armazenamento

- **Object storage** (S3/GCS/Azure) é o padrão de produção (barato e elástico).
    
- Índice: **TSDB/Boltdb-shipper** (arquivo+objeto) — simples e escalável.
    
- Em dev, dá para começar com filesystem.
    

# Segurança e integração

- Autenticação/autorização via proxy (OIDC), _basic auth_ ou gateways; multi-tenant por header.
    
- Correlação com **Prometheus** (labels parecidos) e com **Tempo** (traces) no Grafana: clique do painel de métricas → logs daquela série → trace daquela requisição.
    

---

Se você quiser, eu te mostro um **values.yaml** mínimo (Helm) para Loki + Promtail no seu cluster, ou um **trecho de Fluent Bit** com saída para Loki (aproveitando que você já usa Fluent Bit).