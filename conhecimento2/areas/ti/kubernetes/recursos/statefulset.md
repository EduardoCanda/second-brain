---
tags:
  - Kubernetes
  - NotaBibliografica
---
Um **StatefulSet** é o controlador do [[Kubernetes]] pensado para **aplicações com estado** (bancos, filas, quorum systems) que precisam de **identidade estável**, **armazenamento persistente estável** e **ordem** de criação/atualização/remoção dos Pods.

# O que ele garante

1. **Identidade estável por Pod**
    
    - Nome fixo por ordinal: `nome-0`, `nome-1`, `nome-2`…
    - DNS estável via **Headless Service**: `nome-0.<svc>.<ns>.svc.cluster.local`.

2. **Disco persistente por Pod**
    
    - Usa `volumeClaimTemplates` para criar **um PVC por Pod** (p.ex., `dados-nome-0`).

    - Ao recriar o Pod (mesmo em outro nó), o mesmo PVC é reanexado.
    
    - Deletar o StatefulSet **não** apaga os PVCs (evita perda de dados).
        
3. **Ordem e _lifecycle_ controlados**
    
    - **Criação/atualização**: por padrão, em ordem (`-0` → `-1` → …), aguardando Readiness.
        
    - **Scale down/remoção**: remove do **maior ordinal** para o menor (garante segurança do cluster).
        
4. **Rollouts previsíveis**
    
    - `strategy: RollingUpdate` (padrão) com opção de **particionar** (`partition`) para atualizar só parte dos Pods.
        
    - `OnDelete` se você quiser controlar manualmente a troca de Pods.
        

# Quando usar (e quando evitar)

- **Use** para: PostgreSQL/MySQL, Kafka, ZooKeeper, Redis (master/replicas), Elastic, etc.
    
- **Evite** para workloads **sem estado** → prefira **Deployment** (mais simples e elástico).
    

# Campos e comportamentos importantes

- `serviceName`: **obrigatório** — deve apontar para um **Headless Service** (`clusterIP: None`) que dá DNS estável.
    
- `volumeClaimTemplates`: define os PVCs por Pod. O **StorageClass** cuida do provisionamento dinâmico.
    
- `podManagementPolicy`:
    
    - `OrderedReady` (default): serial e respeita readiness.
        
    - `Parallel`: cria/recupera Pods em paralelo (identidade ainda é estável).
        
- Atualizações:
    
    - `RollingUpdate`: respeita ordem e readiness; pode usar `partition` para canary/ondas.
        
    - `OnDelete`: só troca o Pod quando você o deleta (útil em bancos sensíveis).
        
- **HPA** funciona com StatefulSet (escala `replicas`), mas avalie impacto de ordem e bootstrapping.
    
- **PDB** (PodDisruptionBudget) recomendado para limitar indisponibilidade em manutenções.
    

# Exemplo mínimo (Headless Service + StatefulSet)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: db
  namespace: apps
spec:
  clusterIP: None                  # Headless
  selector:
    app: db
  ports:
    - name: tcp
      port: 5432
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
  namespace: apps
spec:
  serviceName: db                  # casa com o Headless Service
  replicas: 3
  podManagementPolicy: OrderedReady
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 0                 # mude para canary/ondas
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
        - name: postgres
          image: postgres:16
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: dados
              mountPath: /var/lib/postgresql/data
          readinessProbe:
            exec: { command: ["pg_isready","-q"] }
            periodSeconds: 5
  volumeClaimTemplates:
    - metadata:
        name: dados
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
        storageClassName: fast-ssd
```

# Comandos e operações do dia a dia

```bash
# Ver ordem/estado dos Pods
kubectl get pods -l app=db -n apps -o wide

# Escalar com estado
kubectl scale statefulset/db -n apps --replicas=5

# Reiniciar um Pod específico (mantém PVC e identidade)
kubectl delete pod db-2 -n apps

# Ver rollout
kubectl rollout status statefulset/db -n apps
```

# Pegadinhas e boas práticas

- **PVC não é apagado** com o StatefulSet: limpe manualmente se for intencional.
    
- Garanta **topologia de storage** compatível (zonas/`allowedTopologies`) para permitir reanexos ao migrar Pods.
    
- Use **Readiness** bem definida; sem readiness, o rollout/ordenação podem travar.
    
- Para clientes que precisam descobrir todos os membros, use **SRV records** do Headless Service ou liste `db-0.db`, `db-1.db`, etc.
    
- Se for só cache sem identidade (ex.: réplicas indistintas), um Deployment costuma ser melhor.
    

Se quiser, te mostro um **comparativo rápido entre StatefulSet x Deployment x DaemonSet** com cenários de uso típicos (bancos, filas, sidecars, data pipelines) — ajuda muito na escolha certa em produção.