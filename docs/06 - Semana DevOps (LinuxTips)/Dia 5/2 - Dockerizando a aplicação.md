### Entendendo o Dockerfile (Multi-Stage Build)

```dockerfile
# Stage 1: Instalar dependencias (imagem temporaria)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Imagem final (so o necessario)
FROM node:20-alpine AS production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./
COPY public/ ./public/
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1
CMD ["node", "server.js"]
```

**Conceitos importantes:**

- **Multi-stage build:** imagem final nao tem instaladores nem cache
- **Alpine:** imagem base leve (~5MB vs ~1GB do Ubuntu)
- **Non-root user:** nunca rode como root dentro do container!
- **HEALTHCHECK:** Docker sabe se a app esta saudavel

---

### Buildando e Rodando

```bash
# Build da imagem
docker build -t devops-map-brasil:v1 .

# Rodar em background
docker run -d --name devops-map -p 3000:3000 devops-map-brasil:v1

# Testar
curl http://localhost:3000/healthz
curl -X POST http://localhost:3000/api/participante \
  -H "Content-Type: application/json" \
  -d '{"nome":"Jeferson","estado":"SP","cargo":"DevOps"}'
```

A imagem final tem ~180MB (Alpine + Node + App). Compare com `node:20` (>1GB).

---

### Subindo para o Docker Hub

```bash
docker login
docker tag devops-map-brasil:v1 SEU_USER/devops-map-brasil:v1
docker tag devops-map-brasil:v1 SEU_USER/devops-map-brasil:latest
docker push SEU_USER/devops-map-brasil:v1
docker push SEU_USER/devops-map-brasil:latest
```

Troque `SEU_USER` pelo seu usuario do Docker Hub!