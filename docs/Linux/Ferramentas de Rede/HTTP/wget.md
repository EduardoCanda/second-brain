# wget

## O que é

Cliente de download não interativo para HTTP/HTTPS/FTP, focado em transferência de arquivos, retomada de download, espelhamento e execução em scripts/cron.

## Para que serve

- Validar disponibilidade de artefatos (binários, backups, pacotes) expostos por HTTP.
- Baixar arquivos grandes com retomada automática (`-c`).
- Testar autenticação básica e acesso a repositórios privados.
- Fazer espelhamento de conteúdo estático para análise offline.
- Verificar headers e status sem baixar conteúdo completo (`--spider`).

## Quando usar

- **Pipeline CI falha ao baixar artefato** (timeout/404/403).
- **Download interrompido** em links instáveis (retomada necessária).
- **Validação de mirror/repositório** antes de apontar produção.
- **Necessidade de baixar recursivamente** documentação/site estático para auditoria.
- **Inspeção rápida de endpoint de arquivo** sem consumir banda desnecessária.

## Exemplos de uso

```bash
# 1) Checar status/headers sem baixar arquivo
wget --spider -S https://downloads.exemplo.com/app.tar.gz

# 2) Baixar com retomada (ideal para arquivos grandes)
wget -c https://downloads.exemplo.com/app.tar.gz

# 3) Definir timeout e tentativas em ambiente instável
wget --timeout=5 --tries=3 https://downloads.exemplo.com/app.tar.gz

# 4) Salvar com nome específico
wget -O app-prod.tar.gz https://downloads.exemplo.com/releases/latest.tar.gz

# 5) Espelhamento básico de conteúdo estático
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https://docs.exemplo.com/
```

## Exemplo de saída

```text
$ wget --spider -S https://downloads.exemplo.com/app.tar.gz
Spider mode enabled. Check if remote file exists.
--2026-03-15 10:20:41--  https://downloads.exemplo.com/app.tar.gz
Resolving downloads.exemplo.com... 10.30.40.50
Connecting to downloads.exemplo.com|10.30.40.50|:443... connected.
HTTP request sent, awaiting response...
  HTTP/1.1 200 OK
  Content-Type: application/gzip
  Content-Length: 184532992
Length: 184532992 (176M) [application/gzip]
Remote file exists.
```

Leitura rápida:

- Falha em `Resolving...`: DNS.
- Falha em `Connecting...`: rede/porta/firewall.
- `403/401`: autenticação/autorização.
- `404`: URL ou versão de artefato inválida.

## Dicas de troubleshooting

- Use `--server-response`/`-S` para confirmar status real retornado pelo servidor.
- Em erros intermitentes, combine `--tries`, `--waitretry` e `--timeout`.
- Se houver TLS problemático em legado, valide certificado em vez de desabilitar verificação.
- Em CI/CD, capture logs completos do `wget` para correlação com horário do incidente.
- Ao baixar de endpoints protegidos, valide credenciais e escopo antes de culpar rede.

## Flags importantes

- `--spider`: testa existência/acesso sem baixar.
- `-S` / `--server-response`: mostra headers e status.
- `-c`: retoma download interrompido.
- `-O <arquivo>`: define nome do arquivo de saída.
- `--timeout=<seg>`: timeout de rede.
- `--tries=<n>`: número de tentativas.
- `--waitretry=<seg>`: espera progressiva entre retries.
- `--user` / `--password`: autenticação básica.
- `--no-check-certificate`: ignora validação TLS (somente diagnóstico controlado).
- `--mirror`: espelhamento recursivo.

## Boas práticas

- Sempre valide checksum (`sha256sum`) após download de artefatos críticos.
- Em automação, trate códigos de saída do `wget` para diferenciar erro de rede vs HTTP.
- Evite salvar artefatos em caminhos temporários sem limpeza/controle de versão.
- Para downloads sensíveis, registre origem, hash e horário no pipeline.
- Prefira URLs versionadas em produção para evitar “latest” quebrando deploy.

## Referências

- Manual: `man wget`
- GNU Wget docs: https://www.gnu.org/software/wget/manual/
