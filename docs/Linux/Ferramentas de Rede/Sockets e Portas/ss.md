# ss

## O que é

`ss` (socket statistics) é a ferramenta padrão moderna do Linux para inspecionar sockets TCP/UDP/UNIX e estado de conexões. Ela lê dados do kernel via `netlink`, então costuma ser mais rápida e confiável que `netstat` em hosts com muitas conexões.

## Para que serve

- Ver quais portas estão em `LISTEN` e qual processo está bound em cada uma.
- Identificar sessões em estados críticos (`SYN-SENT`, `CLOSE-WAIT`, `TIME-WAIT`, `ESTAB`).
- Investigar fila de socket (`Recv-Q` e `Send-Q`) para detectar backlog saturado.
- Confirmar se o serviço está escutando em `0.0.0.0`, `127.0.0.1`, `::` ou IP específico.
- Correlacionar portas com PID/usuário para descobrir “quem abriu a conexão”.

## Quando usar

- API responde timeout, mas processo está “de pé” (suspeita de fila cheia ou firewall).
- A aplicação sobe, porém só aceita conexões locais (`127.0.0.1`) e não remotas.
- Há pico de conexões em `SYN-RECV` (suspeita de SYN flood, LB mal configurado ou problema de rede).
- Você precisa confirmar se conexões de saída para banco/cache realmente foram estabelecidas.

## Exemplos de uso

```bash
# Portas abertas (TCP/UDP), sem resolver nomes, com processo
ss -tulpen

# Apenas conexões TCP estabelecidas para porta 5432
ss -tanp '( dport = :5432 or sport = :5432 )' state established

# Ver sockets presos em CLOSE-WAIT (sintoma comum de leak de conexão)
ss -tan state close-wait

# Resumo por protocolo (volume de sockets)
ss -s
```

## Exemplo de saída

```text
$ ss -tulpen
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
 tcp  LISTEN 0      4096   0.0.0.0:443         0.0.0.0:*         users:(("nginx",pid=1201,fd=6))
 tcp  LISTEN 0      511    127.0.0.1:5432      0.0.0.0:*         users:(("postgres",pid=932,fd=7))
 udp  UNCONN 0      0      0.0.0.0:53          0.0.0.0:*         users:(("systemd-resolve",pid=611,fd=13))
```

Como interpretar rapidamente:

- `Local Address:Port`: onde o processo está escutando.
- `Recv-Q` alto em `LISTEN`: aplicação não está aceitando conexões rápido o suficiente.
- `127.0.0.1:5432`: banco acessível apenas localmente (esperado ou erro de bind).
- `users:(...)`: PID e FD para pivotar em logs (`journalctl`, `ps`, `lsof`).

## Dicas de troubleshooting

- Sempre rode com `-n` primeiro para evitar atraso por DNS reverso.
- Compare `ss -ltnp` antes/depois de restart para validar se houve rebind de porta.
- Se houver timeout externo, confirme bind local + regra de firewall (`nft`, `iptables`, security group).
- Muitos `TIME-WAIT` geralmente indicam alto churn de conexão; avalie keep-alive/pooling.
- Muitos `SYN-SENT` em cliente sugerem rota, ACL ou destino indisponível.

## Comparação com ferramentas similares

- `ss` vs `netstat`: `ss` é mais rápido e tem filtros melhores.
- `ss` vs `lsof -i`: `ss` é melhor para volume/estado; `lsof` é melhor para detalhar FD por processo.

## Flags importantes

- `-l`: mostra sockets em listen.
- `-t` / `-u` / `-x`: TCP / UDP / UNIX sockets.
- `-n`: não resolve nomes.
- `-p`: mostra processo dono do socket.
- `-e`: metadados extras (uid, inode, etc.).
- `-s`: resumo estatístico.
- `state <estado>`: filtra por estado TCP (`established`, `time-wait`, `close-wait`...).

## Boas práticas

- Em incidentes, salve snapshots com timestamp: `date; ss -tulpen; ss -s`.
- Padronize filtros por serviço crítico (ex.: `:80`, `:443`, `:5432`) no runbook.
- Evite conclusões com um único snapshot; compare ao longo de alguns minutos.
- Use `ss` junto com métricas de aplicação (latência, erro 5xx, backlog) para fechar diagnóstico.

## Referências

- `man ss`
- `man ip`
- Documentação do `iproute2`: https://man7.org/linux/man-pages/man8/ss.8.html
