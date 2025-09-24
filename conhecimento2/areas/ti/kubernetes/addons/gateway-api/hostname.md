---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
Ótima pergunta — “hostname” no **[[gateway-api|Gateway API]]** costuma confundir mesmo, especialmente em dev local. Pense nele como o **nome do site** (FQDN) que o Gateway usa para **decidir para onde enviar uma requisição**.

# O que o hostname faz (ideia geral)

- **[[protocolo-https|HTTP]]**: o cliente envia o cabeçalho `Host:` (HTTP/1.1) ou `:authority` (HTTP/2).  
    O Gateway compara esse valor com o **hostname** do _listener_ e com os **hostnames** das **Routes** (ex.: [[HTTPRoute]]) para decidir o roteamento.
    
- **HTTPS/[[protocolo-tls|TLS]]**: antes mesmo de decodificar HTTP, o cliente envia o **SNI** (o hostname) no handshake TLS.  
    O Gateway usa o SNI para **escolher o certificado** (se for `tls.mode: Terminate`) e/ou para **escolher a rota** (mesmo em **Passthrough**).
    

> Em resumo: com **um único IP/LoadBalancer**, você pode hospedar **vários “sites”** (vários hostnames) e rotear cada um para backends diferentes.

---

# Como isso se aplica no [[Kubernetes]]

- **Gateway (listener.hostname)**: define **quais hostnames** aquele listener aceita. Se **omitido**, aceita **todos**.
    
- **HTTPRoute.spec.hostnames**: diz **para quais hostnames** a rota vale.  
    A rota **só anexa** a um listener se houver interseção (ex.: listener `*.exemplo.com` e rota `api.exemplo.com` → OK).
    
- **Service / DNS internos**: o hostname do Gateway **não** é o mesmo que o nome DNS do Service (tipo `svc.ns.svc.cluster.local`).
    
    - **Tráfego norte→sul (externo)**: usa **hostname “do site”** (Gateway/Route).
        
    - **Tráfego leste→oeste (interno)**: usa **DNS de Services** (ex.: `api.backend.svc.cluster.local`).
        

> Outros recursos que usam “hostname”:
> 
> - **Ingress**: `rules[].host` (mesma ideia de virtual host).
>     
> - **Pod.spec.hostname/subdomain**: afeta o **nome do host dentro do Pod** e entradas DNS _headless_, **não** serve para roteamento externo.
>     
> - **Service ExternalName**: aponta para um **hostname externo** (CNAME).
>     

---

# “Mas estou rodando na minha máquina… qual a utilidade?”

Mesmo localmente, o hostname ainda é útil porque:

1. **Roteamento por host**: você pode simular vários sites/canais (ex.: `api.dev.local`, `web.dev.local`) compartilhando o mesmo IP.
    
2. **Teste de TLS/SNI**: dá para validar certificados (mesmo _self-signed_) e SNI.
    
3. **Compatibilidade**: seus manifests já ficam prontos para produção (DNS real + TLS).
    

### Como testar localmente (3 jeitos)

- **/etc/hosts**  
    Aponte um nome para o IP do seu Gateway (minikube/kind/port-forward):
    
    ```
    127.0.0.1 api.dev.local web.dev.local
    ```
    
    Depois:
    
    ```
    curl -H 'Host: api.dev.local' http://127.0.0.1:80/saude
    ```
    
- **Domínios “mágicos” que resolvem para o IP**  
    Use `nip.io` ou `sslip.io`:
    
    - `http://127.0.0.1.nip.io` (ou `web.127.0.0.1.nip.io`) sem mexer no /etc/hosts.
        
- **Sem DNS (só para testar o match)**
    
    ```
    curl -H 'Host: api.exemplo.com' http://<IP-do-gateway>/
    ```
    
    (O Gateway vai casar pelo `Host:` mesmo que o DNS não exista.)
    

> **Dica**: _wildcards_ (`*.exemplo.com`) funcionam para **um nível** (ex.: `app.exemplo.com`), mas **não** para múltiplos níveis (`a.b.exemplo.com`).

---

# Fluxo mental (resumão)

1. **DNS** do hostname → IP/endpoint do **Gateway** (LB, NodePort+port-forward etc.).
    
2. **Cliente** envia `Host` (e SNI em TLS).
    
3. **[[Listener]]** filtra por `hostname` e **anexa** as rotas compatíveis.
    
4. **HTTPRoute** escolhe o **backend** conforme `matches` (path, headers, method…) e **hostnames**.
    

---

# Exemplo mínimo (funciona em dev e prod)

**Gateway** (duas portas, mesmo hostname):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: publico
  namespace: web
spec:
  gatewayClassName: eg
  listeners:
    - name: http
      port: 80
      protocol: HTTP
      hostname: api.dev.local        # ou 127.0.0.1.nip.io em dev
    - name: https
      port: 443
      protocol: HTTPS
      hostname: api.dev.local
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: cert-api-dev-local
```

**HTTPRoute** (só casa com `api.dev.local`):

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api
  namespace: web
spec:
  parentRefs:
    - name: publico
      sectionName: https
  hostnames: ["api.dev.local"]
  rules:
    - matches:
        - path: { type: PathPrefix, value: "/api" }
      backendRefs:
        - name: api-svc
          port: 8080
```

Teste:

```bash
# Sem mexer em DNS (se usar nip.io)
curl -H 'Host: api.dev.local' http://127.0.0.1:80/api/saude

# Ou com /etc/hosts apontando api.dev.local -> 127.0.0.1
curl https://api.dev.local/api/saude -k     # -k se o cert for self-signed
```

---

## Erros/pitfalls comuns

- **Certificado não cobre o hostname** → falha de TLS (o CN/SAN do cert precisa conter o hostname ou um wildcard compatível).
    
- **Listener sem hostname, rota com hostname inesperado** → a rota pode anexar e “roubar” tráfego que você não queria (use hostnames explícitos e `allowedRoutes`).
    
- **Confundir hostname externo com DNS interno do Service** → um não substitui o outro; são camadas diferentes (norte/sul vs leste/oeste).
    