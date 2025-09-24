---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
cloud_provider: aws
---
Define **o nível de abstração** que o provedor oferece:

# IaaS (Infrastructure as a Service)

- **O que é**: Aluguel de infraestrutura virtualizada (servidores, redes, armazenamento).
- **Controle**: Você gerencia OS, middleware, aplicações.
- **Exemplo AWS**: [[EC2]] (máquinas virtuais), [[EBS]] (discos), [[VPC]] (rede).
- **Quando usar**:
    - Migração "lift-and-shift" de aplicações on-premises.
    - Controle total sobre o ambiente.

# PaaS (Platform as a Service)

- **O que é**: Plataforma para desenvolver, executar e gerenciar aplicações sem se preocupar com infraestrutura.
- **Controle**: Você gerencia apenas o código e os dados.
- **Exemplo AWS**: [[Elastic Beanstalk]], [[Lambda Detalhes|Lambda]] (serverless), [[RDS]] (banco de dados gerenciado).
- **Quando usar**:
    - Foco em desenvolvimento rápido.
    - Evitar overhead de gerenciamento de servidores.

# SaaS (Software as a Service)

- **O que é**: Software pronto para uso, acessado via navegador.
- **Controle**: Apenas configurações do usuário final.
- **Exemplo AWS**: **Amazon Chime** (videoconferência), **AWS QuickSight** (BI).
- **Quando usar**:
    - Adoção de ferramentas empresariais sem desenvolvimento customizado.
