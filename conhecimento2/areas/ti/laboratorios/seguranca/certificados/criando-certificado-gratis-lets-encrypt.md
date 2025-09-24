---
tags:
  - Segurança
  - NotaBibliografica
categoria: criptografia
---
O **DNS-01** é um método de validação do protocolo **ACME** (usado por CAs como a Let’s Encrypt) em que **você prova que controla um domínio criando um registro TXT no [[protocolo-dns|DNS]]**.

# Como funciona (em 4 passos)

1. Você pede o certificado (ex.: para `app.seudominio.com`).
    
2. A [[autoridade-certificadora|CA]] gera um **token** do desafio.
    
3. Você publica **TXT** em **`_acme-challenge.app.seudominio.com`** com o valor fornecido.
    
4. A CA consulta o **[[servidor-autoritativo|DNS autoritativo]]** do seu domínio; se o valor bater, ela **emite** o certificado.
    

> Para **wildcard** (`*.seudominio.com`), o TXT fica em **`_acme-challenge.seudominio.com`**.  
> É possível ter **vários TXT** no mesmo rótulo quando valida nomes múltiplos ao mesmo tempo.

# Por que usar DNS-01?

- **Não precisa** abrir as portas **80/443** (funciona mesmo atrás de NAT/CGNAT).
    
- **Permite wildcard** (`*.domínio`).
    
- Dá para validar um nome **sem** o DNS apontar para seu servidor (útil em migrações).
    

# Pontos de atenção

- Você **precisa conseguir editar o DNS**. Sem API no provedor, a emissão/renovação vira **manual**.
    
- Pode haver **atraso de propagação** (ajude usando TTL baixo durante o processo).
    
- **Automação**: use um plugin de DNS do seu provedor (ex.: `certbot-dns-cloudflare`) ou o **acme.sh**.
    
    - Dica avançada: dá para pôr um **CNAME** em `_acme-challenge.seudominio.com` apontando para outra zona que você controla com API; a CA **segue o CNAME**, então você automatiza mesmo mantendo o DNS principal onde está.
        

# Mini-exemplo (manual com `certbot`)

```bash
sudo apt install certbot
certbot certonly --manual --preferred-challenges dns \
  -d seudominio.com -d *.seudominio.com
# O certbot mostrará o valor do TXT.
# No DNS, crie: _acme-challenge.seudominio.com  TXT  <valor>
# Confirme com:
dig TXT _acme-challenge.seudominio.com +short
# Depois volte ao certbot e pressione Enter.
```

Os arquivos saem em `/etc/letsencrypt/live/…` e valem ~90 dias (se for manual, repete no vencimento).

Se quiser, eu te mostro exatamente como automatizar **DNS-01** no seu provedor de DNS atual (ou com o truque do **CNAME de validação**) e já deixo os comandos prontos.