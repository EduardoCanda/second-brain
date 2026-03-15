---
aliases:
  - "Como o navegador abre uma conexão TCP"
  - "Como o navegador resolve DNS"
  - "Connection pooling"
  - "HTTP request lifecycle no navegador"
  - "HTTP-1 vs HTTP-2 vs HTTP-3 no browser"
  - "Keep Alive"
  - "TLS handshake no navegador"
---

# Networking — Guia Consolidado

Esta nota agrupa os tópicos de **Networking** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Como o navegador abre uma conexão TCP|Como o navegador abre uma conexão TCP]]
- [[#Como o navegador resolve DNS|Como o navegador resolve DNS]]
- [[#Connection pooling|Connection pooling]]
- [[#HTTP request lifecycle no navegador|HTTP request lifecycle no navegador]]
- [[#HTTP-1 vs HTTP-2 vs HTTP-3 no browser|HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[#Keep Alive|Keep Alive]]
- [[#TLS handshake no navegador|TLS handshake no navegador]]

---

## Como o navegador abre uma conexão TCP

### O que é

A conexão TCP estabelece um canal confiável entre navegador e servidor para troca de bytes HTTP/1.1 e HTTP/2 sobre TLS.

### Por que isso existe

Fornece ordenação, retransmissão e controle de congestionamento, reduzindo perdas e corrupção de dados na Internet.

### Como funciona internamente

1. Cliente escolhe IP/porta de destino.
2. Executa 3-way handshake (SYN, SYN-ACK, ACK).
3. Com TLS, handshake criptográfico ocorre em seguida.
4. A conexão entra no pool para reutilização quando possível.

### Exemplo prático

```bash
ss -tnp | head
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Keep Alive]]
- [[Connection pooling]]
- [[TLS handshake no navegador]]

## Como o navegador resolve DNS

### O que é

A resolução DNS converte o hostname da URL em endereço IP para o navegador abrir conexão.

### Por que isso existe

Permite separar identidade lógica do serviço (domínio) da infraestrutura real (IPs dinâmicos, balanceamento, CDN).

### Como funciona internamente

1. Browser consulta cache interno e cache do sistema operacional.
2. Sem hit, pergunta ao resolvedor recursivo configurado.
3. Resolvedor obtém resposta autoritativa e TTL.
4. Resultado pode incluir IPv4/IPv6 e políticas como Happy Eyeballs.

### Exemplo prático

```bash
dig +short api.exemplo.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Como o navegador abre uma conexão TCP]]
- [[HTTP request lifecycle no navegador]]
- [[Keep Alive]]

## Connection pooling

### O que é

Connection pooling é a estratégia do navegador para gerenciar e reutilizar múltiplas conexões por origem.

### Por que isso existe

Controla concorrência, evita abrir sockets em excesso e melhora throughput com menor custo de setup.

### Como funciona internamente

1. Conexões ficam em pool por esquema/origem/prioridade.
2. Requests novas tentam conexão já aquecida.
3. HTTP/2 multiplexa streams e reduz necessidade de sockets paralelos.
4. Políticas de limite evitam exaustão de portas e abuso de servidor.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Keep Alive]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Como o navegador abre uma conexão TCP]]

## HTTP request lifecycle no navegador

### O que é

O ciclo de uma request inclui resolução, conexão, envio, processamento da resposta e efeitos no cache/renderização.

### Por que isso existe

Entender o ciclo completo evita culpar apenas backend quando gargalo está no cliente, rede ou política de segurança.

### Como funciona internamente

1. URL é normalizada e passa por políticas do navegador.
2. DNS/TCP/TLS são executados ou reutilizados.
3. Request sai com headers e credenciais conforme contexto.
4. Resposta pode ser bloqueada, cacheada, parseada e refletida na UI.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Como o navegador resolve DNS]]
- [[Como o navegador abre uma conexão TCP]]
- [[Critical Rendering Path]]

## HTTP-1 vs HTTP-2 vs HTTP-3 no browser

### O que é

Cada versão do HTTP muda forma de transporte, multiplexação e recuperação de perda, impactando latência real no navegador.

### Por que isso existe

Escolher protocolo certo influencia TTFB, head-of-line blocking e custo de infraestrutura.

### Como funciona internamente

1. HTTP/1.1 usa texto e paralelismo limitado por conexão.
2. HTTP/2 multiplexa streams sobre TCP com compressão de headers.
3. HTTP/3 usa QUIC/UDP para reduzir HOL no transporte e acelerar retomadas.
4. Navegador negocia versão via ALPN/Alt-Svc.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[TLS handshake no navegador]]
- [[Connection pooling]]
- [[Como analisar waterfall de requests]]

## Keep Alive

### O que é

Keep-Alive mantém conexões abertas para reutilização, reduzindo handshakes e latência entre requests consecutivas.

### Por que isso existe

Abrir conexão nova para cada recurso aumenta RTT, CPU de TLS e risco de fila no servidor.

### Como funciona internamente

1. Servidor anuncia política de persistência da conexão.
2. Browser mantém socket ocioso por tempo limitado.
3. Novas requests elegíveis reutilizam a conexão.
4. Encerramento ocorre por timeout, limite de requests ou pressão de recursos.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Connection pooling]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Como o navegador abre uma conexão TCP]]

## TLS handshake no navegador

### O que é

O TLS handshake negocia parâmetros criptográficos e autentica o servidor antes do envio de dados HTTP.

### Por que isso existe

É a base prática do cadeado do navegador e da proteção contra MITM.

### Como funciona internamente

1. ClientHello anuncia versões, suites e ALPN.
2. ServerHello define parâmetros e envia certificado.
3. Browser valida cadeia, hostname e validade.
4. Após troca de chaves, tráfego da aplicação passa cifrado.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[HTTPS]]
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Como o navegador abre uma conexão TCP]]

## Pontos comuns da família (backend/devops)

- Base para decompor latência em DNS, conexão, TLS, servidor e download.
- Orienta tuning de keep-alive, pooling, protocolo HTTP e handshake com impacto real no usuário.
- Ajuda a construir SLOs mais precisos separando custo de aplicação do custo de transporte.

## Problemas comuns da família

- Atribuir toda lentidão ao backend sem quebrar waterfall por fase de rede.
- Ajustar um componente isolado (ex.: TLS) sem validar efeitos em CDN/proxy e reutilização de conexão.
- Ignorar diferenças de primeira visita vs conexão reaproveitada.
