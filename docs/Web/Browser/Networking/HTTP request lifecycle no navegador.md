docs/Web/Browser/Networking/HTTP request lifecycle no navegador.md

# HTTP request lifecycle no navegador

## O que é

O ciclo de uma request inclui resolução, conexão, envio, processamento da resposta e efeitos no cache/renderização.

## Por que isso existe

Entender o ciclo completo evita culpar apenas backend quando gargalo está no cliente, rede ou política de segurança.

## Como funciona internamente

1. URL é normalizada e passa por políticas do navegador.
2. DNS/TCP/TLS são executados ou reutilizados.
3. Request sai com headers e credenciais conforme contexto.
4. Resposta pode ser bloqueada, cacheada, parseada e refletida na UI.

## Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

## Quando isso é importante para backend/devops

- Facilita a análise de incidentes sem depender apenas de hipótese no servidor.
- Ajuda a escolher headers, timeouts, políticas de cache e segurança mais coerentes.
- Melhora correlação entre DevTools, logs de aplicação e métricas de infraestrutura.

## Problemas comuns

- Interpretar sintomas de frontend sem validar o que o navegador decidiu internamente.
- Confiar apenas no status HTTP e ignorar headers/políticas que bloqueiam uso da resposta.
- Não reproduzir o cenário real (CDN, proxy, HTTPS, cache quente/frio).

## Relação com outros conceitos

Relaciona-se com:
- [[Como o navegador resolve DNS]]
- [[Como o navegador abre uma conexão TCP]]
- [[Critical Rendering Path]]
