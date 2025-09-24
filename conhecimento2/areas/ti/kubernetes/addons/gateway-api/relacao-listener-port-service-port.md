---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
Ótima dúvida! Pense no **Listener.port** (a sua **8082**) como a **porta de entrada** do [[Gateway]] — é nela que o _proxy_ (NGINX/Envoy) vai **escutar tráfego**. Ela fica **no nível do Listener**, que é onde você também define protocolo, hostname e [[protocolo-tls|TLS]].

Aqui vai a hierarquia com a função de **cada porta**:

```json
Cliente
  │
  │  (A) NodePort/LB ► porta EXTERNA do Service que expõe o Gateway
  ▼
Service do Gateway (NodePort ou LoadBalancer)
  │      └─ .spec.ports[].port = 8082           ← deve existir
  │         .spec.ports[].targetPort = 8082     ← deve apontar para a porta que o pod escuta
  ▼
Pod do Gateway (data-plane: NGINX/Envoy)
  │      └─ Listener.port = 8082                ← porta em que o proxy ESCUTA
  │         + hostname, TLS, allowedRoutes...
  ▼
HTTPRoute (camada L7)
  │      └─ decide o backend pela regra (path, headers, hostnames)
  ▼
Service do backend
  │      └─ backendRefs.port = 9090             ← porta lógica do Service do backend
  ▼
Pod do backend
         └─ containerPort/targetPort (ex.: 9090)
```

Pontos-chave:

- **Listener.port (8082)**: é a porta **front-door** do Gateway. Não tem relação direta com a porta do backend; ela serve para o **cliente chegar** ao Gateway.
    
- **[[Service]] do Gateway**: precisa **expor essa mesma porta** (ex.: `port: 8082`) e encaminhar para o pod do Gateway **na mesma 8082** (`targetPort: 8082`).
    
    - Em **NodePort**, você ainda ganha uma **NodePort** (ex.: 30082) → o cliente acessa `NODE_IP:30082`, que mapeia para `port:8082` do Service, que por sua vez chega no Listener 8082.
        
    - Em **LoadBalancer**, o LB escuta diretamente a **8082** e encaminha para o Service 8082.
        
- **[[HTTPRoute]]**: não “usa” a porta diretamente; ela se **anexa a um Listener** pelo `parentRefs` (e opcionalmente `sectionName` que é o nome do Listener). O roteamento L7 acontece **depois** que o tráfego entrou pela `8082`.
    
- **backendRefs.port (9090 no seu [[Prometheus]])**: é **independente** da `8082`. É a porta do **Service do backend**; o Gateway faz _proxy_ da 8082 (entrada) para 9090 (backend).
    
- **containerPort do backend**: fica por trás do Service do backend (via `targetPort`). Não influencia o [[Listener]].
    

Em resumo:

- Se você muda **a porta do Listener**, ajuste o **Service que expõe o Gateway** (mesma `port` e `targetPort`).
    
- Se você muda **a porta do backend**, ajuste **apenas** `backendRefs.port` na HTTPRoute (e, se necessário, o Service do backend).
    
- **Hostname/TLS** também vivem no **Listener** (juntos com a `port`) porque são preocupações da **entrada**; _paths, headers, splits_ ficam na **HTTPRoute**.
    

Regra prática para evitar `connection refused` e 404 “estranhos”:

1. `Listener.port = X`
    
2. `Service (Gateway).port = X` **e** `targetPort = X`
    
3. `HTTPRoute` anexada ao Listener certo (via `parentRefs/sectionName`)
    
4. `backendRefs.port` = porta do Service do backend (ex.: 9090)
    

Se quiser, te mando um “checklist de portas” em YAML (Gateway + Service do Gateway + HTTPRoute + Service backend) para você usar como gabarito nos próximos deployments.