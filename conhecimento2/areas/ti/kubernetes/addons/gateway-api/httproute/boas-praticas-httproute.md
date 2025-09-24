---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Padrões & boas práticas

- **Separar hosts por Route**: um host por `HTTPRoute` facilita isolamento e precedência. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/http-routing/ "HTTP routing - Kubernetes Gateway API"))
    
- **Use `sectionName`** quando possível; `port` prende a Route a um número específico de porta. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Modelar canário** com um match “mais específico” (ex.: header `traffic=test`) e depois **weights** para rollout. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/traffic-splitting/?utm_source=chatgpt.com "HTTP traffic splitting"))
    
- **Declarar filtros mínimos necessários**; lembre que Redirect e URLRewrite **não** combinam. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Ver precedência** quando múltiplas Routes compartilham o mesmo Gateway. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))