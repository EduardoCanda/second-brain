---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: iaas
cloud_provider: aws
---
**IAM Policies (Políticas de IAM)** são documentos que definem **permissões** em sistemas de gerenciamento de identidade e acesso (como AWS IAM, Azure RBAC ou Google Cloud IAM). Elas especificam **quem** (usuários, grupos, roles) pode **realizar quais ações** (leitura, escrita, exclusão) em **quais recursos** (serviços da nuvem, como S3, EC2, etc.).  

---

## **1. Estrutura Básica de uma IAM Policy**  
As políticas são escritas em **JSON** (AWS/GCP) ou **JSON/YAML** (Azure) e contêm:  
- **Effect**: `Allow` (permitir) ou `Deny` (negar).  
- **Action**: Lista de operações permitidas (ex: `s3:GetObject`).  
- **Resource**: ARN (Amazon Resource Name) ou URI do recurso afetado.  
- **Condition** (opcional): Restrições adicionais (ex: horário, IP de origem).  

### **Exemplo (AWS IAM Policy para acesso a um bucket S3):**  
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::meu-bucket/*", "arn:aws:s3:::meu-bucket"]
    }
  ]
}
```

---

## **2. Tipos de IAM Policies**  
### **A. Políticas Gerenciadas (Managed Policies)**  
- **Pré-definidas** pela plataforma (ex: `AmazonS3ReadOnlyAccess` na AWS).  
- **Reutilizáveis**: Podem ser anexadas a múltiplos usuários/grupos/roles.  

### **B. Políticas Inline (Inline Policies)**  
- **Vinculadas diretamente** a um usuário/grupo/role específico.  
- **Úteis para permissões únicas** (não são reutilizáveis).  

### **C. Políticas Baseadas em Recursos (Resource-Based Policies)**  
- **Anexadas ao recurso** (ex: política de bucket S3 ou fila SQS).  
- **Definem quem pode acessá-lo** (ex: permitir uma role de outra conta AWS).  

---

## **3. Como as IAM Policies Funcionam?**  
1. **Criação**: Um administrador define a política (ex: permitir leitura em um banco de dados).  
2. **Atribuição**: A política é anexada a:  
   - Um **usuário** (raro, melhor usar grupos).  
   - Um **grupo** (recomendado para escalabilidade).  
   - Uma **role** (para acesso temporário).  
3. **Avaliação**: Quando uma ação é solicitada, o IAM verifica se há uma política que a permite.  

---

## **4. Princípios Chave**  
- **Menor privilégio**: Conceda apenas as permissões necessárias.  
- **Ordem de avaliação**: `Deny` sobrepõe `Allow`.  
- **Herança**: Usuários em grupos herdam suas políticas.  

---

## **5. Exemplos Práticos**  
### **A. Permitir acesso a um bucket S3 específico (AWS)**  
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::meu-bucket-exemplo/*"
    }
  ]
}
```

### **B. Negar exclusão de instâncias EC2 (AWS)**  
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "ec2:TerminateInstances",
      "Resource": "*"
    }
  ]
}
```

### **C. Acesso condicional por horário (Azure RBAC)**  
```json
{
  "if": {
    "allOf": [
      {
        "field": "Microsoft.Authorization/roleAssignmentPrincipalId",
        "equals": "[parameters('userPrincipalId')]"
      },
      {
        "not": {
          "field": "Microsoft.Authorization/roleAssignmentTime",
          "in": "[parameters('allowedHours')]"
        }
      }
    ]
  },
  "then": { "effect": "deny" }
}
```

---

## **6. Melhores Práticas**  
✅ **Use políticas gerenciadas** sempre que possível (evite duplicação).  
✅ **Evite `"Resource": "*"`** a menos que seja absolutamente necessário.  
✅ **Monitore permissões não utilizadas** com ferramentas como AWS IAM Access Analyzer.  
✅ **Revise políticas periodicamente** para evitar "permissão creep".  

---

## **7. Comparação entre Plataformas**  
| **Plataforma**   | **Formato** | **Exemplo de Uso**                          |  
|------------------|------------|---------------------------------------------|  
| **AWS IAM**      | JSON       | Controle acesso a S3, EC2, Lambda.          |  
| **Azure RBAC**   | JSON/YAML  | Atribuir roles como `Contributor` ou `Reader`. |  
| **Google Cloud IAM** | JSON  | Vincular roles a service accounts (ex: `roles/storage.admin`). |  

---

## **8. Limitações**  
- **Complexidade**: Políticas muito granulares podem ser difíceis de gerenciar.  
- **Propagação de mudanças**: Alterações podem levar alguns minutos para surtir efeito.  

---

## **9. Conclusão**  
IAM Policies são a base do controle de acesso em ambientes de nuvem, permitindo segurança granular e compliance. Combinadas com **IAM Groups** e **Roles**, elas formam um sistema robusto para governança.  

Precisa de **exemplos avançados** (ex: políticas com condições, cross-account access ou integração com SSO)? Posso detalhar!