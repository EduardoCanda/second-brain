# dig

## O que é

`dig` (Domain Information Groper) é a ferramenta mais completa para consulta DNS em Linux/Unix. Ela exibe a resposta em seções (`QUESTION`, `ANSWER`, `AUTHORITY`, `ADDITIONAL`) e mostra metadados úteis para incidentes, como `status`, `flags`, servidor consultado e tempo de resposta.

## Para que serve

- Validar registros DNS com precisão (`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `SOA`, `SRV`, `CAA`).
- Diferenciar problema de **zona DNS** vs **resolvedor local** vs **rede**.
- Investigar propagação de alterações (TTL, resposta autoritativa, cadeia de delegação).
- Comparar resposta entre resolvers (ex.: DNS interno da empresa vs 1.1.1.1).

## Quando usar

- Após alterar DNS e quiser confirmar se o registro já está ativo em servidores específicos.
- Quando aplicação retorna `NXDOMAIN`, `SERVFAIL` ou resolve para IP antigo.
- Para verificar se o DNS interno está entregando resposta diferente da pública.
- Em troubleshooting de e-mail (MX/SPF/DMARC) e validações de segurança (CAA).

## Exemplos de uso

```bash
# Consulta padrão
 dig example.com

# Saída limpa para script/automação
 dig example.com A +short

# Forçar servidor DNS específico
 dig @8.8.8.8 example.com A

# Seguir delegação até os autoritativos
 dig example.com +trace

# Verificar reverso (PTR)
 dig -x 8.8.8.8
```

## Exemplos de saída

```text
$ dig @1.1.1.1 example.com A

;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;example.com.                   IN      A

;; ANSWER SECTION:
example.com.            300     IN      A       93.184.216.34

;; Query time: 18 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
```

Leitura rápida do que importa:
- `status: NOERROR`: consulta respondeu sem erro de DNS.
- `ANSWER: 1`: veio pelo menos um registro para a pergunta.
- `300`: TTL em segundos (tempo de cache).
- `SERVER`: qual resolvedor realmente respondeu.

## Dicas de troubleshooting

- Se falhar no padrão e funcionar com `@8.8.8.8`, o problema tende a estar no resolvedor local/corporativo.
- Compare `dig +short nome` e `dig +short nome @autoritativo`; divergência indica cache/desatualização.
- Use `+trace` para localizar em qual ponto da delegação ocorre falha.
- `SERVFAIL` costuma indicar problema no servidor DNS, DNSSEC inválido ou cadeia de resolução quebrada.
- `NXDOMAIN` indica nome inexistente (erro de digitação ou registro ainda não criado).

## Flags importantes

- `+short`: saída mínima (ideal para scripts).
- `@IP_DNS`: define servidor DNS consultado.
- `-t TIPO` ou `TIPO` no fim (`A`, `AAAA`, `MX`, `TXT`, etc.).
- `+trace`: percorre a resolução desde a raiz.
- `+noall +answer`: mostra somente a seção de resposta.
- `+stats`: força exibição de métricas (tempo, tamanho da resposta, etc.).

## Boas práticas

- Sempre registrar **comando completo + servidor consultado + horário** no incidente.
- Em produção, consultar pelo menos dois resolvedores para eliminar falso positivo.
- Não confiar apenas em `+short` em análise complexa; revisar cabeçalho e flags.
- Ao validar mudança, checar TTL antes da alteração para planejar janela de propagação.

## Referências

- `man dig`
- BIND 9 Administrator Reference Manual (ISC)
- RFC 1034 e RFC 1035 (fundamentos DNS)
