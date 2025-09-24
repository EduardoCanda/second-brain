---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## TL;DR

- Recurso que **combina correspondência (match)** por host, caminho, headers, método e query-params com **ações** (encaminhar, redirecionar, reescrever, espelhar). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **`parentRefs`** prende a Route a um **[[Gateway]]** (listener por `sectionName` ou por `port`). O Gateway precisa **permitir** HTTPRoutes daquele namespace. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Regra = {matches, filters, backendRefs}**. Vários `matches` em uma regra fazem **OR**; dentro de um match, os campos fazem **AND**. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Precedência**: mais específico vence (Exact > Prefix mais longo > método > +headers > +query). Empates: rota mais antiga, depois ordem alfabética. **Só uma regra recebe** cada requisição. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Filtros core/extended** (ex.: HeaderModifier, Redirect, URLRewrite, Mirror). **Redirect e URLRewrite não podem coexistir na mesma regra.** ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Splitting por `weight`** nos `backendRefs`; peso **não é porcentagem** e a soma **não precisa** dar 100. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    

## Definição rápida

`HTTPRoute` define **como** o tráfego [[protocolo-https|HTTP]]/HTTPS que chega por um listener do [[gateway-gatewayapi]] deve ser **selecionado** (via matches) e **processado** (via filters) e, se aplicável, **encaminhado** a backends [[Kubernetes]] (geralmente `Service`). É GA no canal Standard. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))

## Regras de ligação/escopo

- **Anexar ao Gateway:** a Route só “cola” se o listener aceitar o tipo/namespaces (`allowedRoutes`). Você pode amarrar por `sectionName` **ou** por `port` (flexibilidade vs. acoplamento à porta). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
    
- **Cross-namespace (backends):** para apontar `backendRefs` em outro namespace, é obrigatório um **`ReferenceGrant`** no namespace do backend. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/referencegrant/ "ReferenceGrant - Kubernetes Gateway API"))

## Verificações úteis

```bash
# Ver status e anexos
kubectl get httproute -n ${NAMESPACE}
kubectl describe httproute/${ROUTE_NAME} -n ${NAMESPACE} | sed -n '/Status/,$p'

# Conferir Conditions de Accepted/ResolvedRefs nos Parents
kubectl get httproute/${ROUTE_NAME} -n ${NAMESPACE} -o yaml

# Eventos do namespace (erros de binding / filtros incompatíveis)
kubectl get events -n ${NAMESPACE} --sort-by=.lastTimestamp
```

(HTTPRoute expõe `status.parents[].conditions`, incluindo `Accepted`.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/httproute/ "HTTPRoute - Kubernetes Gateway API"))
## Notas do controlador: **NGINX Gateway Fabric**

- **Suporte de HTTPRoute**: core suportado; alguns campos são parciais. Path types suportados: `Exact` e `PathPrefix`. `parentRefs.port` **não** suportado. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/ "Gateway API Compatibility | NGINX Documentation"))
    
- **Filtros**: `RequestRedirect`, `RequestHeaderModifier`, `URLRewrite`, `ResponseHeaderModifier` suportados; `RequestMirror` suportado, **inclusive mirroring percentual**. Alguns filtros são aplicados “o primeiro vence” quando há múltiplos na mesma regra. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/ "Gateway API Compatibility | NGINX Documentation"))
    
- **Dica prática**: para features não cobertas, o NGF oferece **Snippets/extensionRef** (uso avançado/impl-specific). ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/how-to/traffic-management/snippets/?utm_source=chatgpt.com "Use the SnippetsFilter API | NGINX Documentation"))
    

---

# Notas Importantes
[[boas-praticas-httproute]]
[[campos-criticos-spec-httproute]]
[[troubleshooting-httproute]]
[[armadilhas-comuns-httproute]]
[[exemplos-yaml-httproute]]


