---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
Isso é 100% sintoma de **multi-tenancy do [[Loki]] ativa** (`auth_enabled: true`) sem o header do tenant. Quando o Loki está em multi-tenant, **toda** requisição de ingestão/consulta precisa do header **`X-Scope-OrgID`**; se ele não chega, o gateway devolve `401 no org id`. ([Grafana Labs](https://grafana.com/docs/loki/latest/operations/multi-tenancy/?utm_source=chatgpt.com "Manage tenant isolation | Grafana Loki documentation"))

Aqui vai o conserto direto para o [[fluentbit|Fluent Bit]] + checagens rápidas:

# 1) Fluent Bit → adicione o `tenant_id`

No seu `values` do **fluent/fluent-bit**, inclua `tenant_id` no `[OUTPUT]` do Loki (nome do tenant pode ser “1” mesmo):

```ini
# values-fluent-bit-to-loki.yaml (trecho)
config:
  outputs: |
    [OUTPUT]
        Name        loki
        Match       kube.*
        Host        loki-gateway.loki.svc.cluster.local
        Port        80
        URI         /loki/api/v1/push
        tenant_id   1
        Labels      job=fluentbit, namespace=$kubernetes['namespace_name'], app=$kubernetes['labels']['app'], pod=$kubernetes['pod_name'], container=$kubernetes['container_name']
        Auto_Kubernetes_Labels Off
        Line_Format json
```

> A opção correta no plugin é **`tenant_id`** (também existe `tenant_id_key` se você quiser o tenant **dinâmico** a partir de um campo do log, p.ex. por namespace). ([docs.fluentbit.io](https://docs.fluentbit.io/manual/data-pipeline/outputs/loki "Loki | Fluent Bit: Official Manual"))

Reaplique:

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging -f values-fluent-bit-to-loki.yaml
```

# 2) (Opcional) Tenant dinâmico

Se quiser isolar por namespace, use:

```ini
tenant_id_key $kubernetes['namespace_name']
```

Isso popula o `X-Scope-OrgID` a partir desse campo. ([docs.fluentbit.io](https://docs.fluentbit.io/manual/data-pipeline/outputs/loki "Loki | Fluent Bit: Official Manual"))

# 3) Grafana (confira o datasource)

No kube-prometheus-stack, o datasource precisa enviar o mesmo tenant no header:

```yaml
grafana:
  additionalDataSources:
    - name: Loki
      type: loki
      access: proxy
      url: http://loki-gateway.loki.svc.cluster.local
      jsonData:
        httpHeaderName1: "X-Scope-OrgID"
      secureJsonData:
        httpHeaderValue1: "1"
```

> Em multi-tenant, consultas também exigem `X-Scope-OrgID`. Se você não enviar, verá 401 em consultas. ([Grafana Labs](https://grafana.com/docs/loki/latest/operations/multi-tenancy/?utm_source=chatgpt.com "Manage tenant isolation | Grafana Loki documentation"))

# 4) Testes rápidos de sanidade

- **Teste a API do Loki (com e sem header):**
    

```bash
# sem header -> deve dar 401 quando auth_enabled=true
kubectl -n loki run curl --rm -it --image=curlimages/curl --restart=Never -- \
  curl -i http://loki-gateway.loki.svc.cluster.local/loki/api/v1/labels

# com header -> deve responder 200
kubectl -n loki run curl2 --rm -it --image=curlimages/curl --restart=Never -- \
  curl -i -H "X-Scope-OrgID: 1" http://loki-gateway.loki.svc.cluster.local/loki/api/v1/labels
```

Se o primeiro já responde 200, seu Loki está com `auth_enabled: false`. ([Grafana Labs](https://grafana.com/docs/loki/latest/operations/multi-tenancy/?utm_source=chatgpt.com "Manage tenant isolation | Grafana Loki documentation"))

- **Logs do Fluent Bit:** procure `HTTP status=204` (sucesso) ou novos 401.
    

```bash
kubectl -n logging logs ds/fluent-bit -f | grep -i loki
```

# 5) Plano B (se você quer simplificar agora)

Se não precisa de multi-tenancy por enquanto, dá para desligar:

```bash
helm upgrade -n loki loki grafana/loki --set loki.auth_enabled=false
```

Assim o Loki passa a usar um único tenant “fake” e **não** exige `X-Scope-OrgID`. (Quando voltar a habilitar, reative o `tenant_id` no Fluent Bit e o header no Grafana.) ([Grafana Labs](https://grafana.com/docs/loki/latest/operations/multi-tenancy/?utm_source=chatgpt.com "Manage tenant isolation | Grafana Loki documentation"))

---

## Observações que evitam dor de cabeça

- Se você estiver expondo o **loki-gateway** com **basic auth** num Ingress, alguns templates já **sobrescrevem** o `X-Scope-OrgID` com `$remote_user`. Nesse caso, mesmo enviando `tenant_id`, o header pode ser trocado. Vale conferir a config do NGINX do gateway/ingress se o 401 persistir após o `tenant_id`. ([GitHub](https://github.com/grafana/loki/issues/10873?utm_source=chatgpt.com "[Helm] Self-Monitoring fails when loki.auth_enabled is true ..."))
    
- Para testar ingestão sem gateway, aponte o Fluent Bit direto para `loki.loki.svc.cluster.local:3100` (bypass do NGINX).
    

Se quiser, me manda o trecho atual do seu `[OUTPUT]` Loki (ou o Values completo do chart que você usa) que eu te devolvo o arquivo já ajustado para o seu caminho (gateway vs porta 3100, tenant fixo vs dinâmico).