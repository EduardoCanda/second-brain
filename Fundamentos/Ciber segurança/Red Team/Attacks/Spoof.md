# 🎭 Spoofing  

**Spoofing** é uma técnica maliciosa usada para **forjar ou falsificar informações de identidade** em comunicação digital.  
O objetivo é enganar sistemas, usuários ou dispositivos, fazendo-os acreditar que a comunicação vem de uma fonte legítima.  

---

## 📌 Tipos de Spoofing

### 🔹 IP Spoofing
- O invasor **forja o endereço IP de origem** de pacotes.  
- Muito usado em ataques **DoS/DDoS**.  
- Exemplo: enviar pacotes fingindo ser de um IP confiável.  

### 🔹 ARP Spoofing (ou ARP Poisoning)
- O invasor envia respostas ARP falsas na rede local.  
- Faz com que dispositivos associem o **endereço MAC errado ao IP correto**.  
- Consequência: tráfego pode ser redirecionado ou interceptado (Man-in-the-Middle).  

### 🔹 DNS Spoofing
- Modificação ou falsificação de registros DNS.  
- Faz usuários acessarem **sites falsos** em vez dos legítimos.  
- Exemplo: digitar `www.banco.com` e ser redirecionado para um clone malicioso.  

### 🔹 Email Spoofing
- Alteração do campo "From" em e-mails para parecer legítimo.  
- Muito usado em **phishing** e **engenharia social**.  
- Exemplo: e-mail fingindo ser do suporte do banco.  

### 🔹 Caller ID Spoofing
- Falsificação do número exibido em chamadas telefônicas.  
- Muito comum em golpes de telefone.  

---

## 🛡️ Como se Proteger
- Usar protocolos seguros (**HTTPS, SSH, DNSSEC**).  
- Configuração de **SPF, DKIM e DMARC** contra email spoofing.  
- Monitoramento de rede para identificar tráfego suspeito.  
- Uso de **firewalls e IDS/IPS**.  
- Segmentação da rede para reduzir impacto de ARP spoofing.  

---

## 🔗 Relacionamentos
- [[Phishing]]  
- [[Man-in-the-Middle (MITM)]]  
- [[Overview]]  
- [[Segurança da Informação]]  