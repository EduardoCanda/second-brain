---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O cálculo de **Checksum** no IPv4 é um dos mecanismos usados para garantir a **integridade dos dados** no cabeçalho IP. Vamos entender isso em detalhes:

---

## ✅ **O que é o Checksum?**

O **checksum** é um valor calculado a partir dos dados do cabeçalho IPv4. Ele é usado para detectar **erros de transmissão** — se algum bit for alterado acidentalmente no caminho, o checksum no destino não vai bater com o valor original, indicando corrupção.

---

## 📏 **Como o cálculo é feito?**

O cálculo do checksum IPv4 segue os seguintes passos:

1. **Dividir o cabeçalho em blocos de 16 bits** (2 bytes).
    
2. **Somar todos os blocos** em binário, utilizando **complemento de 1** (1's complement).
    
3. Se houver **overflow**, ele é somado de volta (carried around).
    
4. **Inverter os bits** (complemento de 1 do valor final).
    
5. O resultado é o checksum.
    

---

## ✏️ **Exemplo Prático**

### 🔹 Cabeçalho em Hexadecimal (8 blocos de 16 bits para simplificar):

`4500 0034 1c46 4000 4011 b861 c0a8 0001`

- Cada bloco de 16 bits:
    
    - `4500`
    - `0034`
    - `1c46`
    - `4000`
    - `4011`
    - `b861`
    - `c0a8`
    - `0001`

---

### 🔹 Passo 1: Somar os blocos (em hexadecimal)

`4500 + 0034 + 1c46 + 4000 + 4011 + b861 + c0a8 + 0001 = 2e1eb`

---

### 🔹 Passo 2: Se houver overflow, somar novamente

O resultado foi `2e1eb`, que tem mais de 16 bits. Precisamos somar o overflow:

- O valor binário é: `00101110000111101011`
    
- Os primeiros 4 bits excedem 16 bits, então somamos:
    

`2 + e1eb = e1ed`

---

### 🔹 Passo 3: Complemento de 1 (inverter bits)

O complemento de 1 de `e1ed`:


`FFFF (16 bits) - E1ED = 1E12`

Portanto, o **checksum calculado** para esse cabeçalho é: **1E12** (em hexadecimal).

---

## 🔍 **Validação no Destino**

Quando o pacote chega no destino:

1. Os campos do cabeçalho (incluindo o checksum) são somados novamente.
    
2. Se o resultado for **FFFF (0xFFFF)**, significa que o cabeçalho está íntegro.
    
3. Qualquer valor diferente indica que houve um erro.
    

---

## 🚩 **Curiosidades e Limitações**

- O checksum é **recalculado a cada roteador** que altera campos do cabeçalho (como o TTL).
    
- Ele só verifica o cabeçalho, **não os dados (payload)**. Para isso, o TCP e o UDP fazem seus próprios checksums.
    
- No IPv6, o checksum foi removido do cabeçalho IP para otimização.

# Exercicios de exemplo

## **Exercicio 1**

**Cabeçalho:** 4500+003c+1c46+4000+4011+0000+c0a8+0001+c0a8+00c7

**Checksum Overflow:** 263AB
**Checksum total:** 63AD
**Checksum Bin:** 0110 0011 1010 1101
**Check Sum Bin Invertido:** 1001 1100 0101 0010
**Checksum Final:** 9C52
**Verificação:** 9C52 + 63AD = FFFF

## **Exercicio 2**

**Cabeçalho:** 4500+0028+6d58+0000+8011+0000+ac10+0a63+ac10+0a0c

**Checksum Overflow:** 28F20
**Checksum Total:** 8F22
**Checksum Bin:** 1000 1111 0010 0010
**Check Sum Bin Invertido:** 0111 0000 1101 1101
**Checksum Final:** 70DD
**Verificação:** 70DD+ 8F22 = FFFF

## **Exercicio 3**

**Cabeçalho:** 4500+0073+0000+4000+4011+0000+8c7c+19ac+8c7c+19af

**Checksum Overflow:** 211D7
**Checksum Total:** 11D9
**Checksum Bin:** 0001 0001 1101 1001
**Check Sum Bin Invertido:** 1110 1110 0010 0110
**Checksum Final:** EE26
**Verificação:** EE26 + 11D9 = FFFF

   
 


