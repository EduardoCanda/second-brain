# gnutls-cli

## O que é

Cliente TLS da biblioteca GnuTLS. É muito útil para comparar resultado com `openssl s_client` quando há suspeita de diferença de implementação entre stacks TLS.

## Para que serve

- Testar handshake TLS diretamente contra um endpoint e inspecionar parâmetros negociados
- Exibir cadeia de certificados e detalhes de validação (`--print-cert`)
- Forçar políticas de protocolo/cifra via `--priority` para reproduzir falhas de cliente legado
- Validar cenários de mTLS (cliente com certificado) com `--x509certfile` e `--x509keyfile`

## Quando usar

- Um serviço Java/GnuTLS falha, mas testes com OpenSSL passam (ou vice-versa)
- Necessidade de depurar política criptográfica com granularidade (desabilitar TLS 1.3, suites específicas etc.)
- Troubleshooting de serviços que exigem certificado de cliente (mTLS)
- Ambiente com hardening criptográfico e necessidade de comprovar negociação efetiva

## Exemplos de uso

```bash
# Handshake básico
gnutls-cli api.exemplo.com -p 443

# Mostrar certificados recebidos e informações da cadeia
gnutls-cli --print-cert api.exemplo.com -p 443

# Forçar apenas TLS 1.2
gnutls-cli --priority 'NORMAL:-VERS-TLS-ALL:+VERS-TLS1.2' api.exemplo.com -p 443

# mTLS com certificado de cliente
gnutls-cli api.exemplo.com -p 443 \
  --x509certfile client.crt --x509keyfile client.key
```

## Exemplos de saída

```text
$ gnutls-cli --print-cert api.exemplo.com -p 443
Processed 141 CA certificate(s).
Resolving 'api.exemplo.com:443'...
Connecting to '203.0.113.10:443'...
- Certificate type: X.509
- Got a certificate list of 2 certificates.
- Certificate[0] info:
 - subject `CN=api.exemplo.com', issuer `CN=R3,O=Let's Encrypt,C=US', RSA key 2048 bits
 - status: The certificate is trusted.
- Description: (TLS1.3-X.509)-(ECDHE-SECP256R1)-(RSA-PSS-RSAE-SHA256)-(AES-256-GCM)
- Handshake was completed
```

Leitura prática dos campos:

- `status: The certificate is trusted.`: validação OK na trust store local.
- `Got a certificate list of 2 certificates`: servidor enviou folha + intermediário.
- `Description: (TLS1.3...)`: resume protocolo, troca de chave, assinatura e cifra negociados.
- `Handshake was completed`: transporte + TLS concluídos com sucesso.

## Dicas de troubleshooting

- Use `-d 4` ou maior para debug detalhado de handshake quando erro não é óbvio.
- Se houver virtual host/certificado incorreto, envie SNI com `--sni-hostname`.
- Em erro de CA interna, teste com `--x509cafile empresa-ca.pem` para confirmar problema de trust chain local.
- Para STARTTLS, use `--starttls-proto smtp|imap|ldap` no protocolo correto.
- Compare com `openssl s_client` no mesmo host para isolar se a quebra é dependente da biblioteca TLS.

## Comparação com ferramentas similares

- `gnutls-cli`: forte para testes de política via `--priority` e debug granular da stack GnuTLS.
- `openssl s_client`: referência mais comum em runbooks; ótimo para leitura rápida de cadeia e validação.

## Flags importantes

- `-p, --port`: porta de destino.
- `--print-cert`: imprime certificados recebidos com detalhes.
- `--sni-hostname`: define SNI explicitamente.
- `--priority`: define política criptográfica (versões/cifras/mac/kx).
- `--x509cafile`: CA bundle customizado para validação.
- `--x509certfile` / `--x509keyfile`: certificado/chave de cliente (mTLS).
- `-d <nível>`: debug verboso da negociação.
- `--starttls-proto`: inicia TLS sobre protocolo em texto claro (STARTTLS).

## Boas práticas

- Documente a string `--priority` usada nos testes para reproduzibilidade.
- Evite comparar resultados sem garantir mesmo DNS, mesma porta e mesmo SNI.
- Em mTLS, valide permissões e formato da chave antes de concluir problema de rede/TLS.
- Inclua saída completa de erro no ticket (com redaction de dados sensíveis) para acelerar análise entre times.
- Padronize testes cruzados (`gnutls-cli` + `openssl`) em playbooks de incidente TLS.

## Referências

- GnuTLS manual: https://gnutls.org/manual/
- Man page: `man gnutls-cli`
- Priority Strings: https://gnutls.org/manual/html_node/Priority-Strings.html
