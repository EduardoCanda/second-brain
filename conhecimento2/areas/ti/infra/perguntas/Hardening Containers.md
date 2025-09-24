## Quais práticas de hardening você aplicaria em containers rodando em produção?

### ✅ **Resposta completa:**

**Hardening de containers** é fundamental para proteger aplicações em produção contra **exploração de vulnerabilidades, movimentação lateral e escalonamento de privilégios**. Como Staff Engineer, busco aplicar uma abordagem **defense-in-depth**, que envolve **camadas de proteção no build, no runtime e no host**, sempre com foco em automação e visibilidade.

---

### **Minha abordagem cobre 5 camadas principais de proteção:**

---

### **1. Imagens seguras e minimalistas**

- **Uso imagens minimalistas** (ex: `distroless`, `Alpine`, `scratch`) para reduzir a superfície de ataque.
- Evito `latest` e sempre **versiono imagens** com hashes imutáveis (ex: `sha256:`).
- Faço **scans automáticos de vulnerabilidades em tempo de build** com ferramentas como:
    - Trivy, Grype, Snyk, Amazon Inspector.

---

### **2. Build pipelines confiáveis e assinaturas**

- Imagens são construídas em **pipelines controladas (ex: CodeBuild, GitHub Actions)** com validação de dependências.
- Uso **conteinerização reprodutível** e **signing com Notary / Cosign / Sigstore** para garantir a proveniência da imagem.
- Imagens só são permitidas no ambiente produtivo se estiverem **whitelisted** no repositório oficial (ex: Amazon ECR com política restrita).

---

### **3. Configuração de runtime segura**

- Desabilito a execução como root (`USER non-root`) no Dockerfile.
- Defino **capabilities mínimas necessárias** no manifesto (ex: `NET_BIND_SERVICE` se necessário, removo o resto).
- Uso **seccomp, AppArmor ou SELinux** (em EKS via PSPs ou OPA Gatekeeper) para limitar chamadas ao kernel.
- Configuro **read-only file systems**, `no-new-privileges`, e montagens com `tmpfs` quando possível.

---

### **4. Monitoramento, logging e runtime protection**

- Integro **Falco ou Amazon GuardDuty EKS Protection** para detectar comportamento anômalo no container (ex: abertura de shell, escrita em diretórios protegidos).
- Centralizo logs e métricas em CloudWatch, Datadog ou Prometheus + Loki para análise e alertas.
- Uso **rate limiting** e observabilidade para detectar abusos ou exploração em tempo real.

---

### **5. Atualizações e ciclo de vida**

- Imagens são **reconstruídas frequentemente** com dependências atualizadas.
- Automatizo alertas via Snyk ou ECR para reconstruir imagens vulneráveis.
- Workloads são implantados via pipelines com **validação contínua de segurança (DevSecOps)** e **triggers de reimplante por CVE** crítico.

---

### ✅ **Exemplo prático:**

Em um cluster ECS com workloads sensíveis (API de contratos PJ), implementei:

- Imagens `distroless` com escaneamento automático via ECR.
- IAM roles por task no ECS, com escopo mínimo e sem acesso a metadata APIs públicas.
- Hardening com `read-only root filesystem`, `drop all capabilities`, e exec como non-root.
- Monitoramento com CloudWatch + alarmes baseados em comportamento suspeito (ex: spikes de chamadas `exec` dentro de containers).

---

### ✅ Conclusão:

Hardening de containers não é só sobre segurança reativa, mas sim **prevenção ativa e consciente**. Como Staff Engineer, minha função é garantir que **o time entregue com agilidade**, sem abrir mão de **boas práticas que blindam a produção contra falhas humanas e ataques externos.**
