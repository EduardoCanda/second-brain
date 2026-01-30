Um **proxy** é um intermediário entre um cliente e um servidor. Em vez de o cliente se comunicar diretamente com o destino final, ele envia a requisição ao proxy, que então encaminha essa requisição ao servidor de destino e devolve a resposta ao cliente.

Fluxo simplificado:
> Cliente → Proxy → Servidor
> Servidor → Proxy → Cliente

## Para que serve um proxy
- Controle de acesso (políticas de rede)
- Segurança
- Cache de conteúdo
- Anonimização parcial
- Monitoramento de tráfego
- Controle e auditoria de requisições

## Tipos de proxy
### Forward Proxy (proxy direto)
- Fica entre o **cliente** e a internet
- O cliente sabe que está usando um proxy
- Muito comum em redes corporativas

Exemplo:
- Bloquear acesso a determinados sites
- Registrar logs de navegação
- Exigir autenticação antes de acessar a internet

### Reverse Proxy (proxy reverso)
- Fica entre a **internet** e os servidores
- O cliente **não sabe** que está falando com um proxy
- Muito usado em arquiteturas modernas

Funções comuns:
- Load balancing
- Terminação TLS (HTTPS)
- Proteção contra ataques
- Cache de conteúdo
- Ocultação da infraestrutura interna

Exemplos:
- Nginx
- HAProxy
- Cloudflare

## Proxy e camadas de rede
Dependendo da implementação, um proxy pode atuar em diferentes camadas:
- **Camada 7 (Aplicação)**  
    Analisa conteúdo HTTP, headers, URLs, cookies.
- **Camada 4 (Transporte)**  
    Trabalha com conexões TCP/UDP sem entender o conteúdo da aplicação.
    
## Proxy vs NAT
Diferença fundamental:
- **NAT**
    - Opera em nível de IP
    - Não entende protocolo de aplicação
    - Normalmente transparente
- **Proxy**
    - Entende o protocolo de aplicação (ex: HTTP)
    - Pode modificar requisições e respostas
    - Pode exigir configuração explícita no cliente

## Proxy e privacidade

Um proxy **não garante anonimato total**.

- O proxy pode ver todo o tráfego
    
- Headers como `X-Forwarded-For` podem revelar o IP original
    
- HTTPS protege o conteúdo, mas não o destino
    



## Exemplos práticos
- Empresas usando proxy para controlar acesso à internet
- CDNs funcionando como reverse proxies
- Navegadores configurados para usar proxy corporativo
- Serviços de segurança analisando tráfego HTTP

## Resumo rápido
- Proxy é um intermediário entre cliente e servidor
- Pode ser forward ou reverse
- Atua geralmente na camada de aplicação
- Serve para controle, segurança, cache e balanceamento
- Não é a mesma coisa que NAT