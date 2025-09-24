---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Segurança
categoria_servico: paas
cloud_provider: aws
---

O **OIDC (OpenID Connect)** no EKS é um mecanismo de autenticação que permite vincular **identidades IAM da AWS** a **contas de serviço (ServiceAccounts) do Kubernetes**, especialmente usado para **IAM Roles for Service Accounts (IRSA)**. Ele funciona como um "provedor de identidade" que o Kubernetes confia para autenticar pods e usuários.

Vamos explicar em detalhes:

---

### **1. O que é o OIDC no EKS?**
- É um **provedor de identidade baseado em padrões abertos** (OpenID Connect, um extension do OAuth 2.0).
- No EKS, a AWS cria um **OIDC Provider único para seu cluster**, associado à URL:
  ```
  https://oidc.eks.<region>.amazonaws.com/id/<ID-ÚNICO-DO-CLUSTER>
  ```
- Esse provedor emite **tokens JWT** que comprovam a identidade de:
  - **Pods** (via ServiceAccounts anotados com IAM Roles).
  - **Usuários** (integrando IAM ao RBAC do Kubernetes).

---

### **2. Para que serve o OIDC no EKS?**
Principalmente para dois cenários:

#### **A. IRSA (IAM Roles for Service Accounts)**
- Permite que **pods** assumam IAM Roles temporárias **sem usar credenciais fixas** (ex.: Access Keys).
- Como? O pod apresenta um **token JWT** (gerado pelo OIDC Provider) para a AWS, que valida sua identidade e concede permissões da IAM Role vinculada.

#### **B. Autenticação de Usuários**
- Usuários autenticados via IAM podem ser mapeados para RBAC do Kubernetes usando o `aws-auth` ConfigMap (com o OIDC como intermediário).

---

### **3. Como o OIDC Provider é criado?**
- **Automaticamente**: Quando você habilita o IRSA no cluster (via `eksctl` ou Console AWS).
- **Manual**: Se necessário, pode ser criado com:
  ```sh
  eksctl utils associate-iam-oidc-provider --cluster <nome-cluster> --approve
  ```
- **Saída esperada**:
  ```sh
  [ℹ]  will create IAM Open ID Connect provider for cluster "meu-cluster" in "us-east-1"
  [✔]  created IAM OpenID Connect provider for cluster "meu-cluster" in "us-east-1"
  ```

---

### **4. Como o IRSA usa o OIDC?**
#### **Passo a Passo:**
1. **Cluster EKS tem um OIDC Provider**:
   - URL pública (ex.: `https://oidc.eks.us-east-1.amazonaws.com/id/EXEMPLO123`).
2. **Você cria uma IAM Role**:
   - Na política de **trust relationship**, a Role confia no OIDC Provider do cluster:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Principal": {
             "Federated": "arn:aws:iam::123456789012:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/EXEMPLO123"
           },
           "Action": "sts:AssumeRoleWithWebIdentity",
           "Condition": {
             "StringEquals": {
               "oidc.eks.us-east-1.amazonaws.com/id/EXEMPLO123:sub": "system:serviceaccount:default:meu-sa"
             }
           }
         }
       ]
     }
     ```
     - `sub` (subject) define qual **ServiceAccount** pode assumir a Role (formato: `system:serviceaccount:<namespace>:<serviceaccount-name>`).
3. **ServiceAccount no Kubernetes**:
   - Anotado com a ARN da IAM Role:
     ```yaml
     apiVersion: v1
     kind: ServiceAccount
     metadata:
       name: meu-sa
       annotations:
         eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/meu-role-s3
     ```
4. **Pod usa o ServiceAccount**:
   - Ao rodar, o Kubernetes injeta um **token JWT** no pod (em `/var/run/secrets/eks.amazonaws.com/serviceaccount/token`).
   - O AWS SDK dentro do pod usa esse token para assumir a IAM Role.

---

### **5. Como Verificar o OIDC do Seu Cluster?**
#### **Método 1: Via AWS CLI**
```sh
aws eks describe-cluster --name <nome-cluster> --query "cluster.identity.oidc.issuer"
```
Saída:
```
"https://oidc.eks.us-east-1.amazonaws.com/id/EXEMPLO123"
```

#### **Método 2: No Console AWS**
- Acesse **EKS > Seu Cluster > Configuration > OpenID Connect**.

---

### **6. Exemplo Prático: Pod com Acesso ao S3**
#### **Passo 1: Habilite o OIDC Provider**
```sh
eksctl utils associate-iam-oidc-provider --cluster meu-cluster --approve
```

#### **Passo 2: Crie uma IAM Role**
- Policy da Role (ex.: acesso ao S3):
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "s3:ListBucket",
        "Resource": "arn:aws:s3:::meu-bucket"
      }
    ]
  }
  ```
- Trust Policy (vincula ao OIDC do cluster):
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::123456789012:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/EXEMPLO123"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "oidc.eks.us-east-1.amazonaws.com/id/EXEMPLO123:sub": "system:serviceaccount:default:meu-sa"
          }
        }
      }
    ]
  }
  ```

#### **Passo 3: Crie o ServiceAccount**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: meu-sa
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/meu-role-s3
```

#### **Passo 4: Implante um Pod**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: meu-pod
spec:
  serviceAccountName: meu-sa
  containers:
  - name: aws-cli
    image: amazon/aws-cli
    command: ["aws", "s3", "ls", "s3://meu-bucket"]
```

---

### **7. Vantagens do OIDC no EKS**
- **Segurança**: Elimina a necessidade de armazenar credenciais AWS em pods.
- **Temporário**: Tokens JWT têm vida curta (normalmente 1 hora).
- **Granularidade**: Permissões específicas por ServiceAccount/Namespace.

---

### **8. Limitações**
- **Só funciona com serviços AWS que suportam `sts:AssumeRoleWithWebIdentity`**.
- **Requer configuração inicial** (OIDC Provider + IAM Roles).

---

### **9. Troubleshooting**
- **Erro "Not authorized to perform sts:AssumeRoleWithWebIdentity"**:
  - Verifique se o OIDC Provider está corretamente associado ao cluster.
  - Confira a **trust policy** da IAM Role.
- **Pod não consegue assumir a Role**:
  - Verifique as annotations do `ServiceAccount`.
  - Use `kubectl describe pod <nome>` para ver eventos.

---

### **Resumo Final**
O **OIDC no EKS** é a peça central para:
1. **IRSA**: Permite que pods usem IAM Roles de forma segura.
2. **Autenticação Federada**: Integra IAM ao RBAC do Kubernetes.

É a maneira moderna e segura de gerenciar acesso a recursos AWS a partir de cargas de trabalho Kubernetes! 🚀