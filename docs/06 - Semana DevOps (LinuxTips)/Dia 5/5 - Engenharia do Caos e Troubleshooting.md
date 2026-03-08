Hora de **quebrar as coisas** propositalmente e ver o Kubernetes se curar sozinho.

### Deletando Pods

```bash
kubectl delete pods -n semana-devops -l app=devops-map-brasil

# Imediatamente veja o K8s recriando:
kubectl get pods -n semana-devops -w
```

Os pods novos sobem em SEGUNDOS. Isso e o **Loop de Reconciliacao**: o K8s viu que a realidade (0 pods) era diferente do estado desejado (3 pods) e agiu.

### Simulando OOMKill

```bash
# Dar muito pouca memoria (forcar OOMKill)
kubectl set resources deployment/devops-map-brasil \
  -n semana-devops --limits=memory=10Mi

# STATUS = OOMKilled > CrashLoopBackOff
# Isso e o KERNEL DO LINUX matando o processo que violou o cgroup!

# Corrigir:
kubectl set resources deployment/devops-map-brasil \
  -n semana-devops --limits=memory=256Mi --requests=memory=128Mi
```

### Rolling Update sem Downtime

```bash
kubectl set image deployment/devops-map-brasil \
  devops-map-brasil=SEU_USER/devops-map-brasil:v2 -n semana-devops

kubectl rollout status deployment/devops-map-brasil -n semana-devops

# Deu ruim? ROLLBACK instantaneo!
kubectl rollout undo deployment/devops-map-brasil -n semana-devops
```

---

### Comandos Uteis

```bash
# Descrever pod (eventos, erros)
kubectl describe pod <NOME_DO_POD> -n semana-devops

# Shell dentro do container
kubectl exec -it <NOME_DO_POD> -n semana-devops -- sh

# Ver eventos do namespace
kubectl get events -n semana-devops --sort-by=.metadata.creationTimestamp

# HPA
kubectl get hpa -n semana-devops

# Uso de recursos
kubectl top pods -n semana-devops
```

---

### Limpeza (IMPORTANTE!)

Para nao tomar um susto na fatura da AWS, delete o cluster apos a aula!

```bash
kubectl delete -f dia5/k8s/
eksctl delete cluster -f dia5/eks/cluster.yaml --disable-nodegroup-eviction
```