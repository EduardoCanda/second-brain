---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: hibrido
cloud_provider: aws
categoria: balanceamento_carga
---
### **Listeners na AWS: O que são e como funcionam?**  

Na AWS, um **Listener** (ouvinte) é um componente essencial do **Elastic Load Balancer (ELB)** que "escuta" as requisições de entrada em uma **porta específica** e decide como roteá-las com base em **regras configuradas**.  

Ele funciona como um **porteiro inteligente**, verificando:  
🔹 **Qual [[portas|porta]]/protocolo está sendo usado** (ex.: HTTP na porta 80, HTTPS na 443).  
🔹 **Para qual [[Target Groups Load Balancers|Target Group]] o tráfego deve ser enviado** (ex.: servidores web, API, Lambda).  

---

## **Tipos de Listeners na AWS**  
Dependendo do tipo de **Load Balancer**, os listeners suportam diferentes protocolos:  

| Tipo de Load Balancer                   | Protocolos Suportados                          |
| --------------------------------------- | ---------------------------------------------- |
| **[[Application Load Balancer]] (ALB)** | HTTP, HTTPS, HTTP/2, WebSockets                |
| **[[Network Load Balancer]] (NLB)**     | [[introducao-protocolo-tcp\|TCP]], TLS, UDP |
| **Gateway Load Balancer (GWLB)**        | IP (para tráfego de rede)                      |

---

## **Como um Listener Funciona?**  
1. **Recebe uma requisição** (ex.: `https://meusite.com:443`).  
2. **Verifica as regras de roteamento** (ex.: se o caminho é `/api`, envia para o Target Group de backend).  
3. **Encaminha o tráfego** para os targets saudáveis no grupo definido.  

---

## **Principais Configurações de um Listener**  
1. **Porta e Protocolo**  
   - Ex.: Porta `443` ([[protocolo-https|HTTPS]]) ou `80` ([[protocolo-https|HTTP]]).  
1. **Certificado [[protocolo-tls|SSL/TLS]] (para HTTPS)**  
   - Usado para descriptografar o tráfego seguro.  
3. **Default Action (Ação Padrão)**  
   - Define para qual Target Group o tráfego será enviado **se nenhuma regra específica for atendida**.  
4. **Rules (Regras de Roteamento)**  
   - Permite direcionar o tráfego com base em:  
     - **Path** (ex.: `/api` → Target Group da API).  
     - **Hostname** (ex.: `blog.meudominio.com` → Target Group do blog).  
     - **Headers HTTP** (ex.: `User-Agent: Mobile` → Target Group mobile).  

---

## **Exemplo Prático (ALB com HTTPS)**  
1. **Listener na porta 443 (HTTPS)**  
   - Configurado com um certificado SSL (AWS ACM).  
2. **Regra de roteamento:**  
   - Se o caminho for `/api/*` → Encaminha para o **Target Group da API**.  
   - Se for `/app/*` → Encaminha para o **Target Group do frontend**.  
   - Qualquer outra requisição → Vai para o **Target Group padrão (servidor web principal)**.  

---

## **Como Criar um Listener (AWS CLI)**  
```sh
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/1234567890123456 \
  --protocol HTTPS \
  --port 443 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/my-tg/1234567890123456 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

---

## **Resumo: Para que servem os Listeners?**  
✔ **Ouvem requisições** em portas específicas (80, 443, etc.).  
✔ **Aplicam regras** para rotear o tráfego (ex.: `/api` → servidores de backend).  
✔ **Gerenciam SSL/TLS** (se configurados para HTTPS).  
✔ **Trabalham em conjunto com Target Groups** para direcionar o tráfego aos recursos corretos.  

Se precisar de um exemplo mais detalhado ou ajuda com configurações específicas, é só perguntar! 🚀