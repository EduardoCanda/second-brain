---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: iaas
cloud_provider: aws
---
Os **IAM Users (Usuários de IAM)** são identidades individuais em um sistema de **Gerenciamento de Identidade e Acesso (IAM)**, como AWS IAM, Azure AD ou Google Cloud IAM. Eles representam pessoas, serviços ou aplicações que interagem com recursos em uma plataforma de nuvem, permitindo controle granular sobre permissões e autenticação.  

---

## **1. O que são IAM Users?**  
São entidades com:  
- **Credenciais únicas** (nome de usuário, senha, chaves de acesso).  
- **Permissões específicas** (atribuídas diretamente ou via grupos/roles).  
- **Finalidade definida**: Humanos (ex: administradores) ou máquinas (ex: aplicações que acessam APIs).  

---

## **2. Para que servem?**  
- **Autenticação**: Login seguro em consoles (ex: AWS Management Console).  
- **Autorização**: Controle quais recursos o usuário pode acessar.  
- **Auditoria**: Rastrear ações específicas por usuário (logs no CloudTrail, por exemplo).  
- **Segurança**: Aplicar MFA (autenticação multifator) e políticas de senha.  

---

## **3. Como funcionam? (Exemplo: AWS IAM)**  
### **A. Criação de um IAM User**  
1. **Defina o usuário**:  
   ```bash
   aws iam create-user --user-name alice
   ```  
2. **Adicione credenciais**:  
   - **Senha para console**:  
     ```bash
     aws iam create-login-profile --user-name alice --password 'Senha@123'
     ```  
   - **Chaves de acesso para API (Access Key ID + Secret Access Key)**:  
     ```bash
     aws iam create-access-key --user-name alice
     ```  

### **B. Atribuição de Permissões**  
- **Diretamente ao usuário**:  
  ```bash
  aws iam attach-user-policy --user-name alice --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
  ```  
- **Via grupos**: Adicione o usuário a um grupo com políticas pré-definidas.  

### **C. Autenticação**  
- **Console AWS**: Login com nome de usuário + senha (+ MFA).  
- **API/SDK**: Uso das chaves de acesso (`Access Key ID` e `Secret Access Key`).  

---

## **4. Tipos de IAM Users**  
| **Tipo**               | **Uso**                                                                 | **Exemplo**                          |  
|------------------------|-------------------------------------------------------------------------|--------------------------------------|  
| **Usuários humanos**   | Acesso interativo (console).                                            | Administradores, desenvolvedores.    |  
| **Usuários de serviço** | Acesso programático (aplicações, scripts).                            | CI/CD pipelines, aplicações em EC2.  |  

---

## **5. Melhores Práticas**  
✅ **Princípio do menor privilégio**: Só conceda permissões necessárias.  
✅ **Use grupos** para gerenciar permissões em escala (evite atribuir políticas diretamente a usuários).  
✅ **Habilite MFA** para acesso humano.  
✅ **Rotação de chaves**: Renove chaves de acesso periodicamente (ex: a cada 90 dias).  
✅ **Monitore atividades**: Use logs (AWS CloudTrail, Azure Monitor) para detectar acessos suspeitos.  

---

## **6. Exemplo de Política de Acesso (JSON)**  
Política para permitir apenas leitura em um bucket S3 específico:  
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

## **7. Comparação com Outros Conceitos**  
| **IAM Users**         | **IAM Groups**       | **IAM Roles**         |  
|-----------------------|----------------------|-----------------------|  
| Identidades individuais. | Agrupam usuários.   | Permissões temporárias para serviços/instâncias. |  
| Credenciais permanentes. | Sem credenciais próprias. | Credenciais temporárias (assumidas via STS). |  

---

## **8. Plataformas que usam IAM Users**  
- **AWS IAM**: Usuários para acesso a serviços AWS.  
- **Azure AD (Microsoft Entra ID)**: "Usuários empresariais" para acesso a recursos Azure.  
- **Google Cloud IAM**: Usuários vinculados a contas Google.  

---

## **9. Limitações**  
- **Gestão complexa** em grande escala (prefira grupos ou roles).  
- **Chaves de acesso comprometidas** podem gerar brechas de segurança.  

---

## **10. Conclusão**  
IAM Users são a base para controle de acesso em ambientes de nuvem, permitindo segurança e rastreabilidade. Combinados com **grupos**, **roles** e **MFA**, tornam-se uma ferramenta poderosa para governança.  

Precisa de exemplos de **políticas customizadas** ou como integrar com **SSO (Okta, Azure AD)**? Posso detalhar!