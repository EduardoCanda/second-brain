---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---

Existe algumas faixas de endereçamento que são reservadas para endereçamento público e também privado, essas faixas seguem algumas regras e servem para organizar o endereçamento IPV6

# Faixa de endereçamento Pública

**Representação CIDR:** 2000::/3
**Inicio:** 2000:0000:0000:0000:0000:0000:0000:0000
**Fim:** 3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff

## Redes menores - Endereços de Link Local

**Representação CIDR:** fe80::/64
**Endereço de Exemplo:** fe80::1
**Utilização:** Para essa faixa de endereçamento não existe a possibilidade de [[segmentacao-subredes-ipv6|segmentacao]] de redes, isso significa que o uso ideal é para redes pequenas.

## Redes estruturadas - ULA unique local address

**Representação CIDR:** fd00::/8
**Endereço de Exemplo:** fd00::1
**Utilização:** Com essa faixa de endereçamento podemos configurar[[segmentacao-subredes-ipv6|segmentacao]] de redes, Ela se aproxima muito da abordagem utilizada no [[protocolo-enderecamento-ipv4|IPV4]]. Para endereçar essa é necessário gerar 40 bits aleatórios após o `fd` totalizando 48 bits de prefixo, existe essa [RFC](https://datatracker.ietf.org/doc/html/rfc4193) que diz o algoritmo ideal para gerar esses bits aleatório.
