---
tags: []
categoria: versionamento
ferramenta: git
---
No [[Git]], um **branch** (ou "ramo") é um **ponteiro móvel** para um commit específico no histórico do repositório. Ele permite que você desenvolva recursos, corrija bugs ou experimente ideias **isoladamente** do código principal (geralmente o branch `main` ou `master`).  

---

### **Para que servem os branches?**  
1. **Isolar mudanças**: Trabalhar em um novo recurso (`feature`) sem afetar a versão estável.  
2. **Colaboração**: Várias pessoas podem trabalhar em branches diferentes simultaneamente.  
3. **Gerenciamento de versões**: Manter branches para produção (`main`), desenvolvimento (`dev`), hotfixes, etc.  

---

### **Tipos comuns de branches**  
| Nome | Finalidade |  
|------|------------|  
| `main`/`master` | Versão estável/produção. |  
| `dev` | Desenvolvimento contínuo (antes de ir para `main`). |  
| `feature/nome` | Desenvolver um novo recurso (ex.: `feature/login`). |  
| `bugfix/nome` | Correção de bugs. |  
| `release/v1.0` | Preparação para uma nova versão. |  

---

### **Comandos básicos**  
| Comando | Ação |  
|---------|------|  
| `git branch` | Lista todos os branches locais. |  
| `git branch nome` | Cria um novo branch (mas não muda para ele). |  
| `git checkout nome` | Muda para o branch especificado. |  
| `git checkout -b nome` | Cria **e** muda para o novo branch. |  
| `git merge nome` | Mescla o branch `nome` no branch atual. |  
| `git branch -d nome` | Deleta um branch local (se já mesclado). |  
| `git push origin nome` | Envia o branch para o repositório remoto. |  

---

### **Exemplo de fluxo**  
1. Criar um branch para uma nova funcionalidade:  
   ```bash  
   git checkout -b feature/pagamento  
   ```  
2. Fazer commits nesse branch:  
   ```bash  
   git add .  
   git commit -m "Adiciona sistema de pagamento"  
   ```  
3. Voltar para `main` e mesclar as mudanças:  
   ```bash  
   git checkout main  
   git merge feature/pagamento  
   ```  

---

### **Diferença entre Branch e Tag**  
- **Branch**: Ponteiro **móvel** que avança com novos commits (usado para desenvolvimento).  
- **[[Tag]]**: Ponteiro **estático** que marca um commit específico (usado para releases).  

---

### **Branches Remotos vs. Locais**  
- **[[Remotos]]**: Existem no servidor (ex.: `origin/main`).  
- **Locais**: Existem apenas na sua máquina.  

Para sincronizar:  
```bash  
git fetch origin  # Atualiza a lista de branches remotos  
git pull origin main  # Puxa as mudanças do remoto para o local  
```  

Branches são fundamentais para organizar o trabalho no Git! 🌿🚀