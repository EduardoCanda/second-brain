# Kubernetes — Visão Geral

Kubernetes (K8s) é uma plataforma de orquestração de containers que automatiza deploy, escalabilidade e operação de aplicações.

## Conteúdo principal de Kubernetes

## 1) Arquitetura do cluster
- **Control Plane**: `kube-apiserver`, `etcd`, `kube-scheduler`, `kube-controller-manager`.
- **Workers**: `kubelet`, `kube-proxy` e runtime de container.
- Objetivo: entender como o estado desejado da aplicação é reconciliado.

## 2) Objetos fundamentais
- **Pod**: menor unidade de deploy.
- **Deployment**: gerencia réplicas e updates.
- **ReplicaSet**: mantém número de pods.
- **StatefulSet**: workloads com identidade estável.
- **DaemonSet**: um pod por nó.
- **Job/CronJob**: tarefas batch.

## 3) Rede e exposição
- **Service** (`ClusterIP`, `NodePort`, `LoadBalancer`).
- **Ingress** para roteamento HTTP/HTTPS.
- DNS interno do cluster.

## 4) Configuração e segredos
- **ConfigMap** para configurações não sensíveis.
- **Secret** para dados sensíveis.
- Variáveis de ambiente e montagem de arquivos.

## 5) Armazenamento
- **Volumes** e ciclo de vida.
- **PersistentVolume (PV)** e **PersistentVolumeClaim (PVC)**.
- **StorageClass** para provisionamento dinâmico.

## 6) Segurança
- **Namespaces** para isolamento lógico.
- **RBAC** para permissões.
- **Service Accounts**.
- **Network Policies**.
- Boas práticas com imagens, secrets e least privilege.

## 7) Observabilidade e operação
- Logs (`kubectl logs`), eventos e troubleshooting.
- Probes: `liveness`, `readiness`, `startup`.
- Métricas com Prometheus e dashboards.

## 8) Estratégias de deploy
- **Rolling update**, **recreate**, **blue/green**, **canary**.
- Rollback com `kubectl rollout undo`.

## Comandos essenciais
```bash
kubectl get pods -A
kubectl describe pod <pod>
kubectl logs <pod>
kubectl apply -f deployment.yaml
kubectl rollout status deployment/<name>
```

## Trilha sugerida de estudos
1. Fundamentos de containers (Docker).
2. Arquitetura do Kubernetes.
3. Objetos de workload e services.
4. Segurança e storage.
5. Observabilidade e troubleshooting.
6. GitOps e pipelines para deploy.
