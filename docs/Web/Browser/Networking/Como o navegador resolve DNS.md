docs/Web/Browser/Networking/Como o navegador resolve DNS.md

# Como o navegador resolve DNS

## O que é

A resolução DNS converte o hostname da URL em endereço IP para o navegador abrir conexão.

## Por que isso existe

Permite separar identidade lógica do serviço (domínio) da infraestrutura real (IPs dinâmicos, balanceamento, CDN).

## Como funciona internamente

1. Browser consulta cache interno e cache do sistema operacional.
2. Sem hit, pergunta ao resolvedor recursivo configurado.
3. Resolvedor obtém resposta autoritativa e TTL.
4. Resultado pode incluir IPv4/IPv6 e políticas como Happy Eyeballs.

## Exemplo prático

```bash
dig +short api.exemplo.com
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
- [[Como o navegador abre uma conexão TCP]]
- [[HTTP request lifecycle no navegador]]
- [[Keep Alive]]
