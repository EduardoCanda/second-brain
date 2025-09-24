---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
Sim, o **[[introducao-argocd|Argo CD]]** possui recursos nativos para gerenciar repositórios [[Git]] de forma centralizada, permitindo que você configure, atualize e controle acessos diretamente pela UI ou via [[kubernetes]]. Aqui estão os principais métodos:

---

### **1. Configuração via UI do Argo CD**
Acesse:  
**`Settings` > `Repositories` > `Connect Repo`**  
- Insira a **URL do repositório Git** ([[protocolo-https|HTTPS]]/[[protocolo-ssh|SSH]]).  
- Adicione credenciais (usuário/senha, chave SSH, ou token).  
- Para repositórios privados, é necessário configurar **credenciais de acesso**.

---

### **2. Configuração via Kubernetes (Recurso `Repository`)**
O Argo CD cria automaticamente um recurso do tipo [[secret]] no namespace `argocd` para cada repositório adicionado. Você pode gerenciá-los manualmente:

#### **Exemplo: Adicionar um repositório via Manifesto YAML**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-repo
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
stringData:
  url: https://github.com/meu-org/meu-repo.git  # URL do repositório
  type: git  # Tipo (git, helm)
  username: meu-usuario  # Opcional para repositórios privados
  password: meu-token-ou-senha  # Token de acesso ou senha
  # Para SSH:
  sshPrivateKey: |
    -----BEGIN RSA PRIVATE KEY-----
    [sua-chave-privada-ssh]
    -----END RSA PRIVATE KEY-----
```

#### **Comandos Práticos**:
- **Listar repositórios configurados**:
  ```bash
  kubectl get secrets -n argocd -l argocd.argoproj.io/secret-type=repository
  ```
- **Editar um repositório existente**:
  ```bash
  kubectl edit secret meu-repo -n argocd
  ```

---

### **3. Configuração Global via `argocd-cm` [[configmap]]**
Para definir **repositórios padrão** ou **configurações globais** (ex.: certificados TLS para repositórios self-signed), edite o ConfigMap `argocd-cm`:
```bash
kubectl edit configmap argocd-cm -n argocd
```
Adicione:
```yaml
data:
  repositories: |
    - url: https://github.com/meu-org/meu-repo.git
      type: git
      name: meu-repo
```

---

### **4. Autenticação Avançada**
#### **Para repositórios privados**:
- **GitHub/GitLab/Bitbucket**: Use **tokens de acesso pessoal** (mais seguro que senhas).  
- **SSH**: Gere uma chave SSH sem senha e adicione a pública ao repositório.  
- **Repositórios self-signed**: Adicione o certificado CA em `argocd-tls-certs-cm`.

#### **Exemplo com Token do GitHub**:
```yaml
stringData:
  url: https://github.com/meu-org/meu-repo.git
  password: ghp_meutoken  # Token de acesso do GitHub
```

---

### **5. Gerenciamento via CLI (`argocd repo`)**
Comandos úteis:
```bash
# Adicionar repositório
argocd repo add https://github.com/meu-org/meu-repo.git --username meu-usuario --password meu-token

# Listar repositórios
argocd repo list

# Remover repositório
argocd repo rm https://github.com/meu-org/meu-repo.git
```

---

### **6. Boas Práticas**
- **Use Secrets externos**: Integre com **Vault** ou **Sealed Secrets** para credenciais.  
- **Repositórios dedicados para componentes críticos**: Como [[linkerd]], cert-manager, etc.  
- **[[rbac]]**: Restrinja acesso aos repositórios via políticas no Argo CD.

---

### **Comparação: UI vs Kubernetes vs CLI**
| Método          | Vantagens                          | Quando Usar?                     |
|-----------------|-----------------------------------|----------------------------------|
| **UI**          | Amigável para configuração rápida  | Testes ou ambientes pequenos.    |
| **Kubernetes**  | Versionável via Git (GitOps)       | Ambientes escaláveis e auditáveis. |
| **CLI**         | Automatização/scripts              | Pipelines CI/CD.                 |

---

### **Problemas Comuns e Soluções**
1. **Erro de autenticação**:  
   - Verifique se o token/chave SSH está correto.  
   - Para SSH, use `argocd repo add --ssh-private-key-path`.  

2. **Certificado self-signed**:  
   Adicione o CA em `argocd-tls-certs-cm`:  
   ```bash
   kubectl create configmap argocd-tls-certs-cm -n argocd --from-file=ca.crt
   ```

3. **Sincronização falha**:  
   Habilite o log detalhado:  
   ```bash
   argocd app get meu-app --log-level debug
   ```

---

Se precisar de um exemplo completo ou ajuda com um caso específico, é só perguntar! 🚀