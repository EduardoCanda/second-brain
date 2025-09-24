---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
Combinando os conhecimentos de [[cidr-ipv6]], [[estrutura-endereco-ipv6]] podemos agora entender como funciona a segmentação de subredes. Em compartação com a [[segmentacao-subredes-ipv4]], o processo é muito simplificado e podemos dividir ele em dois processos distintos.

# Segmentação em Subredes Privada 

O Primeiro processo é a segmentação de endereços privados que iremos configurar,
como já sabemos que existem dois tipos de endereçamento privados [[endereços-publicos-privados-ipv6]], a primeira opção([[endereços-publicos-privados-ipv6#Redes menores - Endereços de Link Local|Link Local]]) não possibilita a segmentação em mais subredes sendo todos os dipositivos configurados em uma unica faixa.

Porém quando utilizados a abordagem [[endereços-publicos-privados-ipv6#Redes estruturadas - ULA unique local address|Ula]], podemos realizar o processo de segmentação, podendo dividir esse endereço da seguinte forma.

fd - Prefixo de 8 bits
Global ID - Gerado aleatóriamente 40 bits
Subnet ID - Aqui podemos configurar nossa segmentação. 16 bits
Interface ID - Endereço do host - 64 bits

De forma geral a faixa dedicada para endereçamento ULA começa em fd00::/8, Para configurar o Subnet ID podemos simplesmente começar a partir do 0000 até FFFF no quarto bloco, podendo seguir uma lógica simples como por exemplo incremental, ou até uma separação complexa, tudo isso vai depender do objetivo e contexto de configuração.

## Exemplo de segmentação ULA(Unique Local Address)

`fd12:3456:789a::/48` → seu bloco ULA (gerado aleatoriamente)
`fd12:3456:789a:0001::/64` → rede de IoT
`fd12:3456:789a:0002::/64` → rede de servidores
`fd12:3456:789a:0003::/64` → rede de testes


# Segmentação de blocos públicos

Da mesmo forma do [[#Segmentação em Subredes Privada]], podemos segmentar blocos públicos, para isso basta utilizar a mesma estratégia utilizada nesse [[#Exemplo de segmentação ULA(Unique Local Address)|aqui]],
porém a unica diferença é o prefixo, no caso de redes ULA sempre se inicia com o prefixo fd00::/8 já em redes públicas a faixa se inicia em 2000::/3.

Geralmente esses blocos são distribuídos universalmente pela IANA, e Regionalmente pela LACNIC, então sempre chegará um bloco pré definido em que poderemos segmentar em diversas subredes.

Para entender a faixa de endereçamento acesse [[cidr-ipv6]]

# Exemplo de segmentação Publica

`2d12:3456:789a::/48` → seu bloco ULA (gerado aleatoriamente)
`2d12:3456:789a:0001::/64` → rede de IoT
`2d12:3456:789a:0002::/64` → rede de servidores
`2d12:3456:789a:0003::/64` → rede de testes