---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
# **Self-Signed Certificate (Certificado Autoassinado)**

Um **Self-Signed Certificate** (Certificado Autoassinado) é um [[certificado-digital]] **não emitido por uma Autoridade Certificadora (CA)** confiável, mas sim **assinado pela própria entidade** que o criou.

---

## **Características Principais**
✔ **Não requer uma CA externa** (você mesmo é a "autoridade")  
✔ **Gratuito e fácil de gerar** (usando [[openssl]], por exemplo)  
✔ **Útil para testes e ambientes internos**  
❌ **Não é confiável por padrão em navegadores/sistemas**  
❌ **Não deve ser usado em produção pública**  

---

## **Comparação: Self-Signed vs. CA-Assigned**
| **Self-Signed** | **CA-Assigned (Let's Encrypt, DigiCert)** |
|----------------|------------------|
| Criado e assinado por você | Emitido por uma Autoridade Certificadora (CA) pública/privada |
| **Aviso de segurança** no navegador | Reconhecido automaticamente como confiável |
| **Sem custo** | Pode ser gratuito (Let's Encrypt) ou pago (SSL empresarial) |
| **Sem validação de identidade** | CA verifica quem solicitou o certificado |
| Usado em **dev, LAN, IoT** | Usado em **sites públicos, e-commerce** |

---

## **Como Funciona?**
1. Você gera uma **chave privada** (`.key`).
2. Gera um **[[csr]] (Certificate Signing Request)**.
3. **Autoassina** o certificado (sem enviar para uma CA).
4. Instala no servidor (Apache, Nginx, etc.).

---

## **Exemplo de Uso do OpenSSL**
```sh
# Gerar chave privada
openssl genrsa -out meu-site.key 2048

# Gerar CSR (opcional, pode ser direto)
openssl req -new -key meu-site.key -out meu-site.csr

# Autoassinar o certificado (válido por 365 dias)
openssl x509 -req -days 365 -in meu-site.csr -signkey meu-site.key -out meu-site.crt
```
*(Resultado: `meu-site.key` + `meu-site.crt`)*

---

## **Quando Usar?**
✅ **Ambientes de desenvolvimento** (localhost, Docker)  
✅ **Redes internas** (VPN, servidores LAN)  
✅ **Testes de aplicações [[protocolo-https]]**  
✅ **Dispositivos IoT em rede fechada**  

---

## **Riscos e Limitações**
- **Navegadores/externos não confiam** (exibe aviso "Conexão não segura").
- **Sem verificação de identidade** (qualquer um pode criar um certificado falso).
- **Não recomendado para e-commerce, APIs públicas ou sistemas críticos**.

---

## **Como Torná-lo "Confiável"?**
1. **Adicionar manualmente ao armazenamento de certificados** do SO/navegador.
2. **Usar em redes controladas** (ex: intranet corporativa).
3. **Substituir por um certificado de CA confiável** (Let's Encrypt) em produção.

---

### **Resumo**
- **Self-Signed = Certificado caseiro**, sem validação externa.
- **Ótimo para testes**, mas **inseguro para a internet pública**.
- **Fácil de criar**, mas exige configuração adicional para evitar avisos de segurança.