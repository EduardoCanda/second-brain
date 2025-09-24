---
tags:
  - Kubernetes
  - NotaBibliografica
ferramenta: gatewayapi
---
Ótima pista. O que o seu `get pods` mostra é **apenas o [[control-plane]]** do [[funcionamento-ngf|NGINX Gateway Fabric]]:

```
app.kubernetes.io/name=nginx-gateway-fabric  (controller)
```

Ou seja: **não há nenhum pod do data-plane HTTP** selecionado pelo [[Service]] `nginx-gateway` — por isso ele aparece com `Endpoints: <none>` e você recebe **connection refused**.

Na NGF v2.x o data-plane (os pods NGINX que realmente escutam [[protocolo-https|HTTP]]) é criado **separadamente** do controller e, via de regra, fica **no mesmo [[namespace]] do seu Gateway** (no seu caso, `prometheus`). O Service `nginx-gateway` que você tem no namespace `nginx-gateway` não “enxerga” pods em `prometheus` (Service é namespaced), então ele vai continuar sem endpoints.

A correção é: **descobrir onde estão os pods do [[data-plane]]** e criar (ou ajustar) um **Service NodePort no MESMO namespace** desses pods, expondo a **porta do listener (8082)** com `targetPort: 8082`.

---

## Passo a passo (direto ao ponto)

### 1) Encontre os pods do data-plane

Procure por [[pod|pods]] NGINX criados para o seu `Gateway publico` (geralmente ficam no **mesmo namespace do Gateway**):

```bash
# 1a) Olhe no ns do Gateway
kubectl -n prometheus get pods -o wide --show-labels

# 1b) (amplo) Procure por pods com "nginx-gateway" no cluster
kubectl get pods -A -l app.kubernetes.io/name=nginx-gateway -o wide --show-labels || true
```

> Dica: os pods do data-plane costumam ter labels parecidas com  
> `app.kubernetes.io/name=nginx-gateway` e alguma label que referencia o **nome do Gateway**.

Se **não aparecer nenhum pod do data-plane**, algo impediu a criação dele (ex.: permissões, valores do [[Helm]]). Nesse caso, me diga o `kubectl get gatewayclass nginx -o yaml` e `kubectl -n prometheus get gateway publico -o yaml` que te aponto o ajuste.  
Se **aparecerem**, siga.

---

### 2) Crie o Service **NodePort** no namespace onde estão os pods

Substitua **o seletor** abaixo pelos labels reais que você viu nos pods (muito importante!).  
A porta do listener é **8082** ⇒ exponha `port: 8082` **e** `targetPort: 8082`.

```yaml
# salve como gateway-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: gateway-nodeport
  namespace: prometheus            # mesmo ns dos pods do data-plane
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: nginx-gateway    # AJUSTE para casar com os pods
    # app.kubernetes.io/instance: <valor>    # opcional, se existir no pod
    # (se houver uma label específica do seu Gateway, inclua também)
  ports:
    - name: http-8082
      protocol: TCP
      port: 8082
      targetPort: 8082
      nodePort: 30082   # opcional; remova para deixar o k8s escolher
```

Aplique:

```bash
kubectl apply -f gateway-nodeport.yaml
kubectl -n prometheus get endpoints gateway-nodeport -o wide
```

Você deve ver **IPs de pods** listados como endpoints da porta 8082.  
Se ainda aparecer `<none>`, o **selector** não casou — copie os labels exatos do pod e ajuste.

---

### 3) Teste pelo NodePort

```bash
# Descubra o NodePort real (caso não tenha fixado 30082)
kubectl -n prometheus get svc gateway-nodeport -o jsonpath='{.spec.ports[0].nodePort}{"\n"}'

# IP do node
kubectl get nodes -o wide

# Teste:
curl -v http://<NODE_IP>:<NODEPORT>/
# Se sua HTTPRoute exigir hostname, inclua:
# curl -v -H 'Host: SEU_HOST' http://<NODE_IP>:<NODEPORT>/
```

> Em **kind/k3d**, o NodePort pode não escutar no `127.0.0.1`.  
> Se quiser forçar localhost:
> 
> ```bash
> kubectl -n prometheus port-forward svc/gateway-nodeport 8082:8082
> curl -v http://127.0.0.1:8082/
> ```

---

### 4) Limpeza (opcional)

O Service `nginx-gateway` no namespace `nginx-gateway` não é útil para o tráfego HTTP do seu `Gateway publico` (que vive em `prometheus`). Você pode removê-lo ou mantê-lo para outro uso, mas ele **não** atenderá esse Gateway.

---

## Por que isso resolve?

- **Service é namespaced** → precisa estar no **mesmo ns** dos pods que vai expor.
    
- O **listener** do seu `Gateway` é **8082** → o NGINX do data-plane **escuta 8082** → o Service precisa usar `targetPort: 8082`.
    
- Com o selector correto, o Service ganha **endpoints** e o NodePort passa a encaminhar o tráfego → fim do `connection refused`.
    

Se quiser, cole aqui o `kubectl -n prometheus get pods -o wide --show-labels` e eu te devolvo o YAML do Service já com o selector exatamente certo.