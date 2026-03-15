# openssl

## O que é

Toolkit criptográfico com dezenas de subcomandos. Em troubleshooting de rede/TLS, o mais usado é `openssl s_client`, que funciona como um cliente TLS “cru” para inspecionar handshake, cadeia de certificados e parâmetros de criptografia negociados.

## Para que serve

- Validar se um endpoint realmente fala TLS na porta esperada (`443`, `465`, `8443` etc.)
- Verificar certificado apresentado pelo servidor (CN/SAN, emissor, validade e cadeia)
- Confirmar versão/cipher negociada (TLS 1.2 vs 1.3, suites permitidas)
- Testar SNI (`-servername`) para detectar erro clássico de certificado errado atrás de load balancer/ingress
- Identificar falhas de validação como `self signed certificate`, `unable to get local issuer certificate`, `certificate has expired`

## Quando usar

- Erro na aplicação: `x509: certificate signed by unknown authority`
- Erro em cliente HTTP: `SSL routines:ssl3_get_record:wrong version number`
- Suspeita de mismatch de protocolo/cipher entre cliente antigo e servidor moderno
- Necessidade de provar se a falha está no app ou já ocorre no handshake TLS de baixo nível

## Exemplos de uso

```bash
# Handshake básico com SNI (essencial para hosts virtuais)
openssl s_client -connect api.exemplo.com:443 -servername api.exemplo.com

# Exibir apenas o certificado folha em formato legível
openssl s_client -connect api.exemplo.com:443 -servername api.exemplo.com </dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName

# Forçar TLS 1.2 para validar compatibilidade
openssl s_client -connect api.exemplo.com:443 -servername api.exemplo.com -tls1_2

# Validar cadeia usando CA customizada (ambiente corporativo)
openssl s_client -connect api.exemplo.com:443 -servername api.exemplo.com -CAfile empresa-ca.pem
```

## Exemplos de saída

```text
$ openssl s_client -connect api.exemplo.com:443 -servername api.exemplo.com
CONNECTED(00000003)
depth=2 C = US, O = DigiCert Inc, CN = DigiCert Global Root CA
verify return:1
depth=1 C = US, O = DigiCert Inc, CN = DigiCert TLS RSA SHA256 2020 CA1
verify return:1
depth=0 CN = api.exemplo.com
verify return:1
---
SSL handshake has read 4123 bytes and written 398 bytes
Verification: OK
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
...
Verify return code: 0 (ok)
```

Leitura prática dos campos:

- `verify return:1` em todos os níveis + `Verify return code: 0 (ok)`: cadeia validou corretamente.
- `depth=0`: certificado apresentado ao cliente (server cert).
- `TLSv1.3, Cipher is ...`: protocolo e cifra efetivamente negociados (não o “suportado em teoria”).
- Se aparecer `Verify return code: 20`/`21`: cadeia incompleta ou CA ausente no trust store.

## Dicas de troubleshooting

- Sempre teste com `-servername <host>`; sem SNI você pode receber certificado default do proxy e diagnosticar errado.
- Use `-showcerts` para ver cadeia completa enviada pelo servidor; útil para provar que intermediário não está sendo enviado.
- Para STARTTLS (SMTP/IMAP/LDAP), use `-starttls smtp|imap|ldap`; sem isso o teste falha mesmo com serviço saudável.
- Se o erro for intermitente, rode várias vezes e compare `issuer`/serial para detectar pool com nós inconsistentes.
- Diferencie erro de rede vs TLS: se não chega em `CONNECTED`, é transporte (rota/firewall/porta); se conecta e falha depois, é handshake/cert.

## Comparação com ferramentas similares

- `openssl s_client`: melhor para inspeção detalhada de certificados e handshake “baixo nível”.
- `gnutls-cli`: excelente para comparar comportamento entre bibliotecas TLS diferentes (OpenSSL vs GnuTLS) em casos de incompatibilidade.

## Flags importantes

- `-connect host:porta`: destino TCP.
- `-servername host`: envia SNI no ClientHello.
- `-showcerts`: mostra toda a cadeia enviada.
- `-CAfile arquivo.pem`: trust store customizada.
- `-verify_return_error`: faz o comando falhar explicitamente em erro de validação.
- `-tls1_2` / `-tls1_3`: força versão TLS para teste de compatibilidade.
- `-cipher` (TLS <=1.2) e `-ciphersuites` (TLS 1.3): restringe algoritmos para troubleshooting.
- `-brief`: saída resumida (útil em automação).
- `-starttls <proto>`: negociação STARTTLS para protocolos que iniciam em texto claro.

## Boas práticas

- Salve evidências com timestamp durante incidente (`tee` em arquivo) para anexar em post-mortem.
- Nunca conclua problema de certificado sem testar do mesmo contexto do workload (pod/container/host afetado).
- Em ambientes internos, mantenha bundle de CAs corporativas versionado e distribuído de forma padronizada.
- Automatize checks de expiração (`notAfter`) antes da janela crítica para evitar incidentes evitáveis.
- Combine com `curl -v`/logs da aplicação para correlacionar o erro de handshake com impacto real no serviço.

## Referências

- OpenSSL docs: https://www.openssl.org/docs/
- Man page (`s_client`): `man openssl-s_client`
- RFC 8446 (TLS 1.3): https://datatracker.ietf.org/doc/html/rfc8446
