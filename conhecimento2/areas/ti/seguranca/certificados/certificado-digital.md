---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
## O que é um Certificado Digital?

Um certificado digital é um arquivo eletrônico que associa uma identidade (pessoa, empresa, dispositivo) a uma chave pública, funcionando como uma "carteira de identidade digital". Ele é usado para autenticação, criptografia e assinatura digital.

## Componentes Principais

### CA ([[autoridade-certificadora|Certificate Authority]])
- **Autoridade Certificadora**: entidade confiável que emite e gerencia certificados digitais
- Exemplos: Let's Encrypt, DigiCert, GlobalSign, SERPRO (no Brasil)
- Funções: verificar identidades, emitir certificados, manter listas de revogação ([[crl]])

### Arquivos Comuns

1. **key.pem** (ou .key)
   - Contém a **chave privada** do certificado
   - Deve ser mantida em segredo absoluto
   - Formato PEM (texto codificado em Base64)

2. **cert.pem** (ou .crt, .cer)
   - Contém o **certificado público** (chave pública + informações)
   - Pode ser distribuído livremente

3. **ca.crt** (ou ca.pem)
   - Certificado da Autoridade Certificadora raiz ou intermediária
   - Usado para verificar a cadeia de confiança

4. **csr** ([[csr|Certificate Signing Request]])
   - Pedido de assinatura de certificado
   - Contém a chave pública e informações sobre o solicitante
   - Gerado antes de obter um certificado assinado

## Formatos de Arquivo

- **PEM** (.pem, .crt, .key): formato textual em Base64
- **DER**: formato binário
- **PKCS#12/PFX** (.p12, .pfx): contém chave privada e certificado (protegido por senha)

## Funcionamento Básico

1. Um solicitante gera um par de chaves (pública/privada)
2. Cria um CSR (pedido de certificado) com a chave pública
3. A CA verifica a identidade do solicitante
4. A CA emite o certificado assinado digitalmente
5. O certificado pode ser usado para:
   - Autenticação (ex: HTTPS)
   - Criptografia (ex: TLS)
   - Assinatura digital

## Exemplo de Uso em HTTPS

Quando você acessa um site com [[protocolo-https]]:
1. O servidor envia seu certificado
2. Seu navegador verifica:
   - Se a CA é confiável
   - Se o certificado é válido e não revogado
   - Se o nome do site corresponde ao certificado
3. Se tudo estiver OK, estabelece uma conexão segura

Você gostaria que eu detalhasse algum aspecto específico?