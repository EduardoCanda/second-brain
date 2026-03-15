---
aliases:
  - "Cache Storage"
  - "Cookies"
  - "IndexedDB"
  - "LocalStorage"
  - "SessionStorage"
---

# Browser Storage — Guia Consolidado

Esta nota agrupa os tópicos de **Browser Storage** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#Cache Storage|Cache Storage]]
- [[#Cookies|Cookies]]
- [[#IndexedDB|IndexedDB]]
- [[#LocalStorage|LocalStorage]]
- [[#SessionStorage|SessionStorage]]

---

## Cache Storage

### O que é

Cache Storage é a API usada por Service Workers para armazenar pares Request/Response controlados pela aplicação.

### Por que isso existe

Dá controle fino de estratégias offline além do cache HTTP tradicional.

### Como funciona internamente

1. Service Worker intercepta fetch.
2. Busca recurso no Cache Storage por chave de request.
3. Em cache miss, consulta rede e decide se armazena.
4. Estratégias comuns: cache-first, network-first, stale-while-revalidate.

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
- [[Service Workers e Cache]]
- [[HTTP Cache]]
- [[IndexedDB]]

## Cookies

### O que é

Cookies são pequenos pares chave/valor enviados automaticamente pelo navegador em requests para o domínio correspondente.

### Por que isso existe

São base de autenticação de sessão e preferências compartilhadas entre cliente e servidor.

### Como funciona internamente

1. Servidor envia Set-Cookie com atributos.
2. Browser salva e reenvia conforme domínio/caminho/expiração.
3. Flags HttpOnly, Secure e SameSite alteram segurança e exposição.
4. Excesso de cookies aumenta tamanho de request e latência.

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
- [[CSRF]]
- [[Same Origin Policy]]
- [[HTTP request lifecycle no navegador]]

## IndexedDB

### O que é

IndexedDB é banco NoSQL no navegador, assíncrono e orientado a objetos, com suporte a índices e transações.

### Por que isso existe

Permite armazenar grandes volumes offline sem bloquear thread principal.

### Como funciona internamente

1. Aplicação abre database/versionamento.
2. Object stores e índices organizam os dados.
3. Operações rodam em transações atômicas.
4. Uso comum: sync offline, cache de API e filas locais.

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
- [[Cache Storage]]
- [[LocalStorage]]
- [[Service Workers e Cache]]

## LocalStorage

### O que é

LocalStorage armazena pares chave/valor persistentes por origem, com API síncrona.

### Por que isso existe

É simples para preferências e flags locais sem necessidade de backend.

### Como funciona internamente

1. Dados ficam vinculados à origem.
2. Leitura/escrita é síncrona e pode bloquear a thread principal.
3. Capacidade é limitada e varia por navegador.
4. Não possui indexação ou transações avançadas.

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
- [[SessionStorage]]
- [[IndexedDB]]
- [[Cookies]]

## SessionStorage

### O que é

SessionStorage armazena dados por origem e por aba/janela durante a sessão corrente.

### Por que isso existe

Útil para estado temporário que não deve sobreviver ao fechamento da aba.

### Como funciona internamente

1. Criado ao abrir contexto de navegação.
2. Escopo isolado por aba, mesmo na mesma origem.
3. API síncrona similar ao LocalStorage.
4. Dados são limpos ao encerrar a aba.

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
- [[LocalStorage]]
- [[IndexedDB]]
- [[Cookies]]

## Pontos comuns da família (backend/devops)

- Importante para desenhar persistência local com escopo correto (aba, sessão, longo prazo, offline).
- Permite equilibrar UX (recuperação rápida) com segurança de dados no cliente.
- Ajuda a escolher tecnologia de armazenamento conforme volume, concorrência e modelo transacional.

## Problemas comuns da família

- Guardar dados sensíveis no cliente sem mitigação para XSS e acesso local ao dispositivo.
- Escolher storage apenas por conveniência da API, sem considerar limite de quota e ciclo de vida.
- Não planejar limpeza/migração e degradar experiência em uso prolongado.
