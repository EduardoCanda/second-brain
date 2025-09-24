---
tags:
  - Fundamentos
  - Redes
  - NotaPermanente
categoria: protocolo
---
O Protocolo de endereçamento IPV6 é de extrema simplicidade, o principal objetivo para sua concepção era a principal fraqueza do endereçamento IPV4, a quantidade de hosts, o sistema de tradução de endereços [[traducao-enderecos-nat|NAT]].

Com isso um novo formato foi introduzido e sua composição passou de 32 bits da [[protocolo-enderecamento-ipv4|Versão 4]], para 128 bits nessa nova versão trazendo assim um grande volume de combinações tanto para redes quanto para hosts.

Uma das novidades que ele trouxe foi a divisão em tamanho fixo tanto da quantidade de bits que podem ser utilizados para representar a rede quanto a quantidade que podem representar os hosts dividindo os 128 bits por duas partes de 64 bits.

Ele também trouxe um novo conceito de [[escopo-enderecos]], que pode ajudar ainda mais os administradores de redes a segregar ainda mais os endereçamentos da rede configurada.

# Principáis tópicos

[[estrutura-endereco-ipv6]]
[[simplificacao-enderecos-ipv6]]
[[endereços-publicos-privados-ipv6]]
[[segmentacao-subredes-ipv6]]
