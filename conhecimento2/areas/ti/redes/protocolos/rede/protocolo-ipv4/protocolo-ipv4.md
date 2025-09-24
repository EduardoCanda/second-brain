---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
# 🧠 Introdução ao Protocolo de Comunicação IPv4

O **IPv4** é um **protocolo da camada de rede** do modelo OSI (camada 3). Sua função principal é **encaminhar pacotes** de dados de um dispositivo origem até um dispositivo destino, **sem garantir entrega confiável**. Ele é um protocolo **orientado a datagrama** e **não-confiável por si só**, o que significa que:

- Ele **não estabelece conexão** antes de enviar os dados
    
- Ele **não garante que os pacotes cheguem**
    
- Ele **não garante a ordem** dos pacotes
    
- Ele **não detecta erros de conteúdo**, só de cabeçalho
    

Essas responsabilidades ficam a cargo de protocolos de camadas superiores, como o **TCP** (Transmissão confiável) ou **UDP** (Transmissão leve e rápida).

# 🔁 Comunicação na prática (caminho de um pacote)

1. **Encapsulamento:** O dado gerado por uma aplicação é passado pelo TCP ou UDP, e então encapsulado no IPv4.
    
2. **Encaminhamento:** O IPv4 decide se o pacote pode ser entregue localmente ou se deve ser roteado.
    
3. **Roteamento:** O pacote é encaminhado por roteadores até alcançar o destino.
    
4. **Desencapsulamento:** O destino extrai os dados do pacote IP e entrega à aplicação.
    

---

# 🧱 Características Técnicas

- **Orientado a datagrama:** Cada pacote é independente, sem contexto anterior.
    
- **Melhor esforço:** Tenta entregar, mas sem garantias.
    
- **Fragmentação suportada:** Pacotes maiores que o MTU podem ser quebrados.
    
- **Sem controle de fluxo ou congestão:** Isso é feito por protocolos da camada de transporte (como TCP).
---

# Principais 
[[estrutura-datagrama-ipv4]]
[[fragmentacao-ipv4]]
[[checksum-ipv4]]

