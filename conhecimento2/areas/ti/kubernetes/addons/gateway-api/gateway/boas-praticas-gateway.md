---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Padrões & boas práticas

- **Listeners claros e não conflitantes**: planeje portas (80/443 são comuns) e hostnames para evitar `Conflicted=True`. ([Envoy Gateway](https://gateway.envoyproxy.io/contributions/design/gatewayapi-translator/?utm_source=chatgpt.com "Gateway API Translator Design"))

- **Isolamento por namespace**: mantenha `allowedRoutes.from: Same` como padrão; abra para `Selector`/`All` só quando necessário (multi-tenant). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **TLS**: prefira manter `Secret` no **mesmo namespace** do `Gateway`; se precisar _cross-namespace_, crie um `ReferenceGrant` explícito. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/api-types/referencegrant/?utm_source=chatgpt.com "ReferenceGrant - Kubernetes Gateway API"))
    
- **Observabilidade**: monitore `status.addresses` e `listeners[].attachedRoutes` e use Conditions para _troubleshooting_. ([Broadcom TechDocs](https://techdocs.broadcom.com/us/en/vmware-security-load-balancing/avi-load-balancer/avi-kubernetes-operator/1-12/avi-kubernetes-operator-guide-1-12/gateway-api/gateway-api-v1.html?utm_source=chatgpt.com "Gateway API - v1 - Broadcom TechDocs"))