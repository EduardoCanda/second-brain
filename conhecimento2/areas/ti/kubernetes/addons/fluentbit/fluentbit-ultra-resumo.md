---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
Perfeito — ajustei meu estilo 🎯: respostas **curtas, objetivas**, com um bloco final “**Como aprofundar**”. Se quiser que eu volte ao modo detalhado, é só falar.

# [[fluentbit|Fluent Bit]] — Essencial (ultracurto)

- **O que é**: agente leve de logs (lê → transforma → envia).
    
- **Blocos**: `[SERVICE]`, `[INPUT]`, `[FILTER]`, `[OUTPUT]`, `Parsers/Multiline`.
    
- **K8s padrão**: DaemonSet → `tail /var/log/containers/*.log` → `filter kubernetes` → destino.
    
- **Tag/Match**: rótulo do registro (Tag) usado pelos filtros/saídas (`Match`).
    
- **Métricas**: HTTP `:2020` → `/api/v1/metrics/prometheus`.
    

## 80/20 na prática

- **Start**: `helm upgrade -i fluent-bit ... -f values.yaml`
    
- **Ver**: `kubectl -n logging logs -l app.kubernetes.io/name=fluent-bit --tail=100`
    
- **Config efetiva**: `kubectl exec ... -- cat /fluent-bit/etc/fluent-bit.conf`
    
- **Teste**: `kubectl run logger --image=busybox -- ... echo '{"ok":1}'`
    

## Performance (rápido)

- Ative **buffer em disco**: `[SERVICE] storage.path` + `storage.backlog.mem_limit`; `[INPUT] storage.type filesystem`.
    
- **Tail DB**: `DB /var/fluent-bit/state/tail.db` + `DB.Sync normal`.
    
- **Filtre cedo** (grep) → só depois `kubernetes`/`parser`.
    
- **Multiline/JSON** apenas onde precisa.
    
- Evite **CPU limit** apertado.
    

## Erros comuns

- Sem meta K8s → confira **RBAC** do filtro `kubernetes`.
    
- Stacktrace quebrado → ajuste **`multiline.parser`**.
    
- Retries no output → ver **conectividade** e se há **buffer** habilitado.
    

## Como aprofundar

- **Fundamentos**: Inputs (`tail`), Filter `kubernetes`, Parsers (JSON), Multiline.
    
- **Roteamento**: Tags, `Match`, `rewrite_tag` (clonar/mudar trilhos).
    
- **Destinos**: `file`, `es`/`opensearch`, `http`, `s3`, `loki`, `forward`.
    
- **Operação**: métricas Prometheus, sizing de recursos, ordem de filtros, retenção no destino.
    
- **Avançado**: fan-out por namespace, mascaramento/PII, TLS/`forward` p/ Fluentd agregador.
    

Quer que eu compacte algum `values.yaml` seu nesse formato “essencial + próximos passos”?