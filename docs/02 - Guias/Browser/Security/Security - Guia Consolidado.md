---
aliases:
  - "CORS"
  - "CSP (Content Security Policy)"
  - "CSRF"
  - "HTTPS"
  - "Mixed Content"
  - "Same Origin Policy"
  - "XSS"
---

# Security — Guia Consolidado

Esta nota agrupa os tópicos de **Security** em um único material, reduzindo repetição e mantendo os pontos comuns em contexto.

## Índice rápido

- [[#CORS|CORS]]
- [[#CSP (Content Security Policy)|CSP (Content Security Policy)]]
- [[#CSRF|CSRF]]
- [[#HTTPS|HTTPS]]
- [[#Mixed Content|Mixed Content]]
- [[#Same Origin Policy|Same Origin Policy]]
- [[#XSS|XSS]]

---

## CORS

### O que é

CORS controla quando um script em uma origem pode ler respostas de outra origem. O bloqueio é no navegador: o servidor pode responder 200 e ainda assim o JS não receber os dados.

### Por que isso existe

Sem CORS, qualquer site conseguiria ler APIs autenticadas abertas no navegador do usuário, quebrando o isolamento de origem.

### Como funciona internamente

1. O browser envia a requisição com header Origin.
2. Para métodos/headers não simples, dispara preflight OPTIONS com Access-Control-Request-*.
3. O servidor responde com Access-Control-Allow-*; se incompatível, a resposta é bloqueada para o JS.
4. Credenciais (cookies/Authorization) exigem configuração explícita e nunca combinam com origem * .

### Exemplo prático

```bash
curl -i -X OPTIONS https://api.exemplo.com/orders \
  -H 'Origin: https://app.exemplo.com' \
  -H 'Access-Control-Request-Method: POST'
```

```http
Access-Control-Allow-Origin: https://app.exemplo.com
Access-Control-Allow-Methods: GET,POST
Vary: Origin
```

### Relação com outros conceitos

Relaciona-se com:
- [[Same Origin Policy]]
- [[CSRF]]
- [[Como debugar problemas de CORS]]

## CSP (Content Security Policy)

### O que é

CSP define de quais fontes scripts, estilos, imagens e conexões podem ser carregados/executados.

### Por que isso existe

Reduz superfície de XSS e supply-chain ao transformar execução de código em allowlist explícita.

### Como funciona internamente

1. Servidor envia header Content-Security-Policy.
2. Browser compara cada recurso com diretivas (script-src, connect-src etc.).
3. Recursos fora da política são bloqueados e logados.
4. Pode operar em Report-Only para validar antes de bloquear.

### Exemplo prático

```bash
curl -i https://example.com
```

```http
Content-Security-Policy: default-src "self"; script-src "self" https://cdn.exemplo.com; object-src "none"
```

### Relação com outros conceitos

Relaciona-se com:
- [[XSS]]
- [[Mixed Content]]
- [[HTTPS]]

## CSRF

### O que é

CSRF explora o fato de o navegador enviar cookies automaticamente, fazendo o usuário autenticado executar ações sem intenção.

### Por que isso existe

A web tradicional usa cookies de sessão; sem proteção, formulários e requests forjados mudam estado do sistema.

### Como funciona internamente

1. Atacante hospeda página maliciosa com submit automático.
2. Navegador envia cookie da vítima para o domínio alvo.
3. Servidor aceita a ação por confiar apenas na sessão.
4. Defesas combinam token anti-CSRF, SameSite e validação de Origin/Referer.

### Exemplo prático

```bash
curl -i https://app.exemplo.com/transfer \
  -H 'Cookie: session=abc' \
  -H 'Origin: https://evil.site'
```

```http
GET / HTTP/1.1
Host: example.com
```

### Relação com outros conceitos

Relaciona-se com:
- [[Cookies]]
- [[Same Origin Policy]]
- [[CORS]]

## HTTPS

### O que é

HTTPS é HTTP encapsulado em TLS, garantindo confidencialidade, integridade e autenticação do servidor.

### Por que isso existe

Sem criptografia, tráfego pode ser lido/alterado por proxies, redes públicas e atacantes man-in-the-middle.

### Como funciona internamente

1. Cliente inicia handshake TLS e valida certificado.
2. Chaves de sessão são negociadas com criptografia assimétrica.
3. Após handshake, HTTP trafega criptografado.
4. HSTS e ALPN reforçam segurança e escolha de protocolo.

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
- [[HTTP-1 vs HTTP-2 vs HTTP-3 no browser]]
- [[Mixed Content]]

## Mixed Content

### O que é

Mixed Content acontece quando página HTTPS tenta carregar recurso inseguro via HTTP.

### Por que isso existe

Evita que um atacante na rede injete ou altere recursos em uma sessão teoricamente protegida por TLS.

### Como funciona internamente

1. Documento principal é HTTPS.
2. Subrecursos HTTP são classificados como bloqueáveis ou passive display.
3. Browsers modernos bloqueiam ativo (scripts/iframes) e fazem upgrade automático quando possível.
4. Falhas aparecem no console e em auditorias de segurança.

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
- [[TLS handshake no navegador]]
- [[CSP (Content Security Policy)]]

## Same Origin Policy

### O que é

Same Origin Policy (SOP) é a regra-base que impede scripts de uma origem de acessar dados sensíveis de outra origem.

### Por que isso existe

Ela limita impacto de sites maliciosos e força autorização explícita para compartilhamento entre domínios.

### Como funciona internamente

1. Origem = esquema + host + porta.
2. Leitura de DOM, LocalStorage e respostas XHR/fetch é restrita por origem.
3. Alguns recursos podem ser carregados cross-origin (img/script), mas não necessariamente lidos.
4. Mecanismos como CORS, postMessage e COOP/COEP criam exceções controladas.

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
- [[CORS]]
- [[CSRF]]
- [[Cookies]]

## XSS

### O que é

XSS ocorre quando conteúdo controlado por usuário é interpretado como código JavaScript no navegador.

### Por que isso existe

A mistura entre dados e código em HTML/JS é comum; sem escaping e CSP, o browser executa payloads.

### Como funciona internamente

1. Entrada não sanitizada chega ao HTML/DOM.
2. O parser interpreta o payload como script/event handler.
3. Código roda com privilégios da origem legítima.
4. Impacto: roubo de sessão, ações em nome do usuário e exfiltração de dados.

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
- [[CSP (Content Security Policy)]]
- [[Cookies]]
- [[HTTPS]]

## Pontos comuns da família (backend/devops)

- Necessário para definir fronteiras de confiança entre browser, origem e backend.
- Ajuda a prevenir vazamento de sessão, execução indevida de script e downgrade de transporte.
- Garante que headers/políticas de segurança funcionem também atrás de CDN/proxy.

## Problemas comuns da família

- Tratar segurança do browser como detalhe de frontend e não como parte do desenho de plataforma.
- Configurar políticas de forma parcial por ambiente e gerar brechas em produção.
- Ignorar sinais do navegador (warnings/bloqueios) que já apontam risco real.
