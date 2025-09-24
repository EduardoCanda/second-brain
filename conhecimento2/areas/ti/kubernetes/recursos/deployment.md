---
tags:
  - Kubernetes
  - NotaBibliografica
---
Um **Deployment** no Kubernetes é o **controlador** que garante que um certo número de **réplicas de Pods** (com um _template_ definido) esteja sempre rodando, atualiza esses Pods de forma **gradual** (rolling update) e permite **rollback** se algo der errado.

# Como ele funciona (de ponta a ponta)

1. **Você declara o estado desejado**
    
    - `spec.replicas` (quantos Pods),
        
    - `spec.selector` (quais labels esses Pods devem ter),
        
    - `spec.template` (o _pod template_: contêineres, imagem, env, probes, etc.),
        
    - `spec.strategy` (como atualizar).
        
2. **O Deployment cria/gerencia ReplicaSets**
    
    - Para cada versão do _template_ de Pod, o Deployment mantém um **ReplicaSet** (RS) diferente, com label `pod-template-hash`.
        
    - Ao mudar **qualquer coisa em `spec.template`**, o Deployment cria um **novo RS** e inicia o rollout.
        
    - Mudar só `replicas` **não** cria RS novo (apenas escala o atual).
        
3. **Rolling Update (padrão)**
    
    - Estratégia default: `RollingUpdate` com `maxUnavailable=25%` (arredonda **para baixo**) e `maxSurge=25%` (arredonda **para cima**).
        
    - Ex.: `replicas=10` → `maxUnavailable=floor(2.5)=2`, `maxSurge=ceil(2.5)=3`.  
        Durante o rollout, o cluster pode ter **até 13 Pods** (10 desejados + 3 de _surge_) e **pelo menos 8 prontos**.
        
    - O Deployment **vai substituindo** Pods antigos por novos conforme os novos ficam **Ready** (respeitando `readinessProbes`).
        
4. **Condições e _health_ do rollout**
    
    - `minReadySeconds`: tempo que cada novo Pod precisa ficar **Ready** antes de ser considerado disponível (ajuda a evitar flaps).
        
    - `progressDeadlineSeconds`: tempo máximo para o rollout **progredir** antes de ser marcado como **falho** (útil para detectar travas, ex. imagem inválida ou readiness que nunca passa).
        
    - Condições comuns:
        
        - **Progressing** (ex.: “ReplicaSet atualizado criado/escalado”)
            
        - **Available** (réplicas disponíveis ≥ desejadas após `minReadySeconds`)
            
5. **Rollback e histórico**
    
    - Cada mudança em `spec.template` gera um **novo RS** (uma “revisão”).
        
    - `kubectl rollout undo deployment/<nome>` volta à revisão anterior (ou `--to-revision=N`).
        
    - `revisionHistoryLimit` (default 10) controla quantos RS antigos manter.
        
6. **Escalonamento durante rollout**
    
    - Se você muda `replicas` no meio do rollout, o Deployment **escala proporcionalmente** o RS novo e o antigo para manter o progresso sem picos/bruscos.
        
7. **Pausar/retomar**
    
    - `kubectl rollout pause deployment/<nome>` congela o rollout (bom para aplicar várias mudanças no _template_ de uma vez).
        
    - `kubectl rollout resume deployment/<nome>` retoma.
        
    - `kubectl rollout restart deployment/<nome>` força um novo rollout (atualiza a anotação `kubectl.kubernetes.io/restartedAt`).
        
8. **Recreate (alternativa)**
    
    - `strategy.type: Recreate`: primeiro derruba **todas** as réplicas antigas, depois sobe as novas (potencial **downtime**, útil para apps que não suportam duas versões simultâneas).
        
9. **Boas práticas & pegadinhas**
    
    - O `spec.selector` é **imutável**; ele deve casar com os labels do `spec.template.metadata.labels`.
        
    - Configure **readinessProbe** (não só liveness) — o rollout respeita readiness.
        
    - Combine com **HPA** (Horizontal Pod Autoscaler) para escalar `replicas` por métricas.
        
    - Use **PDB** (PodDisruptionBudget) para limitar indisponibilidade durante manutenções/evicções.
        
    - Adicione `strategy.rollingUpdate.maxUnavailable: 0` quando precisa de **zero downtime** (garanta capacidade/recursos para `maxSurge`).
        
    - Anote mudanças com `--record` (ou `kubernetes.io/change-cause`) para facilitar `rollout history`.
        

---

## Exemplo mínimo (com campos-chave)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 10
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
  minReadySeconds: 5
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%   # arredonda para baixo
      maxSurge: 25%         # arredonda para cima
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:1.27.0
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet: { path: /, port: 80 }
            periodSeconds: 5
            timeoutSeconds: 2
            failureThreshold: 3
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }
```

## Comandos úteis no dia a dia

```bash
# Ver andamento do rollout
kubectl rollout status deployment/web

# Histórico de revisões (mostra change-cause se anotado)
kubectl rollout history deployment/web

# Rollback para a revisão anterior (ou escolha uma revisão)
kubectl rollout undo deployment/web
kubectl rollout undo deployment/web --to-revision=3

# Trocar imagem e iniciar rollout
kubectl set image deployment/web nginx=nginx:1.27.1

# Pausar / retomar / reiniciar
kubectl rollout pause deployment/web
kubectl rollout resume deployment/web
kubectl rollout restart deployment/web
```

Se quiser, posso mostrar um **passo a passo do cálculo do rolling update** (com `maxSurge`/`maxUnavailable`) em diferentes tamanhos de réplicas, ou comparar **RollingUpdate vs Recreate** com cenários práticos (zero-downtime, bancos de dados, migradores, etc.).