---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
## Verificações úteis

```bash
# 1) Endereços e listeners (inclui attachedRoutes)
kubectl get gateway -n ${NAMESPACE} ${GATEWAY_NAME} -o yaml

# 2) Aguardar programação (se o controlador reporta):
kubectl wait --for=condition=Programmed=True -n ${NAMESPACE} gateway/${GATEWAY_NAME} --timeout=90s

# 3) Events do namespace (erros de binding/conflitos)
kubectl get events -n ${NAMESPACE} --sort-by=.lastTimestamp
```

(Conditions padronizadas facilitam health/checks automatizados.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-1364/?utm_source=chatgpt.com "GEP-1364: Status and Conditions Update"))