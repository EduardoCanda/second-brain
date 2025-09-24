---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
# Como funciona o controlador NGINX (NGINX Gateway Fabric)

A implementação moderna da NGINX para Gateway API é o **NGINX Gateway Fabric (NGF)**. Ele usa o NGINX como _data plane_ e implementa os recursos centrais ([[Gateway]], [[gateway-class|GatewayClass]], [[HTTPRoute]], GRPCRoute, TCP/UDP/TLSRoute). ([GitHub](https://github.com/nginx/nginx-gateway-fabric?utm_source=chatgpt.com "nginx/nginx-gateway-fabric"))

Pontos importantes do NGF:

- **GatewayClass + controllerName**  
    O NGF instala uma `GatewayClass` chamada **`nginx`** por padrão. Ele só reconcilia Gateways cujo `gatewayClassName` seja esse nome (a não ser que você mude via flag). O emparelhamento acontece via `controllerName`, algo como `gateway.nginx.org/nginx-gateway-controller`, que também é passado como flag no Deployment do NGF. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/how-to/traffic-management/routing-traffic-to-your-app/?utm_source=chatgpt.com "Routing traffic to applications | NGINX Documentation"), [GitHub](https://github.com/nginxinc/nginx-gateway-fabric/discussions/2306?utm_source=chatgpt.com "Support for Gateway API . #2306"))
    
- **[[Service]] de Exposição**  
    O chart do NGF cria por padrão um **Service `LoadBalancer`** para expor o pod do gateway. Você pode trocá-lo para **NodePort**; nesse caso o cluster aloca NodePorts e você acessa via IP dos nodes + essas portas. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/installation/installing-ngf/helm/?utm_source=chatgpt.com "Installation with Helm - NGINX Gateway Fabric"))
    
- **Compatibilidade de recursos**  
    A NGINX mantém uma matriz pública dizendo o que está totalmente/ parcialmente suportado (HTTPRoute, GRPCRoute, TLS, TCP/UDP, políticas, etc.). Vale checar quando usar features mais novas. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/?utm_source=chatgpt.com "Gateway API Compatibility | NGINX Documentation"))
    
- **Independente do Ingress**  
    NGF **não substitui automaticamente** o NGINX [[Ingress]] Controller; são projetos diferentes (podem coexistir). Use [[gateway-api|Gateway API]] (NGF) quando quiser o modelo mais novo; mantenha Ingress para workloads legados, se necessário. ([GitHub](https://github.com/nginxinc/nginx-gateway-fabric/discussions/2302?utm_source=chatgpt.com "Does Nginx Gateway Fabric replace Nginx Ingress? ..."))
    

## “Mas e a porta do listener (ex.: 8082), qual a relação na hierarquia?”

- A **porta do listener** no `Gateway` (ex.: `spec.listeners[].port: 8082`) é **onde o proxy vai aceitar conexões** logicamente.
    
- Para que tráfego externo chegue ali, o **Service** que expõe o NGF precisa **abrir a mesma porta** (ou mapeá-la).
    
    - Com **LoadBalancer**, o LB do cloud provider escuta 8082 e encaminha para a porta do pod.
        
    - Com **NodePort**, o Kubernetes aloca _nodePorts_ (diferentes) que mapeiam para a porta 8082 do Service/pod. Você acessa via `NODE_IP:nodePort`. ([Documentação NGINX](https://docs.nginx.com/nginx-gateway-fabric/installation/installing-ngf/helm/?utm_source=chatgpt.com "Installation with Helm - NGINX Gateway Fabric"))
        

Em termos práticos: o **listener define a porta/protocolo/hostname do Gateway**, e o **Service** do NGF precisa expor essa(s) porta(s) para fora do cluster. Se você usar 80/443, é comum o Service também publicar 80/443. Se você usar 8082, ajuste o Service conforme necessário.