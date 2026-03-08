## O que é
Nginx é servidor web e proxy reverso usado para publicar aplicações, fazer terminação TLS, balancear carga e aplicar controles de segurança na borda.

## Por que isso existe
Colocar cada aplicação exposta diretamente aumenta superfície de ataque e dificulta operação. Um reverse proxy centraliza roteamento, observabilidade e políticas comuns.

## Como funciona internamente
```text
Client -> Nginx (TLS, WAF/rate-limit, routing) -> Upstreams (apps)
```

Componentes:
- `server`: virtual host por domínio.
- `location`: regras de roteamento por path.
- `upstream`: pool de backends para load balancing.

Algoritmos de balanceamento comuns:
- round-robin (padrão),
- least_conn,
- ip_hash.

## Exemplos práticos

### Reverse proxy básico
```nginx
upstream api_backend {
  least_conn;
  server api-1:8080;
  server api-2:8080;
}

server {
  listen 443 ssl;
  server_name api.exemplo.com;

  location / {
    proxy_pass http://api_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Testes operacionais
```bash
nginx -t
systemctl reload nginx
curl -I https://api.exemplo.com/health
```

### Em Kubernetes
- Nginx Ingress Controller processa objetos `Ingress`.
- Configurações por annotations (timeout, body-size, rate limit).

## Boas práticas
- Habilitar TLS moderno e HSTS.
- Definir timeouts explícitos para upstream.
- Isolar logs de acesso e erro por aplicação.
- Proteger endpoints administrativos.

## Armadilhas comuns
- `proxy_read_timeout` curto para rotas lentas, causando 504.
- Não repassar `X-Forwarded-*`, quebrando rastreabilidade.
- Reload sem validação de sintaxe (`nginx -t`).