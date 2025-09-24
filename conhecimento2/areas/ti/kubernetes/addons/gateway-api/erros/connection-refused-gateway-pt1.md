---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
Sim — isso explica o `connection refused`.

- O **[[Service]] `nginx-gateway` (NodePort)** mostra **`Endpoints: <none>`** em **todas** as portas (80/443/8082).  
    Isso significa que **nenhum [[Pod**]] está sendo selecionado por esse Service → não há nada ouvindo por trás do NodePort → conexão recusada.
    
- Já o **Service `ngf-nginx-gateway-fabric` (ClusterIP:443→8443)** é do **control plane** (gRPC do Fabric), **não** é o [[data-plane]] [[protocolo-https|HTTP]]. Não use esse para tráfego de usuários.
    

Provável causa: **selector do Service não casa com os rótulos dos Pods do dataplane**. Repare que:

- `ngf-nginx-gateway-fabric` usa `app.kubernetes.io/instance=ngf` e `app.kubernetes.io/name=nginx-gateway-fabric`;
    
- Seu [[funcionamento-ngf|nginx-gateway]] usa `app.kubernetes.io/instance=nginx-gateway` e `app.kubernetes.io/name=nginx-gateway`.  
    Na prática, o [[Helm]] release se chama **`ngf`**, então o selector `instance=nginx-gateway` do NodePort **não encontra nada**.
    

Ajuste em 3 passos:

---

## 1) Descobrir os rótulos reais dos Pods do dataplane

```bash
kubectl -n nginx-gateway get pods -o wide --show-labels
# (opcional) filtrar por nome:
kubectl -n nginx-gateway get pods -l app.kubernetes.io/name=nginx-gateway -o wide --show-labels
```

Anote os pares `app.kubernetes.io/instance=...` e `app.kubernetes.io/name=...` **dos Pods NGINX (dataplane)**.

---

## 2) Corrigir o Service NodePort para apontar para esses Pods

Supondo que os Pods do dataplane tenham:

- `app.kubernetes.io/instance=ngf`
    
- `app.kubernetes.io/name=nginx-gateway`
    

…então **patch** o Service `nginx-gateway`:

```bash
# Tornar/garantir que seja NodePort (se já for, ignora)
kubectl -n nginx-gateway patch svc nginx-gateway --type='merge' -p='{"spec":{"type":"NodePort"}}'

# Ajustar o selector para casar com os Pods do dataplane
kubectl -n nginx-gateway patch svc nginx-gateway --type='merge' -p='{
  "spec": {
    "selector": {
      "app.kubernetes.io/instance": "ngf",
      "app.kubernetes.io/name": "nginx-gateway"
    }
  }
}'
```

Confirme se endpoints aparecem:

```bash
kubectl -n nginx-gateway get endpoints nginx-gateway -o wide
```

Você deve ver IPs dos Pods e as portas-alvo (80, 443 **e 8082** se você adicionou).

> Se o Service **ainda** não tiver a porta **8082** → adicione:

```bash
kubectl -n nginx-gateway patch svc nginx-gateway --type='json' -p='[
  {"op":"add","path":"/spec/ports/-","value":{"name":"http-8082","protocol":"TCP","port":8082,"targetPort":8082}}
]'
```

---

## 3) Testar via NodePort (localhost ou IP do nó)

Pegue a NodePort da 8082:

```bash
kubectl -n nginx-gateway get svc nginx-gateway -o jsonpath='{.spec.ports[?(@.port==8082)].nodePort}{"\n"}'
```

Teste:

```bash
# Em single-node (minikube/microk8s), normalmente funciona em localhost:
curl -v http://127.0.0.1:<NODEPORT>/

# Em kind/k3d, use o IP do nó (kubectl get nodes -o wide) ou faça port-forward:
kubectl -n nginx-gateway port-forward svc/nginx-gateway 8082:8082
curl -v http://127.0.0.1:8082/
```

---

### Dicas finais / checagens

- **Gateway/Listener**: você definiu `port: 8082` (ok). O controller programa o NGINX para **escutar 8082**; por isso o Service precisa `targetPort: 8082`.
    
- **HTTPRoute**: se não tem `hostnames`, não precisa enviar `Host:` no `curl` (404 seria “sem rota”; `refused` é rede/Service).
    
- **Dois Services**: mantenha **um** para o dataplane HTTP (`nginx-gateway`, NodePort/LB) e deixe o `ngf-nginx-gateway-fabric` para o controle (não exponha como NodePort).
    

Se quiser, me diga o output do `get pods --show-labels` e eu te mando o `patch` exato do selector (ou um YAML pronto) para o seu ambiente.