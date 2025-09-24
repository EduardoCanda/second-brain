---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
Na **AWS**, uma **Network ACL (NACL)** é um dos mecanismos de controle de tráfego em **redes VPC**.

## 🌐 **O que é uma Network ACL (NACL)?**

Uma **Network ACL** é uma **lista de regras de controle de acesso para sub-redes dentro de uma VPC**.  
Ela define **quais pacotes de rede podem entrar ou sair de uma [[Subnets|subnet]]**, com base em regras que você define.

Ela funciona como uma espécie de **firewall estateless**, ao nível da **subnet**.

---

## 🔷 **Características principais:**

✅ **Aplica-se à subnet, não à instância**

- Ao contrário dos **[[Security Groups]]**, que são aplicados às instâncias [[EC2]], as NACLs são associadas a subnets.
    
- Todas as instâncias dentro de uma subnet são afetadas pelas regras da NACL.
    

✅ **Stateless**

- Isso significa que você deve criar **regras para entrada e saída separadamente**, mesmo para o mesmo fluxo.
    
    - Exemplo: para permitir SSH (TCP 22), você precisa liberar a entrada _e_ a saída.
        

✅ **Regras com número**

- Cada regra tem um **número de prioridade**, quanto menor o número, maior a prioridade.
    
- As regras são avaliadas em ordem ascendente.
    

✅ **Permitir ou negar**

- Você pode explicitamente **permitir** ou **negar** tráfego.
    
- (Security Groups só permitem, não negam explicitamente.)
    

✅ **Regra implícita**

- Existe uma regra implícita de negação para qualquer tráfego que não corresponda a nenhuma regra explícita.
    

---

## 🔷 **Quando usar NACLs?**

- Quando você precisa de **controle adicional ou mais amplo ao nível da subnet**.
    
- Para criar zonas públicas e privadas dentro da VPC com regras rígidas.
    
- Para bloquear (explicitamente) certos endereços IP ou portas em toda a subnet.
    

---

## 🔷 **Comparação com Security Groups:**

|🔹 **Característica**|**Security Group**|**Network ACL**|
|---|---|---|
|**Nível**|Instância EC2|Subnet|
|**Stateful**|✅ sim|❌ não (stateless)|
|**Permite negar?**|❌ não|✅ sim|
|**Tráfego avaliado**|Somente o que chega à instância|Tudo que entra e sai da subnet|

---

## 🔷 **Exemplo de NACL:**

|Regra #|Tipo|Protocolo|Porta|Origem|Ação|
|---|---|---|---|---|---|
|100|TCP|80|0.0.0.0/0|ALLOW||
|110|TCP|22|203.0.113.0/24|ALLOW||
|120|ALL|ALL|0.0.0.0/0|DENY||

---

Em resumo: **NACLs são listas de controle de tráfego ao nível da subnet, usadas para controlar entrada e saída com regras explícitas de permitir e negar. Elas complementam os Security Groups em uma VPC.**

Se quiser, posso também te mostrar um **diagrama da VPC com NACLs e Security Groups juntos** para entender como eles se combinam. Quer?