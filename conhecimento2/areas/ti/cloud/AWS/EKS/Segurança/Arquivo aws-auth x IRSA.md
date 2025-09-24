---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Segurança
categoria_servico: paas
cloud_provider: aws
---
O uso do **`aws-auth` ConfigMap** é uma estratégia tradicional para gerenciar acesso ao cluster EKS, mas hoje em dia tem alternativas mais modernas (como o **OIDC**). Vamos comparar os dois métodos e explicar quando cada um faz sentido:

---

### **1. Estratégia Tradicional:  [[Configmap aws-auth|aws-auth]] ConfigMap**
#### **O que é?**
Um ConfigMap no namespace `kube-system` que mapeia **usuários/grupos IAM** para **usuários/grupos Kubernetes**, permitindo controle de acesso via RBAC.

#### **Como era usado?**
- **Para worker nodes**: Vinculava a IAM Role das instâncias EC2 ao grupo `system:nodes` do Kubernetes.
- **Para usuários humanos**: Mapeava IAM users/roles para acesso ao cluster via `kubectl`.

#### **Exemplo Clássico**:
```yaml
# aws-auth.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    # Permissão para worker nodes
    - rolearn: arn:aws:iam::123456789012:role/meu-eks-node-role
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
  mapUsers: |
    # Acesso para um usuário IAM
    - userarn: arn:aws:iam::123456789012:user/joao
      username: joao
      groups:
        - dev-team
```

#### **Prós**:
- Simples para cenários básicos.
- Funciona bem para **worker nodes** (ainda usado para isso).

#### **Contras**:
- **Gestão manual**: Requer edição manual do ConfigMap.
- **Sem granularidade fina**: Dificuldade para gerenciar muitos usuários.
- **Sem integração direta com IAM Roles**: Antes do IRSA, pods precisavam herdar permissões da EC2 (inseguro).

---

### **2. Estratégia Moderna: OIDC + IAM Roles for Service Accounts (IRSA)**
#### **O que é?**
Usa o **OIDC Provider do cluster** para vincular **IAM Roles diretamente a ServiceAccounts**, sem depender do `aws-auth`.

#### **Como funciona?**
1. O cluster EKS tem um **OIDC Provider** (ex.: `oidc.eks.us-east-1.amazonaws.com/id/ABCD1234`).
2. IAM Roles são configuradas para confiar nesse OIDC Provider.
3. **Pods** assumem permissões via **ServiceAccounts** anotados com a ARN da IAM Role.

#### **Exemplo (IRSA)**:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: meu-app
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/meu-role-s3
---
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

#### **Prós**:
- **Segurança**: Permissões temporárias e específicas por pod.
- **Granularidade**: Cada ServiceAccount pode ter uma IAM Role diferente.
- **Sem credenciais hardcoded**: Elimina risco de vazamento de secrets.

#### **Contras**:
- Configuração inicial mais complexa (OIDC Provider + políticas IAM).

---

### **3. Quando Usar Cada Estratégia?**
| Cenário                           | `aws-auth` ConfigMap | OIDC (IRSA) |
|-----------------------------------|----------------------|-------------|
| **Worker Nodes**                  | ✅ (Necessário)      | ❌          |
| **Acesso humano ao cluster**      | ⚠️ (Funciona, mas há opções melhores) | ✅ (Via `eksctl create iamidentitymapping`) |
| **Pods acessando serviços AWS**   | ❌ (Inseguro)        | ✅ (Recomendado) |

---

### **4. Migrando do `aws-auth` para OIDC**
#### **Para Acesso Humano**:
- Substitua `mapUsers` no `aws-auth` por **IAM Identity Center** ou **`eksctl`**:
  ```sh
  eksctl create iamidentitymapping \
    --cluster meu-cluster \
    --arn arn:aws:iam::123456789012:user/joao \
    --username joao \
    --group dev-team
  ```

#### **Para Pods**:
- Adote **IRSA** para substituir roles de EC2/herança de permissões.

---

### **5. Boas Práticas em 2024**
1. **Worker Nodes**: Continue usando `aws-auth` para mapear roles de EC2.
2. **Pods**: Use **IRSA** (OIDC) para acesso a serviços AWS.
3. **Usuários**: Prefira:
   - **AWS IAM Identity Center** (antigo SSO) + `eksctl`.
   - Ou **EKS Managed RBAC** (integrado ao IAM).

---

### **6. Como Listar Mapeamentos Existentes?**
```sh
eksctl get iamidentitymapping --cluster meu-cluster
```
Saída:
```
ARN                                                USERNAME                GROUPS
arn:aws:iam::123456789012:role/meu-role-node      system:node:{{EC2...}}  system:bootstrappers,system:nodes
arn:aws:iam::123456789012:user/joao               joao                    dev-team
```

---

### **7. Exemplo de Transição**
#### **Antigo (aws-auth)**:
```yaml
# aws-auth.yaml (obsoleto para usuários)
mapUsers: |
  - userarn: arn:aws:iam::123456789012:user/joao
    username: joao
    groups:
      - dev-team
```

#### **Novo (OIDC + eksctl)**:
```sh
eksctl create iamidentitymapping \
  --cluster meu-cluster \
  --arn arn:aws:iam::123456789012:user/joao \
  --username joao \
  --group dev-team \
  --no-duplicate-arns
```

---

### **8. Conclusão**
- **`aws-auth` ConfigMap**: Ainda essencial para **worker nodes**, mas ultrapassado para usuários/pods.
- **OIDC + IRSA**: Estratégia moderna para acesso seguro de pods e usuários.

Se você está começando um cluster novo, **priorize OIDC**. Se tem um legado, planeje a migração! 🔄

Quer um exemplo passo a passo para algum cenário específico?