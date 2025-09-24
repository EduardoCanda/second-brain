---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Troubleshooting (sintoma → causa → ação)

- **Route não aparece no Gateway** → `AllowedRoutes` do listener não permite o seu namespace/tipo → Ajuste `allowedRoutes` ou mova a Route para um namespace permitido. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/multiple-ns/ "Cross-Namespace routing - Kubernetes Gateway API"))
    
- **404 mesmo com regra** → `hostnames` da Route não intersecta com o listener/host do pedido → alinhe hostnames ou remova filtro por host. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/http-routing/ "HTTP routing - Kubernetes Gateway API"))
    
- **Rewrite + Redirect juntos** → regra rejeitada com `IncompatibleFilters` → separe em regras/listeners distintos. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Split ignorando um backend** → `weight: 0` ou `port` inválida no Service → corrija `weight/port`. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Backend em outro namespace não funciona** → faltou `ReferenceGrant` no namespace do backend → crie o grant. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/referencegrant/ "ReferenceGrant - Kubernetes Gateway API"))