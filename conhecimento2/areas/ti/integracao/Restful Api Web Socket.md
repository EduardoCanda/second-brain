---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
---


## 🧠 **Quando usar REST, WebSocket, gRPC, SOAP ou GraphQL?**

A escolha entre esses protocolos e estilos de API deve considerar critérios como:

- Latência e performance
- Bidirecionalidade (realtime)
- Acoplamento entre cliente e servidor
- Versionamento e evolutividade
- Suporte a padrões de mercado (ex: compliance, interoperabilidade)

### ✅ **1. RESTful API**

> Arquitetura baseada em recursos e verbos HTTP. É o estilo mais popular e padronizado.
> 

### 🟢 Use quando:

- Você precisa de uma **API padrão, amplamente compreendida**, fácil de testar com ferramentas como Postman
- Precisa de **baixa curva de aprendizado**
- O sistema é baseado em recursos e CRUD (ex: `/clientes`, `/produtos`)
- Requisições são **independentes (stateless)**
- Comunicação entre **sistemas internos ou externos** sem dependência de linguagem

### 🔴 Evite se:

- Precisa de comunicação em tempo real
- O payload muda com frequência e é muito granular (pode exigir muitos endpoints)
- Precisa otimizar banda ou latência ao extremo

### 🧠 Exemplo:

> API de cadastro de clientes PJ, gerenciamento de contas, etc.
> 

---

### 🔁 **2. WebSocket**

> Protocolo full-duplex para comunicação bidirecional persistente.
> 

### 🟢 Use quando:

- Precisa de **tempo real verdadeiro**, com atualizações push do servidor
- A latência precisa ser mínima
- Casos como **notificações em tempo real, chats, dashboards de trading, sistemas bancários com status de transação ao vivo**

### 🔴 Evite se:

- Precisa de chamadas simples, ocasionais e independentes
- O tráfego for predominantemente unidirecional (ex: cliente → servidor)

### 🧠 Exemplo:

> App bancário que mostra status de aprovação de crédito ou movimentação de conta em tempo real.
> 

---

### ⚡ **3. gRPC (Google Remote Procedure Call)**

> Framework de comunicação baseado em Protobuf, muito eficiente e com suporte a streaming.
> 

### 🟢 Use quando:

- Os sistemas são **internos**, **fortemente tipados** e precisam de **baixa latência**
- Você quer **contratos claros e versionáveis** via `.proto`
- Precisa de comunicação **entre microserviços** de alta performance
- A latência e eficiência de rede são críticas (ex: IoT, mobile com baixa banda)
- Suporte a **streaming (client, server, bidi)**

### 🔴 Evite se:

- Precisa expor API para sistemas legados ou navegadores (não é compatível com browsers diretamente)
- Os consumidores esperam JSON/HTTP padrão

### 🧠 Exemplo:

> Microserviços de risco de crédito, precificação, antifraude, etc., se comunicando via gRPC.
> 

---

### 📦 **4. SOAP (Simple Object Access Protocol)**

> Protocolo formal, baseado em XML, com contratos rígidos (WSDL).
> 

### 🟢 Use quando:

- Está em um **ambiente legado** que exige *compatibilidade com WS- padrões*
- Precisa de recursos como:
    - **Transações distribuídas**
    - **Segurança a nível de mensagem (WS-Security)**
    - **Assinaturas e criptografia no payload**
- Trabalha com **integrações governamentais ou B2B tradicionais**

### 🔴 Evite se:

- Você tem controle sobre os dois lados da aplicação
- Deseja performance e simplicidade

### 🧠 Exemplo:

> Integração com sistemas bancários externos via FEBRABAN ou sistemas governamentais (ex: Receita Federal, eSocial, etc.)
> 

---

### 🔍 **5. GraphQL**

> Linguagem de consulta para APIs onde o cliente define o shape da resposta.
> 

### 🟢 Use quando:

- O cliente precisa de **flexibilidade para escolher quais dados receber**
- Quer **evitar over-fetching ou under-fetching** (problemas comuns em REST)
- As entidades são altamente relacionadas e o front precisa de **queries otimizadas**
- Precisa evoluir a API sem quebrar clientes antigos

### 🔴 Evite se:

- O backend não suporta consultas dinâmicas de forma eficiente (pode gerar N+1)
- O controle de segurança por campo for complexo demais
- Você precisa de controle fino por escopo, cache em CDN, ou monitoramento por endpoint

### 🧠 Exemplo:

> Front-end de plataforma de investimentos PJ onde o cliente seleciona campos customizados para visualizar no dashboard.
> 

---

## 📊 **Resumo comparativo:**

| Critério | REST | WebSocket | gRPC | SOAP | GraphQL |
| --- | --- | --- | --- | --- | --- |
| Comunicação | HTTP | Bidirecional | HTTP/2 | HTTP + XML | HTTP (geralmente) |
| Tempo real | ❌ | ✅ | ✅ (com streaming) | ❌ | ⚠️ (via polling) |
| Formato de dados | JSON | Qualquer (JSON) | Protobuf (binário) | XML | JSON |
| Performance | Média | Alta | **Muito alta** | Baixa | Média |
| Complexidade | Baixa | Média | Alta | Alta | Média |
| Evolutividade | Média | Média | Alta (Protobuf) | Baixa | Alta |
| Navegador-friendly | ✅ | ✅ | ❌ | ⚠️ | ✅ |

---

## ✅ **Conclusão para entrevista**

> “A escolha entre REST, WebSocket, gRPC, SOAP e GraphQL depende muito do contexto. Em geral, REST continua sendo o padrão para integração pública e CRUD. WebSocket é imbatível para tempo real, gRPC para performance entre microserviços, SOAP para ambientes legados com requisitos rigorosos de segurança/transação, e GraphQL quando precisamos de flexibilidade do lado do cliente. Já trabalhei com todos esses formatos, e sempre analiso requisitos funcionais, não funcionais e legado antes de tomar a decisão.”
> 