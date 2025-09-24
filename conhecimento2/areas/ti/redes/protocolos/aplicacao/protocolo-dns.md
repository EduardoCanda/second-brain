---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O **DNS (Domain Name System)** é um protocolo fundamental da internet que atua como um "catálogo telefônico" digital, traduzindo **nomes de domínio** (como `google.com`) em **endereços IP** (como `142.250.189.46`). Ele opera principalmente na **porta 53** usando os protocolos **UDP** (para consultas rápidas) e **TCP** (para transferências de zona ou respostas longas).

---

## **1. Funções Principais do DNS**
- **Resolução de nomes**: Converte domínios em IPs (e vice-versa).
- **Balanceamento de carga**: Distribui tráfego entre múltiplos servidores (usando múltiplos registros IP para um mesmo domínio).
- **Redirecionamento**: Encaminha domínios para outros endereços (via registros `CNAME` ou `URL`).
- **Autenticação de e-mails**: Combate *spam* com registros `SPF`, `DKIM` e `DMARC`.

---

## **2. Componentes do DNS**
| Componente               | Descrição                                                                 |
|--------------------------|--------------------------------------------------------------------------|
| **Cliente DNS (Stub Resolver)** | Software no dispositivo do usuário (ex: `nslookup`, navegadores).       |
| **Servidor Recursivo (Recursive Resolver)** | Servidor que faz consultas em nome do cliente (ex: DNS do Google `8.8.8.8`). |
| **Servidor de Nomes Raiz (Root Server)** | 13 servidores globais que direcionam para TLDs (`.com`, `.org`).      |
| **Servidor TLD (Top-Level Domain)** | Gerencia extensões como `.com`, `.net` (ex: `verisign.com`).          |
| **Servidor Autoritativo** | Armazena os registros DNS oficiais de um domínio (ex: `ns1.google.com`). |

---

## **3. Como uma Consulta DNS Funciona?**
Quando você digita `google.com` no navegador, ocorre o seguinte processo:

### **Passo a Passo da Consulta DNS**
1. **Consulta Local**:
   - O navegador verifica o **cache DNS local** (no computador) e o **cache do roteador**.
   - Se não encontrar, envia a consulta ao **servidor recursivo** (ex: DNS do provedor de internet).

2. **Consulta ao Servidor Recursivo**:
   - Se o servidor recursivo não tiver o registro em cache, ele consulta a **hierarquia DNS**:
     1. **Servidor Raiz**: Indica qual servidor TLD gerencia `.com`.
     2. **Servidor TLD (.com)**: Indica o servidor autoritativo de `google.com`.
     3. **Servidor Autoritativo**: Retorna o IP correto (ex: `142.250.189.46`).

3. **Resposta ao Cliente**:
   - O servidor recursivo envia o IP ao cliente e armazena a resposta em **cache** (TTL define por quanto tempo).

### **Exemplo Prático com Comandos**
```sh
# Consulta DNS usando dig (Linux/macOS)
dig google.com

# Saída simplificada:
;; ANSWER SECTION:
google.com.      300    IN    A    142.250.189.46
```
- `300` é o **TTL (Time-To-Live)** em segundos (5 minutos).

---

## **4. Tipos de Registros DNS**
Cada domínio tem registros que definem seu comportamento:

| Registro  | Função                                                                 | Exemplo                                |
|-----------|-----------------------------------------------------------------------|----------------------------------------|
| **A**     | Mapeia domínio para IPv4.                                             | `google.com → 142.250.189.46`          |
| **AAAA**  | Mapeia domínio para IPv6.                                             | `google.com → 2607:f8b0:4009:80e::200e`|
| **CNAME** | Aponta um domínio para outro (alias).                                 | `www.google.com → google.com`          |
| **MX**    | Define servidores de e-mail.                                          | `google.com → mail.google.com`         |
| **TXT**   | Armazena informações textuais (ex: SPF, DKIM).                        | `"v=spf1 include:_spf.google.com ~all"`|
| **NS**    | Indica os servidores DNS autoritativos do domínio.                    | `google.com → ns1.google.com`          |

---

## **5. Consultas DNS: Recursivas vs. Iterativas**
- **Consulta Recursiva**:  
  O servidor recursivo (ex: `8.8.8.8`) assume a tarefa de buscar a resposta completa para o cliente.
  
- **Consulta Iterativa**:  
  O servidor responde com uma referência (ex: "consulte o servidor TLD .com") e o cliente repete a consulta.

---

## **6. Vulnerabilidades e Mitigações**
### **Ataques Comuns**
1. **DNS Spoofing/Poisoning**:  
   - Um atacante envia respostas falsas para redirecionar tráfego.  
   - **Defesa**: Usar **DNSSEC** (validação criptográfica de respostas).

2. **DDoS a Servidores DNS**:  
   - Sobrecarrega servidores DNS para derrubar sites.  
   - **Defesa**: Usar **anycast** e filtros de tráfego.

3. **Cache Snooping**:  
   - Explorar cache DNS para descobrir sites acessados.  
   - **Defesa**: Configurar **DNS sobre HTTPS (DoH)** ou **DNS sobre TLS (DoT)**.

### **Tecnologias de Segurança**
- **DNSSEC**: Assina digitalmente registros DNS para evitar falsificação.
- **DoH/DoT**: Criptografa consultas DNS para evitar espionagem.

---

## **7. DNS Público vs. DNS Privado**
- **DNS Público** (ex: Google DNS `8.8.8.8`, Cloudflare `1.1.1.1`):  
  Resolve domínios da internet.
  
- **DNS Privado** (ex: Active Directory, Bind):  
  Gerencia domínios internos (ex: `empresa.local`).

---

## **8. Ferramentas para Análise DNS**
| Ferramenta      | Uso                                                                 |
|-----------------|--------------------------------------------------------------------|
| **dig**         | Consulta detalhada de registros DNS (Linux/macOS).                 |
| **nslookup**    | Consulta DNS básica (Windows/Linux).                               |
| **whois**       | Mostra informações de registro do domínio.                         |
| **Wireshark**   | Analisa pacotes DNS em tempo real.                                 |

**Exemplo com `nslookup`**:
```sh
nslookup google.com
```

---

## **9. Conclusão**
O DNS é a espinha dorsal da internet, permitindo que humanos usem nomes amigáveis em vez de IPs numéricos. Embora eficiente, requer configurações seguras (como **DNSSEC** e **DoH**) para evitar ataques. 

Se quiser explorar **configurações avançadas de servidores DNS** (ex: Bind, PowerDNS) ou **depuração de problemas**, posso detalhar ainda mais!