---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
**GatewayClass** (geralmente já vem instalada pelo NGF; aqui apenas ilustrativo):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx
spec:
  controllerName: gateway.nginx.org/nginx-gateway-controller
```

([GitHub](https://github.com/nginxinc/nginx-gateway-fabric/discussions/2306?utm_source=chatgpt.com "Support for Gateway API . #2306"))

**[[Gateway]]** ouvindo em 80 ([[protocolo-https|HTTP]]) e 443 ([[protocolo-https|HTTPS]]):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: web-gw
  namespace: nginx-gateway
spec:
  gatewayClassName: nginx
  listeners:
    - name: http
      protocol: HTTP
      port: 80
      hostname: app.exemplo.com
      allowedRoutes:
        namespaces:
          from: Same
    - name: https
      protocol: HTTPS
      port: 443
      hostname: app.exemplo.com
      tls:
        mode: Terminate
        certificateRefs:
          - name: tls-cert
```

(Esse Gateway só aceitará [[httproute|Routes]] do **mesmo [[namespace]]** por causa de `allowedRoutes`; para cross-namespace, configure `allowedRoutes` e use `ReferenceGrant`.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/multiple-ns/?utm_source=chatgpt.com "Cross-Namespace routing"))

**[[httproute]]** que anexa no listener `http` e encaminha ao Service `minha-api`:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: minha-api
  namespace: nginx-gateway
spec:
  parentRefs:
    - name: web-gw
      sectionName: http
  hostnames: ["app.exemplo.com"]
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: minha-api
          port: 8080
```

(Para gRPC, use **GRPCRoute**; o NGF suporta gRPC nativamente via HTTP/2.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))