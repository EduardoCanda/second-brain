---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
Claro! O [**Twelve-Factor App**](https://12factor.net/) é uma metodologia para construir **aplicações web modernas e escaláveis**, originalmente criada pelos engenheiros da Heroku. Ele define 12 princípios (ou fatores) que ajudam desenvolvedores a criar **aplicações como serviços (SaaS)** que sejam **portáveis, resilientes, facilmente implantáveis e mantidas em ambientes cloud**.

Vamos aprofundar cada um dos 12 fatores:

---

## 🔧 1. **Codebase**

> Uma base de código rastreada com controle de versão, muitos deploys
> 

### Explicação:

- Uma única base de código por aplicação, armazenada em um sistema de versionamento (ex: Git).
- Pode haver **múltiplas instâncias (deploys)** da mesma codebase (ex: produção, staging, desenvolvimento).

📌 **Anti-pattern:** copiar e colar a mesma aplicação em repositórios diferentes para diferentes ambientes.

---

## ⚙️ 2. **Dependencies**

> Declare e isole dependências
> 

### Explicação:

- A aplicação **não deve depender de bibliotecas ou pacotes instalados no sistema** da máquina.
- Deve declarar explicitamente todas as dependências, geralmente em um manifesto (como `package.json`, `requirements.txt`, `pom.xml`).
- Usar ferramentas para isolar dependências (ex: `venv` em Python, Docker, virtualenvs, etc).

📌 **Objetivo:** evitar o clássico *“funciona na minha máquina”*.

---

## 🌍 3. **Config**

> Armazene configurações no ambiente
> 

### Explicação:

- Configurações que variam entre ambientes (ex: credenciais, URLs de banco) devem ser armazenadas em **variáveis de ambiente**, não no código.
- O código deve ser o mesmo entre todos os ambientes — **o ambiente define o comportamento** via configs.

📌 **Boa prática:** usar `dotenv` ou serviços como AWS Secrets Manager.

---

## 💽 4. **Backing Services**

> Trate serviços externos como recursos anexados
> 

### Explicação:

- Qualquer serviço externo (DB, cache, fila, etc.) deve ser tratado como **um recurso configurável**, acessado por uma URL ou credencial via ambiente.
- A troca de um serviço por outro (ex: Redis local → Redis gerenciado) **não deve exigir mudança de código**.

📌 **Exemplo:** alterar `REDIS_URL` e não alterar o código.

---

## 🏗️ 5. **Build, Release, Run**

> Separe etapas de build, release e execução
> 

### Explicação:

- **Build:** compila o código e prepara um artefato (ex: JAR, container).
- **Release:** junta o artefato com a config do ambiente.
- **Run:** executa o processo final (em staging ou prod).
- **Cada release é imutável e versionada**.

📌 **Vantagem:** rollback seguro e pipelines consistentes.

---

## 📡 6. **Processes**

> Execute a aplicação como um ou mais processos stateless
> 

### Explicação:

- Cada instância da aplicação é um **processo isolado e efêmero**.
- Não armazenar estado no disco ou memória local — tudo que é persistente deve ir para um backing service.

📌 **Exemplo ruim:** salvar arquivos de upload no disco local do pod/container.

---

## 🧼 7. **Port Binding**

> A aplicação se expõe via binding a uma porta
> 

### Explicação:

- A aplicação deve **ser autocontida**, escutando diretamente em uma porta (ex: `:8080`), sem precisar de servidor web externo como Apache ou nginx para rotear internamente.

📌 **Boa prática:** containerizar a aplicação e expor a porta no Dockerfile.

---

## 🧰 8. **Concurrency**

> Escale via processos
> 

### Explicação:

- Aplicações devem escalar por meio de **múltiplos processos**, não aumentando threads internas.
- Diferentes tipos de processos (ex: web, worker, scheduler) devem ser isolados.

📌 **Exemplo:** escalar o worker separadamente do servidor web.

---

## 🧾 9. **Disposability**

> Maximize a robustez com inicialização e desligamento rápidos
> 

### Explicação:

- Os processos devem iniciar rapidamente (ex: segundos) e **encerrar graciosamente** para liberar recursos e evitar perda de dados.
- Fundamental para escalabilidade dinâmica, tolerância a falhas e deploys frequentes.

📌 **Exemplo:** capturar `SIGTERM` para finalizar conexões e salvar estado.

---

## 📁 10. **Dev/Prod Parity**

> Mantenha proximidade entre desenvolvimento, staging e produção
> 

### Explicação:

- Minimizar diferenças entre ambientes (tempo, pessoas, ferramentas).
- O ideal é que os mesmos containers e comandos sejam usados em todos os ambientes.

📌 **Prática comum:** usar Docker + Terraform + IaC para replicar ambientes.

---

## 🕓 11. **Logs**

> Trate logs como fluxos de eventos
> 

### Explicação:

- Aplicações não devem armazenar ou gerenciar logs diretamente.
- Logs devem ser escritos em stdout/stderr e **coletados por ferramentas externas** (ex: CloudWatch, Datadog, ELK).

📌 **Objetivo:** desacoplar geração de logs da análise/armazenamento.

---

## 📅 12. **Admin Processes**

> Execute tarefas administrativas como processos pontuais
> 

### Explicação:

- Tarefas como migrações de banco ou scripts de manutenção devem ser executadas **fora do processo principal**, com os mesmos binários/configuração.

📌 **Exemplo:** `python manage.py migrate` ou `rails db:migrate`.

---

## 🚀 Benefícios de seguir o Twelve-Factor:

- Portabilidade entre ambientes (on-prem, cloud, container).
- Deploy contínuo mais seguro.
- Escalabilidade horizontal facilitada.
- Separação clara de responsabilidades.

