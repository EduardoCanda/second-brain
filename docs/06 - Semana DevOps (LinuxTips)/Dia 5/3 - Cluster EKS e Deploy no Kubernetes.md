### Criando o Cluster EKS

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: semana-devops
  region: us-east-1
  version: "1.31"
managedNodeGroups:
  - name: workers
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 1
    maxSize: 4
    volumeSize: 20
```

```bash
# Criar o cluster (~15-20 minutos)
eksctl create cluster -f dia5/eks/cluster.yaml

# Verificar
kubectl get nodes
```

---

### Aplicando os Manifestos

```bash
# Editar deployment.yaml e trocar <SEU_DOCKERHUB_USER>

# Aplicar na ordem
kubectl apply -f dia5/k8s/namespace.yaml
kubectl apply -f dia5/k8s/deployment.yaml
kubectl apply -f dia5/k8s/service.yaml
kubectl apply -f dia5/k8s/hpa.yaml
```

### Verificando o Deploy

```bash
# Ver os pods (3 replicas!)
kubectl get pods -n semana-devops

# Ver o Service e pegar o EXTERNAL-IP
kubectl get svc -n semana-devops
```

Output esperado:

```
NAME                TYPE           CLUSTER-IP    EXTERNAL-IP                           PORT(S)
devops-map-brasil   LoadBalancer   10.100.x.x    aXXX.us-east-1.elb.amazonaws.com     80:31234/TCP
```

Acesse o EXTERNAL-IP no navegador! A app esta no ar na AWS!

### Testando o Balanceamento de Carga

Faca varios cadastros e observe o campo **"Pod"** no feed. Cada requisicao pode ser servida por um pod diferente!

```bash
for i in $(seq 1 10); do
  curl -s http://EXTERNAL_IP/api/info | jq .pod
done
```