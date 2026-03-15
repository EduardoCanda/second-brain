# lsof

## O que é

`lsof` (List Open Files) lista arquivos abertos por processos. Em Linux, sockets também são “arquivos”, então a ferramenta é excelente para descobrir exatamente qual processo/FD está usando uma porta ou conexão.

## Para que serve

- Descobrir qual PID está prendendo uma porta após deploy/restart.
- Mapear conexões de rede abertas por processo específico.
- Correlacionar socket de rede com file descriptor (FD) e usuário efetivo.
- Ajudar em investigação de vazamento de conexão/FD (`too many open files`).

## Quando usar

- `bind: address already in use` ao subir serviço.
- Porta aparece aberta, mas você precisa saber **qual binário** e **qual usuário** abriu.
- Processo Java/Node/Python com suspeita de leak de sockets.
- Necessidade de investigar conexões por PID durante incidente sem reiniciar serviço.

## Exemplos de uso

```bash
# Quem está usando a porta 8080
lsof -nP -iTCP:8080 -sTCP:LISTEN

# Conexões de rede de um PID específico
lsof -nP -p 1234 -i

# Ver todos sockets TCP em LISTEN no host
lsof -nP -iTCP -sTCP:LISTEN

# Filtrar por usuário dono do processo
lsof -nP -i -u nginx
```

## Exemplo de saída

```text
$ lsof -nP -iTCP:8080 -sTCP:LISTEN
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
java     4242 app   95u  IPv6  58231      0t0  TCP *:8080 (LISTEN)
```

Como interpretar:

- `COMMAND`/`PID`/`USER`: dono do socket.
- `FD` (`95u`): file descriptor usado pelo processo; útil para debug avançado.
- `NAME` (`*:8080`): bind em todas interfaces.
- `(LISTEN)`/`(ESTABLISHED)`: estado da conexão.

## Dicas de troubleshooting

- Sempre use `-nP` para evitar resolução DNS/porta e ganhar velocidade.
- Se resultado vier vazio, valide privilégios (muitos dados exigem root).
- Combine com `ss -tanp` para ver estado global e depois aprofunde no processo com `lsof`.
- Para leak de FD, compare amostras no tempo: `lsof -p <PID> | wc -l`.

## Comparação com ferramentas similares

- `lsof` vs `ss`: `ss` mostra panorama de sockets; `lsof` aprofunda no processo/FD.
- `lsof` vs `fuser`: `fuser` é rápido para “quem usa esta porta”, `lsof` traz mais contexto.

## Flags importantes

- `-i`: filtra objetos de rede.
- `-iTCP[:porta]` / `-iUDP[:porta]`: protocolo/porta.
- `-sTCP:LISTEN|ESTABLISHED`: estado TCP.
- `-p <PID>`: filtra por processo.
- `-u <usuário>`: filtra por usuário.
- `-nP`: sem resolução de host/serviço.

## Boas práticas

- Padronize `lsof -nP` em runbooks para reduzir variabilidade.
- Não use `kill` direto sem confirmar se o PID pertence ao serviço correto.
- Em produção, capture evidências (`lsof`, `ss`, logs) antes de qualquer ação corretiva.
- Se houver supervisão (`systemd`, `k8s`), mate processo apenas com entendimento do impacto.

## Referências

- `man lsof`
- FAQ oficial: https://github.com/lsof-org/lsof/blob/master/00FAQ
- Quickstart: https://man7.org/linux/man-pages/man8/lsof.8.html
