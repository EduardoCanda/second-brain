# host

## O que é

`host` é um comando enxuto para consultas DNS diretas e reversas. Ele é excelente para checks objetivos no terminal e scripts simples.

## Para que serve

- Resolver nome para IP de forma direta.
- Resolver IP para nome (PTR/reverso).
- Consultar tipo específico de registro sem saída verbosa.
- Validar rapidamente DNS autoritativo em troubleshooting do dia a dia.

## Quando usar

- Em scripts de health-check onde saída curta é melhor.
- Para conferir PTR de IPs de servidores, balanceadores ou gateways.
- Para checagem operacional rápida durante incidentes.
- Quando você quer uma alternativa mais simples que `dig`.

## Exemplos de uso

```bash
# Resolução padrão
host example.com

# Tipo específico
host -t txt example.com

# Reverso (PTR)
host 8.8.8.8

# Forçar servidor DNS específico
host example.com 1.1.1.1
```

## Exemplos de saída

```text
$ host example.com
example.com has address 93.184.216.34

$ host 8.8.8.8
8.8.8.8.in-addr.arpa domain name pointer dns.google.
```

Leitura rápida do que importa:
- `has address`: resposta de registro `A`.
- `domain name pointer`: resposta PTR de reverso.
- Mensagens como `not found: 3(NXDOMAIN)` indicam ausência do nome na zona.

## Dicas de troubleshooting

- Para incidentes DNS, compare o mesmo comando com DNS interno e público.
- Em problema de e-mail, valide `MX` e `TXT` (SPF/DMARC) com `-t`.
- Se o retorno variar entre execuções, investigar round-robin, cache e TTL baixo.
- Em scripts, trate explicitamente códigos de erro para diferenciar timeout de NXDOMAIN.

## Flags importantes

- `-t TIPO`: define tipo do registro (`A`, `AAAA`, `MX`, `TXT`, `NS`, etc.).
- `-a`: modo “all” (equivalente a consulta detalhada/ANY quando possível).
- `-W SEGUNDOS`: timeout da consulta.
- `-C`: verifica consistência SOA entre autoritativos da zona.

## Boas práticas

- Usar `host` para confirmação rápida e `dig` para investigação detalhada.
- Em automação, capturar stdout e exit code para decisão confiável.
- Documentar qual DNS foi consultado para evitar ambiguidade em incidentes.
- Não presumir sucesso apenas por resolver `A`; validar também reverso quando relevante.

## Referências

- `man host`
- BIND 9 Administrator Reference Manual (ISC)
