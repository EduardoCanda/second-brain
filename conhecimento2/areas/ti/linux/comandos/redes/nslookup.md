---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O **`nslookup`** é uma ferramenta de linha de comando usada para consultar servidores [[protocolo-dns|DNS]] (Domain Name System) e resolver nomes de domínio em endereços IP (e vice-versa). Ele está disponível em **Windows, Linux e macOS** e é útil para diagnóstico de problemas de rede, verificação de registros DNS e testes de configuração.

---

## **1. Funcionamento Básico**
O `nslookup` envia consultas DNS para servidores especificados (ou usa o servidor DNS padrão do sistema) e retorna:
- **Endereços IP** associados a um domínio (registros **A** para [[protocolo-ipv4|IPv4]] ou **AAAA** para [[protocolo-ipv6|IPv6]]).
- **Registros DNS** específicos (MX, CNAME, TXT, etc.).
- Informações sobre servidores DNS autoritativos.

---

## **2. Modos de Uso**
### **A. Modo Interativo**
Digite `nslookup` sem argumentos para entrar no modo interativo, onde você pode fazer múltiplas consultas:
```bash
nslookup
> google.com
> set type=MX
> google.com
> exit
```

### **B. Modo Direto (Non-Interactive)**
Execute consultas diretamente no terminal:
```bash
nslookup google.com
```

---

## **3. Sintaxe e Opções Comuns**
```bash
nslookup [opções] [nome-do-dominio] [servidor-dns]
```
| **Opção**          | **Descrição**                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `-type=A`          | Consulta registros **A** (IPv4).                                           |
| `-type=AAAA`       | Consulta registros **AAAA** (IPv6).                                        |
| `-type=MX`         | Consulta servidores de e-mail (Mail Exchange).                             |
| `-type=CNAME`      | Consulta aliases (domínios redirecionados).                                |
| `-type=TXT`        | Consulta registros de texto (usados para SPF, DKIM).                      |
| `-type=NS`         | Consulta servidores DNS autoritativos do domínio.                         |
| `-debug`           | Mostra detalhes da consulta (incluindo cabeçalhos DNS).                   |
| `-port=53`         | Especifica uma porta diferente (útil para testes).                        |

---

## **4. Exemplos Práticos**
### **A. Consulta Básica (A ou AAAA)**
```bash
nslookup google.com
```
**Saída**:
```
Server:     8.8.8.8
Address:    8.8.8.8#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.189.46
Name:   google.com
Address: 2607:f8b0:4009:80e::200e
```

### **B. Consultar Registros MX (Servidores de E-mail)**
```bash
nslookup -type=MX google.com
```
**Saída**:
```
google.com mail exchanger = 10 smtp.google.com.
```

### **C. Usar um Servidor DNS Específico**
```bash
nslookup google.com 1.1.1.1  # Usa o DNS da Cloudflare
```

### **D. Consultar Registros TXT (Verificação SPF/DKIM)**
```bash
nslookup -type=TXT google.com
```
**Saída**:
```
google.com text = "v=spf1 include:_spf.google.com ~all"
```

### **E. Encontrar Servidores DNS Autoritativos (NS)**
```bash
nslookup -type=NS google.com
```
**Saída**:
```
google.com nameserver = ns1.google.com.
google.com nameserver = ns2.google.com.
```

---

## **5. Comparação com Outras Ferramentas DNS**
| **Ferramenta**  | **Vantagens**                              | **Limitações**                     |
|----------------|------------------------------------------|-----------------------------------|
| **`nslookup`** | Simples, presente em todos os sistemas.  | Menos detalhes que `dig` (Linux). |
| **`dig`**      | Mais detalhado, opções avançadas.        | Não vem pré-instalado no Windows. |
| **`host`**     | Saída concisa e rápida.                  | Menos flexível que `dig`.         |

---

## **6. Troubleshooting com `nslookup`**
### **Problema: Domínio Não Resolvido**
```bash
nslookup dominio-inexistente.com
```
**Se a resposta for**:
```
*** dominio-inexistente.com can't be found: NXDOMAIN
```
- Significa que o domínio não existe ou não está registrado.

### **Problema: Servidor DNS Não Respondendo**
```bash
nslookup
> server 8.8.8.8  # Testar um DNS alternativo
> google.com
```

---

## **7. Dicas Avançadas**
### **A. Consulta Reversa (IP para Domínio)**
```bash
nslookup 142.250.189.46
```

### **B. Verificar Tempo de Resposta**
Use `time` no Linux/macOS para medir a latência:
```bash
time nslookup google.com
```

### **C. Usar TCP em Vez de UDP**
```bash
nslookup -vc google.com  # Força uso de TCP (útil para consultas grandes)
```

---

## **8. Conclusão**
O `nslookup` é uma ferramenta essencial para:
- Verificar **registros DNS**.
- Diagnosticar problemas de **resolução de nomes**.
- Testar servidores DNS **alternativos**.

Se precisar de **exemplos específicos** (ex: consultas em Windows PowerShel ou scripts automatizados), posso detalhar!