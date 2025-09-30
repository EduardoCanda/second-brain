# Laboratórios de Rede

Este arquivo contém exercícios práticos para fixar os conceitos de redes e protocolos.

---

## 1. Explorando Endereços e Interfaces

**Comando:**

```bash
ip addr show
```

**Objetivo:**  
Ver todas as interfaces de rede, seus IPs e MACs.

**Conceito relacionado:**  
Camada 2 (MAC) e Camada 3 (IP).

---

## 2. ARP na Prática

**Comando:**

```bash
arp -n
```

**Objetivo:**  
Visualizar a tabela ARP do seu computador.

**Tarefa extra:**  
Fazer um `ping` para outro host e ver como a tabela ARP muda.

---

## 3. Ping e ICMP

**Comando:**

```bash
ping 8.8.8.8
```

**Objetivo:**  
Observar o envio de mensagens ICMP Echo Request e Echo Reply.

**Extra:** Capturar tráfego ICMP com tcpdump:

```bash
sudo tcpdump icmp
```

---

## 4. Traceroute e Roteamento

**Comando:**

```bash
traceroute google.com
```

**Objetivo:**  
Ver o caminho (hops) que os pacotes percorrem até o destino.

**Conceito relacionado:**  
Camada 3, TTL, roteamento.

---

## 5. Testando TCP vs UDP

**Comandos:**

Teste TCP:

```bash
nc -vz google.com 80
```

Teste UDP:

```bash
nc -vzu 8.8.8.8 53
```

**Objetivo:**  
Comparar comportamento de portas TCP e UDP.

**Extra:**  
Testar porta fechada e observar diferenças de resposta.

---

## 6. DNS na Linha de Comando

**Comando:**

```bash
dig google.com
```

**Objetivo:**  
Ver a resolução de nome → IP na prática.

**Extra:** Forçar servidor DNS específico:

```bash
dig @8.8.8.8 google.com
```

---

## 7. HTTP e Cabeçalhos

**Comando:**

```bash
curl -v http://example.com
```

**Objetivo:**  
Inspecionar cabeçalhos HTTP (request/response).

**Extra:**  
Testar `https://` para ver handshake TLS.

---

## 8. SSH vs Telnet

**Comandos:**

SSH:

```bash
ssh usuario@host
```

Telnet (teste divertido):

```bash
telnet towel.blinkenlights.nl
```

**Objetivo:**  
Comparar segurança (SSH criptografado vs Telnet em texto puro).

---

## 9. Captura de Tráfego (Bônus)

**Comando:**

```bash
sudo tcpdump -i any -nn
```

**Objetivo:**  
Capturar pacotes de rede em tempo real.

**Extra:** Filtrar por protocolo:

```bash
sudo tcpdump tcp port 80
```

---

> 💡 **Dica:** Documente o que você observar em cada laboratório para facilitar revisão futura.
