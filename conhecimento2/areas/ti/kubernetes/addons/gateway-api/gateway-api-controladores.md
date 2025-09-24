---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
Boa! Vamos por partes — o que é a [[gateway-api]] API, o que são “controladores” (controllers) e, por fim, como funciona o controlador da NGINX (NGINX Gateway Fabric, que é o que você está rodando).

# Visão geral da Gateway API

A **Gateway API** é a evolução do [[Ingress]]: um conjunto de CRDs padronizados para roteamento L4/L7 em Kubernetes. Ela separa claramente responsabilidades e é extensível. Os principais recursos são:

- **GatewayClass** – a “classe” oferecida por um controlador (quem implementa a Gateway API). Define _quem_ vai operar os Gateways. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/?utm_source=chatgpt.com "Kubernetes Gateway API: Introduction"), [Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API - Kubernetes"))
    
- **Gateway** – uma instância de plano de entrada com um ou mais **listeners** (porta/protocolo/hostname) onde o tráfego chega. Ele referencia uma _GatewayClass_. ([Medium](https://medium.com/%40rifewang/kubernetes-traffic-management-ingress-vs-gateway-api-c539182fea38?utm_source=chatgpt.com "Kubernetes Traffic Management: Ingress vs Gateway API - Medium"))
    
- **Routes** – regras de roteamento que “grudam” em um listener do Gateway (via `parentRefs`). Existem **HTTPRoute**, **GRPCRoute**, **TCPRoute**, **UDPRoute**, **TLSRoute** etc. (gRPC está GA). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))
    
- **ReferenceGrant** – permite que rotas encaminhem para _backends_ em outros namespaces (opt-in seguro). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/referencegrant/?utm_source=chatgpt.com "ReferenceGrant - Kubernetes Gateway API"))
    

A associação entre Gateways e Routes é controlada por políticas como `allowedRoutes` no listener (limita que tipos/namespaces de Routes podem anexar). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/multiple-ns/?utm_source=chatgpt.com "Cross-Namespace routing"), [gateway-api.f5se.io](https://gateway-api.f5se.io/guides/allowedroutes/?utm_source=chatgpt.com "Allowedroutes - BIG-IP Kubernetes GatewayAPI Controller"))

# O que é um “controlador” (controller)

O **controller** é um operador que:

1. observa os CRDs (GatewayClass, Gateway, Routes, etc.);
    
2. **concilia** essas specs em configuração de data plane (ex.: gera config do proxy);
    
3. atualiza _status conditions_ (ex.: rota aceita, endereço do gateway, conflitos de anexo).  
    Cada GatewayClass tem um `spec.controllerName` (string estilo domínio) que **precisa bater** com o nome que o binário do controller está anunciando. Isso é o que liga sua GatewayClass ao processo que vai operá-la. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference - Kubernetes Gateway API"))
    

[[funcionamento-ngf]]

[[exemplo-ngf]]

# Fluxo mental de operação

1. O Deployment do NGF sobe e registra seu **controllerName**.
    
2. Ele “assume” a `GatewayClass nginx`.
    
3. Você cria um `Gateway` com `gatewayClassName: nginx` e listeners (portas/protocolos).
    
4. Você cria `HTTPRoute`/`GRPCRoute` etc. que referenciam o `Gateway` (`parentRefs`).
    
5. O NGF traduz tudo para NGINX, **atualiza status/endereços** no `Gateway`, e o **Service** expõe as portas ao exterior. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/how-to/traffic-management/routing-traffic-to-your-app/?utm_source=chatgpt.com "Routing traffic to applications | NGINX Documentation"))
    

---

Se quiser, te mostro como:

- **ver o nome do controller** em `GatewayClass` e se o NGF está reconciliando (`kubectl describe gatewayclasses nginx`);
    
- **validar o IP/ports** pelo `Service` do NGF (LoadBalancer ou NodePort);
    
- montar **ReferenceGrant** para backends em outro namespace.