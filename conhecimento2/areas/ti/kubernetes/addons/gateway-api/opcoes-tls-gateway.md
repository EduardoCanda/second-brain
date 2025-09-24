---
tags:
  - Kubernetes
  - NotaBibliografica
  - Segurança
ferramenta: gatewayapi
---
Ótima! Em setups “enterprise”, o padrão mais usado é:

# Padrão de referência (prod): **[[tls-borda|TLS na borda]] + [[tls-mtls|mTLS]] interno (service mesh)**

**O que é:** o Gateway/Ingress termina o [[protocolo-tls|TLS]] público (cert público, WAF/observabilidade), e **dentro do cluster o tráfego é re-criptografado via mTLS do mesh** ([[Linkerd]]/Istio), sem precisar que cada app fale HTTPS.  
**Como fica com [[introducao-argocd|Argo CD]]:** `argocd-server` roda com `--insecure` (HTTP), mas **o fio é mTLS** entre sidecars → nada viaja em claro.  
**Por que é o padrão:**

- você **mantém L7 completo na borda** (redirects, reescrita, headers, rate-limit, WAF);
    
- **criptografia fim-a-fim de verdade** (edge→mesh→workload), com identidade forte (SPIFFE) e **rotação automática**;
    
- apps ficam simples (sem gerenciar cert local/gRPC TLS).
    

> No seu contexto (você já usa Linkerd), é o caminho mais limpo:  
> Gateway HTTPS → [[HTTPRoute]] → Service do ArgoCD (porta 80) → sidecars do mesh fazem **mTLS**.  
> Dica: injete Linkerd no **[[namespace]] do ArgoCD** e (se possível) também no data-plane do gateway. Se o gateway não for meshado, o hop gateway→app não terá mTLS; nesse caso, considere “passthrough” (abaixo) se precisar desse último elo criptografado sem mesh.

---

# Alternativas comuns (quando usar)

1. **TLS passthrough (fim-a-fim no app)**  
    Gateway em `TLS/Passthrough` + `TLSRoute`; quem apresenta o cert é o Argo CD.  
    ✅ Mantém TLS até o app (bom p/ requisitos rígidos, client-cert, h2/grpc puro).  
    ❌ Você **perde L7 na borda** (sem rewrite/header inspect), roteia só por **SNI**.  
    Use quando precisa que o app “veja” o handshake do cliente, ou quando **não há mesh** e você quer **criptografia em todos os hops** sem abrir mão do TLS no app.
    
2. **TLS na borda + re-encriptação sem mesh (origination)**  
    Gateway termina TLS e **inicia nova conexão TLS** ao backend (re-encrypt).  
    ✅ Mantém L7 na borda **e** criptografa o hop interno.  
    ❌ Depende do **controlador suportar TLS para upstream** (policy/extension específica). Se não houver, prefira **mesh** ou **passthrough**.
    
3. **TLS só na borda + [[protocolo-https|HTTP]] interno (sem mesh)**  
    Simples e comum em times pequenos/labs.  
    ✅ Fácil; menos moving parts.  
    ❌ O hop interno fica **em claro** — geralmente **não** é o padrão em “arquiteturas avançadas”.
    

---

# Extras que empresas costumam acoplar

- **SSO/OIDC** no Argo CD (desabilita local users), RBAC por grupo.
    
- **HSTS** + security headers na borda, `X-Forwarded-Proto/Host` corretos.
    
- **cert-manager** (ACME) + **ExternalDNS** pra automação de certs/DNS.
    
- **NetworkPolicy** fechando o namespace do Argo CD.
    
- **WAF/Rate-limit** no gateway.
    
- **mTLS obrigatório** (mesh) + policy de autorização L7 quando disponível.
    

---

## Recomendação prática pra você

- **Escolha:** _TLS na borda + mTLS interno (service mesh)_.
    
- **Argo CD:** `server.insecure: "true"` (evita loop), SSO OIDC.
    
- **Gateway:** listener `HTTPS/Terminate` com cert público e `HTTPRoute` → `argocd-server:80`.
    
- **Mesh:** injete Linkerd no Argo CD (e, se viável, no gateway) para que **todo tráfego intra-cluster** fique **mTLS**.
    
- Se **precisar** criptografar o hop gateway→ArgoCD **sem mesh**, troque para **TLS passthrough** (Gateway `TLS` + `TLSRoute`) e mantenha TLS no Argo CD (sem `--insecure`).