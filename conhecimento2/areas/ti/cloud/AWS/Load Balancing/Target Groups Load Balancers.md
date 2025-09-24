---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: balanceamento_carga
---
Na **[[AWS]] (Amazon Web Services)**, **Target Groups (Grupos de Destino)** são um componente fundamental usado principalmente com **Elastic Load Balancing (ELB)** e **Amazon ECS** para direcionar o tráfego de rede aos recursos de backend, como instâncias EC2, contêineres, funções Lambda ou endereços IP.  

---

## **O que são Target Groups na AWS?**  
Um **Target Group** é um conjunto de recursos (chamados de *targets*) que recebem tráfego redirecionado por um:  
- **[[Application Load Balancer]] (ALB)**  
- **[[Network Load Balancer]] (NLB)**  
- **Gateway Load Balancer (GWLB)**  

Cada **Target Group** define:  
✅ **Os targets** (servidores, IPs, Lambdas, etc.) que receberão o tráfego.  
✅ **O protocolo e a porta** usados para comunicação (ex.: HTTP:80, HTTPS:443, TCP:8080).  
✅ **Health Checks** (verificações de saúde) para monitorar a disponibilidade dos targets.  
✅ **Configurações avançadas**, como *Sticky Sessions* (afinidade de sessão) e *Slow Start* (início lento para novos targets).  

---

## **Tipos de Targets Suportados**  
| Tipo de Target                           | Uso Comum                              | Compatível com   |
| ---------------------------------------- | -------------------------------------- | ---------------- |
| **Instâncias EC2**                       | Servidores tradicionais                | ALB, NLB, GWLB   |
| **IPs (Endereços Externos ou Internos)** | Servidores fora da AWS ou em outra VPC | NLB, GWLB        |
| **Funções Lambda**                       | Processamento serverless               | ALB (HTTP/HTTPS) |
| **Contêineres (ECS/EKS/Pods)**           | Aplicações em Docker/Kubernetes        | ALB, NLB         |

---

## **Como Funciona na Prática?**  
1. **Um Load Balancer (ALB/NLB) recebe uma requisição.**  
2. **O *Listener* (ouvinte) do LB verifica a regra de roteamento.**  
   - Ex.: Se a URL for `/api`, encaminha para o *Target Group* de backend.  
3. **O tráfego é distribuído entre os *targets* saudáveis do grupo.**  
4. **Se um target falhar no *Health Check*, o LB para de enviar tráfego até que ele se recupere.**  

---

## **Exemplo de Configuração (AWS CLI)**
```sh
# Cria um Target Group com instâncias EC2 na porta 80
aws elbv2 create-target-group \
  --name my-web-servers \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-123456 \
  --health-check-path /health
```

---

## **Principais Casos de Uso**  
✔ **Balanceamento de Carga** → Distribui tráfego entre múltiplos servidores.  
✔ **Microserviços e ECS/EKS** → Roteamento para contêineres baseado em paths (ex.: `/api`, `/app`).  
✔ **Serverless (Lambda)** → Direciona requisições HTTP para funções sem servidor.  
✔ **High Availability (HA)** → Remove automaticamente targets não saudáveis.  

---

## **Diferença Entre Target Groups e Listeners**  
| **Target Group** | **Listener** |
|-----------------|-------------|
| Define **para onde** o tráfego será enviado (os targets). | Define **como** o tráfego será ouvido (porta/protocolo). |
| Contém instâncias, IPs ou Lambdas. | Configura regras (ex.: "Se for HTTPS:443, vá para o Target Group X"). |

Resumindo:  
🔹 **[[Listeners Load Balancers|Listener]]** = "Ouve" o tráfego em uma porta (ex.: 443 para HTTPS).  
🔹 **[[Target Groups Load Balancers|Target Group]]** = "Para onde" o tráfego será enviado (servidores, Lambdas, etc.).  

Se precisar de exemplos mais detalhados ou configurações específicas, posso ajudar! 🚀