---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Ótima pergunta — resposta direta:

## TL;DR

- **ServiceMonitor NÃO “raspa o ClusterIP” do [[Service]].** Ele seleciona **Services por label** e o [[prometheus-operator|Prometheus Operator]] expande isso para os **[[endpont|Endpoints]]/[[endpoint-slice|EndpointSlices]]** daquele Service. Na prática, o Prometheus **scrapeia cada [[Pod]] IP/porta** exposta pelo Service.
    
- Se houver **várias réplicas**, você terá **um target por Pod** (por porta monitorada). **Não deveria “pular” nenhuma**, desde que os pods virem endpoint.
    
- Perdas de scraping normalmente vêm de **config/estado**: porta/`port` name errado, `readiness` tirando o pod dos endpoints, Service sem `selector`, exporter ouvindo só em `127.0.0.1`, [[networkpolicy|NetworkPolicy]] bloqueando, etc.
    

---

## Como funciona (rápido)

1. `ServiceMonitor.spec.selector` encontra **Services**.
    
2. Para cada Service, o Operator consulta **EndpointSlice/Endpoints** e gera um target por `(podIP, port)` cujo **nome da porta** bate com `endpoints[].port` do ServiceMonitor.
    
3. O [[Prometheus]] scrapeia **direto** nos Pod IPs. (Isso é automático; você não precisa configurar Pod por Pod.)
    

---

## Quando você pode “perder” réplicas (e como evitar)

- **Porta nomeada errada no Service**
    
    - No `ServiceMonitor`, `endpoints[].port` é o **nome** da porta do Service (ex.: `metrics`). Se o Service chama a porta `metrics` mas você escreve `metr` no ServiceMonitor… esse endpoint não entra.
        
    - ✅ Dica: padronize `name: metrics` no Service e use o mesmo nome no ServiceMonitor.
        
- **Pod fora de Endpoints (readiness)**
    
    - Se o Pod não está **Ready**, por padrão ele **não** aparece nos Endpoints → não é raspado.
        
    - ✅ Se você precisa raspar mesmo “não-pronto” (alguns exporters), use `publishNotReadyAddresses: true` no Service **ou** mude para **PodMonitor**.
        
- **Service sem `selector` (ou errado)**
    
    - Sem selector (ou com labels que não casam), o Service não gera Endpoints.
        
    - ✅ Garanta que `spec.selector` do Service corresponda aos labels dos Pods.
        
- **Exporter ouvindo em `127.0.0.1`**
    
    - O Prometheus conecta no **podIP:port**; se o processo só escuta em `127.0.0.1`, a conexão externa falha.
        
    - ✅ Faça o exporter ouvir em `0.0.0.0` (ou no pod IP).
        
- **NetworkPolicy bloqueando o Prometheus**
    
    - ✅ Libere tráfego **de** `namespace=monitoring` (ou onde roda o Prometheus) **para** os pods do NGF na porta de métricas.
        
- **Selectors do Prometheus não “enxergam” seu ServiceMonitor**
    
    - Se o seu `Prometheus` tem `serviceMonitorSelector`, ele só pega monitores com certos labels.
        
    - ✅ Adicione o label exigido (ex.: `release: prometheus`) no ServiceMonitor/PodMonitor.
        

---

## Como conferir que todas as réplicas estão sendo raspadas

```bash
# Endpoints/EndpointSlice expostos pelo Service (quantos IPs/ports?)
kubectl -n nginx-gateway get endpoints svc/<SERVICE-DO-NGF> -o wide
kubectl -n nginx-gateway get endpointslice -l kubernetes.io/service-name=<SERVICE-DO-NGF> -o wide

# No Prometheus → Status > Targets: veja 1 target por Pod (UP)
```

---

## Quando usar **[[podmonitor-crd|PodMonitor]]** em vez de [[servicemonitor-crd|ServiceMonitor]]

- Se você **não tem** (ou não quer) um Service que exponha a porta de métricas.
    
- Se quer escapar de `readiness` (comportamento um pouco diferente) ou selecionar Pods por labels diretamente.Prometheus
    
- A semântica é igual (descoberta automática), só muda o “ponto de ancoragem” (Pods em vez de Services).
    

---

## Exemplo mínimo (garante múltiplas réplicas)

**Service** (nota: nome da porta!):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ngf
  namespace: nginx-gateway
  labels:
    app.kubernetes.io/name: nginx-gateway-fabric
spec:
  selector:
    app.kubernetes.io/name: nginx-gateway-fabric
  ports:
    - name: metrics        # <— use este nome no ServiceMonitor
      port: 9113
      targetPort: 9113
```

**ServiceMonitor**:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: ngf-metrics
  namespace: monitoring
  labels:
    release: prometheus    # se o seu Prom exige esse label
spec:
  namespaceSelector:
    matchNames: ["nginx-gateway"]
  selector:
    matchLabels:
      app.kubernetes.io/name: nginx-gateway-fabric
  endpoints:
    - port: metrics        # <— nome da porta do Service
      path: /metrics
      interval: 30s
```

Com isso, **cada réplica** do NGF (cada Pod que virar endpoint) vira um **target** — sem “buracos”.