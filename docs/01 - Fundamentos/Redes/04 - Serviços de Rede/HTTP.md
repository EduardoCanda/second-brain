# HTTP (Hypertext Transfer Protocol)

O **HTTP** é o protocolo base da comunicação na Web. Ele atua na **camada de aplicação** do modelo TCP/IP (e se relaciona com a camada de aplicação no modelo OSI).  
No HTTP, a comunicação segue o padrão **cliente-servidor**:

- **Cliente**: navegador, app mobile, `curl`, etc.
- **Servidor**: aplicação web/API que recebe requisições e retorna respostas.

> O HTTP é um protocolo **stateless**: por padrão, cada requisição é independente da anterior.

---

## HTTPS

O **HTTPS** é o HTTP com segurança via **TLS** (antigo SSL):

- Criptografa os dados em trânsito.
- Garante integridade (evita alteração de conteúdo no caminho).
- Autentica o servidor via certificado digital.

Porta padrão:

- HTTP: **80**
- HTTPS: **443**

---

## Request e Response

Para acessar um servidor web, o cliente envia uma **requisição (request)** e recebe uma **resposta (response)**.

### Estrutura de uma requisição HTTP

```http
GET / HTTP/1.1
Host: exemplo.com
User-Agent: Mozilla/5.0
Accept: text/html
```

Partes principais:

1. **Start line** (método + caminho + versão)
2. **Headers**
3. **Body** (opcional, comum em POST/PUT/PATCH)

### Estrutura de uma resposta HTTP

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 98

<html>
  <body>Olá mundo</body>
</html>
```

Partes principais:

1. **Status line** (versão + código + motivo)
2. **Headers**
3. **Body**

---

## URL (Uniform Resource Locator)

A URL define *onde* e *como* acessar um recurso.

Exemplo:

```text
https://usuario:senha@www.exemplo.com:443/produtos?id=10&ordem=asc#detalhes
```

Componentes:

- **scheme**: `https`
- **user info**: `usuario:senha` (pouco usado hoje)
- **host**: `www.exemplo.com`
- **port**: `443`
- **path**: `/produtos`
- **query string**: `?id=10&ordem=asc`
- **fragment**: `#detalhes` (usado no cliente, não vai ao servidor)

---

## HTTP Methods (métodos)

Os métodos indicam a ação desejada no recurso.

- **GET**: buscar/ler recurso.
- **POST**: enviar dados, geralmente para criar recurso/processar ação.
- **PUT**: atualizar/substituir recurso de forma completa.
- **PATCH**: atualização parcial de recurso.
- **DELETE**: remover recurso.
- **HEAD**: igual ao GET, mas sem corpo na resposta (útil para metadados).
- **OPTIONS**: informa métodos/opções suportados pelo endpoint (muito usado em CORS).

### Segurança e idempotência (visão prática)

- **Safe methods**: não devem alterar estado no servidor (ex.: GET, HEAD).
- **Idempotentes**: repetir a mesma requisição tende ao mesmo resultado final (ex.: GET, PUT, DELETE).

---

## HTTP Status Codes

Os códigos de status indicam o resultado da requisição:

### 1xx – Informacional

- **100 Continue**

### 2xx – Sucesso

- **200 OK**
- **201 Created**
- **204 No Content**

### 3xx – Redirecionamento

- **301 Moved Permanently**
- **302 Found**
- **304 Not Modified**

### 4xx – Erro do cliente

- **400 Bad Request**
- **401 Unauthorized**
- **403 Forbidden**
- **404 Not Found**
- **405 Method Not Allowed**
- **409 Conflict**
- **429 Too Many Requests**

### 5xx – Erro do servidor

- **500 Internal Server Error**
- **502 Bad Gateway**
- **503 Service Unavailable**
- **504 Gateway Timeout**

---

## Headers (cabeçalhos)

Headers carregam metadados da requisição/resposta.

Exemplos comuns em **request**:

- `Host`: domínio de destino.
- `Authorization`: credenciais/token (ex.: Bearer JWT).
- `Content-Type`: formato do corpo enviado (`application/json`, etc.).
- `Accept`: formatos aceitos na resposta.
- `Cookie`: cookies enviados ao servidor.
- `User-Agent`: cliente que fez a requisição.

Exemplos comuns em **response**:

- `Content-Type`: formato do conteúdo retornado.
- `Content-Length`: tamanho do corpo.
- `Set-Cookie`: define cookie no cliente.
- `Cache-Control`: diretivas de cache.
- `Location`: URL de redirecionamento/criação de recurso.
- `Server`: software do servidor (opcional).

---

## Cookies, sessão e autenticação

Como HTTP é stateless, aplicações usam mecanismos para manter contexto:

- **Cookies de sessão**: servidor identifica usuário via ID de sessão.
- **Tokens (ex.: JWT)**: cliente envia token no `Authorization`.
- **CSRF token**: proteção em operações sensíveis com sessão/cookie.

---

## Versionamento do HTTP

- **HTTP/1.1**: amplamente usado, conexões persistentes.
- **HTTP/2**: multiplexação, compressão de headers, melhor desempenho.
- **HTTP/3**: usa QUIC/UDP, melhora latência e resiliência em redes instáveis.

---

## Exemplos rápidos com curl

```bash
# GET simples
curl -i https://httpbin.org/get

# POST com JSON
curl -i -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"nome":"ana"}'
```

---

## Resumo

- HTTP organiza a comunicação web em **requisição** e **resposta**.
- URL indica o recurso; método define ação; status code indica resultado.
- Headers e body carregam contexto e dados.
- HTTPS é obrigatório na prática para segurança em produção.
