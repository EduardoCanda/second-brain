### O Pipeline

```
┌──────────┐    ┌───────────────┐    ┌─────────────┐
│   Test   │───>│   Build &     │───>│   Deploy     │
│  & Lint  │    │    Push       │    │   no EKS     │
└──────────┘    └───────────────┘    └─────────────┘
```

1. **Test & Lint** roda os testes e verifica o codigo
2. **Build & Push** builda a imagem Docker e sobe pro Docker Hub
3. **Deploy** atualiza a imagem no cluster EKS

---

### Configurando os Secrets

No seu repositorio GitHub, va em **Settings > Secrets and variables > Actions**:

|Secret|Valor|
|---|---|
|`DOCKERHUB_USERNAME`|Seu usuario do Docker Hub|
|`DOCKERHUB_TOKEN`|Token de acesso (nao a senha!)|
|`AWS_ACCESS_KEY_ID`|Chave de acesso AWS|
|`AWS_SECRET_ACCESS_KEY`|Secret da chave AWS|

**NUNCA** coloque credenciais direto no codigo. Use _Secrets_ sempre!

---

### Primeiro Deploy Automatizado

```bash
# Fazer uma alteracao na app
# Edite server.js e mude APP_VERSION para "2.0.0"

# Commit e push
git add .
git commit -m "feat: deploy v2 do Semana DevOps Map"
git push origin main
```

Acompanhe o pipeline na aba **Actions** do repositorio!