---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Troubleshooting (sintoma → causa → ação)

- **`listeners[].conditions.Conflicted=True`** → duas definições competindo na mesma `{Port, Protocol, Hostname}` → ajuste porta/host/protocolo até ficar único. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/specx/?utm_source=chatgpt.com "Experimental - Kubernetes Gateway API"))
    
- **`attachedRoutes=0` mesmo com Routes criadas** → `allowedRoutes` não permite o namespace/tipo; ou **hostname** do listener não intersecta com o da Route → corrija `allowedRoutes` e/ou hostnames. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Sem endereço em `status.addresses`** → o controlador ainda não alocou/propagou o _data plane_ (LB/hostNetwork/etc.). Verifique a implementação específica e os objetos de exposição. ([Broadcom TechDocs](https://techdocs.broadcom.com/us/en/vmware-security-load-balancing/avi-load-balancer/avi-kubernetes-operator/1-12/avi-kubernetes-operator-guide-1-12/gateway-api/gateway-api-v1.html?utm_source=chatgpt.com "Gateway API - v1 - Broadcom TechDocs"))