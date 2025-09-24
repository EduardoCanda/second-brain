---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
cloud_provider: aws
categoria_servico: iaas
---
**IAM Groups (Grupos de IAM)** são conjuntos de usuários em um sistema de **Identity and Access Management (IAM)** — como AWS IAM, Azure AD ou Google Cloud IAM — que permitem gerenciar permissões de forma centralizada. Eles simplificam a administração de acesso ao agrupar usuários com necessidades semelhantes e atribuir políticas de permissão (**policies**) ao grupo, em vez de a cada usuário individualmente.

---

## **1. Para que servem os IAM Groups?**
- **Gerenciamento eficiente de permissões**: Aplicar regras de acesso a múltiplos usuários de uma vez.
- **Reduzir erros**: Evitar a atribuição manual de permissões a cada usuário.
- **Facilitar auditorias**: Rastrear permissões por grupo (não por usuário).
- **Cumprir políticas de segurança**: Garantir o princípio do **menor privilégio** (cada grupo tem apenas as permissões necessárias).

---

## **2. Como funcionam?**
- **Usuários são adicionados a grupos** com base em suas funções (ex: `Developers`, `Admins`, `Finance`).
- **Políticas de permissão são vinculadas ao grupo** (ex: "Acesso read-only ao S3").
- Qualquer usuário no grupo herda automaticamente as permissões do grupo.

---

## **3. Exemplo Prático (AWS IAM)**
### **Criar um Grupo e Atribuir Permissões**
1. **Crie um grupo** chamado `Developers` no AWS IAM:
   ```bash
   aws iam create-group --group-name Developers
   ```

2. **Anexe uma política** (ex: acesso a Amazon S3):
   ```bash
   aws iam attach-group-policy --group-name Developers --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
   ```

3. **Adicione usuários** ao grupo:
   ```bash
   aws iam add-user-to-group --group-name Developers --user-name alice
   ```

---

## **4. Benefícios**
✅ **Escalabilidade**: Adicionar/remover usuários de grupos é mais rápido que gerenciar permissões individuais.  
✅ **Consistência**: Todos no grupo têm o mesmo nível de acesso.  
✅ **Manutenção simplificada**: Alterar permissões para 100 usuários? Basta atualizar o grupo.  

---

## **5. Melhores Práticas**
- **Nomeie grupos com base em funções** (ex: `Devs-Prod`, `Admins-Global`).
- **Use políticas customizadas** para controle fino (evite políticas muito amplas como `AdministratorAccess`).
- **Revise permissões periodicamente** com ferramentas como AWS IAM Access Analyzer.

---

## **6. Comparação com Outros Conceitos**
| **IAM Users**         | **IAM Groups**       | **IAM Roles**         |
|-----------------------|----------------------|-----------------------|
| Contas individuais.   | Agrupam usuários.    | São assumidas por serviços/instâncias. |
| Permissões diretas.   | Permissões herdadas. | Temporárias e dinâmicas. |

---

## **7. Exemplo em Outras Plataformas**
### **Azure AD (Microsoft Entra ID)**
- Grupos são usados para acesso a recursos Azure (ex: `Contributors`, `Readers`).
- Podem ser sincronizados com Active Directory local.

### **Google Cloud IAM**
- Grupos no Google Workspace podem ser vinculados a funções (ex: `roles/storage.admin`).

---

## **8. Limitações**
- **Herança complexa**: Se um usuário está em múltiplos grupos, as permissões podem se sobrepor.
- **Não aplicável a serviços**: Grupos são para usuários humanos; para serviços, use **IAM Roles**.

---

## **9. Conclusão**
IAM Groups são essenciais para gerenciar acesso em ambientes de nuvem, garantindo segurança e eficiência. Eles são a base para implementar **controle de acesso baseado em funções (RBAC)**.  

Precisa de exemplos de políticas customizadas ou como integrar com **SSO (Okta, Azure AD)**? Posso detalhar!