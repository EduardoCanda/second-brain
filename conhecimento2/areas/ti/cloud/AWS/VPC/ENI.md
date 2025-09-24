---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
# 🌐 **O que é uma ENI?**

**ENI** significa **Elastic Network Interface**, ou seja:  
📄 _Interface de rede elástica._

Na AWS, uma **ENI** é simplesmente uma **interface de rede virtual** que você pode anexar a uma instância EC2 ou manter “parada”, para ser usada mais tarde.

É a representação de uma **placa de rede virtual (NIC)** dentro de uma VPC.

---

## 🔷 **O que ela contém?**

Uma ENI é composta por:

- Um **endereço IP privado primário**.
    
- Zero ou mais **endereços IP privados secundários**.
    
- Um ou mais **endereços IPv6** (opcional).
    
- Uma ou mais interfaces MAC.
    
- Um ou mais **Security Groups**.
    
- Uma associação opcional com um **endereço IP elástico (EIP)**.
    
- A subnet onde ela está criada.
    

---

## 🔷 **Por que a ENI é “elástica”?**

Porque você pode:  
✅ Criar uma ENI independente, sem instância.  
✅ Anexar e desanexar de uma EC2 a qualquer momento.  
✅ Mover de uma EC2 para outra dentro da mesma AZ.  
✅ Persistir a interface mesmo que a EC2 seja terminada.

---

## 🖇️ **Usos comuns da ENI:**

✅ Alta disponibilidade:

- Você pode mover a ENI para outra instância EC2 em caso de falha da primeira, mantendo o mesmo IP e Security Group.
    

✅ VPC Endpoint (Interface Endpoint):

- VPC Endpoints de tipo _Interface_ são implementados com uma ou mais ENIs dedicadas.
    

✅ Balanceamento manual:

- Você pode ter várias ENIs em uma instância e “dividir” o tráfego.
    

✅ Appliances virtuais:

- Quando você precisa de múltiplas interfaces para roteamento ou firewall, por exemplo.
    

---

## 🔷 **Restrições:**

- Cada instância EC2 tem um limite no número de ENIs que pode ter, dependendo do tipo da instância (exemplo: t2.micro só permite 2 ENIs).
    
- Uma ENI só pode ser usada dentro da mesma Availability Zone.
    

---

## 🔷 **Resumo rápido:**

📌 **ENI é como uma “placa de rede virtual” independente e móvel na VPC.**

- Pode ser anexada/desanexada de instâncias.
    
- Persistente.
    
- Suporta múltiplos IPs.
    
- Necessária para recursos como VPC Endpoints, Load Balancers, etc.
    

---

Se quiser, posso te mostrar:  
✅ Um comando para criar e anexar uma ENI via AWS CLI.  
✅ Ou desenhar um pequeno diagrama explicando como elas se comportam em failover.

Quer que eu faça isso?