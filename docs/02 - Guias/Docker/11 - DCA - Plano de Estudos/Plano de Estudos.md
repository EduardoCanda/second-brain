# Docker Certified Associate (DCA) — Plano de Estudos

> Plano de 8 semanas baseado na estrutura oficial de domínios da certificação DCA (instalação/configuração, imagens, orquestração, rede, segurança e storage), com foco prático para acelerar retenção.

## 1) Visão geral da prova

- **Formato esperado**: questões de múltipla escolha e cenários práticos/conceituais.
- **Duração alvo de estudo**: **8 semanas**.
- **Carga sugerida**: **7 a 10 horas por semana**.
- **Distribuição sugerida por domínio**:
  - Orquestração (Swarm): **25%**
  - Image Creation, Management and Registry: **20%**
  - Installation and Configuration: **15%**
  - Networking: **15%**
  - Security: **15%**
  - Storage and Volumes: **10%**

---
## 2) Pré-requisitos (Semana 0)

Antes de começar a trilha:

- Linux básico: processos, permissões, systemd, logs, rede.
- CLI: pipes, redirecionamento, `grep`, `awk`, `sed` (nível essencial).
- Conceitos de rede: IP, DNS, portas, bridge, NAT.
- Git e YAML básico.

### Ambiente de laboratório

Monte um ambiente simples para prática contínua:

- 1 máquina principal Linux com Docker Engine.
- (Opcional) 2 VMs extras para laboratório de Swarm.
- Editor + terminal + acesso a Docker Hub/registry privado de testes.

---
## 3) Trilha de 8 semanas

## Semana 1 — Installation & Configuration (parte 1)

**Objetivo:** dominar instalação e componentes do Docker.

- Instalar Docker Engine em Linux.
- Entender arquitetura: daemon, client, containerd, runc.
- Configurar daemon (`daemon.json`).
- Gerenciar lifecycle do serviço Docker com systemd.
- Verificar versões e contexto (`docker version`, `docker info`, `docker context ls`).

**Prática mínima (hands-on):**
- Instalar e validar Docker do zero.
- Alterar configuração do daemon (ex.: log driver) e reiniciar.
- Coletar troubleshooting básico de inicialização.

## Semana 2 — Installation & Configuration (parte 2) + início de Images

**Objetivo:** automação e base de build.

- Storage drivers e logging drivers (visão prática).
- Namespace e cgroups (conceito aplicado).
- Dockerfile: `FROM`, `RUN`, `COPY`, `ADD`, `CMD`, `ENTRYPOINT`, `ENV`, `EXPOSE`.
- Diferença entre imagem e container.

**Prática mínima:**
- Criar 3 imagens: app estático, API simples, imagem com variáveis de ambiente.
- Comparar comportamentos de `CMD` vs `ENTRYPOINT`.

## Semana 3 — Image Creation, Management and Registry

**Objetivo:** build eficiente e distribuição de imagens.

- Camadas e cache de build.
- Multi-stage builds.
- Tagging e versionamento semântico.
- Push/pull em registry.
- Scan básico de vulnerabilidade e hardening inicial.

**Prática mínima:**
- Refatorar Dockerfile para reduzir tamanho da imagem.
- Publicar imagem versionada em registry.
- Criar checklist de imagem “production-ready”.

## Semana 4 — Networking

**Objetivo:** dominar conectividade entre containers e serviços.

- Drivers: bridge, host, overlay, macvlan (conceitual + uso).
- DNS interno do Docker.
- Publicação de portas e exposição interna.
- Conectividade multi-container.
- Troubleshooting de rede (`docker network inspect`, `exec`, testes de porta).

**Prática mínima:**
- Subir stack com frontend + backend + banco em redes separadas.
- Validar comunicação permitida/bloqueada por design de rede.

## Semana 5 — Storage and Volumes

**Objetivo:** persistência e ciclo de vida de dados.

- Tipos de mount: volume, bind mount, tmpfs.
- Backup/restore de volumes.
- Compartilhamento de dados entre containers.
- Noções de drivers de volume.

**Prática mínima:**
- Simular perda de container e recuperação de dados via volume.
- Exportar/importar volume com tar.

## Semana 6 — Security

**Objetivo:** aplicar segurança no runtime e supply chain.

- Least privilege e user namespace.
- Capabilities e `--privileged` (quando evitar).
- Secrets e configs (especialmente em Swarm).
- Assinatura/confiança de imagens (conceitos).
- Boas práticas de Dockerfile seguro.

**Prática mínima:**
- Rodar containers como usuário não-root.
- Remover capabilities desnecessárias.
- Publicar versão hardenizada da imagem.

## Semana 7 — Orchestration (Swarm)

**Objetivo:** administrar cluster e serviços.

- `docker swarm init/join`.
- Managers vs workers.
- Services, tasks, replicas, constraints.
- Rolling update, rollback e healthcheck.
- Networks/volumes no contexto de Swarm.

**Prática mínima:**
- Criar cluster pequeno (3 nós).
- Deploy de serviço replicado com update progressivo.
- Simular falha e rollback.

## Semana 8 — Revisão final + simulados

**Objetivo:** consolidar conhecimento e estratégia de prova.

- Revisão por domínio com foco em lacunas.
- Simulados cronometrados.
- Revisão de comandos críticos.
- Treino de leitura rápida de cenários.

**Prática mínima:**
- 2 simulados completos com análise pós-prova.
- “Caderno de erros” com correções objetivas.

---
## 4) Rotina semanal recomendada

- **Dia 1 (90 min):** teoria orientada ao domínio.
- **Dia 2 (120 min):** laboratório guiado.
- **Dia 3 (90 min):** laboratório livre + troubleshooting.
- **Dia 4 (60 min):** revisão ativa (flashcards/checklist).
- **Dia 5 (60–90 min):** mini simulado + revisão de erros.

---
## 5) Checklist de competências (pronto para prova)

Marque ✅ quando estiver confortável sem consulta:

- [ ] Instalar, configurar e diagnosticar Docker Engine.
- [ ] Criar Dockerfiles eficientes e seguros.
- [ ] Gerenciar imagens, tags e registry.
- [ ] Projetar redes de containers e resolver falhas.
- [ ] Configurar persistência com volumes e backup/restore.
- [ ] Aplicar práticas de segurança de runtime e imagem.
- [ ] Operar Swarm com deploy, scale, update e rollback.
- [ ] Interpretar cenários e escolher comando correto com rapidez.

---
## 6) Estratégia para os últimos 7 dias

- Reduzir conteúdo novo e focar em revisão ativa.
- Revisar comandos mais frequentes por domínio.
- Executar pelo menos 1 lab completo integrando: imagem + rede + volume + segurança + serviço.
- Simular prova em janela de tempo real.
- Dormir bem no dia anterior (impacta muito em desempenho de prova técnica).

---
## 7) Comandos-chave para memorizar

```bash
docker version
docker info
docker system df
docker system prune

docker build -t repo/app:1.0 .
docker images
docker tag
docker push

docker run -d --name app -p 8080:80 app:1.0
docker exec -it app sh
docker logs -f app
docker inspect app

docker volume create dados
docker volume ls
docker volume inspect dados

docker network ls
docker network create minha-rede
docker network inspect minha-rede

docker swarm init
docker node ls
docker service create --name web --replicas 3 nginx
docker service ls
docker service ps web
docker service update --image nginx:stable web
docker service rollback web
```

---
## 8) Como medir evolução

Use uma escala simples semanal (0 a 5) por domínio:

- 0 = não vi ainda
- 1 = conheço termos
- 2 = executo com cola
- 3 = executo sem cola
- 4 = explico e soluciono falhas
- 5 = pronto para questão de cenário

Se algum domínio ficar abaixo de 3 na Semana 6, reajuste a Semana 7 para reforço.
