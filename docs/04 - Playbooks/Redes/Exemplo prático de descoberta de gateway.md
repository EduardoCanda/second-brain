Documentar como identificamos que:

    apigateway-int.mbi.cloud.ihf

atua como **front door** encaminhando tráfego para um **gateway
universal**.

------------------------------------------------------------------------

# Arquitetura descoberta

``` mermaid
flowchart TD

Client[Cliente]

Proxy[Proxy corporativo]

DNS[DNS / GTM]

NLB[AWS NLB]

Envoy[Gateway Envoy]

Upstream[Serviço upstream]

Client --> Proxy
Proxy --> DNS
DNS --> NLB
NLB --> Envoy
Envoy --> Upstream
```

------------------------------------------------------------------------

# Camadas envolvidas

  Camada   Componente
  -------- ---------------
  DNS      GTM
  L4       AWS NLB
  L7       Envoy Gateway
  App      APIs internas

------------------------------------------------------------------------

# Passo 1 --- DNS

``` bash
nslookup apigateway-int.mbi.cloud.ihf
nslookup api-sp.prod.aws.cloud.ihf
```

Resultado observado:

    apigateway-int
      CNAME apigateway-int.gtm.prod.cloud.ihf
      CNAME *.elb.sa-east-1.amazonaws.com

Conclusão:

    INT → GTM → AWS NLB

------------------------------------------------------------------------

# Passo 2 --- Inspeção HTTP

``` bash
curl -v https://apigateway-int.mbi.cloud.ihf
```

Headers encontrados:

    server: envoy
    x-envoy-original-host
    x-forwarded-for
    x-amzn-trace-id

Conclusão:

Existe um **reverse proxy Envoy**.

------------------------------------------------------------------------

# Passo 3 --- Certificado TLS

``` bash
openssl s_client -connect apigateway-int.mbi.cloud.ihf:443 \
-servername apigateway-int.mbi.cloud.ihf
```

Resultado:

    CN = apigateway-universal.mbi.cloud.ihf

Isso indica:

    host INT
       ↓
    gateway universal compartilhado

------------------------------------------------------------------------

# Passo 4 --- Proxy corporativo

Durante o curl foi identificado:

    CONNECT proxynew.itau:8080

Fluxo real:

``` mermaid
flowchart LR

Client --> CorporateProxy
CorporateProxy --> NLB
NLB --> Envoy
Envoy --> Service
```

------------------------------------------------------------------------

# Conclusão final

O host:

    apigateway-int.mbi.cloud.ihf

não faz redirect HTTP.

Ele funciona como:

    front-door

Arquitetura real:

``` mermaid
flowchart TD

Client

Client --> Proxy
Proxy --> GTM
GTM --> NLB
NLB --> Envoy
Envoy --> API1
Envoy --> API2
Envoy --> API3
```

------------------------------------------------------------------------

# Kit de diagnóstico

## DNS

``` bash
nslookup host
dig host
```

## HTTP

``` bash
curl -v https://host
curl -vkI https://host
```

## TLS

``` bash
openssl s_client -connect host:443 -servername host
```

------------------------------------------------------------------------

# Sinais de cada tipo de arquitetura

  Evidência             Interpretação
  --------------------- -----------------------
  Location header       redirect
  CNAME → ELB           load balancer
  server: envoy         reverse proxy
  CN diferente          gateway compartilhado
  x-forwarded headers   tráfego via proxy

------------------------------------------------------------------------

# Fluxo final identificado

``` mermaid
sequenceDiagram

participant Cliente
participant Proxy
participant NLB
participant Envoy
participant API

Cliente->>Proxy: HTTPS request
Proxy->>NLB: TCP tunnel
NLB->>Envoy: Forward connection
Envoy->>API: Route request
API-->>Envoy: Response
Envoy-->>Cliente: HTTP response
```