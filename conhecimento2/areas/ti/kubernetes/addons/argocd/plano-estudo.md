---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Para uma abordagem **didática e eficiente** ao aprender [[introducao-argocd|Argo CD]], recomendo seguir esta ordem:

---

### **1. Comece pelo _[[areas/ti/kubernetes/addons/argocd/links-externos|User Guide]]_ (Guia do Usuário)**  
**Por quê?**  
- **Foco prático**: Ensina conceitos básicos e fluxos de trabalho do dia a dia.  
- **Mão na massa rápido**: Você verá resultados concretos em minutos (ex: deploy de uma app simples).  
- **Fundamentos essenciais**:  
  - O que é um `Application`?  
  - Como fazer sync manual/automático?  
  - Uso da UI e CLI.  

**Exemplos do que você aprenderá:**  
- Criar sua primeira aplicação.  
- Gerenciar deploys com [[GitOps]].  
- Usar features como auto-sync e hooks.  

---

### **2. Depois avance para o _Operator Manual_ (Manual do Operador)**  
**Por quê?**  
- **Tópicos avançados**: Exige familiaridade com os conceitos básicos.  
- **Foco em administração**:  
  - Configuração do Argo CD em nível de cluster (ex: [[rbac]], SSO, alta disponibilidade).  
  - Troubleshooting e otimização.  
- **Casos complexos**:  
  - Gerenciamento de multi-clusters.  
  - Customização do controlador Argo CD.  

**Exemplos do conteúdo:**  
- Configurar [[Resumo OAUTH 2.0|OAuth2]] com Dex.  
- Gerenciar `ApplicationSets` em larga escala.  
- Monitoramento com [[prometheus]].  

---

### 📌 **Metáfora Didática**  
Pense como aprender a dirigir:  
- **User Guide** = Aprender a ligar o carro, trocar de marcha e estacionar (o essencial para usar).  
- **Operator Manual** = Entender o motor, fazer manutenção e otimizar o consumo de combustível (para quem quer dominar o sistema).  

---

### ⚠️ **Riscos de Pular Etapas**  
Se começar pelo _Operator Manual_ sem base:  
- Pode ser **sobrecarregante** (muitos conceitos interdependentes).  
- Você perderá contexto de **por que** certas configurações são necessárias.  

---

### ✅ **Plano de Estudo Recomendado**  
1. **User Guide** (1-2 dias):  
   - Siga o [tutorial oficial](https://argo-cd.readthedocs.io/en/stable/getting_started/).  
   - Pratique com exemplos locais (ex: Minikube).  
2. **Operator Manual** (semana seguinte):  
   - Explore tópicos conforme sua necessidade (ex: segurança, escalabilidade).  

---

### 🔥 **Dica Extra**  
- Use o **Argo CD em um projeto pessoal** enquanto estuda. A prática fixa o conhecimento!  
- Se encontrar termos desconhecidos no _Operator Manual_, volte ao _User Guide_ para reforçar a base.  

