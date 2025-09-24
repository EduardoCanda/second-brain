---
tags:
  - Fundamentos
  - Redes
  - Segurança
  - NotaBibliografica
categoria: criptografia
---
ótima! “**TLS na borda**” (TLS at the edge) significa que o **primeiro componente do seu perímetro** — o _edge_ (ex.: Load Balancer, Ingress/Gateway do Kubernetes, CDN/WAF) — é quem **faz o handshake [[protocolo-tls|TLS]] com o cliente e descriptografa o tráfego ali**. Daí pra dentro, você escolhe se o hop interno vai em **[[protocolo-https|HTTP]]** (offload total), **TLS de novo** (re-encrypt/bridging) ou **mTLS de mesh**.

## Modelo mental rápido

```
Cliente ──TLS──> [ BORDA ] ──(sua escolha)──> App

Opção 1:  HTTP (offload/termination)
Opção 2:  TLS novamente (re-encrypt/bridging)
Opção 3:  mTLS (service mesh: sidecar↔sidecar)
Opção 4:  Passthrough (sem terminar na borda; TLS vai direto ao app)
```

### Termos

- **Terminação TLS (edge termination/offload):** a borda **termina** TLS e fala **HTTP** com o backend.
    
- **Re-encrypt / Bridging:** a borda termina TLS **e** inicia **uma nova conexão TLS** até o backend.
    
- **Passthrough:** a borda **não** termina TLS; só roteia por **SNI** e quem apresenta o certificado é o próprio app.
    
- **mTLS (mesh):** dentro do cluster, proxies (ex.: Linkerd/Istio) re-criptografam tudo com **certificados de identidade**.
    

## Por que fazer na borda?

- **Centraliza certificados públicos** (renovação, HSTS, ciphers, TLS versions) num único lugar.
    
- **Habilita L7 completo** no edge: redirects, rewrites, WAF, rate-limit, observabilidade.
    
- **Performance:** descarrega custo de criptografia dos pods (quando usa offload total).
    

## Quando escolher cada variação

- **Edge termination + HTTP interno:** simples e comum; requer ajustar o app para confiar nos _headers_ do proxy (`X-Forwarded-Proto/Host`) e evitar _redirect loops_.
    
- **Edge termination + re-encrypt/mTLS:** padrão “enterprise”: HTTPS público na borda **e** tráfego interno criptografado (mTLS do mesh é o mais usado).
    
- **Passthrough:** quando você **precisa** que o app veja o handshake (client cert, gRPC/h2 puro end-to-end) e não quer lógica L7 na borda para aquele host.
    

## Cabos soltos e pegadinhas

- **Loop de redirecionamento:** borda termina TLS e backend ainda força HTTPS → use HTTP no backend (ex.: `--insecure` no Argo CD) **ou** injete `X-Forwarded-Proto: https`.
    
- **Cadeia incompleta:** `tls.crt` deve conter **fullchain** (leaf + intermediários) — senão browsers rejeitam.
    
- **Passthrough ≠ L7:** em passthrough você perde reescrita/headers; roteia só por **SNI**.
    
- **SNI obrigatório:** em passthrough/TLSRoute o `hostname` (SNI) precisa casar com o certificado do app.
    

## Exemplo mini (Gateway API — terminação na borda)

```yaml
kind: Gateway
spec:
  gatewayClassName: nginx
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      hostname: app.exemplo.com
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: app-exemplo-com-tls   # fullchain + key
---
kind: HTTPRoute
spec:
  parentRefs:
    - name: <gateway>
      sectionName: https
  rules:
    - backendRefs:
        - name: meu-servico
          port: 80   # HTTP interno (ou mTLS via mesh)
```
