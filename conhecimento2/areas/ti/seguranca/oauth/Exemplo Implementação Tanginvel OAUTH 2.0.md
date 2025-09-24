---
tags:
  - Fundamentos
  - Segurança
  - NotaBibliografica
---
# Autenticação vs. Autorização no OAuth 2.0 - Exemplos Tangíveis

Vamos desmistificar essa separação com exemplos práticos para você entender exatamente como cada parte funciona no mundo real.

## A Diferença Fundamental

**Autenticação (Quem você é?)**:
- Verifica a identidade do usuário
- Exemplo: Login com usuário/senha, biometria

**Autorização (O que você pode fazer?)**:
- Determina quais recursos/operações estão disponíveis
- Exemplo: Acessar seus contatos do Google, mas não poder deletá-los

## Como o OAuth 2.0 Lida com Isso

### 1. Autenticação no OAuth 2.0 (Onde Acontece)
- **Não é responsabilidade direta do OAuth 2.0** (isso causa muita confusão)
- OAuth 2.0 delega a autenticação para o **Authorization Server**
- Na prática, usa-se OpenID Connect (extensão do OAuth) para autenticação

**Exemplo Tangível: Login com Google**
1. Você clica "Entrar com Google" num app de fotos
2. É redirecionado para accounts.google.com (Authorization Server)
3. Digita email/senha (autenticação)
4. Google verifica suas credenciais (autenticação)
5. Google pergunta: "O App Fotos quer acessar seu nome e email?" (autorização)

### 2. Autorização no OAuth 2.0 (O Foco Principal)
- Define quais recursos o cliente pode acessar
- Especificado via "scopes" (escopos)

**Exemplo Prático:**
- `scope=email` → só pode ler o email
- `scope=email profile` → pode ler email e perfil básico
- `scope=contacts.readonly` → pode ver, mas não modificar contatos

## Fluxo Concreto com Exemplos

### Cenário: App de Agendamento que acessa seu Google Calendar

1. **Autenticação** (feita pelo Google):
   ```mermaid
   sequenceDiagram
       Usuário->>Google: Digita email/senha
       Google-->>Usuário: Verifica credenciais (autenticação OK)
   ```

2. **Autorização** (OAuth 2.0 em ação):
   ```mermaid
   sequenceDiagram
       App Agendamento->>Usuário: "Precisamos acessar sua agenda"
       Usuário->>Google: Autoriza o app com escopos específicos
       Google-->>App Agendamento: Token com permissões limitadas
       App Agendamento->>Google Calendar: Usa token para ler eventos (apenas leitura)
   ```

## Exemplos Reais de Implementação

### Exemplo 1: Spotify (Autenticação + Autorização)
1. Você abre um app de estatísticas musicais
2. Clica "Conectar com Spotify"
3. Spotify pede login (autenticação)
4. Depois pergunta: "Este app quer:
   - Ver seu nome e foto (autenticação via OpenID)
   - Ler suas playlists (autorização via OAuth)
   - Modificar seu player (autorização via OAuth)"

### Exemplo 2: Banco (Segurança Máxima)
1. App de finanças pede conexão com seu banco
2. Você faz login no site do banco (autenticação)
3. Banco pergunta: "Permitir que este app:
   - Veja saldo (escopo: accounts.read)
   - Veja transações (escopo: transactions.read)
   - Mas NÃO pode transferir (nenhum escopo write)"

## Por Que Essa Separação?

**Vantagem principal**: O app de terceiros:
- Nunca vê sua senha (só o provedor autentica)
- Só acessa o que você explicitamente permitir
- Você pode revogar acesso sem mudar senha

## Problemas Comuns na Implementação

1. **Confusão**: Muitos acham que OAuth autentica, quando na verdade ele autoriza
2. **Solução**: Usar OpenID Connect para autenticação + OAuth para autorização
3. **Exemplo Errado**: "Estou logado porque tenho um token OAuth" → Não! O token só prova autorização, não identidade

## Como Saber Qual Está Sendo Usado?

- **Se pede login/senha**: Autenticação
- **Se pede permissões**: Autorização
- **Se retorna claims como email, nome**: OpenID Connect (autenticação)
- **Se retorna apenas token de acesso**: OAuth puro (autorização)

Espero que esses exemplos tangíveis tenham esclarecido a diferença prática! O OAuth 2.0 em si não é um protocolo de autenticação completo - ele precisa ser complementado (geralmente com OpenID Connect) para fornecer autenticação real.