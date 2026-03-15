# socat

## O que é

`socat` conecta dois endpoints de I/O (TCP, UDP, UNIX socket, arquivo, PTY, OpenSSL) e faz ponte bidirecional. É excelente para reproduzir cenários “estranhos” de rede.

## Para que serve

- Criar túnel temporário para inspecionar tráfego entre cliente e servidor.
- Expor serviço local em outra porta para teste controlado.
- Adaptar protocolos/transportes (ex.: UNIX socket <-> TCP).
- Simular relay durante troubleshooting sem alterar aplicação.

## Quando usar

- Você precisa observar/mediar fluxo e não apenas testar “porta abre ou não”.
- Serviço escuta em UNIX socket mas cliente só fala TCP.
- Quer reproduzir comportamento de proxy/LB localmente.
- Precisa testar TLS em baixo nível com opção de ignorar/verificar certificado.

## Exemplos de uso

```bash
# Relay TCP local -> serviço real
socat -d -d TCP-LISTEN:8080,reuseaddr,fork TCP:10.10.20.80:80

# UNIX socket -> TCP (ex.: app local consumindo serviço remoto)
socat -d -d TCP-LISTEN:15432,reuseaddr,fork UNIX-CONNECT:/var/run/postgresql/.s.PGSQL.5432

# Cliente TLS simples
socat -d -d - OPENSSL:api.exemplo.com:443,verify=1

# Capturar payload em arquivo enquanto faz relay
socat -d -d TCP-LISTEN:9000,reuseaddr,fork SYSTEM:'tee -a /tmp/capture.log | socat - TCP:10.10.20.50:9000'
```

## Exemplos de saída

```text
$ socat -d -d TCP-LISTEN:8080,reuseaddr,fork TCP:10.10.20.80:80
2026/03/01 10:20:11 socat[1234] N listening on AF=2 0.0.0.0:8080
2026/03/01 10:20:20 socat[1234] N accepting connection from AF=2 10.10.20.99:53214
2026/03/01 10:20:20 socat[1234] N opening connection to AF=2 10.10.20.80:80
```

Interpretação: listener recebeu conexão e conseguiu abrir upstream.

```text
2026/03/01 10:20:20 socat[1234] E connect(5, AF=2 10.10.20.80:80, 16): Connection refused
```

Interpretação: caminho existe, mas porta destino recusou conexão.

## Dicas de troubleshooting

- Sempre use `-d -d` (ou `-d -d -d`) para logs suficientes no incidente.
- Comece simples (TCP<->TCP) e adicione opções aos poucos (`fork`, `reuseaddr`, `verify`).
- Se o relay “trava”, verifique direção de fluxo/pipeline e buffering do comando `SYSTEM:`.
- Para TLS, teste primeiro com `verify=0` só para isolar conectividade; depois valide com `verify=1`.

## Flags/opções importantes

- `-d -d`: aumenta verbosidade de eventos de socket.
- `TCP-LISTEN:<porta>,fork,reuseaddr`: listener concorrente e reaproveitamento de porta.
- `OPENSSL:<host>:<porta>,verify=0|1`: conexão TLS com/sem validação de certificado.
- `UNIX-CONNECT:<path>`: conecta em socket Unix.
- `SYSTEM:'<cmd>'`: integra com ferramentas shell para captura/manipulação.

## Boas práticas

- Use portas temporárias altas (acima de 1024) para evitar conflito com serviços reais.
- Não deixe relay em produção sem prazo/owner: risco de desvio de tráfego.
- Ao capturar payload, cuide de dados sensíveis (LGPD/segurança).
- Encapsule comandos longos em script versionado para repetibilidade do diagnóstico.

## Referências

- `man socat`
- Socat documentation: http://www.dest-unreach.org/socat/
