# fuser

## O que é

`fuser` identifica quais processos estão usando um arquivo, filesystem, porta TCP/UDP ou socket. É uma ferramenta direta para responder “quem está usando este recurso agora?”.

## Para que serve

- Descobrir rapidamente quem está ocupando uma porta.
- Encerrar processo que mantém porta presa após shutdown incompleto.
- Ver processos usando um mountpoint/device antes de unmount.
- Acelerar resposta operacional sem parsing complexo.

## Quando usar

- Deploy falha com “porta já em uso” e você precisa liberar rápido.
- Serviço foi parado, mas o socket continua ocupado por processo órfão.
- `umount` falha porque filesystem ainda está em uso.
- Você precisa de comando curto para automação operacional simples.

## Exemplos de uso

```bash
# Quem usa a porta TCP 8080
fuser -v -n tcp 8080

# Quem usa a porta UDP 53
fuser -v -n udp 53

# Encerrar processos que usam a porta 8080 (cuidado)
fuser -k -n tcp 8080

# Descobrir quem está segurando um mountpoint
fuser -vm /mnt/dados
```

## Exemplo de saída

```text
$ fuser -v -n tcp 8080
                     USER        PID ACCESS COMMAND
8080/tcp:            app        4242 F.... java
```

Como interpretar:

- `8080/tcp`: recurso consultado.
- `PID`/`COMMAND`: processo que detém a porta.
- `ACCESS`: tipo de acesso (`F` costuma indicar open file/socket ativo).

## Dicas de troubleshooting

- Primeiro rode sem `-k` para evitar matar processo errado.
- Em porta crítica, confirme o PID com `ps -fp <PID>` antes de encerrar.
- Se `fuser` não mostrar dados, execute como root/sudo.
- Em ambiente com systemd/k8s, matar PID pode disparar restart automático (esperado).

## Comparação com ferramentas similares

- `fuser` vs `lsof`: `fuser` é mais direto; `lsof` oferece mais detalhes.
- `fuser` vs `ss`: `ss` é melhor para estado/conjunto de conexões; `fuser` para dono de um alvo específico.

## Flags importantes

- `-n tcp|udp`: define namespace de porta de rede.
- `-v`: modo verboso (mostra usuário, comando, acesso).
- `-k`: envia sinal para processos encontrados (por padrão `SIGKILL` em muitas implementações).
- `-m`: identifica processos usando filesystem/mountpoint.
- `-i`: confirmação interativa ao usar `-k`.
- `-SIGNAL` (ex.: `-TERM`, `-HUP`): escolhe sinal mais seguro que `KILL`.

## Boas práticas

- Prefira `-TERM` antes de `-KILL` para permitir shutdown limpo.
- Registre PID/comando antes de matar (`fuser -v ...` + `ps -fp`).
- Evite `fuser -k` em portas compartilhadas sem validar impacto.
- Em pós-incidente, documente por que a porta ficou presa para evitar recorrência.

## Referências

- `man fuser`
- `man psmisc`
- Documentação psmisc: https://man7.org/linux/man-pages/man1/fuser.1.html
