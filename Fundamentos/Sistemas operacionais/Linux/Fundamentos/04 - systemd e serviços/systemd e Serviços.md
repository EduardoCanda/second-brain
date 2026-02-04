## O que é o systemd

`systemd` é o **init system** e **gerenciador de serviços** do Linux moderno.

Responsabilidades:
- Inicializar o sistema (PID 1)
- Gerenciar serviços
- Controlar dependências
- Gerenciar logs (journald)
- Controlar sessões e recursos

---

## PID 1

- `systemd` roda como PID 1
- Pai de todos os processos de usuário
- Se PID 1 falha, o sistema cai

---

## Units

Tudo no systemd é uma **unit**.

Tipos comuns:
- `service` → serviços
- `socket` → sockets
- `target` → grupos de units (estados)
- `timer` → agendamentos
- `mount` → pontos de montagem

Arquivos:
- `/lib/systemd/system/` → units do sistema
- `/etc/systemd/system/` → overrides/customizações

---

## Service Unit

Exemplo conceitual:
[Unit]  
Description=Minha Aplicação  
After=network.target

[Service]  
ExecStart=/usr/bin/java -jar app.jar  
User=app  
Restart=always

[Install]  
WantedBy=multi-user.target


Seções:
- `[Unit]` → dependências e ordem
- `[Service]` → como executar
- `[Install]` → quando iniciar

---

## Targets

Targets representam **estados do sistema**.

Exemplos:
- `multi-user.target` → modo texto, serviços
- `graphical.target` → ambiente gráfico
- `rescue.target` → modo recuperação

Equivalem aos antigos runlevels.

---

## systemctl

Ferramenta de controle do systemd.

Comandos comuns:
- `systemctl start serviço`
- `systemctl stop serviço`
- `systemctl restart serviço`
- `systemctl status serviço`
- `systemctl enable serviço`
- `systemctl disable serviço`

---

## Enable vs Start

- `start` → inicia agora
- `enable` → inicia no boot
- `disable` → não inicia no boot
- `stop` → para agora

São coisas diferentes.

---

## Logs com journalctl

- Logs centralizados
- Indexados
- Persistentes (se configurado)

Exemplos:
- `journalctl -u serviço`
- `journalctl -f`
- `journalctl --since today`

---

## Dependências e Ordem

- `After=` → ordem
- `Requires=` → dependência obrigatória
- `Wants=` → dependência opcional

---

## Erros Comuns

- Editar unit em `/lib/systemd/system`
- Confundir `enable` com `start`
- Não rodar `daemon-reload` após mudanças
- Rodar serviços como root sem necessidade

---

## Regra Prática

- Serviços são processos gerenciados
- systemd controla ciclo de vida
- Logs ficam no journal
- Boot é uma cadeia de units
