---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Exemplos YAML

### 1) Gateway mínimo (HTTP em 80)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${GATEWAY_NAME}
  namespace: ${NAMESPACE}
spec:
  gatewayClassName: ${GATEWAY_CLASS:=nginx}
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      allowedRoutes:
        namespaces:
          from: Same   # padrão seguro
```

(Anexe uma `HTTPRoute` a este listener via `parentRefs.sectionName: http`.) ([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))

### 2) Gateway HTTPS com terminação TLS (443)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${GATEWAY_NAME}
  namespace: ${NAMESPACE}
spec:
  gatewayClassName: ${GATEWAY_CLASS:=nginx}
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      hostname: app.${DOMAIN}
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: ${TLS_SECRET}   # kubernetes.io/tls
```

(`Terminate` faz a terminação no Gateway; `certificateRefs` aponta para `Secret` TLS.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))

### 3) Multi-tenant controlado (abrindo para namespaces por label)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: ${GATEWAY_NAME}
  namespace: edge
spec:
  gatewayClassName: ${GATEWAY_CLASS}
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      allowedRoutes:
        namespaces:
          from: Selector
          selector:
            matchLabels:
              team: app    # só Routes de NS com essa label
        kinds:
          - kind: HTTPRoute
```

(Controle fino de _who-can-attach_ via `allowedRoutes`.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))

### 4) TLS com Secret em **outro** namespace (usa `ReferenceGrant`)

```yaml
# Gateway em ns "edge" referenciando Secret em ns "security"
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: https-gw
  namespace: edge
spec:
  gatewayClassName: ${GATEWAY_CLASS}
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            namespace: security
            name: wildcard-cert
---
# ReferenceGrant no ns "security" autorizando o Gateway "edge/https-gw"
apiVersion: gateway.networking.k8s.io/v1
kind: ReferenceGrant
metadata:
  name: allow-edge-gw
  namespace: security
spec:
  from:
    - group: gateway.networking.k8s.io
      kind: Gateway
      namespace: edge
  to:
    - group: ""
      kind: Secret
```

(Autoriza a referência _cross-namespace_ ao `Secret`.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/api-types/referencegrant/?utm_source=chatgpt.com "ReferenceGrant - Kubernetes Gateway API"))