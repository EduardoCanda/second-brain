---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Campos críticos (do `spec`)

- **`parentRefs[]`** – Gateways/listeners aos quais a Route tenta se anexar. Pode apontar por `sectionName` (nome do listener) ou por `port` (anexa a todos os listeners daquela porta). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **`hostnames[]`** _(opcional)_ – FQDNs avaliados **antes** das regras; se ausente, avalia só as regras. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/http-routing/ "HTTP routing - Kubernetes Gateway API"))
    
- **`rules[]`** – Cada regra contém:
    
    - **`matches[]`** (OR entre itens; dentro de um match, AND de caminho/header/método/query). Default de caminho se nada for especificado: **prefix “/”**. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
        
    - **`filters[]`** – Passos de processamento (core/extended). **Redirect ↔ URLRewrite são mutuamente exclusivos por regra.** ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
        
    - **`backendRefs[]`** – Destinos e **`weight`** para dividir tráfego (0 = desativa, default=1). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
        
    - **`timeouts`** _(experimental)_ – `request` e `backendRequest`. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))