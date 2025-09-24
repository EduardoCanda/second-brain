---
tags:
  - Fundamentos
  - NotaBibliografica
  - Cloud
categoria_servico: iaas
cloud_provider: aws
categoria: computacao
---
Ótimo! Vamos explorar as **AMIs (Amazon Machine Images)**, um conceito fundamental no [[EC2]] que permite criar, compartilhar e implantar instâncias de forma padronizada.  

---

## **📌 O que é uma AMI?**  
Uma **AMI (Amazon Machine Image)** é um "template" pré-configurado que contém:  
✅ **Sistema operacional** (Linux, Windows, etc.).  
✅ **Configurações de software** (Apache, Docker, Banco de Dados, etc.).  
✅ **Permissões de acesso** (via IAM).  
✅ **Dados em blocos ([[EBS]] snapshots)** – Se a AMI usar EBS como armazenamento.  

👉 **Resumindo**: É como uma "imagem de disco" que você usa para iniciar uma instância EC2.  

---

## **🔹 Tipos de AMIs**  
Existem 4 categorias principais:  

| Tipo                        | Descrição                                                    | Quando Usar                                                              |     |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ | --- |
| **AWS Marketplace AMIs**    | Imagens pré-configuradas (ex.: WordPress, SQL Server).       | Para soluções prontas (evita configurar do zero).                        |     |
| **Community AMIs**          | AMIs públicas compartilhadas por usuários AWS.               | Para testes ou soluções customizadas (cuidado com segurança!).           |     |
| **Minhas AMIs**             | AMIs criadas por você.                                       | Para replicar ambientes personalizados (ex.: sua aplicação em produção). |     |
| **Amazon Quick Start AMIs** | Imagens oficiais AWS (Amazon Linux, Ubuntu, Windows Server). | Quando você quer um SO limpo e confiável.                                |     |

---

## **🔹 Como Funciona o Processo de Criação de uma AMI?**  
1. **Crie uma instância EC2** e a configure (SO, softwares, permissões).  
2. **Gere a AMI** (via Console AWS, CLI ou API):  
   - Se a instância usar **EBS**, a AMI incluirá um *snapshot* do volume.  
   - Se usar **Instance Store**, a AMI copiará os dados diretamente (menos durável).  
3. **Compartilhe (opcional)** com outras contas AWS ou torne pública.  
4. **Lance novas instâncias** a partir dessa AMI.  

---

## **🔹 Principais Vantagens de Usar AMIs**  
✔ **Padronização**: Garante que todas as instâncias tenham a mesma configuração.  
✔ **Backup/Restore**: Se uma instância falhar, você pode lançar uma nova idêntica.  
✔ **Escalabilidade**: Facilita a criação de múltiplas instâncias idênticas (Auto Scaling).  
✔ **Segurança**: Você pode criar AMIs com hardening pré-aplicado.  

---

## **🔹 Perguntas Comuns em Entrevistas sobre AMIs**  

### **1. "Qual a diferença entre AMI baseada em EBS vs. Instance Store?"**  
- **AMI com EBS**:  
  - Armazenamento persistente (não é perdido ao parar a instância).  
  - Permite snapshots e backups fáceis.  
  - Pode ser usada para instâncias *stop/start*.  
- **AMI com Instance Store**:  
  - Mais performance (armazenamento temporário *ephemeral*).  
  - Dados são perdidos se a instância for encerrada.  
  - Usada para workloads temporários (ex.: cache de alta velocidade).  

### **2. "Como você atualizaria uma AMI em produção?"**  
- Crie uma nova instância baseada na AMI atual.  
- Aplique as atualizações (SO, patches, softwares).  
- Gere uma nova AMI e atualize os Launch Templates/Auto Scaling Groups.  
- Teste em staging antes de substituir a AMI em produção.  

### **3. "Posso copiar uma AMI para outra região?"**  
- Sim! Use o comando `aws ec2 copy-image` ou o Console AWS.  
- Útil para DR (Disaster Recovery) ou baixa latência em múltiplas regiões.  

### **4. "O que é AMI Golden Image?"**  
- É uma AMI "definitiva" com todas as configurações de segurança e software necessárias.  
- Usada em pipelines de CI/CD para garantir consistência entre dev/test/prod.  

---

## **🔹 Dicas Práticas**  
🔸 **Use tags em AMIs** para organizar (ex.: `env=prod`, `app=webserver`).  
🔸 **Exclua AMIs não utilizadas** para evitar custos de armazenamento (EBS snapshots).  
🔸 **Monitore AMIs públicas** para evitar vulnerabilidades (ex.: AMIs com SSH aberto).  

---

## **📚 Recursos para Aprofundar**  
- [AWS Docs: Criando uma AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-an-ami.html)  
- [Diferença entre EBS e Instance Store](https://aws.amazon.com/premiumsupport/knowledge-center/instance-store-vs-ebs/)  
- [AMI Best Practices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)  

