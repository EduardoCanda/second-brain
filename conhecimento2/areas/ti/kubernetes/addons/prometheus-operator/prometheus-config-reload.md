---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Boa! No [[prometheus-operator|Prometheus Operator]] você **não “recarrega” o Operator** em si — ele reconcilia automaticamente quando qualquer **[[prometheus-crd]]/[[servicemonitor-crd|ServiceMonitor]]/[[podmonitor-crd|PodMonitor]]/[[prometheus-rule-crd|Rule]]** muda. O que às vezes você quer é:

1. **Forçar o Prometheus a recarregar a config** (sem restart)
    
2. **Forçar uma nova reconciliação** dos CRDs
    
3. **Reiniciar** Prometheus (quando o reload não resolve)
    
4. (Raro) **Reiniciar o Operator**
    

Aí vão os jeitos práticos 👇

---

## 1) Disparar um **reload** no Prometheus (sem restart)

O Operator sobe o Prometheus com `--web.enable-lifecycle`, então dá para chamar `/-/reload`.

```bash
# 1) Ache um pod do Prometheus
kubectl -n monitoring get pods -l app.kubernetes.io/name=prometheus

# 2) Faça port-forward (troque <prom-pod>)
kubectl -n monitoring port-forward pod/<prom-pod> 9090:9090

# 3) Em outro terminal, dispare o reload
curl -X POST http://localhost:9090/-/reload
```

Para conferir que o reload foi disparado:

```bash
kubectl -n monitoring logs pod/<prom-pod> -c prometheus-config-reloader --tail=100
# ou (dependendo do chart)
kubectl -n monitoring logs pod/<prom-pod> -c config-reloader --tail=100
```

---

## 2) **Forçar uma reconciliação** (gera nova config e o sidecar dá reload)

Qualquer mudança mínima em `ServiceMonitor/PodMonitor/PrometheusRule` já dispara. Se você só quer “tocar” no recurso:

```bash
# Ex.: tocar no ServiceMonitor para reprocessar
kubectl -n <ns> annotate servicemonitor <nome> reconcile-ts="$(date +%s)" --overwrite
```

Dica: ao **corrigir o path para `/actuator/prometheus`** no seu ServiceMonitor, isso **já** deveria disparar reconciliação + reload automaticamente.

---

## 3) **Restart controlado** do Prometheus (rollout restart do StatefulSet)

Quando o reload não resolve ou você mudou flags/volumes:

```bash
# Descubra o StatefulSet
kubectl -n monitoring get sts | grep -i prometheus

# Reinicie
kubectl -n monitoring rollout restart statefulset/<sts-do-prometheus>
```

---

## 4) (Raro) **Reiniciar o Operator**

Só se o Operator “travou” e não está reconciliando:

```bash
# Nome varia conforme chart (kube-prometheus-stack costuma ter algo como ...-operator)
kubectl -n monitoring get deploy | grep -i operator
kubectl -n monitoring rollout restart deployment/<operator-deploy>
```

---

## Sanidade rápida (checklist)

- Alterou `ServiceMonitor`/`PodMonitor`? → Deve aparecer nos **Targets** do Prometheus em alguns segundos.
    
- Veja logs do reloader pra confirmar o reload.
    
- Se nada anda: `rollout restart` no **StatefulSet** do Prometheus.
    

Se quiser, me diga o **namespace** e o **nome do seu Prometheus CR** (ex.: `prometheus-k8s` ou `kube-prometheus-stack-prometheus`) que eu te passo os comandos já preenchidos para o seu cenário.