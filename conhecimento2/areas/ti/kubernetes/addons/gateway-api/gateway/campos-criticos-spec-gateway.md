---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Campos críticos (do `spec`)

- **`gatewayClassName`** – qual `GatewayClass` (e portanto qual controlador) gerencia este `Gateway`. ([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))
    
- **`addresses[]`** _(opcional)_ – endereços de rede solicitados; a alocação efetiva aparece em `status.addresses`. Suporte varia por implementação. ([Broadcom TechDocs](https://techdocs.broadcom.com/us/en/vmware-security-load-balancing/avi-load-balancer/avi-kubernetes-operator/1-12/avi-kubernetes-operator-guide-1-12/gateway-api/gateway-api-v1.html?utm_source=chatgpt.com "Gateway API - v1 - Broadcom TechDocs"))
    
- **`listeners[]`** – onde e como o tráfego é aceito:
    
    - `port`, `protocol` (HTTP/HTTPS/TCP/UDP/TLS/GRPC), `hostname` (opcional). **Únicos por tripla `{Port, Protocol, Hostname}`.** ([Envoy Gateway](https://gateway.envoyproxy.io/contributions/design/gatewayapi-translator/?utm_source=chatgpt.com "Gateway API Translator Design"))
        
    - `tls` – `mode` (`Terminate`/`Passthrough`) e `certificateRefs` (normalmente `Secret` do tipo `kubernetes.io/tls`; _cross-namespace_ requer `ReferenceGrant`). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
        
    - `allowedRoutes` – restringe **de quais namespaces** e **quais tipos de Routes** podem anexar. Padrão: `from: Same`. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))