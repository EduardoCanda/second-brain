---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
# Listener (do `Gateway`)

## TL;DR

- **Listener = a “porta/protocolo/host” do Gateway.** Ele diz _onde_ o tráfego chega (ex.: `:443/HTTPS` para `app.example.com`) e aplica **TLS** e **regras de anexação de Routes** naquele ponto. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))
    
- Campos-chave: `port`, `protocol` (HTTP/HTTPS/TLS/TCP/UDP/GRPC), `hostname` (opcional), `tls` (Terminate/Passthrough + `certificateRefs`), `allowedRoutes`. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/guides/tls/?utm_source=chatgpt.com "TLS"))
    
- **Unicidade:** cada listener no mesmo Gateway deve ter combinação **única** `{Port, Protocol, Hostname}`; **diferenças só de TLS não contam** (ainda conflita). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"), [docs.redhat.com](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/network_apis/gateway-gateway-networking-k8s-io-v1?utm_source=chatgpt.com "Chapter 15. Gateway [gateway.networking.k8s.io/v1] | ..."))
    
- **Aderência de Routes:** se listener e Route tiverem `hostname(s)`, **precisa haver interseção**; com HTTP/HTTPS, o host do listener casa com `Host` do request; com TLS, casa com **SNI**. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **TLS:** `Terminate` exige `certificateRefs`; `Passthrough` não usa certificado no listener (o app termina). Wildcards `*.example.com` são suportados com regras específicas. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-2907/?utm_source=chatgpt.com "GEP-2907: TLS Configuration Placement and Terminology"))
    

## Definição rápida

Um **listener** é a “**superfície de entrada**” do `Gateway`: define **porta**, **protocolo**, **(opcional) hostname** e **políticas de TLS e de anexação** para as Routes. Cada listener opera de forma independente, permitindo que um mesmo `Gateway` tenha, por exemplo, `:80/HTTP` e `:443/HTTPS` para domínios diferentes. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))

## Campos críticos

- **`port` + `protocol`** – Onde e como o Gateway aceita conexões (HTTP/HTTPS/GRPC/TLS/TCP/UDP). Algumas combinações são “Core” esperadas (ex.: `80/HTTP`, `443/HTTPS (Terminate)`, `443/TLS (Passthrough)`). ([docs.redhat.com](https://docs.redhat.com/en/documentation/openshift_container_platform/4.19/html/network_apis/gateway-gateway-networking-k8s-io-v1?utm_source=chatgpt.com "Chapter 15. Gateway [gateway.networking.k8s.io/v1] | ..."))
    
- **`hostname` (opcional)** – Limita o _virtual host_ do listener.
    
    - HTTP/HTTPS: deve casar com **Host** (autoridade) do request;
        
    - TLS: deve casar com **SNI**;
        
    - **Wildcard** suportado apenas como `*.example.com` (um único label curinga, IPs não são permitidos). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
        
- **`tls`** – Política de TLS do listener:
    
    - **`mode: Terminate`**: o Gateway encerra TLS e serve um **certificado de `certificateRefs`**;
        
    - **`mode: Passthrough`**: o Gateway **não** apresenta certificado; roteia por **SNI** até o backend (usar `TLSRoute`). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-2907/?utm_source=chatgpt.com "GEP-2907: TLS Configuration Placement and Terminology"))
        
- **`allowedRoutes`** – Restringe **de quais namespaces** (`Same`/`All`/`Selector`) e **quais tipos** de Routes podem anexar. O padrão é **`from: Same`**. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))
    

## Regras de ligação/escopo

- **Unicidade**: dentro do mesmo `Gateway`, cada listener deve ter combinação única `{Port, Protocol, Hostname}`; **mudar só a config TLS não diferencia** (continua conflito). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Hostnames & interseção**: quando **listener** e **Route** declaram hostnames, **precisa haver interseção** para anexar (vale para HTTPRoute/GRPCRoute/TLSRoute). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Seleção de listener pela Route**: em `parentRefs`, a Route pode especificar **`sectionName`** (nome do listener) e/ou **`port`** (seleciona todos os listeners daquela porta compatíveis). Se ambos forem informados, **ambos** devem casar. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"), [docs.okd.io](https://docs.okd.io/latest/rest_api/network_apis/httproute-gateway-networking-k8s-io-v1.html?utm_source=chatgpt.com "HTTPRoute [gateway.networking.k8s.io/v1] - Network APIs ..."))
    

## Padrões & boas práticas

- **Um host → um listener** quando os certificados diferem; use **wildcard** (`*.example.com`) quando faz sentido e complemente com listener “mais específico” para priorizar um cert dedicado. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/guides/tls/?utm_source=chatgpt.com "TLS"))
    
- **Deixe `allowedRoutes.from: Same` por padrão** e só abra com `Selector`/`All` quando realmente precisar multi-tenant. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/concepts/api-overview/?utm_source=chatgpt.com "API Overview"))
    
- **Escolha clara de TLS**:
    
    - **Terminate** (edge TLS) ⇒ `HTTPS` + `certificateRefs` + Routes **HTTP**;
        
    - **Passthrough** ⇒ `TLS` + **`TLSRoute`** com SNI (sem `certificateRefs`). ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-2907/?utm_source=chatgpt.com "GEP-2907: TLS Configuration Placement and Terminology"))
        

## Armadilhas comuns

- **Dois listeners “iguais”** (mesmo `{port, protocol, hostname}`) ⇒ o segundo **não é aceito** (conflito). **Diferenças só em TLS não evitam conflito**. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Sem interseção de hostnames** entre listener e Route ⇒ a Route **não anexa**. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    
- **Esperar TLS no Passthrough com HTTPRoute** (ou Terminate sem `certificateRefs`) ⇒ erro de protocolo/TLS. **Ajuste o par protocolo/rota**. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-2907/?utm_source=chatgpt.com "GEP-2907: TLS Configuration Placement and Terminology"))
    
- **Wildcard fora do padrão** (ex.: `*w.example.com`, `*` “puro”) ⇒ inválido. Use **`*.example.com`**. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
    

## Exemplos YAML

### 1) HTTP 80 (padrão seguro `allowedRoutes` no mesmo namespace)

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: web
  namespace: ${NS}
spec:
  gatewayClassName: ${GWC:=nginx}
  listeners:
    - name: http
      port: 80
      protocol: HTTP
      allowedRoutes:
        namespaces: { from: Same }
```

(HTTPRoute anexa com `parentRefs.sectionName: http`.)

### 2) HTTPS 443 com **TLS Terminate** + cert dedicado

```yaml
listeners:
  - name: https
    port: 443
    protocol: HTTPS
    hostname: app.${DOMAIN}
    tls:
      mode: Terminate
      certificateRefs:
        - kind: Secret
          name: app-${DOMAIN}-tls   # kubernetes.io/tls (fullchain + key)
```

(`certificateRefs` é **obrigatório** em `Terminate`.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-2907/?utm_source=chatgpt.com "GEP-2907: TLS Configuration Placement and Terminology"))

### 3) TLS **Passthrough** (SNI) para app terminar TLS

```yaml
listeners:
  - name: tls
    port: 443
    protocol: TLS
    hostname: secure.${DOMAIN}
    tls: { mode: Passthrough }
```

(Use **`TLSRoute`** com `hostnames` compatíveis; o Gateway não usa Secret.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/geps/gep-2907/?utm_source=chatgpt.com "GEP-2907: TLS Configuration Placement and Terminology"))

### 4) Wildcard + específico (prioridade ao específico)

```yaml
listeners:
  - name: https-foo
    port: 443
    protocol: HTTPS
    hostname: foo.${DOMAIN}
    tls:
      mode: Terminate
      certificateRefs:
        - name: foo-cert
  - name: https-wild
    port: 443
    protocol: HTTPS
    hostname: *.${DOMAIN}
    tls:
      mode: Terminate
      certificateRefs:
        - name: wildcard-cert
```

(Para `foo.${DOMAIN}`, o listener **específico** tem prioridade sobre o wildcard.) ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/guides/tls/?utm_source=chatgpt.com "TLS"))

## Verificações úteis

```bash
# Ver listeners e conditions
kubectl -n ${NS} describe gateway ${GW} | sed -n '/Listeners/,$p'

# Checar anexos/hostnames
kubectl -n ${NS} get httproute ${ROUTE} -o yaml | sed -n '/parents:/,$p'

# Validar cert no edge (HTTPS Terminate)
openssl s_client -connect ${HOST}:443 -servername ${HOST} -showcerts </dev/null | egrep 'Certificate chain|Verify return code'
```

## Notas do controlador: **NGINX Gateway Fabric (NGF)**

- NGF segue a semântica da spec: você **declara explicitamente** `HTTPS + tls.mode: Terminate + certificateRefs` para servir o cert no listener; guias mostram os dois listeners (`http`/`https`) e o uso do Secret de TLS. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/how-to/traffic-management/https-termination/?utm_source=chatgpt.com "HTTPS termination - NGINX Gateway Fabric"))
    
- O **matching por hostname/wildcard** e as **restrições `allowedRoutes`** funcionam conforme a Gateway API; consulte a matriz de compatibilidade do NGF para nuances por campo/feature. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/?utm_source=chatgpt.com "Gateway API Compatibility | NGINX Documentation"))
    

Se quiser, eu transformo isso em um **snippet Markdown** com placeholders `${...}` para você colar no capítulo “Gateway → Listener” do seu repositório.