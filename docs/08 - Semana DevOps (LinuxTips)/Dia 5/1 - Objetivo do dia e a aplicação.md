## Objetivo do Dia

Construir, containerizar, deployar e automatizar uma aplicacao web completa, do `git push` ao Load Balancer publico na AWS.

Voce sobreviveu a semana inteira. Linux, Terraform, Containers, Kubernetes, Cloud, CI/CD, tudo foi estudado de forma isolada, como pecas de um quebra-cabeca. Hoje **acabou a teoria**. Nos vamos montar o Transformer.

---

### O que vamos usar

|Ferramenta|Para que|
|---|---|
|**Node.js**|Aplicacao backend (API)|
|**Docker**|Empacotar a aplicacao|
|**EKS (eksctl)**|Cluster Kubernetes na AWS|
|**kubectl**|Gerenciar o cluster|
|**GitHub Actions**|Pipeline CI/CD automatizada|
|**Docker Hub**|Registro de imagens|

---

### A Aplicacao: Semana DevOps Map

Uma app interativa onde cada participante se cadastra com **Nome**, **Localizacao** e **Cargo/Area**. A app mostra em tempo real:

- **Mapa interativo** com pontos nos estados/paises dos participantes
- **Painel de estatisticas** (total, distribuicao por cargo)
- **Feed ao vivo** mostrando quem acabou de se cadastrar
- **Nome do Pod** que serviu cada requisicao (pra provar o balanceamento de carga!)

### Estrutura do Projeto

```
dia5/
├── app/                          # Aplicacao
│   ├── server.js                 # Backend Express (API REST)
│   ├── Dockerfile                # Container (multi-stage build)
│   └── public/                   # Frontend interativo
├── k8s/                          # Manifestos Kubernetes
│   ├── namespace.yaml
│   ├── deployment.yaml           # 3 replicas, probes, resource limits
│   ├── service.yaml              # LoadBalancer
│   └── hpa.yaml                  # Auto-scaling (3 a 10 pods)
├── eks/
│   └── cluster.yaml              # Configuracao do cluster EKS
└── .github/workflows/
    └── ci.yaml                   # Pipeline CI/CD
```

### As Rotas da API

|Metodo|Rota|O que faz|
|---|---|---|
|`GET`|`/`|Serve o frontend (HTML)|
|`GET`|`/healthz`|Health check (usado pelo K8s)|
|`POST`|`/api/participante`|Cadastra um participante|
|`GET`|`/api/participantes`|Lista todos|
|`GET`|`/api/stats`|Estatisticas agregadas|
|`GET`|`/api/info`|Info do app (versao, pod, uptime)|