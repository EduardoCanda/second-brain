---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Segurança
categoria_servico: paas
cloud_provider: aws
---

O **`aws-auth` ConfigMap** é um componente crítico no EKS para mapear usuários, grupos ou roles do **AWS IAM** para permissões dentro do cluster Kubernetes (RBAC). Ele funciona como uma "ponte" entre a autenticação da AWS e o Kubernetes. Vamos desmontá-lo em detalhes:

---

### **1. O que é o `aws-auth` ConfigMap?**
- **Onde vive**: No namespace `kube-system` do cluster EKS.
- **Para que serve**: Define como identidades IAM (usuários, roles, grupos) são mapeadas para usuários/grupos no Kubernetes.
- **Quem o usa**: O **AWS IAM Authenticator** (ou o **OpenID Connect Provider** em clusters modernos) consulta esse ConfigMap para autenticar requisições.

---

### **2. Estrutura do Arquivo `aws-auth.yaml`**
O ConfigMap tem duas seções principais:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |  # Mapeia IAM Roles para Kubernetes
    - rolearn: <ARN_DA_IAM_ROLE>
      username: <NOME_NO_KUBERNETES>
      groups:  # Grupos RBAC associados
        - <GRUPO_K8S>
  mapUsers: |  # Mapeia IAM Users para Kubernetes
    - userarn: <ARN_DO_USUÁRIO_IAM>
      username: <NOME_NO_KUBERNETES>
      groups:
        - <GRUPO_K8S>
  mapAccounts: |  # Mapeia contas AWS inteiras
    - "123456789012"  # AWS Account ID
```

---

### **3. Como Cada Seção Funciona?**

#### **A. `mapRoles` (Para IAM Roles)**
Usado para:
- **Worker Nodes**: Roles das instâncias EC2 que rodam seus pods.
- **IRSA (IAM Roles for Service Accounts)**: Roles associadas a pods via `ServiceAccount`.

**Exemplo**: Role de um Node Group
```yaml
mapRoles: |
  - rolearn: arn:aws:iam::123456789012:role/meu-eks-node-group-role
    username: system:node:{{EC2PrivateDNSName}}  # Padrão do Kubernetes para nodes
    groups:
      - system:bootstrappers
      - system:nodes
```

#### **B. `mapUsers` (Para IAM Users)**
Para dar acesso a usuários humanos ou máquinas via IAM.

**Exemplo**: Acesso de um desenvolvedor
```yaml
mapUsers: |
  - userarn: arn:aws:iam::123456789012:user/joao
    username: joao
    groups:
      - dev-team
```

#### **C. `mapAccounts` (Para Contas AWS Inteiras)**
Permite que **todos os IAM users/roles de uma conta AWS** acessem o cluster.

**Exemplo**:
```yaml
mapAccounts: |
  - "123456789012"  # Conta da AWS
```

---

### **4. Como o Mapeamento é Usado na Prática?**
1. **Autenticação**:
   - Quando você roda `kubectl`, o AWS IAM Authenticator verifica:
     - Se você é um IAM user/role listado no `aws-auth`.
     - Se sim, mapeia para um usuário/grupo Kubernetes.
2. **Autorização (RBAC)**:
   - O Kubernetes verifica se o usuário/grupo tem permissões via `Role`/`ClusterRole` + `RoleBinding`.

---

### **5. Exemplo Completo**
Suponha que você queira:
- Um **node group** (EC2).
- Um **usuário IAM** com acesso limitado.
- Um **pod** com acesso ao S3 (IRSA).

**`aws-auth.yaml`**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    # Role dos Worker Nodes
    - rolearn: arn:aws:iam::123456789012:role/meu-eks-node-role
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
    # IRSA: Role para um pod acessar o S3
    - rolearn: arn:aws:iam::123456789012:role/meu-pod-s3-role
      username: s3-accessor
      groups:
        - pod-s3-group
  mapUsers: |
    # Usuário IAM "maria" com acesso ao namespace "app"
    - userarn: arn:aws:iam::123456789012:user/maria
      username: maria
      groups:
        - app-team
```

---

### **6. Como Editar o `aws-auth`?**
#### **Método 1: Via `kubectl`**
```sh
kubectl edit configmap aws-auth -n kube-system
```

#### **Método 2: Aplicar um Arquivo YAML**
```sh
kubectl apply -f aws-auth.yaml
```

#### **Método 3: Usando `eksctl` (Recomendado)**
```sh
eksctl create iamidentitymapping \
  --cluster meu-cluster \
  --arn arn:aws:iam::123456789012:user/maria \
  --username maria \
  --group app-team
```

---

### **7. Regras Importantes**
1. **Ordem de Precedência**:
   - Se um usuário/role estiver em `mapUsers` e `mapRoles`, o primeiro mapeamento encontrado é usado.
2. **Grupos Kubernetes**:
   - Devem ser definidos em **Roles/RoleBindings** para terem efeito.
   - Exemplos de grupos nativos:
     - `system:masters` (acesso de admin, equivalente a `cluster-admin`).
     - `system:nodes` (para worker nodes).
3. **IRSA**:
   - Requer um **OIDC Provider** habilitado no cluster.
   - O `ServiceAccount` do pod deve ter a annotation com a ARN da role.

---

### **8. Troubleshooting**
- **Erro "Unable to connect to the server: Unauthorized"**:
  - Verifique se o ARN no `aws-auth` está correto.
  - Confira se o usuário/role tem a política IAM `eks:DescribeCluster`.
- **Pods não assumem a IAM Role**:
  - Confira se o OIDC Provider está configurado:
    ```sh
    aws eks describe-cluster --name meu-cluster --query "cluster.identity.oidc.issuer"
    ```
  - Verifique as annotations do `ServiceAccount`.

---

### **9. Boas Práticas**
1. **Use `eksctl` para gerenciar mapeamentos**: Evita erros manuais.
2. **Evite `system:masters`**: Restrinja ao mínimo necessário.
3. **Revise regularmente**: Use ferramentas como `kubectl whoami` ou AWS IAM Access Analyzer.

---

### **Exemplo de Fluxo**
1. **Usuário "maria"**:
   - Faz login via AWS CLI.
   - Roda `kubectl get pods -n app`.
   - O EKS verifica o `aws-auth` e vê que ela pertence ao grupo `app-team`.
   - O RBAC verifica se `app-team` tem permissão para `get pods` no namespace `app`.

2. **Pod com IRSA**:
   - Tenta acessar o S3 via AWS SDK.
   - O SDK assume a IAM Role definida no `ServiceAccount`.
   - A Role foi mapeada no `aws-auth` para o grupo `pod-s3-group`.

---

### **Resumo Final**
O `aws-auth` ConfigMap é o **cérebro da integração IAM-RBAC no EKS**. Ele responde:
- **Quem pode acessar?** (via `mapUsers`, `mapRoles`, `mapAccounts`).
- **Como são mapeados?** (para usuários/grupos Kubernetes).
- **O que podem fazer?** (isso fica com o RBAC do Kubernetes).

Quer testar? Crie um cluster EKS e experimente adicionar seu próprio usuário IAM ao `aws-auth`!