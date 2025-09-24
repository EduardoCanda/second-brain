---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
Quando você compra um certificado digital de uma [[autoridade-certificadora|Autoridade Certificadora (CA)]] comercial, você está adquirindo muito mais do que apenas um arquivo. Veja o que você recebe efetivamente:

### **1. O [[certificado-digital]] em Si**
- **Arquivos entregues**:
  - `seu_dominio.crt` (certificado público)
  - `seu_dominio.key` (chave privada - sua responsabilidade proteger)
  - Possivelmente arquivos de cadeia (`ca-bundle.crt` para intermediários)

- **Formato**:
  - Normalmente em PEM (.crt, .pem) ou PKCS#12 (.pfx)
  - Compatível com servidores web (Apache, Nginx), load balancers, etc.

### **2. Validação de Identidade (o principal valor)**
O tipo de validação define o nível de confiança:

| Tipo de Certificado              | Validação Realizada                                                              | Indicado para        |
| -------------------------------- | -------------------------------------------------------------------------------- | -------------------- |
| **DV (Domain Validation)**       | Verifica apenas o controle do domínio (via e-mail/DNS/[[protocolo-https\|HTTP]]) | Blogs, sites simples |
| **OV (Organization Validation)** | Verifica documentos da empresa (CNPJ, contrato social)                           | Empresas, APIs       |
| **EV (Extended Validation)**     | Auditoria rigorosa (endereço físico, telefone, existência legal)                 | Bancos, e-commerce   |

### **3. Suporte Técnico**
- Assistência para instalação
- Reemissão em caso de problemas
- Revogação emergencial (se sua chave privada for comprometida)

### **4. Garantias Financeiras**
- CAs globais oferecem seguros contra falhas de autenticação (ex: até US$ 1.75 milhão no Sectigo OV)
- Proteção contra emissão fraudulenta

### **5. Reconhecimento Universal**
- Pré-instalação nos principais:
  - Navegadores (Chrome, Firefox, Safari)
  - Sistemas operacionais (Windows, Mac, Linux)
  - Dispositivos móveis (iOS, Android)

### **6. Certificados Intermediários**
- Uma cadeia de confiança completa:
  ```
  Seu certificado → CA Intermediária → CA Raiz (já confiável nos dispositivos)
  ```

### **7. Ferramentas Adicionais**
- Geradores de [[csr]]
- Verificadores de instalação
- Alertas de expiração

### **O Que Não Está Incluído**
- **Configuração do servidor** (você precisa instalar)
- **Proteção da chave privada** (sua responsabilidade)
- **Cobertura para ataques** (o certificado só autentica, não previne hacks)

### **Exemplo Prático: Comprando um SSL para um E-commerce**
1. Você escolhe um certificado OV ou EV
2. A CA verifica seu CNPJ e domínio
3. Recebe:
   - Certificado assinado
   - Chave intermediária
   - Instruções de instalação
4. Configura no seu servidor
5. Os clientes veem:
   - Cadeado verde (HTTPS)
   - Selo de segurança (para EV)
   - Detalhes da empresa (em OV/EV)

### **Por Que Pagar se Existem CAs Gratuitas?**
| **CA Paga (DigiCert, Sectigo)** | **CA Gratuita (Let's Encrypt)** |
|---------------------------------|--------------------------------|
| Validação de organização (OV/EV) | Apenas DV |
| Validade 1-3 anos | Validade 90 dias (renovação constante) |
| Suporte prioritário | Suporte via comunidade |
| Garantias financeiras | Sem garantias |
| Aceitação em sistemas legados | Pode ter problemas em dispositivos IoT antigos |

**Dica profissional**: Use Let's Encrypt para testes/DV, mas considere certificados OV/EV pagos para sistemas críticos.