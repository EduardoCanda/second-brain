## Objetivo

Método usado por SRE para diagnosticar problemas de rede e latência em
sistemas distribuídos.

Ferramentas principais:

    mtr
    tcpdump
    ss
    iptables
    conntrack
    curl

------------------------------------------------------------------------

## Fluxo de investigação

``` mermaid
flowchart TD
A[Cliente reporta erro] --> B[Testar conectividade]
B --> C[Analisar rota de rede]
C --> D[Inspecionar portas abertas]
D --> E[Capturar tráfego]
E --> F[Identificar origem do problema]
```

------------------------------------------------------------------------

## 1 Testar conectividade

``` bash
curl -v https://host
```

Verificar:

-   status HTTP
-   latência
-   headers

------------------------------------------------------------------------

## 2 Analisar rota de rede

``` bash
mtr host
```

ou

``` bash
traceroute host
```

Isso mostra:

-   hops da rede
-   perda de pacotes
-   latência por salto

------------------------------------------------------------------------

## 3 Ver portas abertas

``` bash
ss -tulpn
```

Isso revela:

-   processos escutando portas
-   serviços ativos

Exemplo:

    envoy
    nginx
    java
    node

------------------------------------------------------------------------

## 4 Captura de tráfego

``` bash
sudo tcpdump -nn host host.com
```

Permite ver:

-   handshake TCP
-   conexões abertas
-   retransmissões

------------------------------------------------------------------------

## 5 Ver regras de firewall

``` bash
iptables -L -n
```

Ou:

``` bash
iptables -t nat -L
```

Isso mostra:

-   regras de bloqueio
-   NAT
-   redirecionamentos

------------------------------------------------------------------------

## 6 Ver conexões rastreadas

``` bash
conntrack -L
```

Usado para identificar:

-   sessões NAT
-   conexões ativas
-   limites atingidos

------------------------------------------------------------------------

## Arquitetura típica investigada

``` mermaid
flowchart LR
Client --> CDN
CDN --> LoadBalancer
LoadBalancer --> Gateway
Gateway --> Microservice
Microservice --> Database
```

------------------------------------------------------------------------

## Checklist rápido de SRE

1️⃣ Testar endpoint

    curl

2️⃣ Ver rota

    mtr

3️⃣ Ver portas

    ss

4️⃣ Capturar rede

    tcpdump

5️⃣ Ver firewall

    iptables

6️⃣ Ver estado das conexões

    conntrack

------------------------------------------------------------------------

## Conclusão

Esse playbook permite descobrir rapidamente:

-   falhas de conectividade
-   bloqueios de firewall
-   problemas de load balancer
-   gargalos de rede