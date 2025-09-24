---
tags:
  - Kubernetes
  - NotaBibliografica
  - Laboratorio
categoria: CD
ferramenta: argocd
---
Para garantir que o **[[introducao-argocd|Argo CD]] consiga acessar repositórios privados no GitHub** (ou outros [[Git]] providers como GitLab, Bitbucket), você precisa configurar credenciais de forma segura. Aqui está um guia completo:

---

### 🔑 **Métodos Recomendados para Acesso a Repositórios Privados**

#### 1. **Usando [[protocolo-ssh|SSH]] Keys (Recomendado para segurança)**
   - **Como funciona**: O Argo CD usa uma chave SSH para autenticar no GitHub.
   - **Passos**:
     1. **Gere uma chave SSH** (se ainda não tiver):
        ```sh
        ssh-keygen -t ed25519 -C "argocd@meu-cluster"
        ```
     2. **Adicione a chave pública ao GitHub**:
        - Acesse `Settings > SSH and GPG keys` no GitHub e cole a chave pública (`~/.ssh/id_ed25519.pub`).
     3. **Configure o Argo CD para usar a chave privada**:
        - Crie um Secret no Kubernetes com a chave privada:
          ```sh
          kubectl create secret generic argocd-github-ssh \
            --namespace argocd \
            --from-file=sshPrivateKey=/path/to/private/key \
            --from-literal=url=git@github.com:usuario/repo.git
          ```
        - Associe o Secret ao repositório no Argo CD:
          ```sh
          argocd repo add git@github.com:usuario/repo.git \
            --ssh-private-key-path /path/to/private/key \
            --insecure-ignore-host-key
          ```

#### 2. **Via Token de Acesso Personalizado (HTTPS)**
   - **Como funciona**: Um token com permissões específicas substitui a senha.
   - **Passos**:
     1. **Crie um token no GitHub**:
        - Acesse `Settings > Developer settings > Personal access tokens`.
        - Escopo mínimo: `repo` (para repositórios privados).
     2. **Armazene o token em um Secret**:
        ```sh
        kubectl create secret generic argocd-github-token \
          --namespace argocd \
          --from-literal=username=seu-usuario \
          --from-literal=password=SEU_TOKEN_GITHUB
        ```
     3. **Adicione o repositório ao Argo CD**:
        ```sh
        argocd repo add https://github.com/usuario/repo.git \
          --username seu-usuario \
          --password SEU_TOKEN_GITHUB
        ```

#### 3. **Usando Secrets Existente (Helm/Manifests)**
   - Se você instalar o Argo CD via Helm, pode pré-configurar repositórios no `values.yaml`:
     ```yaml
     configs:
       repositories:
         private-repo:
           url: https://github.com/usuario/repo.git
           passwordSecret:
             name: argocd-github-token
             key: password
           usernameSecret:
             name: argocd-github-token
             key: username
     ```

---

### 🔒 **Boas Práticas de Segurança**
1. **Restrinja Escopos de Tokens**:
   - No GitHub/GitLab, limite tokens às permissões necessárias (ex: apenas `read:repo`).
2. **Rotação de Credenciais**:
   - Atualize chaves SSH e tokens periodicamente.
3. **Use Namespace Isolation**:
   - Mantenha os Secrets no namespace `argocd` (não use `default`).
4. **Evite Hardcoding**:
   - Nunca armazene credenciais em manifests Git sem criptografia (use ferramentas como **Sealed Secrets** ou **Vault**).

---

### 🛠️ **Solução para Problemas Comuns**
- **Erro "Host key verification failed"** (SSH):
  ```sh
  argocd repo add git@github.com:usuario/repo.git --insecure-ignore-host-key
  ```
- **Token expirado**:
  - Atualize o Secret no Kubernetes e reinicie o `argocd-repo-server`:
    ```sh
    kubectl rollout restart deployment argocd-repo-server -n argocd
    ```

---

### 🌐 **Outros Provedores Git**
- **GitLab**: Use [Deploy Keys](https://docs.gitlab.com/ee/user/project/deploy_keys/) ou [Project Access Tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html).
- **Bitbucket**: Use [App Passwords](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/).

---

### 📌 **Exemplo Prático com Secret (YAML)**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: argocd-github-token
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
type: Opaque
stringData:
  url: https://github.com/usuario/repo.git
  username: seu-usuario
  password: SEU_TOKEN_GITHUB
```

---

### ✅ **Como Verificar se Funcionou?**
1. Acesse a UI do Argo CD ou execute:
   ```sh
   argocd repo list
   ```
2. O repositório deve aparecer com status `Successful`.

---

Com essas configurações, o Argo CD terá acesso seguro aos seus repositórios privados! Se precisar de ajuda com um cenário específico (ex: GitHub Enterprise), posso detalhar ainda mais. 😊