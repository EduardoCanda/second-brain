# Docker — Networking

Docker fornece redes virtuais para comunicação entre containers.

------------------------------------------------------------------------

# 📦 Visão Geral

Cada container possui:

-   Stack de rede própria
-   IP interno
-   Possibilidade de múltiplas redes
-   Portas expostas opcionalmente

Por padrão, containers entram na rede `bridge`.

------------------------------------------------------------------------

# 🌐 Tipos de Rede

## 1️⃣ bridge (default)

-   Rede padrão do Docker
-   Comunicação entre containers na mesma rede
-   NAT para saída externa
-   Permite port mapping

Inspecionar:

``` bash
docker network inspect bridge
```

------------------------------------------------------------------------

## 2️⃣ host

-   Container compartilha rede do host
-   Sem NAT
-   Sem port mapping necessário
-   Sem isolamento de porta

Uso:

``` bash
docker run --network host nginx
```

------------------------------------------------------------------------

## 3️⃣ none

-   Container sem rede
-   Totalmente isolado

Uso:

``` bash
docker run --network none alpine
```

------------------------------------------------------------------------

## 4️⃣ overlay

-   Rede distribuída entre múltiplos hosts
-   Utilizada com Docker Swarm
-   Permite comunicação cross-host

------------------------------------------------------------------------

## 5️⃣ macvlan

-   Container recebe IP real da rede física
-   Visível diretamente na LAN
-   Usado para integrações legadas

------------------------------------------------------------------------

# 🔑 Conceitos Importantes

## Port Mapping

Expor porta do container no host:

``` bash
docker run -p 8080:80 nginx
```

Formato:

HOST:CONTAINER

------------------------------------------------------------------------

## DNS Interno

Em redes customizadas, containers resolvem nome automaticamente.

Exemplo:

``` bash
docker network create minha-rede
docker run --network minha-rede --name app nginx
docker run --network minha-rede busybox ping app
```

------------------------------------------------------------------------

## Service Discovery

-   Containers se comunicam pelo nome
-   Não é necessário conhecer IP

------------------------------------------------------------------------

## Isolamento de Tráfego

Containers só se comunicam se estiverem na mesma rede.

Conectar container a outra rede:

``` bash
docker network connect backend app
```

------------------------------------------------------------------------

# 🛠 Comandos

Listar redes:

``` bash
docker network ls
```

Criar rede:

``` bash
docker network create minha-rede
```

Inspecionar rede:

``` bash
docker network inspect minha-rede
```

------------------------------------------------------------------------

# 📌 Boas Práticas

-   Criar redes customizadas por sistema
-   Evitar usar bridge default em produção
-   Evitar --network host em produção
-   Usar nomes de containers como hostname
-   Separar frontend e backend em redes distintas

------------------------------------------------------------------------

# 🎯 Modelo Mental

Docker Networking fornece:

-   Virtualização de rede
-   DNS interno
-   Isolamento
-   Segmentação lógica
-   Controle de tráfego

Entender networking é essencial para arquiteturas de microsserviços.