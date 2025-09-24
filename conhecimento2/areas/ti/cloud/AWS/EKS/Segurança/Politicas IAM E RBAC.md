---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Segurança
categoria_servico: hibrido
cloud_provider: aws
---
### **1. Visão Geral da Integração IAM + RBAC**

O EKS usa o **AWS IAM** para autenticação (provar quem você é) e o **Kubernetes RBAC** para autorização (o que você pode fazer). A chave dessa integração é o **AWS IAM Authenticator** (ou o **OpenID Connect ([[OIDC no Cluster|OIDC]])** em clusters modernos), que mapeia entidades IAM (usuários, roles) para entidades Kubernetes (usuários, `ServiceAccounts`).

---

### **2. Fluxo de Autenticação e Autorização**
1. **Autenticação via IAM**:
   - Um usuário ou aplicação chama a API do EKS usando credenciais AWS (ex.: `aws eks get-token`).
   - O EKS verifica a identidade através do IAM.
2. **Mapeamento para RBAC**:
   - O usuário/role IAM é associado a um **sujeito** (subject) no Kubernetes (ex.: um usuário ou `ServiceAccount`).
   - O RBAC do Kubernetes define quais ações esse sujeito pode executar (ex.: `get pods`).

---

### **3. Exemplo 1: Dar Acesso a um Usuário IAM**
**Cenário**: Permitir que um usuário IAM (`jane@example.com`) liste pods em um namespace específico.

#### **Passo 1: Criar um mapeamento no `ConfigMap` do EKS**
O arquivo `aws-auth.yaml` (usado pelo EKS para mapear IAM → Kubernetes) deve incluir:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapUsers: |
    - userarn: arn:aws:iam::123456789012:user/jane
      username: jane
      groups:
        - dev-team
```

#### **Passo 2: Criar uma Role e RoleBinding no Kubernetes**
```yaml
# Role (define as permissões no namespace "app")
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: app
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]

# RoleBinding (associa o grupo "dev-team" à Role)
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: app
  name: read-pods
subjects:
- kind: Group
  name: dev-team
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

#### **Resultado**:
- Jane (autenticada via IAM) pode executar:
  ```sh
  kubectl get pods -n app
  ```
- Mas não pode acessar outros namespaces ou deletar pods.

---

### **4. Exemplo 2: IAM Role para um Pod (IRSA)**
**Cenário**: Um pod precisa acessar um bucket S3 sem usar credenciais hardcoded.

#### **Passo 1: Criar um OIDC Provider para o Cluster EKS**
- Habilite o OIDC no cluster:
  ```sh
  eksctl utils associate-iam-oidc-provider --cluster meu-cluster --approve
  ```

#### **Passo 2: Criar uma IAM Role com Acesso ao S3**
- Policy da Role (ex.: `s3-read-only`):
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject"],
        "Resource": "arn:aws:s3:::meu-bucket/*"
      }
    ]
  }
  ```

#### **Passo 3: Associar a Role a um `ServiceAccount`**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: meu-app
  namespace: default
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/s3-read-only
```

#### **Passo 4: Usar o `ServiceAccount` no Pod**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: meu-pod
spec:
  serviceAccountName: meu-app
  containers:
  - name: aws-cli
    image: amazon/aws-cli
    command: ["aws", "s3", "ls", "s3://meu-bucket"]
```

#### **Resultado**:
- O pod terá permissão temporária para acessar o S3 via AWS SDK (sem segredos explícitos).

---

### **5. Exemplo 3: Restringir Acesso a Namespaces por Time**
**Cenário**: Time de DevOps tem acesso total, enquanto o time de Dev só pode ler em namespaces específicos.

#### **Passo 1: Mapear Grupos IAM no `aws-auth` ConfigMap**
```yaml
mapGroups: |
  - grouparn: arn:aws:iam::123456789012:group/devops-team
    username: devops
    groups:
      - admin
  - grouparn: arn:aws:iam::123456789012:group/dev-team
    username: dev
    groups:
      - dev-group
```

#### **Passo 2: Definir ClusterRoles e Bindings**
```yaml
# ClusterRole para DevOps (acesso total)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: admin
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]

# ClusterRole para Devs (somente leitura)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dev-reader
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list"]

# ClusterRoleBindings
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: devops-admin-binding
subjects:
- kind: Group
  name: admin
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: admin
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: dev-reader-binding
  namespace: app
subjects:
- kind: Group
  name: dev-group
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: dev-reader
  apiGroup: rbac.authorization.k8s.io
```

#### **Resultado**:
- Membros do `devops-team` podem executar qualquer operação no cluster.
- Membros do `dev-team` só podem listar pods/services no namespace `app`.

---

### **6. Dicas de Segurança**
1. **Princípio do Menor Privilégio**: Sempre restrinja permissões ao mínimo necessário.
2. **Use IRSA para Pods**: Evite usar roles de EC2 para pods.
3. **Auditoria**: Habilite logs do Kubernetes API Server no CloudWatch.

---

### **7. Problemas Comuns e Soluções**
- **Erro "Unauthorized"**: Verifique se o `aws-auth` ConfigMap está correto.
- **Pods não assumem a IAM Role**: Confira as anotações do `ServiceAccount` e se o OIDC está habilitado.
- **Permissões muito amplas**: Revise políticas IAM e RBAC regularmente.

---

### **Resumo**
A integração IAM + RBAC no EKS permite:
- **Autenticação centralizada** via IAM.
- **Autorização granular** via Kubernetes RBAC.
- **Segurança aprimorada** com IRSA (IAM Roles for Service Accounts).

Quer testar na prática? Crie um cluster EKS (via `eksctl` ou Console) e experimente os exemplos acima!