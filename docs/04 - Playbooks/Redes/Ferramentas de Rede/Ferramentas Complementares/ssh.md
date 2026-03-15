# ssh

## O que é

Cliente OpenSSH para acesso remoto seguro e execução de comandos em outro host via TCP/22 (ou porta customizada).

## Para que serve

- Acessar servidor Linux remotamente com autenticação por chave ou senha
- Executar comandos de diagnóstico sem abrir sessão interativa (`ssh host comando`)
- Criar túneis para acessar serviços internos (DB, Redis, painel web) sem expor portas
- Investigar problemas de rede **a partir da origem real do tráfego** (bastion, app server, pod)

## Quando usar

- Quando você precisa validar conectividade **do servidor A para o B** (e não da sua máquina local)
- Quando um serviço interno só é alcançável via bastion/jump host
- Quando quer testar porta remota com segurança (`ssh -vvv`, `ssh -p`, `ssh -J`)
- Quando precisa encaminhar porta local/remota para troubleshooting temporário

## Exemplos de uso

```bash
# login remoto simples
ssh admin@10.10.10.20

# debug detalhado de conexão SSH
ssh -vvv admin@10.10.10.20

# executar comando remoto sem shell interativo
ssh admin@10.10.10.20 'ss -tulpen | grep 443'

# acessar host privado via bastion
ssh -J ops@bastion.corp.local ubuntu@app-01.internal

# túnel local: localhost:15432 -> db.internal:5432
ssh -L 15432:db.internal:5432 ops@bastion.corp.local
```

## Exemplos de saída

```text
$ ssh -vvv admin@10.10.10.20
...
debug1: Connecting to 10.10.10.20 [10.10.10.20] port 22.
debug1: Connection established.
debug1: Authenticating to 10.10.10.20:22 as 'admin'
debug1: Offering public key: /home/user/.ssh/id_ed25519
debug1: Server accepts key: /home/user/.ssh/id_ed25519
Authenticated to 10.10.10.20 ([10.10.10.20]:22).
...
```

Leitura rápida:
- Parou em `Connecting to ...` + timeout: rota/firewall/porta bloqueada.
- `Permission denied (publickey,password)`: falha de credencial/política de autenticação.
- `Host key verification failed`: chave do host mudou ou `known_hosts` divergente.

## Dicas de troubleshooting

- Use `ssh -vvv` para separar problema de rede, handshake e autenticação.
- Valide porta antes com `nc -vz host 22` quando suspeitar de bloqueio L3/L4.
- Em salto via bastion, teste primeiro bastion isoladamente e depois `-J`.
- Se houver erro de host key, confirme mudança legítima antes de remover entrada do `~/.ssh/known_hosts`.
- Em conexões instáveis, configure keepalive (`ServerAliveInterval`, `ServerAliveCountMax`).

## Comparação com ferramentas similares

- `telnet`/`nc`: testam conectividade de porta, mas não fornecem acesso administrativo seguro.
- VPN: abre conectividade de rede ampla; `ssh` é mais pontual e auditável para acesso por host.
- Console de cloud: útil para emergência, porém `ssh` é mais automatizável para operação diária.

## Flags importantes

- `-p <porta>`: conecta em porta diferente de 22.
- `-i <chave>`: define chave privada específica.
- `-J <jump_host>`: conexão via bastion (ProxyJump).
- `-L [local:]host:porta` / `-R`: túnel local/remoto.
- `-N`: não executa comando remoto (útil para túnel).
- `-T`: desabilita pseudo-terminal (bom para scripts).
- `-o ConnectTimeout=5`: timeout de conexão explícito.
- `-vvv`: máximo nível de verbosidade de debug.

## Boas práticas

- Preferir autenticação por chave + passphrase (evitar senha em produção).
- Desabilitar login direto de `root` e usar usuário nominativo + `sudo`.
- Centralizar parâmetros em `~/.ssh/config` para reduzir erro operacional.
- Rotacionar chaves e remover acessos de usuários inativos.
- Registrar comandos críticos executados remotamente no processo de incidente.

## Referências

- `man ssh`
- `man ssh_config`
- OpenSSH manual: https://www.openssh.com/manual.html
