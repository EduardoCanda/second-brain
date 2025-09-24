---
tags:
  - Kubernetes
  - NotaPermanente
---
Boa! Se agora você recebe **404**, significa que o **pipeline está ok** (NodePort → [[gateway]] → [[data-plane]]), mas **a regra de roteamento não está casando** ou o **backend** está devolvendo 404. Siga este passo-a-passo rápido para achar e corrigir:

---

## 1) Verifique o que a sua [[HTTPRoute]] realmente casa

```bash
# Hostnames configurados?
kubectl -n prometheus get httproute prom -o jsonpath='{.spec.hostnames}{"\n"}'

# Qual listener e path?
kubectl -n prometheus get httproute prom -o jsonpath='{.spec.parentRefs}{"\n"}{.spec.rules[*].matches[*].path.type}{" "}{.spec.rules[*].matches[*].path.value}{"\n"}'

# Status da rota (se foi anexada e programada)
kubectl -n prometheus describe httproute prom | sed -n '/Parents/,$p'
```

### Interpretação

- **Hostnames definidos?** Então o cliente **precisa** enviar `Host:` compatível.  
    Ex.: `curl -v -H 'Host: api.dev.local' http://127.0.0.1:<NODEPORT>/`
    
- **Path match não é `"/"`?** Se você está pedindo `GET /` mas a rota só casa `/api`, o Gateway responde **404**. Teste a _path_ correta ou mude a regra.
    

---

## 2) Confirme que o backend realmente existe e responde

```bash
# O Service do Prometheus tem endpoints na 9090?
kubectl -n prometheus get svc prometheus -o wide
kubectl -n prometheus get endpoints prometheus -o wide
```

Se `Endpoints: <none>`, o Service está apontando labels errados → ajuste o selector do [[Service]] (ou confira se o [[Prometheus]] está nesse namespace).

---

## 3) Rota “pega-tudo” para validar (catch-all)

Se quiser garantir o roteamento sem depender de hostname/path, aplique esta **HTTPRoute mínima** (ajuste o nome do Service se for diferente de `prometheus`):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: prom
  namespace: prometheus
spec:
  parentRefs:
    - name: publico
      sectionName: http
  # Sem hostnames = aceita qualquer Host
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: prometheus
          port: 9090
```

Teste:

```bash
curl -v http://127.0.0.1:<NODEPORT>/
```

- Se **funcionar** → o problema anterior era **hostname** ou **path**.
    
- Se ainda der **404**, é provável que o **backend** esteja devolvendo 404 (menos comum no Prometheus para `/`). Teste caminhos típicos:
    
    ```bash
    curl -v http://127.0.0.1:<NODEPORT>/graph
    curl -v http://127.0.0.1:<NODEPORT>/metrics
    ```
    

---

## 4) Quer publicar sob um prefixo (ex.: `/prom`)?

Se você quer acessar `http://<node>:<port>/prom` mas o Prometheus serve em `/`, use **URLRewrite**:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: prom
  namespace: prometheus
spec:
  parentRefs:
    - name: publico
      sectionName: http
  rules:
    - matches:
        - path: { type: PathPrefix, value: /prom }
      filters:
        - type: URLRewrite
          urlRewrite:
            path:
              type: ReplacePrefixMatch
              replacePrefixMatch: /
      backendRefs:
        - name: prometheus
          port: 9090
```

Teste:

```bash
curl -v http://127.0.0.1:<NODEPORT>/prom
```

---

## 5) Checklist rápido

-  `parentRefs.sectionName` = **nome do listener** do Gateway (`http`).
    
-  Listener do Gateway está na **8082** (e o Service/NodePort expõe `port: 8082` → `targetPort: 8082`).
    
-  Se usar `hostnames` na HTTPRoute, enviar `-H 'Host: ...'`.
    
-  `Endpoints` do Service backend **não** estão vazios.
    
-  Se publicar sob prefixo, usar **URLRewrite** para ajustar o caminho.
    

Se quiser, cole aqui o `kubectl -n prometheus get httproute prom -o yaml` e o `kubectl -n prometheus get svc prometheus -o yaml` que eu te devolvo o YAML exato (catch-all ou com prefixo) já pronto para aplicar.