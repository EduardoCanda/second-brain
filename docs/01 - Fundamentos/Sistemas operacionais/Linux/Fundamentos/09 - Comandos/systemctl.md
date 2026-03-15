## Visão Geral

`systemctl` é a interface principal para gerenciar o `systemd`, responsável por:
- inicialização do sistema
- gerenciamento de serviços
- controle de targets (antigos runlevels)
- monitoramento de estado e logs (em conjunto com `journalctl`)

Como DevOps, você usa `systemctl` para:
- subir e parar serviços
- investigar falhas
- controlar comportamento no boot
- automatizar operações

---
## Conceitos Fundamentais

### Unit
Tudo no systemd é uma **unit**.

Tipos mais comuns:
- `service` → serviços (nginx, docker, ssh)
- `target` → grupos de units (runlevels modernos)
- `socket` → ativação sob demanda
- `timer` → agendamentos (cron moderno)

**Exemplo de unit:**
nginx.service  
docker.service  
multi-user.target

---
## Comandos Essenciais (Dia a Dia)

### Ver status de um serviço
```bash
systemctl status nginx
```

Uso prático:
- verificar se está rodando
- ver PID
- ver últimos logs
- identificar erros de inicialização

---
### Iniciar um serviço
`sudo systemctl start nginx`

### Parar um serviço
`sudo systemctl stop nginx`

### Reiniciar um serviço
`sudo systemctl restart nginx`

Use quando:
- alterar configuração
- serviço entrou em estado inconsistente

### Recarregar configuração (sem restart)
`sudo systemctl reload nginx`

Observação:
- só funciona se o serviço suportar reload
- ideal para evitar downtime

---
## Habilitação no Boot

### Habilitar serviço no boot

`sudo systemctl enable nginx`

Cria links simbólicos para iniciar automaticamente.

### Desabilitar serviço no boot
`sudo systemctl disable nginx`

### Ver se serviço inicia no boot
`systemctl is-enabled nginx`

---
## Targets (Runlevels Modernos)

### Ver target padrão
`systemctl get-default`

### Definir target padrão
`sudo systemctl set-default multi-user.target`

Casos comuns:
- servidor → `multi-user.target`
- desktop → `graphical.target`
    
### Trocar target em tempo real
`sudo systemctl isolate rescue.target`

Uso DevOps:
- troubleshooting
- manutenção
- recuperação de sistema

---
## Listagens Úteis
### Listar todos os serviços ativos
`systemctl list-units --type=service`

### Listar todos os serviços instalados
`systemctl list-unit-files --type=service`

### Ver serviços que falharam
`systemctl --failed`

Esse comando é **ouro** em incidentes.

---
## Logs (Integração com journalctl)

### Ver logs de um serviço
`journalctl -u nginx`

### Ver logs em tempo real
`journalctl -u nginx -f`

Equivalente a:
`tail -f /var/log/...`

### Ver logs desde o último boot
`journalctl -u nginx -b`

---
## Diagnóstico e Troubleshooting

### Ver dependências de um serviço
`systemctl list-dependencies nginx`

Útil para:
- entender ordem de inicialização
- identificar dependências quebradas

### Testar arquivo de unit customizado
`systemd-analyze verify arquivo.service`

---
## Units Customizadas (Noções Importantes)
Local padrão:
`/etc/systemd/system/`

Após criar ou alterar uma unit:
`sudo systemctl daemon-reexec sudo systemctl daemon-reload`

Regra prática:
- `daemon-reload` → mudou unit
- `restart service` → aplicar mudança

---
## systemctl vs Containers

- Containers geralmente **não usam systemd**
- systemctl é para:
    - hosts
    - VMs
    - nós de Kubernetes

Nunca tente usar `systemctl` dentro de containers comuns.

---
## Boas Práticas DevOps
- Sempre use `status` antes de reiniciar
- Prefira `reload` quando possível
- Monitore serviços falhados
- Desabilite serviços desnecessários
- Em servidores: evite `graphical.target`

---
## Comandos-Chave para Memorizar
```shell
systemctl status 
systemctl start 
systemctl stop 
systemctl restart 
systemctl enable 
systemctl disable 
systemctl get-default 
systemctl set-default 
systemctl --failed 
journalctl -u
```
``
---
## Princípio Final

`systemctl` não é só para ligar e desligar serviços.  
Ele é uma **ferramenta central de observabilidade, controle e estabilidade do sistema**.
