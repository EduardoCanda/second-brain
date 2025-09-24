---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
# **CA Root (Root Certificate Authority) - Conceito e Terminologia**

O **CA Root** (ou **Root CA**) é a **Autoridade Certificadora Raiz**, o nível mais alto na hierarquia de [[certificado-digital|certificados digitais]]. Ela é a fonte primária de confiança em uma infraestrutura de chave pública ([[pki]]).

---

## **Diferença Entre CA Root, CA Intermediária e Outros Termos**
| Termo                                  | Significado                           | Função                                                                                         |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **CA Root (Root CA)**                  | Autoridade Certificadora Raiz         | Emite [[certificado-digital\|certificados]] para CAs intermediárias (não para usuários finais) |
| **CA Intermediária (Intermediate CA)** | Subordinada à CA Root                 | Emite certificados para usuários finais (evita expor a CA Root)                                |
| **End-Entity Certificate**             | Certificado do usuário final          | Usado por servidores, clientes ou dispositivos (ex: certificado [[protocolo-tls\|SSL]])        |
| **Self-Signed Certificate**            | Autoassinado (não emitido por uma CA) | Usado em testes ou ambientes internos                                                          |

---

## **Como Funciona a Hierarquia de Confiança?**
1. **CA Root** → Emite certificados apenas para **CAs Intermediárias**.
2. **CA Intermediária** → Emite certificados para **usuários finais** (sites, serviços, dispositivos).
3. **Certificado do Usuário Final** → Usado em aplicações (ex: HTTPS, assinatura digital).

Isso cria uma **cadeia de confiança**:
```
Browser/Cliente → Verifica → Certificado do Site → CA Intermediária → CA Root
```

---

## **Por Que Usar uma CA Root e Não Emitir Diretamente?**
- **Segurança**: Se a CA Root for comprometida, **todos os certificados** ficam inválidos.
- **Flexibilidade**: CAs intermediárias podem ser revogadas sem afetar a raiz.
- **Isolamento**: A CA Root fica offline na maioria dos casos (armazenada em hardware seguro).

---

## **Nomes Alternativos para CA Root**
- **Root Certificate**
- **Trusted Root CA**
- **Root Certification Authority**
- **Raiz de Confiança** (em português)

---

## **Onde a CA Root é Armazenada?**
- **Sistemas Operacionais** (Windows, macOS, Linux têm uma "loja de certificados raiz").
- **Navegadores** (Chrome, Firefox, Safari também mantêm sua própria lista).
- **Dispositivos IoT/Servidores** (precisam ter a CA Root confiável instalada).

---

### **Resumo**
- **CA Root ≠ CA Intermediária ≠ Certificado Final** (são níveis diferentes).
- **A CA Root é a fonte máxima de confiança** em uma PKI.
- **Ela raramente emite certificados diretamente**, usando CAs intermediárias para maior segurança.