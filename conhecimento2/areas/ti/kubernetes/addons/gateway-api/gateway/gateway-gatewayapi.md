---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## TL;DR

- `Gateway` representa **uma instância de infraestrutura de tráfego** que **liga _listeners_** (porta/protocolo/hostname/TLS) a **endereços**; as _Routes_ anexadas definem _para onde_ o tráfego vai. ([Broadcom TechDocs](https://techdocs.broadcom.com/us/en/vmware-security-load-balancing/avi-load-balancer/avi-kubernetes-operator/1-12/avi-kubernetes-operator-guide-1-12/gateway-api/gateway-api-v1.html?utm_source=chatgpt.com "Gateway API - v1 - Broadcom TechDocs"), [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))
    
- Cada listener deve ter **combinação única** `{Port, Protocol, Hostname}`; conflitos deixam o listener em `Conflicted=True` e ele não recebe tráfego. ([Envoy Gateway](https://gateway.envoyproxy.io/contributions/design/gatewayapi-translator/?utm_source=chatgpt.com "Gateway API Translator Design"), [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/specx/?utm_source=chatgpt.com "Experimental - Kubernetes Gateway API"))
    
- **Anexos de Routes** são controlados por `allowedRoutes` do listener; por **padrão só permite Routes do mesmo namespace** (`from: Same`). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- `status.addresses` e `status.listeners[].attachedRoutes` mostram **endereços alocados** e **quantas rotas** anexaram com sucesso. **Conditions** padronizadas incluem `Programmed`, `Accepted` e `ResolvedRefs`. ([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"), [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-1364/?utm_source=chatgpt.com "GEP-1364: Status and Conditions Update"))
    
- Para **TLS** com `certificateRefs` em outro namespace, use **`ReferenceGrant`** (segurança _cross-namespace_). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/api-types/referencegrant/?utm_source=chatgpt.com "ReferenceGrant - Kubernetes Gateway API"))
    

## Definição rápida

`Gateway` descreve **como o tráfego chega** (de fora ou de outro domínio de rede) e **como é traduzido para Services** dentro do cluster. Ele declara a **classe** (`gatewayClassName`), **endereços desejados** (opcional) e **listeners**; o controlador realiza isso e popula o `status`. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))

## Regras de ligação/escopo

- **Routes → Gateway (listeners)**: uma Route só anexa se for **permitida pelo `allowedRoutes`** do listener. Por padrão, apenas Routes do **mesmo namespace** são aceitas. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Hostnames**: quando listener **e** Route especificam hostnames, **deve haver interseção** para a Route ser aceita. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/specx/?utm_source=chatgpt.com "Experimental - Kubernetes Gateway API"))
    
- **Status**: implementações devem reportar Conditions consistentes (ex.: `Programmed`, `Accepted`, `ResolvedRefs`, e `Ready`), úteis para _health_. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-1364/?utm_source=chatgpt.com "GEP-1364: Status and Conditions Update"), [GitHub](https://github.com/argoproj/argo-cd/issues/20986?utm_source=chatgpt.com "Healthchecks for Gateway API resources · Issue #20986"))


## Notas do controlador: **NGINX Gateway Fabric**

- **Suporte**: segue níveis _Core/Extended/Impl-specific_ do Gateway API. No `Gateway`, `certificateRefs` requer um único `Secret` TLS; `addresses` do `spec` não é suportado (endereços reportados parcialmente no `status`). ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/?utm_source=chatgpt.com "Gateway API Compatibility | NGINX Documentation"))
    
- **Portas padrão**: o _Service_ de exposição do NGF tipicamente publica **80/443**; se quiser outras portas, ajuste o Service/Deployment conforme a doc do projeto. ([GitHub](https://github.com/nginxinc/nginx-gateway-fabric/discussions/1697?utm_source=chatgpt.com "Can't change gateway port on service #1697"))
    

---

# Notas Importantes

[[campos-criticos-spec-gateway]]
[[boas-praticas-gateway]]
[[armadilhas-comuns-gateway]]
[[exemplos-yaml-gateway]]
[[verificacoes-uteis-gateway]]
[[troubleshooting-gateway]]