---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
categoria: balanceamento_carga
---
### **Como Funciona um Network Load Balancer (NLB) na AWS?**  

O **Network Load Balancer (NLB)** é um balanceador de carga de **camada 4 (TCP/UDP/TLS)** projetado para aplicações que exigem **alta performance, baixa latência e escalabilidade extrema**. Ele é ideal para tráfego não-HTTP, como jogos, streaming, APIs TCP e cargas de trabalho em tempo real.  

---

## **🔹 Principais Características do NLB**  

| **Recurso**                                 | **Descrição**                                                                                                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Protocolos Suportados**                   | TCP, UDP, TLS (sem análise de conteúdo HTTP).                                                                           |
| **Altíssima Performance**                   | Capaz de lidar com **milhões de requisições por segundo (RPS)** com latência ultrabaixa.                                |
| **Preservação de IP de Origem**             | Mantém o **IP original do cliente**, útil para firewalls e logs.                                                        |
| **Targets Flexíveis**                       | Pode direcionar tráfego para: instâncias EC2, IPs (inclusive fora da AWS), containers (ECS/EKS) e serviços on-premises. |
| **Zona de Disponibilidade (AZ) Resiliente** | Se uma AZ falhar, o NLB redistribui o tráfego automaticamente.                                                          |
| **Integração com VPC Flow Logs**            | Permite monitorar tráfego de rede para auditoria e segurança.                                                           |

---

## **🔹 Arquitetura do NLB**  

1. **O cliente envia uma requisição** (ex.: conexão TCP na porta 443 para um jogo online).  
2. **O NLB recebe o tráfego** e o encaminha para um **[[Target Groups Load Balancers|Target Group]]** com base na porta e protocolo.  
3. **O Target Group verifica a saúde dos targets** (servidores, containers, etc.).  
4. **O tráfego é roteado** para um target saudável, **mantendo o IP original do cliente**.  

```
Clientes → [ NLB (TCP:443) ] → [ Target Group ] → Servidores (EC2/Containers/IPs)
```

---

## **🔹 Casos de Uso do NLB**  

✔ **Jogos Online ([[protocolo-udp|UDP]]/[[introducao-protocolo-tcp|TCP]])** → Baixa latência para pacotes em tempo real.  
✔ **Streaming de Vídeo/Audio** → Tráfego UDP de alta performance.  
✔ **APIs TCP Personalizadas** → Bancos de dados, serviços IoT, VPNs.  
✔ **Balanceamento de Carga Híbrido** → Direciona tráfego para servidores **dentro e fora da AWS** (on-premises).  
✔ **Aplicações Financeiras** → Alta velocidade para transações em tempo real.  

---

## **🔹 Diferença Entre NLB e [[Application Load Balancer|ALB]]**  

| **Feature**             | **NLB (Layer 4)**                   | **ALB (Layer 7)**        |
| ----------------------- | ----------------------------------- | ------------------------ |
| **Protocolos**          | TCP, UDP, [[protocolo-tls\|TLS]]    | HTTP, HTTPS, HTTP/2      |
| **Análise de Conteúdo** | ❌ (Não lê HTTP/Headers)             | ✅ (Path, Host, Headers)  |
| **Performance**         | **Extremamente Alta** (milhões RPS) | Alta (até ~100k RPS)     |
| **IP do Cliente**       | ✅ (Preservado)                      | ❌ (Usa IP do ALB)        |
| **Use Case**            | Jogos, TCP/UDP, baixa latência      | Aplicações Web/APIs REST |

---

## **🔹 Exemplo de Configuração (AWS CLI)**  

1. **Criar um NLB:**  
   ```sh
   aws elbv2 create-load-balancer \
     --name my-game-nlb \
     --subnets subnet-123456 subnet-789012 \
     --type network \
     --scheme internet-facing
   ```

2. **Criar um Target Group (TCP:80):**  
   ```sh
   aws elbv2 create-target-group \
     --name game-servers \
     --protocol TCP \
     --port 80 \
     --vpc-id vpc-123456 \
     --target-type instance  # Pode ser 'ip' ou 'alb' também
   ```

3. **Criar um Listener (TCP:443):**  
   ```sh
   aws elbv2 create-listener \
     --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/my-game-nlb/50dc6c495c0c9188 \
     --protocol TLS \
     --port 443 \
     --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012 \
     --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/game-servers/1234567890123456
   ```

---

## **🔹 Quando Usar NLB vs ALB?**  

- **Escolha o NLB se:**  
  - Sua aplicação usa **TCP/UDP** (não HTTP).  
  - Precisa de **baixíssima latência** (ex.: jogos, VoIP).  
  - Requer **preservação do IP original do cliente**.  

- **Escolha o ALB se:**  
  - Sua aplicação é **HTTP/HTTPS** (ex.: APIs, sites).  
  - Precisa de **roteamento avançado** (path/host-based).  

---

### **Conclusão**  
O **NLB** é a melhor opção para **cargas de trabalho de rede de alta performance**, enquanto o **ALB** é ideal para aplicações web modernas. Se precisar de um **balanceador híbrido** (HTTP + TCP), a AWS também oferece o **Gateway Load Balancer (GWLB)** para tráfego de segurança (ex.: firewalls).  