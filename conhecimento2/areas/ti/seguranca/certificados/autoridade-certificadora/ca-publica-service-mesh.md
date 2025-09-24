---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
A utilização de uma **CA ([[autoridade-certificadora]]) externa** em um *service mesh* privado (como o [[linkerd]] em um cluster [[kubernetes]] isolado) pode parecer contra-intuitiva à primeira vista, já que o ambiente é fechado. No entanto, há razões importantes para essa prática, mesmo em contextos restritos:

---

## **1. Padronização com a PKI Corporativa**
- **Integração com sistemas existentes**: Se a organização já tem uma [[pki]] (ex: Microsoft AD CS, HashiCorp Vault, Venafi), usar a mesma CA garante:
  - **Unificação de políticas** (validade de certificados, algoritmos de criptografia).
  - **Auditoria centralizada** (todos os certificados são rastreados em um único lugar).
  - **Revogação simplificada** (uma única [[crl]] ou OCSP para todos os sistemas).

- **Exemplo**: Um *service mesh* em uma rede privada pode precisar se comunicar com:
  - APIs externas (que exigem certificados assinados pela CA corporativa).
  - Bancos de dados ou serviços legados que já usam a PKI existente.

---

## **2. [[introducao-seguranca|Segurança]] e Boas Práticas**
- **Isolamento de responsabilidades**:
  - A CA externa é gerenciada por equipes de segurança especializadas (não pelos desenvolvedores do *service mesh*).
  - Evita que comprometimentos no cluster Kubernets afetem toda a PKI interna.

- **Ciclo de vida robusto de certificados**:
  - CAs externas oferecem recursos avançados como:
    - **Rotatividade automática** (evita certificados expirados).
    - **Validação de identidade** (mesmo em redes privadas, para evitar *spoofing* interno).

---

## **3. Mitigação de Riscos em Caso de Comprometimento**
- **Problema com certificados autoassinados**:
  - Se a CA interna do *service mesh* for comprometida, um invasor pode:
    - Emitir certificados para qualquer serviço (ataques *man-in-the-middle*).
    - Se passar por componentes legítimos da malha.

- **Vantagem da CA externa**:
  - Limita o escopo do ataque (a CA corporativa pode revogar apenas os certificados do *service mesh* sem afetar outros sistemas).
  - Geralmente tem **[[hsm]] (Hardware Security Module)** para proteger chaves raiz.

---

## **4. Conformidade e Governança**
- **Normas como PCI-DSS, HIPAA, LGPD** podem exigir:
  - **Separação de funções** (quem emite certificados ≠ quem opera o cluster).
  - **Registros de emissão** (logs centralizados na CA externa).

- **Exemplo**: Em bancos, mesmo ambientes isolados precisam seguir políticas rígidas de criptografia.

---

## **5. Flexibilidade para Expansão**
- **Cenários futuros** onde o *service mesh* precise se integrar a:
  - Outros clusters Kubernetes (multi-cluster).
  - Serviços *hybrid cloud* (ex: [[AWS]]/Azure com VPN).
  - Sistemas de parceiros (que confiam na CA corporativa).

---

## **Quando Usar uma CA Interna/Autoassinada?**
Ainda há casos onde uma CA interna (autoassinada) é suficiente:
- **Ambientes de desenvolvimento/testes**.
- **Projetos pequenos** sem integração com sistemas corporativos.
- **Redes totalmente isoladas** sem requisitos de compliance.

---

### **Resumo**
| **CA Externa** | **CA Interna/Autoassinada** |
|----------------|-----------------------------|
| Alinhamento com PKI existente | Configuração rápida e simples |
| Melhor governança e conformidade | Risco maior se comprometida |
| Ideal para produção em empresas | Usado em dev/testes ou POCs |

**Conclusão**: Mesmo em redes privadas, uma CA externa traz **padronização, segurança e preparação para cenários futuros**. Para ambientes críticos, o custo adicional de integrar uma PKI corporativa vale a pena.