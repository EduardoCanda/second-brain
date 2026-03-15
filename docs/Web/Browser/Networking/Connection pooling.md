docs/Web/Browser/Networking/Connection pooling.md

# Connection pooling

## O que é

Connection pooling é a estratégia do navegador para gerenciar e reutilizar múltiplas conexões por origem.

## Por que isso existe

Controla concorrência, evita abrir sockets em excesso e melhora throughput com menor custo de setup.

## Como funciona internamente

1. Conexões ficam em pool por esquema/origem/prioridade.
2. Requests novas tentam conexão já aquecida.
3. HTTP/2 multiplexa streams e reduz necessidade de sockets paralelos.
4. Políticas de limite evitam exaustão de portas e abuso de servidor.

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
- [[Keep Alive]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Como o navegador abre uma conexão TCP]]
