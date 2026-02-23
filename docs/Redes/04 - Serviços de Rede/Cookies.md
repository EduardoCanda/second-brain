Cookies são **pequenos dados armazenados no navegador do usuário** por um site.  
Eles são enviados pelo servidor via HTTP e retornam ao servidor a cada requisição subsequente para o mesmo domínio.

Seu principal objetivo é **manter estado** em um protocolo que é naturalmente **stateless** (HTTP).
## Por que cookies existem?
O protocolo HTTP não lembra requisições anteriores.  

Cookies resolvem problemas como:
- Manter o usuário autenticado
- Guardar preferências (idioma, tema)
- Rastrear sessões
- Medir comportamento e analytics

## Como cookies funcionam

1. O cliente faz uma requisição HTTP
2. O servidor responde com um header:
    `Set-Cookie: session_id=abc123`
3. O navegador salva o cookie
4. Em requisições futuras, o navegador envia:
    `Cookie: session_id=abc123`
## Estrutura de um cookie
Um cookie pode conter:
- **Nome=Valor**
- **Domain** – domínio ao qual pertence
- **Path** – caminho válido
- **Expires / Max-Age** – tempo de vida
- **Secure** – enviado apenas via HTTPS
- **HttpOnly** – inacessível via JavaScript
- **SameSite** – controle de envio cross-site    

Exemplo:
`Set-Cookie: session_id=abc123; HttpOnly; Secure; SameSite=Strict`
## Tipos de cookies

### Cookies de sessão
- Temporários
    - Apagados ao fechar o navegador
    - Muito usados para autenticação
### Cookies persistentes
- Possuem data de expiração
    - Permanecem no disco
    ### Cookies próprios (First-party)
- Criados pelo domínio acessado
    - Geralmente legítimos
### Cookies de terceiros (Third-party)
- Criados por domínios externos
- Muito usados para rastreamento e anúncios
## Cookies e segurança
### Riscos
- Sequestrar sessões (session hijacking)
- Roubo de identidade
- Ataques XSS explorando cookies mal configurados
### Boas práticas
- Usar HTTPS
- Marcar cookies como `HttpOnly`
- Usar `Secure`
- Configurar corretamente `SameSite`
## Cookies x Storage do navegador

| Tecnologia     | Acesso via JS | Enviado ao servidor |
| -------------- | ------------- | ------------------- |
| Cookies        | Opcional      | Sim                 |
| LocalStorage   | Sim           | Não                 |
| SessionStorage | Sim           | Não                 |

Cookies são os únicos enviados automaticamente em cada requisição HTTP.
## Relação com autenticação
Normalmente:
- O servidor gera um **ID de sessão**
- Armazena a sessão no backend
- Envia o ID via cookie
- O cookie identifica o usuário em cada requisição