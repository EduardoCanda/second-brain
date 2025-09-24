---
tags:
  - Segurança
  - Kubernetes
  - NotaBibliografica
categoria: criptografia
ferramenta: openssl
---
# 1) Localize os arquivos do certificado

- **certbot** (padrão):
    
    - **[[certificado-digital|certificado]] + cadeia (use este!)**: `/etc/letsencrypt/live/SEU_DOMINIO/fullchain.pem`
    
    - **chave privada**: `/etc/letsencrypt/live/SEU_DOMINIO/privkey.pem`
    
- **acme.sh**:
    
    - **fullchain**: `~/.acme.sh/SEU_DOMINIO/fullchain.cer`
    - **chave**: `~/.acme.sh/SEU_DOMINIO/SEU_DOMINIO.key`

> Se você só tem `cert.pem` e `chain.pem`, junte-os para formar o **tls.crt**:
> 
> ```bash
> cat cert.pem chain.pem > fullchain.pem
> ```

# 2) Criar o [[Secret]] TLS

Escolha o namespace onde seu Ingress/Gateway roda (ex.: `default`):

```bash
kubectl -n default create secret tls app-tls \
  --cert=/etc/letsencrypt/live/SEU_DOMINIO/fullchain.pem \
  --key=/etc/letsencrypt/live/SEU_DOMINIO/privkey.pem
```

Confirme:

```bash
kubectl -n default get secret app-tls -o jsonpath='{.type}{"\n"}'
# deve imprimir: kubernetes.io/tls
```

> Dica “idempotente” (bom para automação/renovação):
> 
> ```bash
> kubectl -n default create secret tls app-tls \
>   --cert=/etc/letsencrypt/live/SEU_DOMINIO/fullchain.pem \
>   --key=/etc/letsencrypt/live/SEU_DOMINIO/privkey.pem \
>   --dry-run=client -o yaml | kubectl apply -f -
> ```

# 3) Usar o Secret no tráfego HTTPS

## Opção A — [[Ingress]] (ex.: ingress-nginx)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app
  namespace: default
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - app.seu-dominio.com.br
      secretName: app-tls
  rules:
    - host: app.seu-dominio.com.br
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: app-svc
                port:
                  number: 80
```

## Opção B — [[gateway-api|Gateway API]] (TLS termina no [[Gateway]])

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: public-gw
  namespace: default
spec:
  listeners:
    - name: https
      port: 443
      protocol: HTTPS
      hostname: app.seu-dominio.com.br
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: app-tls   # no mesmo namespace do Gateway
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-route
  namespace: default
spec:
  parentRefs:
    - name: public-gw
  hostnames:
    - app.seu-dominio.com.br
  rules:
    - backendRefs:
        - name: app-svc
          port: 80
```

# 4) Renovação (importante!)

Seu LE vence em ~90 dias. Se você **renova fora do cluster** (certbot/acme.sh), automatize a atualização do Secret:

- **certbot** com deploy-hook:
    
    ```bash
    certbot renew --deploy-hook \
    'kubectl -n default create secret tls app-tls \
       --cert=/etc/letsencrypt/live/SEU_DOMINIO/fullchain.pem \
       --key=/etc/letsencrypt/live/SEU_DOMINIO/privkey.pem \
       --dry-run=client -o yaml | kubectl apply -f -'
    ```
    
    (Garanta que essa máquina tem `kubectl` com acesso ao cluster.)
    
- **Controllers** como ingress-nginx e a maioria dos Gateways detectam mudança no Secret e recarregam automaticamente.
    

# 5) Erros comuns a evitar

- **Usar `cert.pem` (sem cadeia)** → alguns clientes falham. Prefira **`fullchain.pem`**.
    
- **Namespace errado** → o Secret precisa estar **no mesmo namespace** do Ingress/Gateway.
    
- **Permissões** → proteja `privkey.pem` (0600) na origem; no Secret, o Kubernetes cuida do acesso por _mount_.
    

Se me disser qual controlador você usa (ingress-nginx, Traefik, Contour, Gateway com NGINX/HAProxy/etc.) e o namespace, eu ajusto os manifests exatamente pro seu cenário.