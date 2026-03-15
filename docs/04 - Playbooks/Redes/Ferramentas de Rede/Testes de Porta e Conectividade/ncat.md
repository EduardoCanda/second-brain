# ncat

## O que é

`ncat` é o netcat do projeto Nmap, com recursos extras para diagnóstico avançado: TLS, proxy, IPv6 e modo broker/chat.

## Para que serve

- Testar portas TCP/UDP como no `nc`, mas com melhor suporte corporativo.
- Validar handshake TLS sem depender de cliente HTTP completo.
- Testar acesso via proxy HTTP/SOCKS.
- Automatizar testes de conectividade em scripts de diagnóstico.

## Quando usar

- Você precisa verificar problema em serviços HTTPS/TLS (`handshake failure`, `unknown ca`).
- O tráfego passa por proxy e você quer validar rota real.
- Quer saída mais consistente entre ambientes com Nmap já instalado.

## Exemplos de uso

```bash
# Conectividade TCP básica
ncat -vz -n -w 2 10.10.20.30 443

# Teste TLS (mostra detalhes no modo verboso)
ncat --ssl -v api.exemplo.com 443

# Teste via proxy HTTP
ncat --proxy 10.10.0.10:3128 --proxy-type http api.exemplo.com 443

# Listener para coleta de payload
ncat -lvk 8080
```

## Exemplos de saída

```text
$ ncat -vz -n -w 2 10.10.20.30 443
Ncat: Version 7.94 ( https://nmap.org/ncat )
Ncat: Connected to 10.10.20.30:443.
Ncat: 0 bytes sent, 0 bytes received in 0.02 seconds.
```

Interpretação: conectividade L3/L4 OK; falta ainda validar protocolo da aplicação.

```text
$ ncat --ssl -v api.exemplo.com 443
Ncat: SSL connection to 203.0.113.15:443.
Ncat: SHA-1 fingerprint: 12AB ...
```

Interpretação: handshake TLS ocorreu; útil para separar erro de rede de erro de certificado.

```text
$ ncat --ssl -v api.exemplo.com 443
Ncat: SSL routines:tls_process_server_certificate:certificate verify failed
```

Interpretação: rota e porta OK, mas cadeia de certificado/CA falhou.

## Dicas de troubleshooting

- Para erro de certificado, compare com `openssl s_client -connect host:443 -servername host`.
- Em proxy, valide se bloqueio é no proxy ou no destino testando com e sem `--proxy`.
- Use `-n` para evitar falso positivo/negativo causado por DNS interno.
- Em timeout TLS, teste primeiro sem `--ssl` para confirmar conectividade TCP pura.

## Flags importantes

- `--ssl`: habilita TLS no cliente/servidor.
- `--ssl-verify`: valida certificado do peer (comportamento seguro).
- `--proxy <host:porta>` e `--proxy-type http|socks4|socks5`.
- `-z`, `-v`, `-n`, `-w`: mesmos conceitos práticos do `nc`.
- `-l`, `-k`: listener persistente para capturar múltiplas conexões.

## Boas práticas

- Em produção, prefira `--ssl-verify` para não mascarar erro real de PKI.
- Documente fingerprint/cert expirado quando abrir incidente para time de segurança.
- Evite usar `--ssl` como prova de “aplicação saudável”; valide rota HTTP/API depois.

## Referências

- `man ncat`
- Ncat Reference Guide: https://nmap.org/ncat/guide/
