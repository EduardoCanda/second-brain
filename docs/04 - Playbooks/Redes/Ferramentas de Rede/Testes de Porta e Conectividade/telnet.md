# telnet

## O que é

`telnet` é um cliente TCP interativo legado. Ainda é útil para teste manual de porta e leitura de banner em protocolos texto (SMTP, HTTP, POP3, IMAP).

## Para que serve

- Confirmar conectividade TCP quando ferramentas modernas não estão instaladas.
- Abrir sessão manual para enviar comandos simples de protocolo texto.
- Validar banner de serviço (ex.: `220 mail... ESMTP`).

## Quando usar

- Ambiente mínimo/legado onde só existe `telnet`.
- Troubleshooting rápido de SMTP/HTTP sem TLS.
- Necessidade de provar se a porta aceita conexão e responde texto.

## Exemplos de uso

```bash
# SMTP
telnet 10.10.30.25 25

# HTTP (sem TLS)
telnet api.exemplo.com 80
# depois digite manualmente:
# GET /health HTTP/1.1
# Host: api.exemplo.com
#

# Teste porta genérica
telnet 10.10.20.15 5432
```

## Exemplos de saída

```text
$ telnet 10.10.30.25 25
Trying 10.10.30.25...
Connected to 10.10.30.25.
Escape character is '^]'.
220 mail.exemplo.com ESMTP Postfix
```

Interpretação: porta aberta e serviço SMTP ativo com banner.

```text
$ telnet 10.10.20.15 5432
Trying 10.10.20.15...
telnet: Unable to connect to remote host: Connection refused
```

Interpretação: host alcançável, mas sem processo ouvindo na porta.

```text
$ telnet 10.10.20.15 5432
Trying 10.10.20.15...
telnet: Unable to connect to remote host: Connection timed out
```

Interpretação: bloqueio de rede/firewall ou rota inválida.

## Dicas de troubleshooting

- Use `Ctrl+]` para abrir prompt do telnet e `quit` para sair corretamente.
- Não use telnet para concluir saúde de serviços TLS (443, 993, 995): prefira `ncat --ssl` ou `openssl s_client`.
- Se conecta mas não há banner, o serviço pode exigir envio inicial de comando/protocolo binário.
- Para erro intermitente, repita o teste com timestamp para correlacionar com firewall/log de app.

## Flags importantes

- `telnet <host> <porta>`: modo principal (não há muitas flags modernas).
- `-4` / `-6` (dependendo da implementação): força IPv4 ou IPv6.
- `-E` (algumas implementações): desativa escape char.

## Boas práticas

- Trate telnet como ferramenta de emergência/legado; prefira `nc`/`ncat` no dia a dia.
- Nunca use para credenciais em rede não confiável (protocolo sem criptografia).
- Em documentação de incidente, registre banner recebido: ajuda a identificar serviço real por trás da porta.

## Referências

- `man telnet`
- NetKit telnet user guide (implementações Linux legadas)
