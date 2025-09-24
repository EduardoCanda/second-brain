---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
## 🌐 **O que é um VPC Endpoint?**

Um **VPC Endpoint** é um recurso da [[AWS]] que permite que você acesse serviços da AWS **de dentro da sua [[VPC]], sem precisar de um [[Internet Gateway (IGW)]], [[NAT Gateway]] ou IP público.**

Ele basicamente cria uma rota privada (dentro da rede da AWS) entre a sua VPC e o serviço AWS.

---

## 📦 **Por que usar?**

✅ Você quer que suas instâncias em subnets privadas acessem serviços como:

- [[S3]]
- DynamoDB
- Secrets Manager
- [[Resumo SNS|SNS]], [[SQS]], etc.

✅ Mas sem:

- Passar pelo gateway da Internet.
- Usar IP público.
- Pagar por tráfego via NAT Gateway.

---

## 🔷 **Tipos de VPC Endpoints**

Existem **dois tipos principais**:

### 1️⃣ **Interface Endpoint**

- É uma **ENI (Elastic Network Interface)** privada dentro da sua VPC.
- Você aponta para ela como destino.
- Usado para **serviços AWS baseados em API (como SSM, Secrets Manager, CloudWatch, etc.)** ou serviços privados.
- Tem um custo fixo por hora e tráfego.

🖇️ Exemplo:  
Você cria um Interface Endpoint para o **Secrets Manager** na VPC e as suas instâncias privadas conseguem acessar as APIs do serviço sem sair para a Internet.

---

### 2️⃣ **Gateway Endpoint**

- Funciona como uma entrada em sua tabela de rotas para destinos específicos.
- É gratuito.
- Atualmente só disponível para:
    
    - **S3**
    - **DynamoDB**

🖇️ Exemplo:  
Você cria um Gateway Endpoint para S3, adiciona à tabela de rotas da sua subnet, e então pode acessar buckets do S3 sem passar pela Internet.

---

## 🖼️ **Resumo: VPC sem endpoint vs. com endpoint**

| |Sem VPC Endpoint|Com VPC Endpoint|
|---|---|---|
|Precisa Internet?|✅ Sim|❌ Não|
|IP público?|✅ Sim ou NAT|❌ Não|
|Custo|Tráfego via NAT pago|Interface: pago; Gateway: grátis|
|Tráfego|Passa por Internet|Permanece na rede AWS|


## 🔷 **Vantagens**

✅ Mais seguro (sem tráfego exposto à Internet).  
✅ Melhora a latência e a disponibilidade.  
✅ Reduz custos de NAT Gateway (em muitos casos).

---

## 🧰 **Exemplo prático:**

- Você tem uma aplicação numa subnet privada que precisa ler arquivos de um bucket S3.
    
- Se você não usar VPC Endpoint → precisa de NAT Gateway para sair para a Internet e acessar o S3.
    
- Com Gateway Endpoint para S3 → tráfego vai direto para o S3, sem sair da AWS.
    

---

Se quiser, posso:  
📐 desenhar um diagrama de fluxo com/sem VPC Endpoint  
📄 ou dar um comando CLI / CloudFormation para criar um VPC Endpoint.

Quer algum desses?