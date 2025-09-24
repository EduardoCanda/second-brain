---
tags:
  - Linux
  - Namespaces
  - NotaBibliografica
---
Os namespaces de rede são muito úteis e com eles é possível isolar o contexto de rede do host, com isso podemos ter interfaces de rede independentes, regras de roteamento, regras de iptables etc. Com isso os containers podem trabalhar de forma independente no quesito de rede.

### Principais características dos namespaces de rede:

1. **Isolamento** – Cada namespace de rede tem sua própria pilha de rede, incluindo interfaces, rotas e regras de firewall.
2. **Independência** – Um namespace pode ter seu próprio endereço IP e regras de roteamento diferentes de outro namespace.
3. **Comunicação entre namespaces** – Pode ser feita através de veth pairs, bridges ou outras interfaces de rede.
4. **Uso em containers** – Docker, Kubernetes e outras ferramentas usam namespaces de rede para isolar redes de containers.
5. **Persistência** – Por padrão, um namespace de rede existe enquanto houver processos dentro dele; quando o último processo termina, o namespace é destruído.

### Cada **namespace de rede** tem:

- Sua própria pilha TCP/IP.
- Suas próprias interfaces de rede (eth0, lo, etc.).
- Tabelas de roteamento independentes.
- Configuração de firewall (iptables) separada.

Se um processo estiver rodando em um namespace de rede, ele não consegue acessar diretamente interfaces ou sockets pertencentes a outro namespace (a menos que haja alguma ponte de conexão entre eles).

## **Como o Kernel Implementa os Namespaces de Rede?**

No nível do kernel, os namespaces são representados como estruturas no `struct net`, e cada namespace de rede contém referências para:

- Tabelas de roteamento individuais.
- Estruturas de sockets e conexões ativas.
- Interfaces de rede disponíveis.

Cada processo no Linux pode pertencer a um namespace de rede específico, e o kernel gerencia essa separação de forma transparente.

Ao criar um novo network namespace, o kernel duplica as estruturas da pilha de rede, criando um ambiente isolado.

## **Namespaces de Rede vs. Outras Tecnologias de Virtualização**

|Tecnologia|Isolamento|Overhead|Uso principal|
|---|---|---|---|
|**Network Namespaces**|Alto|Baixo|Containers, tunelamento, segurança|
|**VMs (Máquinas Virtuais)**|Completo|Alto|Execução de múltiplos SOs|
|**Docker/Kubernetes**|Baseado em namespaces|Baixo|Gerenciamento de containers|
|**Cgroups + Namespaces**|Completo|Baixo|Controle de recursos de processos|

Os namespaces de rede são uma forma leve de isolamento em comparação com VMs, pois não criam um novo kernel, apenas isolam os recursos de rede.

## **Tipos de Interfaces de Rede nos Namespaces**

Dentro de um namespace, as interfaces de rede podem ser de diferentes tipos:

- **Loopback (lo)** – Cada namespace tem sua própria interface `lo` que precisa ser ativada manualmente (`ip link set lo up`).
- **Veth Pairs (veth0 <-> veth1)** – Dispositivos virtuais usados para conectar dois namespaces.
- **Bridges** – Simulam switches para permitir comunicação entre namespaces.
- **Physical Interfaces (eth0, wlan0, etc.)** – Interfaces físicas podem ser movidas para namespaces específicos.
- **Túnel (tun/tap, VXLAN, WireGuard)** – Interfaces de rede criadas para encapsular pacotes.