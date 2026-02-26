# Kubernetes — Visão Geral

Kubernetes (K8s) é uma plataforma de orquestração de containers que automatiza deploy, escalabilidade e operação de aplicações em cluster.

## 1) Control Plane
O **Control Plane** é o “cérebro” do cluster. Ele decide **o que deve existir** (estado desejado) e coordena os componentes para que esse estado seja atingido.

Componentes principais:
- `kube-apiserver`
- `etcd`
- `kube-scheduler`
- `kube-controller-manager`
- `cloud-controller-manager` (quando há integração com provedor de nuvem)

---

## 2) etcd (banco de dados)
O **etcd** é um banco **chave-valor distribuído** que guarda o estado do cluster:
- definições de objetos (Pods, Deployments, Services etc.)
- metadados
- configurações

Sem etcd saudável, o cluster perde sua fonte de verdade. Por isso, backup e alta disponibilidade são críticos.

---

## 3) Scheduler
O **kube-scheduler** escolhe em qual **Node** cada Pod será executado.

Ele considera, por exemplo:
- CPU/memória disponível
- afinidade/anti-afinidade
- taints/tolerations
- restrições de zona/região

---

## 4) API Server
O **kube-apiserver** é a porta de entrada do Kubernetes.

Tudo passa por ele:
- `kubectl`
- controllers
- operadores
- integrações externas

Ele valida requisições, aplica autenticação/autorização e persiste o estado no etcd.

---

## 5) Kube Controller (kube-controller-manager)
O **kube-controller-manager** executa controladores que comparam estado atual vs. estado desejado.

Exemplos:
- Node Controller
- ReplicaSet Controller
- Deployment Controller

Esse loop de reconciliação é base do comportamento declarativo do Kubernetes.

---

## 6) Cloud Controller
O **cloud-controller-manager** integra Kubernetes com APIs do provedor cloud (AWS, GCP, Azure etc.).

Ele cuida de recursos como:
- Load Balancer externo
- rotas de rede
- metadados de nós

---

## 7) Data Plane
O **Data Plane** é onde os workloads realmente executam (nós workers + rede + runtime de containers).

Enquanto o Control Plane decide e coordena, o Data Plane processa tráfego e executa Pods.

---

## 8) Cluster
Um **cluster Kubernetes** é o conjunto de:
- Control Plane
- Nodes workers
- rede
- armazenamento

Objetivo: executar aplicações de forma resiliente, escalável e declarativa.

---

## 9) Nodes (VM)
**Nodes** são máquinas (VMs ou bare metal) que executam os Pods.

Cada Node geralmente possui:
- `kubelet`
- `kube-proxy`
- runtime de containers (containerd, CRI-O)

---

## 10) Pods (com um container ou mais / sidecar)
**Pod** é a menor unidade de deploy no Kubernetes.

Características:
- pode conter **1 ou mais containers**
- containers do mesmo Pod compartilham rede (IP/porta) e volumes
- padrão **sidecar**: container auxiliar (ex.: log, proxy, observabilidade) junto ao container principal

---

## 11) Kubelet
O **kubelet** roda em cada Node e garante que os Pods definidos para aquele nó estejam executando.

Ele:
- conversa com o API Server
- instrui o runtime a criar/parar containers
- reporta status do nó e dos Pods

---

## 12) Kube-Proxy (k-proxy)
O **kube-proxy** implementa regras de rede para Services (iptables/ipvs), permitindo roteamento de tráfego para os Pods corretos.

É essencial para comunicação estável entre serviços.

---

## 13) Load Balancer
No Kubernetes, load balancing aparece em múltiplas camadas:
- **Service ClusterIP**: balanceia dentro do cluster
- **Service LoadBalancer**: expõe serviço externamente (normalmente via cloud)
- **Ingress + Controller**: roteamento HTTP/HTTPS avançado

---

## 14) Self-Healing
Kubernetes possui mecanismos de **autocura**:
- reinicia containers com falha
- recria Pods em caso de queda
- substitui Pods de nós indisponíveis
- mantém quantidade desejada de réplicas

Isso reduz indisponibilidade e intervenção manual.

---

## 15) kubectl
`kubectl` é a CLI oficial para interagir com o cluster.

Exemplos:
```bash
kubectl get pods -A
kubectl describe pod <pod>
kubectl logs <pod>
kubectl apply -f deployment.yaml
kubectl rollout status deployment/<name>
```

---

## 16) kind
**kind (Kubernetes IN Docker)** cria clusters Kubernetes locais usando containers Docker.

Uso comum:
- estudos
- testes locais
- CI/CD

Exemplo rápido:
```bash
kind create cluster --name estudo-k8s
kubectl cluster-info --context kind-estudo-k8s
```

---

## 17) Manifestos YAML
No Kubernetes, você declara recursos em arquivos **YAML** (manifestos), por exemplo:
- Pod
- Deployment
- Service
- ConfigMap

Fluxo comum:
1. editar manifesto
2. aplicar com `kubectl apply -f arquivo.yaml`
3. observar reconciliação

---

## 18) Deployment
**Deployment** gerencia aplicações stateless com:
- rollout/rollback
- estratégia de atualização (rolling update)
- controle de réplicas via ReplicaSet

É o recurso mais comum para aplicações web/API.

---

## 19) DaemonSet
**DaemonSet** garante 1 Pod por Node (ou por subset de nodes).

Casos típicos:
- coletores de logs
- agentes de monitoramento
- plugins de rede

---

## 20) ReplicaSet
**ReplicaSet** mantém um número fixo de réplicas de Pods.

Na prática, normalmente é gerenciado pelo Deployment (não criado manualmente no dia a dia).

---

## 21) StatefulSet
**StatefulSet** é usado para workloads com estado:
- identidade estável de Pods
- ordem previsível de criação/remoção
- volume persistente por réplica

Exemplos: bancos de dados e filas.

---

## 22) Auto Scaling
Escalabilidade automática no Kubernetes:
- **HPA (Horizontal Pod Autoscaler)**: ajusta número de Pods
- **VPA (Vertical Pod Autoscaler)**: ajusta requests/limits de recursos
- **Cluster Autoscaler**: adiciona/remove Nodes

---

## 23) Services
**Service** fornece endpoint estável para acessar Pods dinâmicos.

Tipos principais:
- **ClusterIP** (interno)
- **NodePort** (exposição por porta no nó)
- **LoadBalancer** (exposição externa)
- **ExternalName** (alias DNS)

---

## Resumo rápido da arquitetura
- **Control Plane**: decide e orquestra.
- **Data Plane**: executa workloads.
- **API declarativa + controllers**: mantêm estado desejado.
- **Services + rede**: garantem conectividade.
- **Self-healing + autoscaling**: aumentam resiliência.

## Trilha sugerida de estudos
1. Criar cluster local com `kind`.
2. Aplicar manifestos YAML com Pod, Deployment e Service.
3. Praticar troubleshooting com `kubectl logs/describe/events`.
4. Simular falhas para observar self-healing.
5. Configurar HPA e testar autoscaling.
