---
tags:
  - Segurança
  - Fundamentos
  - NotaBibliografica
---
## 🔐 **Como garantir a segurança de uma aplicação?**

Garantir segurança não é algo que se faz só no final — é um processo **contínuo e multifásico**. Algumas práticas fundamentais:

---

### ✅ 1. **Segurança desde o desenvolvimento (Shift-Left Security)**

- Adotar **princípios de Secure by Design**: segurança desde a arquitetura
- Validar e sanitizar **toda entrada de dados externa**
- Proteger **dados sensíveis** (ex: criptografia em trânsito e em repouso)
- Implementar autenticação forte e **[[autenticacao-autorizacao|autorização]] baseada em escopo e contexto**

---

### ✅ 2. **Integração de segurança no CI/CD (DevSecOps)**

- Pipelines com *checkpoints* de segurança:
    - Análise de código (SAST)
    - Escaneamento de dependências (SCA)
    - Testes dinâmicos (DAST)
- Reprovação automática de builds que violem políticas críticas
- Uso de ferramentas como **Trivy**, **Grype**, ou **OWASP Dependency-Check**

---

### ✅ 3. **Gestão de segredos e identidade**

- Sem secrets hardcoded — usar:
    - **AWS Secrets Manager**
    - **SSM Parameter Store**
- Aplicar **[[IAM]] de menor privilégio**
- Tokens com curta duração (OAuth 2.0, STS)

---

### ✅ 4. **Monitoramento e resposta a incidentes**

- Logs auditáveis (CloudTrail, ELK, Splunk)
- Integração com **SIEMs**
- Alertas sobre comportamento anômalo (ex: GuardDuty, AWS Config)

---

## 🧪 **O que é SAST (Static Application Security Testing)?**

SAST é uma abordagem de **análise de segurança em código-fonte**, realizada **sem executar a aplicação**.

---

### 🎯 O que ele faz:

- Varre o código-fonte, bytecode ou binário em busca de **vulnerabilidades conhecidas ou padrões perigosos**, como:
    - SQL Injection
    - XSS
    - Hardcoded passwords
    - Uso inseguro de APIs
- Pode ser executado **localmente, no CI/CD, ou como um serviço na nuvem**
- Oferece sugestões e classificação por severidade (crítico, alto, médio, baixo)

---

### ✅ Vantagens do SAST:

- Detecta vulnerabilidades **ainda na fase de desenvolvimento**
- Ajuda a educar o time dev sobre boas práticas
- Gera **baseline de segurança** do código
- Permite correções mais baratas e rápidas (quanto antes, melhor)

---

## 🛠️ **Ferramentas SAST populares: Fortify, Veracode, Checkmarx**

### 🧰 **Fortify (Micro Focus)**

- Uma das ferramentas mais consolidadas no mercado
- Pode analisar código-fonte, bytecode, binários
- Alta integração com IDEs e pipelines
- Tem versões on-premises e SaaS
- Muito usada em instituições financeiras e ambientes regulados

### 🧰 **Veracode**

- Foco em **SaaS** e em ser **developer-friendly**
- Não requer acesso ao código-fonte em si (pode usar binário)
- Alta automação para DevSecOps
- Oferece SAST, DAST e SCA em um só ecossistema
- Útil em ambientes CI/CD e pipelines rápidos

### 🧰 **Checkmarx**

- Muito focado em SAST puro, com grande suporte a linguagens modernas (Go, Kotlin, TypeScript etc.)
- Possui alta capacidade de customização e tuning
- Bom para empresas que querem manter tudo on-premises
- Permite análises contextuais com foco em segurança real (não só falsos positivos)

---

## ✅ Conclusão para entrevista

> “Para garantir a segurança de uma aplicação, aplico práticas desde o design até a operação. No desenvolvimento, integro SAST como uma etapa obrigatória do pipeline CI/CD, usando ferramentas como Fortify, Veracode ou Checkmarx, conforme o contexto do projeto. Essas ferramentas analisam o código em repouso e ajudam a identificar vulnerabilidades logo no início, reduzindo riscos operacionais e de compliance. Além disso, combino isso com gestão segura de segredos, uso de IAM com menor privilégio, e monitoramento contínuo com alertas em tempo real. Em sistemas bancários, essa abordagem ajuda a manter a robustez exigida pelo negócio e pelas regulações do setor.”
