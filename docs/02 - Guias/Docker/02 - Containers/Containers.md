Containers são uma forma de virtualização em nível de sistema
operacional que permite executar aplicações isoladas dentro do mesmo
kernel Linux.

Ferramentas como Docker utilizam recursos nativos do kernel para criar
esse isolamento.

Diferente de máquinas virtuais, containers **não virtualizam hardware**.

------------------------------------------------------------------------

# Containers vs Máquinas Virtuais

|Característica|Container|VM|
|---|---|---|
|Virtualização|Sistema operacional|Hardware|
|Kernel|Compartilhado com host|Kernel próprio|
|Inicialização|Milissegundos|Minutos|
|Consumo de recursos|Baixo|Alto|
|Tecnologia base|Namespaces + cgroups|Hypervisor|

Arquitetura de uma VM:

    Hardware
       ↓
    Hypervisor
       ↓
    VM (Kernel + Userspace)

Arquitetura de containers:

    Hardware
       ↓
    Linux Kernel
       ↓
    Containers (userspace isolado)

------------------------------------------------------------------------

# Componentes que tornam containers possíveis

O isolamento dos containers é construído usando três mecanismos
principais do kernel Linux:

-   Namespaces
-   cgroups
-   Filesystem em camadas (OverlayFS)

------------------------------------------------------------------------
# Namespaces

Namespaces criam uma visão isolada dos recursos do sistema.

Cada container recebe seu próprio namespace, fazendo com que ele
acredite estar rodando sozinho no sistema.

Principais namespaces:

|Namespace|Função|
|---|---|
|PID|isolamento de processos|
|NET|isolamento de rede|
|MNT|isolamento de filesystem|
|IPC|comunicação entre processos|
|UTS|hostname|
|USER|usuários e permissões|

------------------------------------------------------------------------

## PID Namespace

Isola os processos.

Dentro do container:

    PID 1 -> aplicação principal
    PID 2 -> worker

O container não consegue ver processos do host nem de outros containers.

------------------------------------------------------------------------

## NET Namespace

Cada container possui:

-   sua própria interface de rede
-   tabela de roteamento própria
-   portas isoladas

Dentro do container:

    eth0
    lo

------------------------------------------------------------------------

## MNT Namespace

Isola o sistema de arquivos visível.

    /
    ├── bin
    ├── etc
    ├── app

Esse filesystem é montado a partir de camadas de imagem.

------------------------------------------------------------------------

# cgroups (Control Groups)

cgroups são responsáveis por limitar e controlar o uso de recursos do
sistema.

Eles controlam:

|Recurso|Função|
|---|---|
|CPU|limitar processamento|
|Memória|limitar RAM|
|Disk I/O|limitar acesso ao disco|
|Network|limitar tráfego|

Exemplo:

    Container A
    CPU: 1 core
    RAM: 512MB

    Container B
    CPU: 2 cores
    RAM: 2GB

Se um container exceder o limite de memória, o kernel pode ativar o OOM
Killer.

------------------------------------------------------------------------

# Filesystem em camadas

Containers utilizam filesystem em camadas usando OverlayFS.

Imagem:

    Layer 1: base (ex: Ubuntu)
    Layer 2: runtime (ex: Python)
    Layer 3: aplicação

Quando o container roda:

    read-only layers
    +
    writable layer (container)

------------------------------------------------------------------------

# Rede entre containers

Quando Docker é instalado, ele cria uma bridge virtual chamada:

    docker0

Arquitetura típica:

    Host
     │
     ├─ docker0 bridge
     │    │
     │    ├── container A (172.17.0.2)
     │    ├── container B (172.17.0.3)

Cada container recebe um IP interno.

------------------------------------------------------------------------

## Comunicação container → container

Se estiverem na mesma rede:

    containerA -> containerB

Usando IP interno ou DNS interno.

------------------------------------------------------------------------

## Comunicação container → host

Exemplo:

    docker run -p 8080:80 nginx

Fluxo:

    host:8080 → container:80

------------------------------------------------------------------------

## Comunicação container → internet

Fluxo típico:

    container
       ↓
    veth pair
       ↓
    docker0 bridge
       ↓
    iptables NAT
       ↓
    host network
       ↓
    internet

------------------------------------------------------------------------

# veth (Virtual Ethernet Pair)

Cada container possui um par de interfaces virtuais.

    container eth0
         │
         │ veth pair
         │
    docker0 bridge

------------------------------------------------------------------------

# Resumo da arquitetura

Um container é construído com:

    Namespaces → isolamento
    cgroups → controle de recursos
    OverlayFS → filesystem em camadas
    network namespaces → rede isolada

Tudo rodando no mesmo kernel Linux.

------------------------------------------------------------------------

# Analogia

Kernel Linux = prédio

Cada container = apartamento

Namespaces → paredes que isolam apartamentos\
cgroups → limite de energia de cada apartamento\
network → interfone entre apartamentos

Todos compartilham a mesma infraestrutura.
