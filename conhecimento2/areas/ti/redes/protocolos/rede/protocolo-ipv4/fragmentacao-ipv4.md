---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---

## 🧩 O que é Fragmentação no IPv4?

A **fragmentação** é o processo de **quebrar um pacote IP em partes menores (fragmentos)** para que ele possa ser transmitido por redes com restrições de tamanho — ou seja, com um **MTU (Maximum Transmission Unit)** menor que o tamanho do pacote original.

---

## 📦 Por que ela acontece?

Nem todas as redes aceitam pacotes grandes. Exemplo:

- Um host envia um pacote de 2000 bytes
    
- A próxima rede aceita no máximo 1500 bytes (MTU = 1500)
    
- O roteador divide o pacote em **fragmentos menores** para que ele possa atravessar essa rede
    

---

## 🧠 Onde ela acontece?

- A **fragmentação pode ser feita pelo host de origem** ou por **roteadores intermediários**
    
- A **reconstrução (reassembly)** **sempre acontece no destino final**
    

> **Importante:** no IPv6 a fragmentação só pode ser feita pelo host de origem. No IPv4, roteadores também podem fragmentar.

---

## 🧮 Fragmentação na prática

Vamos simular a fragmentação de um pacote de 4000 bytes em uma rede com MTU de 1500 bytes:

- **Cabeçalho IPv4 tem 20 bytes**
    
- Cada fragmento só pode ter **até 1480 bytes de dados** (1500 - 20)
    

Assim teremos:

|Fragmento|Offset (em bytes)|Tamanho total|Flags (MF)|Dados úteis|
|---|---|---|---|---|
|1|0|1500|1 (mais)|0 a 1479|
|2|1480|1500|1 (mais)|1480 a 2959|
|3|2960|1080|0 (último)|2960 a 3999|

---

## 📑 Campos usados no IPv4 para fragmentação

|Campo|Função|
|---|---|
|**Identification**|Mesmo valor em todos os fragmentos do pacote original|
|**Flags (DF/MF)**|DF = Don't Fragment, MF = More Fragments|
|**Fragment Offset**|Indica a posição do fragmento no pacote original (em unidades de 8 bytes)|

> Exemplo: um offset de `1` significa que o fragmento começa no byte 8 (1 × 8) do pacote original.

---

## 🚫 O que pode dar errado?

- Se algum fragmento se perde, **o pacote todo é descartado**
    
- Reassemblies exigem memória e CPU no destino
    
- Algumas redes bloqueiam fragmentos por segurança
    

---

## 📌 Detalhe legal: DF (Don't Fragment)

O campo **DF = 1** impede que o pacote seja fragmentado. Se um roteador encontrar uma MTU menor e **não puder fragmentar**, ele **descarta o pacote** e retorna uma mensagem ICMP **"Fragmentation Needed"** — isso é usado no **Path MTU Discovery**.

Um outro ponto importante é que a cada fragmentação de dados poderá haver o recalculo do [[checksum-ipv4]] pois haverá alterações no pacote.