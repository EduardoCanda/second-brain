---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
Quando você cria um `Gateway`, o **NGINX Gateway Fabric ([[funcionamento-ngf|NGF]])** de fato **cria e gerencia automaticamente** a _workload_ de data plane ([[Deployment]] + [[Service]]) para aquele [[Gateway]]. Isso é esperado e está no desenho do produto. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/?utm_source=chatgpt.com "NGINX Gateway Fabric"))

Já o **[[protocolo-tls|TLS]] “de borda”** (o certificado que os **clientes [[protocolo-https|HTTP]](S)** veem no listener `HTTPS`) **não é ligado automaticamente** a nenhum Secret que o NGF crie por conta própria. Para terminar TLS você **sempre** precisa declarar explicitamente no listener:

```yaml
listeners:
  - name: https
    protocol: HTTPS
    port: 443
    hostname: seu.dominio
    tls:
      mode: Terminate
      certificateRefs:
        - kind: Secret
          name: <seu-secret-tls>
          # + ReferenceGrant se estiver em outro namespace
```

O [[Secret]] deve conter **[[certificado-digital|cert público]] (fullchain)** em `tls.crt` e **chave** em `tls.key` (tipo `kubernetes.io/tls`). NGF então usa esse par para a terminação HTTPS. Guias oficiais mostram exatamente esse fluxo: **o Secret é criado (manualmente ou via [[cert-manager]]) e depois referenciado no Gateway**; quando o Secret é renovado, o NGF recarrega o par dinamicamente. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/how-to/traffic-security/integrating-cert-manager/?utm_source=chatgpt.com "Secure traffic using Let's Encrypt and cert-manager - F5 NGINX"))

> O que é o Secret “automático” que você viu?  
> Em instalações específicas (ex.: **NGINX Plus**/telemetria), a documentação pede criar alguns **Secrets internos** (licença/JWT, CA/cliente para agente, etc.) no namespace do **control plane**; o NGF **copia esses Secrets** para onde o data plane roda. **Esses não são** usados como certificado público do listener HTTPS. ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/install/nginx-plus/ "Install NGINX Gateway Fabric with NGINX Plus | NGINX Documentation"))

### Dicas práticas

- **Sem `certificateRefs` ⇒ sem HTTPS** (ou handshake falha). Sempre aponte para o Secret certo. ([Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/guides/tls/?utm_source=chatgpt.com "TLS"))
    
- Se o Secret **não** estiver no mesmo namespace do `Gateway`, crie um **[[reference-grant|ReferenceGrant]]** no namespace do Secret para autorizar a referência [[namespace|_cross-namespace_]]. (Padrão da Gateway API.)
    
- Se preferir **passthrough**, use `protocol: TLS` + `tls.mode: Passthrough` e **TLSRoute**; aí o **app** apresenta o cert (o Gateway não usa `certificateRefs`). ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/traffic-management/tls-passthrough/?utm_source=chatgpt.com "Configure TLS passthrough | NGINX Documentation"))
    

Se quiser, te ajudo a:

1. apontar o `certificateRefs` para o Secret que você já tem (ou criar via cert-manager), e
    
2. adicionar um `ReferenceGrant` só se for _cross-namespace_.