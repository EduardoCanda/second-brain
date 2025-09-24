---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
categoria: questoes
---
## 🧠 **Qual a diferença entre CI e CD?**

### 🔹 **CI – Continuous Integration (Integração Contínua)**

> CI é a prática de integrar frequentemente o código ao repositório principal, com validações automáticas (build, testes, lint, etc.).
> 

### ✅ Objetivos:

- Detectar erros de integração cedo
- Garantir que o código está **sempre testável e compilável**
- Automatizar validações (testes unitários, estáticos, builds)

🧠 *Exemplo:*

> Sempre que faço um git push no repositório, uma pipeline roda testes e valida se o build está saudável.
> 

---

### 🔸 **CD – Continuous Delivery / Continuous Deployment**

> CD pode significar duas coisas, dependendo do nível de automação:
> 

| Variante | O que faz |
| --- | --- |
| **Continuous Delivery** | Prepara o sistema para ser implantado a qualquer momento (**deploy manual**) |
| **Continuous Deployment** | **Faz o deploy automaticamente** após a aprovação na pipeline |

### ✅ Objetivos:

- Automatizar a entrega para homologação ou produção
- Reduzir tempo entre commit e release
- Garantir entregas confiáveis e seguras

🧠 *Exemplo:*

> Após a aprovação dos testes e validações, a aplicação é implantada automaticamente em staging ou produção via pipeline.
> 

---

## 🧰 **Ferramentas populares de CI/CD**

### 🛠️ **CI/CD All-in-One**

| Ferramenta | Descrição breve |
| --- | --- |
| **GitHub Actions** | CI/CD nativo do GitHub com YAML e integração total |
| **GitLab CI** | CI/CD nativo com runners altamente customizáveis |
| **CircleCI** | Focado em performance e integração com containers |
| **Bitbucket Pipelines** | CI/CD da Atlassian |

### 🏗️ **CI focado (com integrações externas)**

| Ferramenta | Descrição breve |
| --- | --- |
| **Jenkins** | Altamente personalizável e poderoso (mas exige manutenção) |
| **Travis CI** | Popular em projetos open source |
| **TeamCity** | Solução robusta da JetBrains |

### ☁️ **Ferramentas AWS**

| Serviço | Função |
| --- | --- |
| **AWS CodeBuild** | Serviço de **build e teste (CI)** totalmente gerenciado |
| **AWS CodeDeploy** | Serviço de **deploy automatizado (CD)** para EC2, ECS, Lambda |
| **AWS CodePipeline** | Orquestração de CI/CD com etapas integradas |

---

## 🔁 **Ciclo completo CI/CD em prática (exemplo com GitHub Actions e ECS):**

1. **CI**: Ao fazer push em `main`, GitHub Actions:
    - Roda testes
    - Faz linting e build da aplicação
    - Gera artefato (ex: imagem Docker)
2. **CD**: Após o build:
    - Faz push da imagem para o ECR
    - Atualiza o serviço no ECS (Fargate ou EC2)
    - Notifica via Slack ou SNS

---

## ✅ **Conclusão para entrevista**

> “CI é o processo de integrar e validar automaticamente o código a cada mudança, enquanto CD automatiza a entrega ou implantação da aplicação. Já implementei pipelines completas usando GitHub Actions e AWS CodePipeline, com testes automatizados, build de imagem Docker, push para ECR e deploy para ECS. Essas práticas aumentaram nossa velocidade de entrega e reduziram erros manuais em produção.”
> 

### Qual a diferença entre ACID e BASE?
