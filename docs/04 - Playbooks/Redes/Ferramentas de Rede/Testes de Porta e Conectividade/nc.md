# nc

## O que é

`nc` (netcat) é o canivete suíço para teste de camada 4 (TCP/UDP): abre conexão, escuta porta e envia payload cru sem “inteligência” de protocolo.

## Para que serve

- Confirmar rapidamente se uma porta TCP está **aberta/fechada/filtrada**.
- Validar se um serviço UDP responde (DNS, syslog, statsd).
- Simular cliente/servidor simples durante incidentes.
- Testar de dentro do mesmo contexto do app (host, container, pod, namespace).

## Quando usar

- Aplicação reporta `connection refused`, `i/o timeout` ou `no route to host`.
- Você quer separar problema de rede (L3/L4) de problema de aplicação (L7).
- Precisa provar que o firewall/security group/NACL está bloqueando.
- Quer checar se a porta está bindada no IP esperado (`0.0.0.0` vs `127.0.0.1`).

## Exemplos de uso

```bash
# Scan TCP sem DNS e com timeout curto
nc -vz -n -w 2 10.10.20.15 5432

# Teste UDP (não garante resposta se serviço não responder)
nc -vzu -n -w 2 10.10.20.53 53

# Listener para validar chegada de tráfego
nc -lvk 9000

# Enviar requisição HTTP crua
printf 'GET /health HTTP/1.1\r\nHost: api.exemplo\r\n\r\n' | nc -n -w 3 10.10.20.80 80
```

## Exemplos de saída

```text
$ nc -vz -n -w 2 10.10.20.15 5432
Connection to 10.10.20.15 5432 port [tcp/postgresql] succeeded!
```

Interpretação: rota + firewall + processo ouvindo na porta TCP estão OK.

```text
$ nc -vz -n -w 2 10.10.20.15 5432
nc: connect to 10.10.20.15 port 5432 (tcp) failed: Connection refused
```

Interpretação: host é alcançável, mas porta está fechada ou serviço caiu.

```text
$ nc -vz -n -w 2 10.10.20.15 5432
nc: connect to 10.10.20.15 port 5432 (tcp) timed out: Operation now in progress
```

Interpretação: normalmente bloqueio em firewall/security group/ACL ou rota quebrada.

## Dicas de troubleshooting

- Rode no **mesmo namespace de rede** do app (`kubectl exec`, `docker exec`, `ip netns exec`).
- Sempre compare com destino saudável na mesma sub-rede para baseline.
- Use `-n` para remover DNS da equação; depois repita com hostname para validar DNS.
- Se `refused`, verifique servidor: `ss -lntp | rg :5432`.
- Se `timeout`, valide caminho: `ip route`, regras FW (`iptables/nft`), SG/NACL.

## Flags importantes

- `-z`: modo scan (não envia dados de aplicação).
- `-v`: detalha resultado (útil para evidência em incidente).
- `-n`: não resolve DNS (acelera e isola problema de nome).
- `-w <seg>`: timeout de conexão/leitura.
- `-u`: modo UDP.
- `-l` / `-k`: escutar porta / manter listener para múltiplas conexões.

## Boas práticas

- Logue comando + horário + origem do teste no ticket.
- Não conclua “porta aberta = app saudável”; valide endpoint real quando possível.
- Em UDP, trate “silêncio” com cuidado: ausência de resposta não prova queda.
- Evite loops de teste agressivos em produção (pode acionar IDS/IPS).

## Referências

- `man nc`
- OpenBSD netcat (variante mais comum): https://man.openbsd.org/nc
