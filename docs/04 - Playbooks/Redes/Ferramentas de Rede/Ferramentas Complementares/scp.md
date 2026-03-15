# scp

## O que é

Comando de cópia de arquivos sobre SSH. Usa o canal SSH para transferir dados de forma autenticada e criptografada.

## Para que serve

- Transferir logs, dumps e artefatos entre máquinas Linux com segurança
- Copiar rapidamente arquivos para suporte de incidente (coleta de evidência)
- Distribuir arquivos de configuração/chaves em ambiente controlado
- Validar throughput básico entre dois hosts sem abrir serviços adicionais

## Quando usar

- Quando você já tem SSH liberado e quer copiar arquivo sem instalar agente adicional
- Em troubleshooting, para retirar logs de servidor sem expor compartilhamentos
- Em operações pontuais/automação simples (script shell)
- Quando precisa cópia recursiva de diretórios (`-r`) para hosts remotos

## Exemplos de uso

```bash
# copiar arquivo local para remoto
scp app.log ops@10.10.10.30:/tmp/

# copiar arquivo remoto para local
scp ops@10.10.10.30:/var/log/nginx/error.log ./

# copiar diretório recursivamente
scp -r ./coleta-incidente ops@10.10.10.30:/tmp/

# usar porta customizada e chave específica
scp -P 2222 -i ~/.ssh/id_ed25519 backup.tar.gz ops@10.10.10.30:/backup/
```

## Exemplos de saída

```text
$ scp app.log ops@10.10.10.30:/tmp/
app.log                                      100%  248KB   1.8MB/s   00:00
```

Leitura rápida:
- `%` e taxa (`MB/s`) ajudam a perceber gargalo de banda/latência.
- `No such file or directory`: caminho local/remoto incorreto.
- `Permission denied`: usuário sem permissão no diretório de destino.
- `Connection timed out` ou `Connection refused`: problema de rota/firewall/porta SSH.

## Dicas de troubleshooting

- Teste primeiro `ssh user@host` antes de depurar `scp`.
- Use `-v` para ver detalhes de autenticação e negociação.
- Confirme espaço em disco no destino (`df -h`) ao copiar arquivos grandes.
- Se houver limitação de rede, use compressão (`-C`) para texto/logs.
- Para ambientes com bastion, combine `-o ProxyJump=bastion`.

## Comparação com ferramentas similares

- `rsync -e ssh`: melhor para sync incremental, retomada e preservação avançada.
- `sftp`: melhor para uso interativo (listar, navegar, subir/baixar por sessão).
- `cp`/NFS/SMB: exigem filesystem compartilhado; `scp` funciona só com SSH.

## Flags importantes

- `-P <porta>`: porta SSH do host remoto.
- `-i <chave>`: chave privada específica.
- `-r`: cópia recursiva de diretório.
- `-C`: habilita compressão durante transferência.
- `-p`: preserva mtime/atime/modo do arquivo.
- `-v`: modo verboso para debug.
- `-o ProxyJump=<host>`: salto via bastion.

## Boas práticas

- Evitar copiar segredos sem criptografia adicional e controle de destino.
- Validar hash (`sha256sum`) após transferir arquivos críticos.
- Usar diretório temporário controlado (`/tmp/inc-<id>`) em incidentes.
- Preferir `rsync` para grandes volumes e reexecução frequente.
- Limpar arquivos sensíveis após a análise.

## Referências

- `man scp`
- `man ssh_config`
- OpenSSH manual: https://www.openssh.com/manual.html
