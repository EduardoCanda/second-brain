# httpie

## O que é

Cliente HTTP com sintaxe amigável para humanos, excelente para debug de APIs REST/JSON no terminal, com saída colorida e estrutura legível.

## Para que serve

- Testar rapidamente endpoints JSON sem montar comandos longos.
- Visualizar request/response (headers + body) de forma clara.
- Validar contratos de API (campos obrigatórios, status, erro de validação).
- Simular chamadas autenticadas com Bearer token.
- Produzir exemplos reproduzíveis para documentação e incidentes.

## Quando usar

- **Debug funcional de API** (payload, validação, serialização).
- **Triagem de incidentes 4xx/5xx** com foco na resposta da aplicação.
- **Integração entre squads**: compartilhar comando curto e legível.
- **Ambientes de desenvolvimento e homologação** com alta iteração.
- **Investigar comportamento de endpoint** sem ruído de ferramentas GUI.

## Exemplos de uso

```bash
# 1) GET simples
http GET https://api.exemplo.com/v1/health

# 2) POST JSON (HTTPie monta JSON automaticamente com :=)
http POST https://api.exemplo.com/v1/orders customer_id:=123 total:=89.9 currency=BRL

# 3) Autenticação Bearer
http GET https://api.exemplo.com/v1/me Authorization:'Bearer <TOKEN>'

# 4) Mostrar request e response completos
http -v POST https://api.exemplo.com/v1/orders customer_id:=123 total:=89.9

# 5) Apenas headers (sem body)
http --headers https://api.exemplo.com/v1/orders
```

## Exemplo de saída

```text
$ http POST https://api.exemplo.com/v1/orders customer_id:=123 total:=89.9
HTTP/1.1 201 Created
Content-Type: application/json
X-Request-Id: 6f1d8...

{
    "id": "ord_9f2...",
    "status": "created",
    "customer_id": 123,
    "total": 89.9
}
```

Leitura rápida:

- `201 Created`: fluxo nominal de criação.
- `X-Request-Id`: correlaciona com logs/traces no backend.
- Campos faltando/formatados errado: possível quebra de contrato.

## Dicas de troubleshooting

- Use `-v` para enxergar exatamente o que foi enviado (request) e recebido (response).
- Se receber `415 Unsupported Media Type`, valide `Content-Type` e formato do body.
- Se retornar `422`, compare payload com schema esperado (tipos com `:=` vs string com `=`).
- Em `401/403`, revise token, escopos e clock skew (tokens expirados).
- Para casos intermitentes, repita a chamada e capture `X-Request-Id` de cada tentativa.

## Flags importantes

- `-v` / `--verbose`: request + response completas.
- `--headers`: exibe apenas headers.
- `--body`: exibe apenas body.
- `--print=HhBb`: controla partes impressas (request/response).
- `--timeout=<seg>`: timeout da requisição.
- `--follow`: segue redirects.
- `--verify=no`: desativa verificação TLS (somente diagnóstico controlado).
- `--form`: envia dados como formulário (`multipart/form-data`).

## Boas práticas

- Em exemplos de equipe, prefira HTTPie para comandos didáticos e fáceis de revisar.
- Use `:=` para números/booleanos/JSON e `=` para strings, evitando bugs de tipo.
- Nunca compartilhe comandos com token real em chats/tickets.
- Padronize uso de `X-Request-Id` para acelerar investigação com observabilidade.
- Versione exemplos críticos de API junto da documentação interna.

## Referências

- Manual: `man http`
- Docs oficiais: https://httpie.io/docs/cli
