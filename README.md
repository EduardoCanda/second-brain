# Second Brain de Fundamentos de Computação

Este repositório é uma base pessoal de estudos em português, organizada como um **second brain** para revisão rápida de conteúdos essenciais de TI.

A ideia é concentrar anotações práticas e teóricas sobre redes, sistemas operacionais, segurança, banco de dados, DevOps, observabilidade e temas correlatos.

---

## Visão geral do repositório

- **Formato do conteúdo:** arquivos Markdown (`.md`) com resumos, listas, conceitos e laboratórios.
- **Escopo atual:** `139` notas Markdown dentro de `Fundamentos/`.
- **Arquivo de apoio no nível raiz:** `Tópicos para estudar.md`.

---

## Estrutura atual (atualizada)

```text
.
├── Fundamentos/
│   ├── Banco de dados/                 # SQL, SGBD, tipos de bancos
│   ├── Ciber segurança/                # Criptografia, OSINT, Red Team, Blue Team
│   ├── Hardware/
│   ├── IA/
│   ├── Infraestrutura e DevOps/        # Trilha de Docker (fundamentos a troubleshooting)
│   ├── Linhas de comando/              # Bash, Zsh e utilitários
│   ├── Literatura para evoluir como DEV.md
│   ├── Observability/                  # Prometheus e OpenTelemetry
│   ├── Programação/
│   ├── Redes/                          # Introdução, OSI, LAN, protocolos, serviços, segurança, labs
│   └── Sistemas operacionais/          # Linux, Windows (incl. AD), MacOS e iOS
├── Tópicos para estudar.md
└── README.md
```

---

## Mapa de estudos por área

### Redes
Conteúdos de base e progressão prática:
- Introdução a redes
- Modelo OSI e TCP/IP
- LAN (ARP, Ethernet, Switch, Router, topologias)
- Protocolos (IP, TCP, UDP, ICMP)
- Serviços de rede (DNS, DHCP, NAT, Proxy, WAF, CDN, Load Balancer, HTTP)
- Segurança (SSH, SSL/TLS, VPN, firewall)
- Laboratórios e patterns (ex.: Service Mesh)

📁 `Fundamentos/Redes/`

### Sistemas operacionais
- Linux (filesystem, usuários/permissões, processos, boot, systemd, logs, networking, storage)
- Windows (CLI, Active Directory)
- MacOS e iOS

📁 `Fundamentos/Sistemas operacionais/`

### Ciber segurança
- Criptografia (overview, simétrica, assimétrica)
- OSINT
- Red Team (vetores de ataque como XSS, SQLi, phishing, spoofing, Wi-Fi)
- Blue Team (SOC, DFIR, Threat Intelligence, Malware Analysis)

📁 `Fundamentos/Ciber segurança/`

### Infraestrutura e DevOps
Trilha de Docker abrangendo:
- Fundamentos
- Imagens e containers
- Volumes e networking
- Compose e sidecar
- Segurança
- Registry
- Swarm
- Troubleshooting e revisão (DCA)

📁 `Fundamentos/Infraestrutura e DevOps/Docker/`

### Banco de dados
- Fundamentos e visão geral
- SQL (DDL, CRUD, clauses, operators, functions)
- Tipos de bancos (relacional e não relacional)

📁 `Fundamentos/Banco de dados/`

### Observability
- Introdução a Prometheus
- OpenTelemetry
- Labs com Spring Boot e guia completo

📁 `Fundamentos/Observability/`

### Outras áreas
- Linhas de comando (`Bash`, `Zsh`, utilitários)
- Hardware
- Programação
- IA
- Literatura recomendada

📁 `Fundamentos/`

---

## Como navegar

1. Comece por uma pasta de domínio em `Fundamentos/`.
2. Siga os arquivos `00 - Overview` ou `00 - Introdução` quando houver.
3. Avance para os tópicos numerados para progressão didática.
4. Use os arquivos de laboratórios para prática.

---

## Objetivo deste repositório

- Consolidar aprendizado técnico em uma base única.
- Servir como material de revisão para entrevistas e estudos contínuos.
- Manter trilhas de estudo evolutivas e organizadas por tema.

---

## Próximas melhorias sugeridas

- Adicionar um índice navegável por links para cada área.
- Padronizar todos os arquivos com seções fixas (conceito, prática, referências).
- Criar trilhas recomendadas por nível (iniciante, intermediário, avançado).

---

## Publicação automática no GitHub Pages

Este repositório já está preparado para publicar as notas em um site com **MkDocs** e atualizar automaticamente a cada `push` na branch `main`.

Arquivos adicionados:
- `mkdocs.yml`
- `.github/workflows/deploy-pages.yml`

### Passos para ativar no GitHub

1. Defina o repositório remoto no `mkdocs.yml`:
   - `site_url`
   - `repo_url`
2. Faça push da branch `main` com esses arquivos.
3. No GitHub, abra **Settings → Pages** e defina **Source: GitHub Actions**.
4. Garanta que a branch padrão usada para edição seja `main`.

Depois disso, cada nova nota adicionada no repositório será publicada automaticamente no GitHub Pages após o workflow rodar.
