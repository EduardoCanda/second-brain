---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Armadilhas comuns

- **Hostname não casa** com o listener do Gateway → `Accepted=False` na Route. Verifique host do listener e `hostnames` da Route. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/http-routing/ "HTTP routing - Kubernetes Gateway API"))
    
- **Falta de permissão** do listener (`allowedRoutes`) → anexo falha. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/multiple-ns/ "Cross-Namespace routing - Kubernetes Gateway API"))
    
- **Combinar `URLRewrite` + `RequestRedirect`** na mesma regra → inválido. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Entender “weights”**: não é porcentagem e somatório livre; `weight: 0` efetivamente exclui o backend. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Cross-namespace sem `ReferenceGrant`** → referência ao Service é ignorada. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/referencegrant/ "ReferenceGrant - Kubernetes Gateway API"))