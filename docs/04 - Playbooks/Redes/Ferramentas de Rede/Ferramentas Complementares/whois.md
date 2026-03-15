# whois

## O que é

Ferramenta de consulta de registros públicos de domínio, bloco IP e ASN em servidores WHOIS (RIR/NIC/registries).

## Para que serve

- Identificar dono/organização responsável por domínio, IP ou ASN
- Descobrir faixa de IP, contatos de abuso e provedor upstream
- Apoiar investigação de origem de tráfego suspeito (ataque, scan, spam)
- Validar se um endereço pertence ao provedor esperado em troubleshooting de rota

## Quando usar

- Durante análise de incidentes de segurança e tráfego anômalo
- Quando precisar abrir chamado com provedor correto (abuse/NOC)
- Para confirmar jurisdição/registro de domínio em troubleshooting DNS
- Em diagnóstico de BGP/peering, para mapear ASN e prefixos

## Exemplos de uso

```bash
# domínio
whois example.com

# IP público
whois 8.8.8.8

# consultar ASN em servidor específico (RADB)
whois -h whois.radb.net AS15169

# obter rota/prefixo via RADB
whois -h whois.radb.net 8.8.8.0/24
```

## Exemplos de saída

```text
$ whois 8.8.8.8
NetRange:       8.8.8.0 - 8.8.8.255
CIDR:           8.8.8.0/24
OrgName:        Google LLC
OriginAS:       AS15169
OrgAbuseEmail:  network-abuse@google.com
```

Leitura rápida:
- `NetRange/CIDR`: faixa associada ao IP.
- `OrgName`/`descr`: organização proprietária.
- `OriginAS`: ASN de origem (útil em análise de rota/BGP).
- `OrgAbuseEmail`: contato para reporte de abuso.

## Dicas de troubleshooting

- Lembre que WHOIS não testa conectividade; ele apenas mostra metadados de registro.
- Se resposta vier incompleta, consulte diretamente o servidor RIR correto (`-h whois.arin.net`, `whois.ripe.net`, etc.).
- Cruze informação de WHOIS com `dig`, `traceroute` e dados BGP para contexto completo.
- Alguns TLDs ocultam dados por privacidade (GDPR/proxy); valide em fontes complementares.
- Em investigação de domínio malicioso, combine com histórico DNS e CT logs.

## Comparação com ferramentas similares

- `dig/nslookup`: focam resolução DNS atual, não ownership de registro.
- Portais RIR/web: mesma base, porém `whois` é scriptável para automação.
- APIs de threat intel: enriquecem WHOIS com reputação e histórico.

## Flags importantes

- `-h <servidor>`: escolhe servidor WHOIS de consulta.
- `-p <porta>`: porta customizada (raro; padrão 43).
- `--verbose` (quando disponível): detalhes de consulta/encadeamento.

## Boas práticas

- Registrar timestamp da consulta (dados WHOIS mudam ao longo do tempo).
- Salvar saída bruta em incidentes para cadeia de evidência.
- Não tirar conclusão isolada de WHOIS; sempre correlacionar com telemetria de rede.
- Em automação, tratar variações de formato entre registries.

## Referências

- `man whois`
- IANA WHOIS: https://www.iana.org/whois
- ARIN, RIPE, APNIC, LACNIC, AFRINIC (RIRs)
