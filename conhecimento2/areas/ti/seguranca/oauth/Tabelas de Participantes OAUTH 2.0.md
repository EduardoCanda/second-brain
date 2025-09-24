---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
Aqui está uma tabela detalhada explorando as possibilidades de interação entre os participantes do OAuth 2.0:

| Participante          | Papel Principal                          | Possíveis Combinações de Cenários                                                                 | Exemplo Real                                                                 |
|-----------------------|------------------------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Resource Owner** (Você) | Dono dos dados/recursos                 | - Usuário humano concedendo acesso a um app mobile<br>- Sistema automatizado (robô) com credenciais | Usuário do Google permitindo que um app de agenda acesse seu calendário      |
| **Client** (Aplicação)   | App que quer acessar seus dados         | - Aplicação web server-side (mais segura)<br>- SPA (aplicação single-page)<br>- App mobile/nativo<br>- Dispositivo IoT | App de análise de gastos que quer ler seus extratos bancários                |
| **Authorization Server** | Emissor de tokens                       | - Servidor do próprio provedor (Google, Facebook)<br>- Servidor de identidade corporativo<br>- Solução third-party (Auth0, Okta) | Tela de login do Facebook que também mostra permissões solicitadas           |
| **Resource Server**     | Guardião dos dados protegidos           | - Pode ser o mesmo servidor de autorização<br>- Servidor API separado<br>- Microsserviço especializado | API do Google Drive que entrega seus arquivos quando apresentado token válido |

### Combinações Avançadas:

| Cenário de Uso                | Participantes Envolvidos                     | Fluxo OAuth Recomendado          | Caso de Negócio Típico                          |
|-------------------------------|----------------------------------------------|----------------------------------|-------------------------------------------------|
| **Login Social**              | User + Client (SPA) + Facebook Auth Server   | Authorization Code + PKCE        | App de delivery usando login com Facebook       |
| **Integração B2B**            | Sistemas corporativos + API Partner          | Client Credentials               | ERP acessando API de cotação de frete           |
| **Dispositivos Smart TV**     | User + TV App + Music Service Auth           | Device Code Flow                 | Spotify em TV sem teclado                       |
| **Migração de Dados**         | User + Migration Tool + Cloud Storage        | Authorization Code (offline)     | Ferramenta migrando fotos do Google para iCloud |
| **Pagamentos via API**        | Merchant App + Payment Processor API         | Mixed: User Auth + M2M Auth      | Loja virtual processando cartões via Stripe     |

### Tabela de Permissões Típicas:

| Tipo de Client            | Pode Usar Quais Fluxos?                     | Requisitos de Segurança                     |
|---------------------------|---------------------------------------------|---------------------------------------------|
| Aplicação Web Confiável   | Authorization Code, PKCE                    | Client Secret armazenado com criptografia   |
| Mobile App                | Authorization Code + PKCE                   | Prova de posse do certificado               |
| Single-Page App           | Implicit (deprecated) ou Auth Code + PKCE   | Strict Redirect URI validation              |
| Backend Service           | Client Credentials                          | IP Whitelisting + Rotação de credenciais    |
| Dispositivo com UI Limitada| Device Code                                 | Short-lived tokens + polling                |

### Exemplo Completo de Caso:
**Cenário**: App de viagens (Client) quer acessar seus emails no Gmail (Resource Server) para extrair reservas

1. **Resource Owner**: Você (dono da conta Gmail)
2. **Authorization Server**: accounts.google.com
3. **Escopos**: `https://www.googleapis.com/auth/gmail.readonly`
4. **Token Resultante**: Acesso APENAS para ler emails, sem poder deletar ou enviar

Essa tabela mostra como o OAuth 2.0 é flexível para diferentes arquiteturas, sempre mantendo o controle de acesso nas mãos do Resource Owner (você ou sua organização).