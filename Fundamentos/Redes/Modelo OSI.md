O modelo OSI é um **padrão conceitual** que divide a comunicação em **7 camadas**, cada uma com uma função específica.  
Ele ajuda a entender **como os dados são transmitidos de um computador para outro** em uma rede.

Pense nele como uma pilha, onde cada camada **adiciona ou interpreta informações** antes de entregar para a próxima.

---

# 📚 As 7 Camadas do Modelo OSI

|Camada|Nome|Função|Exemplos|
|---|---|---|---|
|**7**|**Aplicação**|Interface com o usuário e aplicações.|HTTP, HTTPS, FTP, SMTP, DNS|
|**6**|**Apresentação**|Formata os dados para aplicação, criptografa e comprime.|SSL/TLS, JPEG, MP3, UTF-8|
|**5**|**Sessão**|Estabelece, gerencia e termina sessões de comunicação.|RPC, NetBIOS, Controle de sessão TLS|
|**4**|**Transporte**|Garante entrega confiável, ordenada e sem duplicatas.|TCP, UDP|
|**3**|**Rede**|Define endereçamento e roteamento de pacotes.|IP, ICMP, OSPF, BGP|
|**2**|**Enlace de Dados**|Detecta e corrige erros de transmissão na rede local.|Ethernet, Wi-Fi (802.11), PPP|
|**1**|**Física**|Transmite bits em forma de sinais elétricos/ópticos/radiofrequência.|Cabos, Fibra, Rádio, Repetidores|
# 🔎 Explicação Camada a Camada

### 1️⃣ Física

- **O que faz:** Transporta bits (0s e 1s) no meio físico.
    
- **Exemplo prático:** Cabo de rede enviando sinais elétricos.
    
- **Problemas comuns:** Conector mal encaixado, cabo quebrado.
    

---

### 2️⃣ Enlace de Dados

- **O que faz:** Agrupa bits em **quadros (frames)**, detecta erros simples e garante que o quadro chegue ao destino certo na mesma rede.
    
- **Exemplo prático:** Placa de rede (MAC Address).
    
- **Protocolos:** Ethernet, Wi-Fi, ARP.
    

---

### 3️⃣ Rede

- **O que faz:** Decide para onde os pacotes devem ir, mesmo que seja para outra rede.
    
- **Exemplo prático:** Endereços IP e roteadores.
    
- **Protocolos:** IPv4, IPv6, ICMP, OSPF.
    

---

### 4️⃣ Transporte

- **O que faz:** Garante que os dados cheguem **completos e na ordem certa** (ou envia de forma rápida sem garantia, se for UDP).
    
- **Exemplo prático:** Conexão TCP que você usa para abrir sites.
    
- **Protocolos:** TCP (confiável), UDP (rápido, sem garantia).
    

---

### 5️⃣ Sessão

- **O que faz:** Cria e gerencia sessões de comunicação (diálogo) entre duas máquinas.
    
- **Exemplo prático:** Sessão TLS que mantém você logado no site.
    
- **Protocolos:** NetBIOS, RPC.
    

---

### 6️⃣ Apresentação

- **O que faz:** Converte o formato dos dados para algo que o app entenda, criptografa e/ou comprime.
    
- **Exemplo prático:** Um vídeo é convertido para H.264 antes de ser enviado.
    
- **Protocolos:** TLS (para criptografia), JPEG, PNG.
    

---

### 7️⃣ Aplicação

- **O que faz:** É a camada visível para o usuário, onde os programas usam a rede.
    
- **Exemplo prático:** Browser acessando HTTP/HTTPS, envio de e-mails via SMTP.
    
- **Protocolos:** HTTP, HTTPS, DNS, FTP.