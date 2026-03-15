# curl

## O que é

Ferramenta “canivete suíço” para fazer requisições HTTP/HTTPS (e outros protocolos) via terminal, com controle fino de método, headers, DNS, TLS, proxy e tempos de conexão.

## Para que serve

- Testar APIs internas sem depender de Postman/Insomnia.
- Reproduzir erros de produção (`401`, `403`, `404`, `429`, `5xx`) direto do host/pod afetado.
- Medir latência por etapa (DNS, TCP, TLS, TTFB, total) com `-w`.
- Validar handshake TLS, SNI e cadeia de certificado.
- Simular chamadas entre serviços em ambientes Kubernetes e VMs Linux.

## Quando usar

- **Incidente de API lenta**: comparar `time_connect` vs `time_starttransfer`.
- **Suspeita de DNS incorreto**: testar com `--resolve` e com DNS padrão.
- **Erro de autenticação**: validar `Authorization`, cookies e redirects.
- **Falha só em um pod/node**: executar `curl` dentro do mesmo namespace/container.
- **Debug de gateway/reverse proxy**: inspecionar headers de resposta (`server`, `via`, `x-request-id`).

## Exemplos de uso

```bash
# 1) Healthcheck simples com status code
curl -sS -o /dev/null -w 'code=%{http_code} total=%{time_total}\n' https://api.exemplo.com/health

# 2) Ver headers de resposta (cache, rate-limit, trace-id)
curl -sSI https://api.exemplo.com/v1/orders

# 3) Forçar resolução DNS para validar rota nova/LB novo
curl -v --resolve api.exemplo.com:443:10.20.30.40 https://api.exemplo.com/health

# 4) Medir tempos detalhados
curl -sS -o /dev/null -w 'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' https://api.exemplo.com/v1/orders

# 5) Testar endpoint autenticado
curl -sS https://api.exemplo.com/v1/me -H 'Authorization: Bearer <TOKEN>'
```

## Exemplo de saída

```text
$ curl -sS -o /dev/null -w 'dns=%{time_namelookup} tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} code=%{http_code}\n' https://api.exemplo.com/v1/orders
dns=0.004 tcp=0.018 tls=0.079 ttfb=0.612 total=0.645 code=200
```

Leitura rápida:

- `dns` alto: problema em resolução de nome.
- `tcp` alto: rota/rede/firewall.
- `tls` alto: handshake/certificado/cipher.
- `ttfb` alto com `tcp/tls` baixos: lentidão na aplicação upstream.

## Dicas de troubleshooting

- Comece com `-v`; se necessário, suba para `--trace-time --trace /tmp/curl.trace`.
- Use `-L` para seguir redirect e confirmar destino final (`301/302` podem mascarar erro).
- Compare resultados com e sem proxy (`--noproxy '*'`), quando houver proxy corporativo.
- Em Kubernetes, rode no mesmo pod/rede do app (`kubectl exec ... -- curl ...`).
- Não use `-k/--insecure` como “solução”; use apenas para diagnóstico controlado.

## Flags importantes

- `-sS`: silencioso, mas mostra erros.
- `-v` / `-vvv`: detalhamento da conexão e headers.
- `-I`: somente headers da resposta.
- `-L`: segue redirects.
- `-H`: adiciona headers.
- `-X`: define método HTTP (`GET/POST/PUT/...`).
- `--data` / `--data-raw`: envia payload.
- `--connect-timeout` e `--max-time`: limites de tempo.
- `--resolve host:port:ip`: override de DNS sem alterar `/etc/hosts`.
- `-w`: formata métricas de saída (ideal para scripts/monitoramento).

## Boas práticas

- Padronize um formato de saída (`-w`) para facilitar comparação entre ambientes.
- Remova tokens da saída antes de anexar em ticket/postmortem.
- Execute testes curtos e repetidos (3-5 vezes) para detectar intermitência.
- Salve evidência mínima: comando, horário, origem (pod/node), resultado.
- Para automação, prefira `-sS -o /dev/null -w ...` ao parsing frágil de texto verboso.

## Referências

- Manual: `man curl`
- Docs oficiais: https://curl.se/docs/
- Everything curl (livro oficial): https://everything.curl.dev/
