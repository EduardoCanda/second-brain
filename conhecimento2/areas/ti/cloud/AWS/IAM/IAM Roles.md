---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
cloud_provider: aws
categoria_servico: hibrido
---
**IAM Roles (Funções de IAM)** são identidades seguras em sistemas de **Identity and Access Management (IAM)** — como AWS IAM, Azure RBAC ou Google Cloud IAM — que **não estão vinculadas a um usuário ou serviço específico**, mas podem ser **assumidas temporariamente** por usuários, serviços ou aplicações para conceder permissões controladas. Elas são fundamentais para implementar o princípio do **menor privilégio** e gerenciar acesso em ambientes de nuvem.

---

## **1. Para que servem as IAM Roles?**
- **Acesso temporário**: Permissões são concedidas apenas durante a sessão (não usam credenciais permanentes).
- **Delegação de acesso**: Permitir que serviços da nuvem (ex: EC2, Lambda) acessem outros recursos.
- **Federação de identidade**: Integrar com provedores de identidade (ex: Active Directory, Okta).
- **Segurança reforçada**: Elimina a necessidade de armazenar chaves de acesso longevas.

---

## **2. Como funcionam?**
1. **Criação da Role**:  
   Define-se:  
   - **Entidade que pode assumir a role** (trust policy).  
   - **Permissões concedidas** (permissions policy).  

2. **Assunção da Role**:  
   - Um usuário, serviço ou aplicação "assume" a role e recebe credenciais temporárias (ex: AWS STS).  
   - As permissões são válidas apenas durante o tempo definido (ex: 1 hora).  

3. **Acesso a recursos**:  
   A entidade usa as credenciais temporárias para interagir com os recursos permitidos.

---

## **3. Exemplo Prático (AWS IAM)**
### **A. Criar uma Role para um serviço AWS (EC2)**
```json
// Trust policy (quem pode assumir a role)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```json
// Permissions policy (o que a role pode fazer)
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::meu-bucket/*"
    }
  ]
}
```

### **B. Associar a Role a uma instância EC2**
```bash
aws ec2 associate-iam-instance-profile \
  --instance-id i-1234567890 \
  --iam-instance-profile Name=MinhaRoleParaEC2
```

---

## **4. Casos de Uso Comuns**
| **Cenário**                | **Exemplo**                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **Serviços acessando serviços** | Uma instância EC2 lendo arquivos de um bucket S3.                          |
| **Acesso entre contas AWS** | Usuário da Conta A assume uma role na Conta B para acessar recursos.       |
| **Federação de identidade** | Usuário do Active Directory assume uma role via SAML.                      |
| **CI/CD pipelines**        | Um pipeline no GitHub Actions assume uma role para deploy na AWS.          |

---

## **5. Vantagens sobre IAM Users**
✅ **Sem credenciais permanentes**: Reduz risco de vazamento.  
✅ **Permissões temporárias**: Acesso expira automaticamente.  
✅ **Flexibilidade**: Pode ser assumida por usuários, serviços ou contas externas.  
✅ **Auditoria**: Logs detalhados no CloudTrail (quem assumiu a role e quando).  

---

## **6. Comparação com Outros Conceitos**
| **IAM Users**         | **IAM Groups**       | **IAM Roles**         |
|-----------------------|----------------------|-----------------------|
| Credenciais permanentes. | Agrupa usuários.    | Credenciais temporárias. |
| Para humanos ou serviços. | Sem credenciais.    | Assumida por entidades. |

---

## **7. Melhores Práticas**
- **Use roles para serviços AWS**: Evite chaves de acesso em instâncias EC2.  
- **Restrinja trust policies**: Defina apenas entidades confiáveis que podem assumir a role.  
- **Monitore uso**: Ative logs no AWS CloudTrail para auditoria.  
- **Rotação de permissões**: Use condições como `DurationSeconds` para limitar sessões.  

---

## **8. Exemplo em Outras Plataformas**
### **Azure (Managed Identities / RBAC Roles)**
- **Funções** como `Contributor` ou `Reader` são atribuídas a recursos.  
- **Managed Identities** são equivalentes a roles para serviços Azure.  

### **Google Cloud (Service Accounts + Roles)**
- **Service Accounts** atuam como roles para recursos GCP.  

---

## **9. Limitações**
- **Complexidade**: Configurar trust policies pode ser desafiador.  
- **Latência**: Assumir roles pode adicionar pequeno atraso.  

---

## **10. Conclusão**
IAM Roles são a maneira mais segura e escalável de gerenciar acesso em ambientes de nuvem, especialmente para **comunicação entre serviços** ou **acesso entre contas**. Elas eliminam a necessidade de credenciais estáticas e reduzem riscos de segurança.  

Precisa de **exemplos detalhados** para cenários como **Kubernetes (EKS)**, **Lambda** ou **federated access**? Posso aprofundar!