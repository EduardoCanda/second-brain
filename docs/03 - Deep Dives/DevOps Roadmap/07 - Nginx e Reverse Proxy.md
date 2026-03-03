# Nginx e Reverse Proxy

## Objetivo
Publicar aplicações com segurança, desempenho e controle de tráfego.

## Tópicos essenciais
- Reverse proxy para múltiplos serviços.
- TLS termination.
- Rate limit e headers de segurança.
- Cache de conteúdo estático.
- Balanceamento básico de carga.

## Exemplo mínimo
```nginx
server {
  listen 80;
  server_name app.exemplo.com;

  location / {
    proxy_pass http://app_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```
