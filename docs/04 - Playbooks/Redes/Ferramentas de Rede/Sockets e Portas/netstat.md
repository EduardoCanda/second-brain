# netstat

## O que é

`netstat` é uma ferramenta clássica do pacote `net-tools` para listar conexões, portas em escuta, tabela de rotas e estatísticas por protocolo. Hoje é considerada legada em muitas distros, mas ainda aparece em ambientes antigos e scripts legados.

## Para que serve

- Auditar portas abertas em servidores antigos sem `ss`.
- Ver rapidamente conexões ativas e estados TCP.
- Inspecionar tabela de roteamento (`-rn`) durante incidentes de reachability.
- Levantar estatísticas de erro/retransmissão por protocolo (`-s`).

## Quando usar

- Você caiu em host legado (RHEL/CentOS antigos, appliances) onde runbooks usam `netstat`.
- Precisa manter compatibilidade com scripts já existentes em operações.
- Quer validar rota default/gateway sem trocar de ferramenta no meio do incidente.

## Exemplos de uso

```bash
# Portas em listen com PID/programa
netstat -tulpen

# Conexões TCP numéricas (sem DNS) para reduzir ruído/latência
netstat -tan

# Tabela de rotas sem resolução de nomes
netstat -rn

# Estatísticas de protocolos (TCP/UDP/IP)
netstat -s
```

## Exemplo de saída

```text
$ netstat -tulpen
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address   Foreign Address State  User Inode PID/Program name
tcp        0      0 0.0.0.0:22      0.0.0.0:*       LISTEN 0    12345 701/sshd
tcp        0      0 127.0.0.1:3306  0.0.0.0:*       LISTEN 27   22334 1180/mysqld
```

Leitura prática:

- `127.0.0.1:3306`: MySQL exposto só localmente.
- `Recv-Q` crescendo em `LISTEN`: aplicação não drenando conexões.
- `PID/Program name`: processo responsável pela porta para correlação rápida.

## Dicas de troubleshooting

- Use `-n` em produção para evitar bloqueio com DNS reverso.
- Se `netstat -p` não mostrar PID, execute como root/sudo.
- Compare `netstat -tan | awk '{print $6}' | sort | uniq -c` para enxergar concentração por estado TCP.
- Se rota parece correta em `-rn`, valide política/ACL fora do host (firewall, SG, NACL).

## Comparação com ferramentas similares

- `netstat` vs `ss`: prefira `ss` quando disponível.
- `netstat -rn` vs `ip route`: `ip route` é a interface moderna.

## Flags importantes

- `-t` / `-u`: TCP / UDP.
- `-l`: somente sockets em listen.
- `-a`: todos sockets (listen + não-listen).
- `-n`: sem resolução de nome.
- `-p`: PID/programa dono.
- `-r`: tabela de roteamento.
- `-s`: estatísticas de protocolos.

## Boas práticas

- Trate `netstat` como compatibilidade, não padrão para novos runbooks.
- Em automação nova, prefira `ss` e `ip route`.
- Documente a versão do OS quando compartilhar saída (diferenças entre distros são comuns).
- Em incidentes, capture saída com timestamp para comparação histórica.

## Referências

- `man netstat`
- `man net-tools`
- Guia de migração para `ss`/`ip`: https://www.man7.org/linux/man-pages/man8/netstat.8.html
