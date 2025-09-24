---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Exemplos YAML

### 1) Mínimo funcional (anexa ao listener `http` e encaminha tudo)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: ${ROUTE_NAME}
  namespace: ${NAMESPACE}
spec:
  parentRefs:
    - name: ${GATEWAY_NAME}
      sectionName: http
  rules:
    - backendRefs:
        - name: ${SERVICE}
          port: ${SERVICE_PORT:=80}
```

(Ausente `matches` ⇒ casa prefixo “/”.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))

### 2) Match completo + rewrite + headers + split

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-v1v2
  namespace: ${NAMESPACE}
spec:
  parentRefs:
    - name: ${GATEWAY_NAME}
      sectionName: http
  hostnames: ["app.${DOMAIN}"]
  rules:
    - matches:
        - path: { type: PathPrefix, value: /api }
          method: GET
          headers:
            - name: x-env
              type: Exact
              value: prod
          queryParams:
            - name: lang
              type: Exact
              value: pt
      filters:
        - type: URLRewrite            # não combine com RequestRedirect
          urlRewrite:
            path:
              type: ReplacePrefixMatch
              replacePrefixMatch: /v1
        - type: RequestHeaderModifier
          requestHeaderModifier:
            set:
              - name: x-forwarded-app
                value: docs
      backendRefs:
        - name: ${SERVICE_V1}
          port: 8080
          weight: 9
        - name: ${SERVICE_V2}
          port: 8080
          weight: 1
```

(Rewrite/Redirect são exclusivos; `weight` controla proporção.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))

### 3) Redirect HTTP→HTTPS (core)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: https-redirect
  namespace: ${NAMESPACE}
spec:
  parentRefs:
    - name: ${GATEWAY_NAME}
      sectionName: http   # listener HTTP
  rules:
    - filters:
        - type: RequestRedirect
          requestRedirect:
            scheme: https
            statusCode: 301
```

([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/http-redirect-rewrite/?utm_source=chatgpt.com "HTTP path redirects and rewrites"))

### 4) Mirror (100% ou percentual) — _Extended_

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: mirror-traffic
  namespace: ${NAMESPACE}
spec:
  parentRefs:
    - name: ${GATEWAY_NAME}
      sectionName: http
  rules:
    - matches:
        - path: { type: PathPrefix, value: /checkout }
      backendRefs:
        - name: ${PRIMARY}
          port: 8080
      filters:
        - type: RequestMirror
          requestMirror:
            backendRef:
              name: ${MIRROR}
              port: 8080
            percentage: "42%"   # quando suportado
```

(“RequestMirror” é Extended; **percentage** foi padronizado em v1.3 — suporte depende do controlador.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"), [GitHub](https://github.com/kubernetes-sigs/gateway-api/releases?utm_source=chatgpt.com "Releases · kubernetes-sigs/gateway-api"), [Kubernetes](https://kubernetes.io/blog/2025/06/02/gateway-api-v1-3/?utm_source=chatgpt.com "Gateway API v1.3.0: Advancements in Request Mirroring ..."))

### 5) Cross-namespace backend (precisa `ReferenceGrant`)

```yaml
# HTTPRoute em app-ns apontando para Service em backend-ns
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: store
  namespace: app-ns
spec:
  parentRefs:
    - name: ${GATEWAY_NAME}
      sectionName: http
  rules:
    - matches:
        - path: { value: /store }
      backendRefs:
        - name: store
          namespace: backend-ns
          port: 8080
---
# ReferenceGrant em backend-ns autorizando HTTPRoutes de app-ns
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-app-ns
  namespace: backend-ns
spec:
  from:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
      namespace: app-ns
  to:
    - group: ""
      kind: Service
```

([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/referencegrant/ "ReferenceGrant - Kubernetes Gateway API"))