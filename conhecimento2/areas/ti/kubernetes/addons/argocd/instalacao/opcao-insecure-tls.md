---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: argocd
categoria: CD
---
ótima pergunta — a **opção `--insecure` do `argocd-server`** costuma confundir mesmo. Aqui vai a explicação “sem mistério”.

# O que a opção `--insecure` faz

Ela **desliga o [[protocolo-tls|TLS]] no `argocd-server`**. Com isso, o servidor **passa a atender HTTP puro** (sem HTTPS) e **deixa de forçar redirecionamento para HTTPS**. É exatamente isso: _“Run server without TLS”_. ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/server-commands/argocd-server/ "argocd-server Command Reference - Argo CD - Declarative GitOps CD for Kubernetes"))

# Por que (e quando) usar

Use `--insecure` quando você **termina o TLS na borda** (Ingress/Gateway/Load Balancer) e quer que o hop interno até o `argocd-server` seja **HTTP**. A própria doc do Argo CD recomenda isso para **evitar loops de redirecionamento** (HTTP→HTTPS→HTTP→…): rodar o API server **com TLS desabilitado** atrás do proxy. ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/?utm_source=chatgpt.com "Ingress Configuration - Declarative GitOps CD for Kubernetes"))

**Modelo mental (com [[gateway-gatewayapi|Gateway API]] terminando TLS):**

```
Navegador ──HTTPS──> Gateway (termina TLS)
                     ↓ HTTP
                 argocd-server  (--insecure)
```

Sem `--insecure`, o `argocd-server` enxerga HTTP e **redireciona para HTTPS**, mas o cliente já está em HTTPS na borda — daí o **loop**. A solução é **não** ter TLS no `argocd-server` quando a borda já faz isso. ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/?utm_source=chatgpt.com "Ingress Configuration - Declarative GitOps CD for Kubernetes"))

# O que **não** muda

- **Autenticação/Autorização** do Argo CD (login, RBAC, SSO) continuam iguais; você só mudou o **transporte** entre a borda e o `argocd-server`.
    
- O acesso do usuário final **permanece HTTPS** (o TLS está na borda).
    

> Observação de segurança: o tráfego **dentro do cluster** (Gateway → `argocd-server`) fica em HTTP. Se você precisa criptografia nesse hop, use **TLS passthrough** (Gateway em `TLS/Passthrough` + `TLSRoute`) ou um mesh com mTLS; nesse caso **não** use `--insecure`. (A doc de Ingress mostra o primeiro cenário como recomendado para evitar loops quando a borda termina TLS.) ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/?utm_source=chatgpt.com "Ingress Configuration - Declarative GitOps CD for Kubernetes"))

# Como habilitar (duas formas)

1. **Flag no deployment** do `argocd-server`:
    
    - Adicione `--insecure` aos args do container. ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/server-commands/argocd-server/ "argocd-server Command Reference - Argo CD - Declarative GitOps CD for Kubernetes"))
        
2. **ConfigMap de parâmetros**:
    
    - No `argocd-cmd-params-cm`, defina: `server.insecure: "true"` (o operador injeta isso como arg). ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/?utm_source=chatgpt.com "Ingress Configuration - Declarative GitOps CD for Kubernetes"))
        

> Nos guias oficiais de Ingress, a instrução é exatamente essa: “rode o API server com TLS desabilitado (flag `--insecure` ou `server.insecure: "true"` no ConfigMap)”. ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/?utm_source=chatgpt.com "Ingress Configuration - Declarative GitOps CD for Kubernetes"))

# Quando **não** usar `--insecure`

- Se você quer **TLS fim-a-fim** (o próprio Argo CD apresenta o certificado ao cliente). Aí use **Gateway `TLS/Passthrough` + `TLSRoute`** e **não** configure `--insecure`.
    
- Se você expõe o `argocd-server` **direto** (sem proxy na frente) e quer HTTPS nativo.
    

# Dicas rápidas e pegadinhas

- Habilitou `--insecure` e ainda vê **ERR_TOO_MANY_REDIRECTS**? Verifique se você **removeu filtros de Redirect** do lado do Gateway/Ingress; com TLS na borda, não precisa redirecionar de novo. Os guias de Ingress citam o `--insecure` justamente para evitar esse loop. ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/operator-manual/ingress/?utm_source=chatgpt.com "Ingress Configuration - Declarative GitOps CD for Kubernetes"))
    
- **CLI x servidor**: o `--insecure` do **servidor** só muda o jeito que o server atende (HTTP). Já o `argocd login` tem seus próprios flags (como `--grpc-web`, etc.). Em setups com TLS na borda, o CLI normalmente fala **HTTPS na URL pública**, então você **não** precisa de CLI “insecure” — isso é outro assunto. (A doc de comandos do `argocd`/`argocd-server` separa bem esses contextos.) ([argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/en/latest/user-guide/commands/argocd/?utm_source=chatgpt.com "argocd Command Reference"))
    