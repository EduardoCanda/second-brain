---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Armadilhas comuns

- **Conflito de listener** (`{Port, Protocol, Hostname}` repetido) → listener fica `Conflicted=True`/não pronto e o tráfego não flui. Ajuste a tripla. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/specx/?utm_source=chatgpt.com "Experimental - Kubernetes Gateway API"))
    
- **Route “não cola”** no Gateway → `allowedRoutes` do listener não permite o namespace/tipo → ajuste `allowedRoutes`. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **TLS não sobe** → `certificateRefs` não encontrado/sem permissão _cross-namespace_ → garanta `Secret` correto ou crie `ReferenceGrant`. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/api-types/referencegrant/?utm_source=chatgpt.com "ReferenceGrant - Kubernetes Gateway API"))