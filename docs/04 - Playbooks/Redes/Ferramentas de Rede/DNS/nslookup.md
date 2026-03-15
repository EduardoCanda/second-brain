# nslookup

## O que é

`nslookup` é uma ferramenta tradicional para consultas DNS rápidas, disponível em praticamente toda distribuição Linux. É útil para validações pontuais, mesmo sendo menos detalhada que `dig`.

## Para que serve

- Confirmar rapidamente se um nome resolve para IP.
- Consultar tipos comuns de registro (`A`, `AAAA`, `MX`, `NS`, `TXT`).
- Testar resposta de um DNS específico sem alterar `/etc/resolv.conf`.
- Fazer troubleshooting básico quando você precisa de algo simples e imediato.

## Quando usar

- Em acesso inicial a servidor onde você precisa de diagnóstico rápido.
- Quando equipe de suporte pede evidência simples de resolução DNS.
- Para validar se o DNS interno responde diferente do DNS público.
- Em ambientes legados onde `dig` pode não estar instalado por padrão.

## Exemplos de uso

```bash
# Consulta padrão (usa DNS configurado no host)
nslookup example.com

# Consulta tipo específico
nslookup -type=mx gmail.com

# Consulta reversa
nslookup 8.8.8.8

# Forçar servidor DNS específico
nslookup example.com 1.1.1.1
```

## Exemplos de saída

```text
$ nslookup example.com 1.1.1.1
Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   example.com
Address: 93.184.216.34
```

Leitura rápida do que importa:
- `Server` / `Address`: resolvedor que respondeu.
- `Non-authoritative answer`: resposta veio de cache/recursivo, não direto do autoritativo.
- `Name` e `Address`: resultado efetivo da resolução.

## Dicas de troubleshooting

- Teste primeiro sem servidor explícito, depois com servidor explícito (ex.: `1.1.1.1`) para isolar problema local.
- Se houver timeout, valide conectividade UDP/TCP 53 entre host e DNS.
- Se `nslookup` resolve mas aplicação falha, investigar camada de aplicação/TLS/proxy.
- Use consulta reversa para checar consistência PTR em ambientes que dependem de reverse DNS (mail, logs).

## Flags importantes

- `-type=TIPO`: define tipo de registro (`A`, `AAAA`, `MX`, `TXT`, etc.).
- `-debug`: aumenta detalhes do processo de consulta.
- `-port=PORTA`: consulta DNS em porta não padrão.
- `nome servidor_dns`: forma prática de escolher resolver no próprio comando.

## Boas práticas

- Para análise profunda de incidente, complementar `nslookup` com `dig`.
- Guardar saída completa quando houver erro intermitente (ajuda correlação com logs).
- Evitar conclusões com único teste; repetir em mais de um resolvedor.
- Padronizar um conjunto de domínios internos/externos para testes de saúde DNS.

## Referências

- `man nslookup`
- BIND 9 Administrator Reference Manual (ISC)
