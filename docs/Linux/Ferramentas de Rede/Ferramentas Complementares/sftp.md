# sftp

## O que é

Cliente de transferência de arquivos via subsistema SSH (SSH File Transfer Protocol), com shell interativo para manipular arquivos remotos.

## Para que serve

- Enviar e baixar arquivos com segurança, mantendo sessão interativa
- Navegar diretórios remotos (`ls`, `cd`, `pwd`) sem abrir shell completo
- Automatizar lotes de upload/download com arquivo de comandos (`-b`)
- Operar em ambientes onde SCP é restrito, mas SFTP é permitido

## Quando usar

- Quando você precisa listar/remover/renomear arquivos remotos durante a transferência
- Para rotinas operacionais de troca de arquivos entre sistemas (integrações)
- Quando quer transferir vários arquivos de forma guiada por sessão
- Em pipelines com lote (`sftp -b`) sem dependências extras

## Exemplos de uso

```bash
# abrir sessão interativa
sftp ops@10.10.10.40

# conectar em porta SSH customizada
sftp -P 2222 ops@10.10.10.40

# comandos dentro da sessão
sftp> lcd ./coletas
sftp> cd /var/log/app
sftp> get app.log
sftp> put diagnostico.txt

# execução em lote (batch mode)
sftp -b comandos_sftp.txt ops@10.10.10.40
```

## Exemplos de saída

```text
$ sftp ops@10.10.10.40
Connected to 10.10.10.40.
sftp> ls
app.log
app.log.1
sftp> get app.log
Fetching /var/log/app/app.log to app.log
/var/log/app/app.log                          100%  6MB   3.2MB/s   00:02
```

Leitura rápida:
- `Connected to ...`: handshake/autenticação concluídos.
- `Couldn't stat remote file`: caminho remoto inválido.
- `Permission denied`: ACL/permissão insuficiente no remoto.
- Transferência muito lenta: verificar latência, compressão e limitação de banda.

## Dicas de troubleshooting

- Ative `-v` para detalhes de SSH/SFTP em falhas de conexão.
- Valide se o servidor tem subsistema SFTP habilitado (`Subsystem sftp ...` no `sshd_config`).
- Use caminho absoluto ao diagnosticar erro de diretório remoto.
- Em automação, prefira `-b` + tratamento de exit code para reprocessamento.
- Em bastion, combine com `-o ProxyJump`.

## Comparação com ferramentas similares

- `scp`: mais direto para cópia pontual, porém sem shell de arquivos.
- `rsync`: melhor para sincronização eficiente e incremental.
- FTP/FTPS: legado comum em integrações, mas SFTP costuma simplificar segurança (porta única + SSH).

## Flags importantes

- `-P <porta>`: porta SSH remota.
- `-i <chave>`: chave privada específica.
- `-b <arquivo>`: modo batch (não interativo).
- `-r`: cópia recursiva (quando suportado no cliente).
- `-C`: compressão na sessão.
- `-v`: verboso para debug.
- `-o ProxyJump=<host>`: conexão via bastion.

## Boas práticas

- Padronizar diretórios de entrada/saída para integração (`/in`, `/out`, `/error`).
- Aplicar princípio de menor privilégio para usuário SFTP (chroot/jail quando possível).
- Versionar scripts de batch SFTP usados em produção.
- Monitorar falhas de transferência e criar retry idempotente.
- Evitar transferir arquivos parcialmente escritos (usar padrão `.tmp` + rename atômico).

## Referências

- `man sftp`
- `man ssh_config`
- OpenSSH manual: https://www.openssh.com/manual.html
