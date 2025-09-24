---
tags: []
categoria: versionamento
ferramenta: git
---
No [[Git]], **remotos** (ou *remote repositories*) são **versões do seu repositório hospedadas em um servidor externo**, como GitHub, GitLab ou Bitbucket. Eles permitem que você compartilhe código, sincronize mudanças com outras pessoas e trabalhe em equipe de forma colaborativa.  

---

### **Para que servem os remotos?**  
1. **Backup**: Seu código fica salvo em um servidor, não apenas localmente.  
2. **Colaboração**: Várias pessoas podem clonar, enviar (*push*) e baixar (*pull*) alterações.  
3. **Deploy**: Muitas plataformas usam remotos para publicar aplicações (ex.: GitHub Pages, CI/CD).  

---

### **Comandos básicos para gerenciar remotos**  

| Comando | O que faz? |  
|---------|------------|  
| `git remote -v` | Lista todos os remotos configurados (mostra URLs de *fetch*/*push*). |  
| `git remote add origin URL` | Adiciona um novo remoto (geralmente chamado de `origin`). |  
| `git remote remove origin` | Remove um remoto. |  
| `git push origin main` | Envia commits locais para o remoto (no branch `main`). |  
| `git pull origin main` | Baixa as mudanças do remoto e mescla localmente. |  
| `git fetch origin` | Atualiza a referência dos branches remotos **sem mesclar**. |  
| `git clone URL` | Baixa um repositório remoto para sua máquina (já configura `origin`). |  

---

### **Exemplo de fluxo com remotos**  
1. **Clonar um repositório existente**:  
   ```bash  
   git clone https://github.com/usuario/repositorio.git  
   ```  
   - Isso automaticamente define o remoto `origin` apontando para o URL.  

2. **Adicionar um remoto manualmente**:  
   ```bash  
   git remote add upstream https://github.com/original/repositorio.git  
   ```  
   - Útil para forks (ex.: sincronizar com o projeto original).  

3. **Enviar alterações para o remoto**:  
   ```bash  
   git push origin main  # Envia o branch `main` para `origin`  
   ```  

4. **Baixar atualizações do remoto**:  
   ```bash  
   git pull origin main  # Puxa e mescla as mudanças  
   ```  

---

### **Branches remotos vs. locais**  
- Um branch remoto (ex.: `origin/main`) é uma **referência** ao estado do branch no servidor.  
- Para trabalhar nele localmente, você precisa criar um *tracking branch*:  
  ```bash  
  git checkout --track origin/develop  # Cria um branch local `develop` rastreando o remoto  
  ```  

---

### **Remotos comuns**  
- `origin`: Nome padrão para o repositório original (ex.: seu fork no GitHub).  
- `upstream`: Usado em forks para referenciar o projeto original.  
- Outros: Equipes podem usar nomes como `production`, `staging`, etc.  

---

### **Diferença entre `git pull` e `git fetch`**  
- `git fetch`: Baixa as mudanças do remoto **mas não mescla** (você decide quando fazer o merge).  
- `git pull`: Faz um `fetch` + `merge` automático.  

Exemplo seguro:  
```bash  
git fetch origin  # Atualiza os dados do remoto  
git diff main origin/main  # Compara as mudanças antes de mesclar  
git merge origin/main  # Mescla manualmente  
```  

---

### **Resumo**  
- **Remotos** são repositórios Git hospedados em servidores (GitHub, GitLab, etc.).  
- `origin` é o nome padrão para o repositório principal.  
- Use `push`, `pull` e `fetch` para sincronizar mudanças.  

Remotos são essenciais para trabalhar com Git em equipe! 🌍🔗