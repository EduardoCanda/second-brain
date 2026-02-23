## O que é um Processo

Um processo é um **programa em execução**.

Ele possui:
- PID (Process ID)
- Usuário dono
- Espaço de memória
- Estado
- Prioridade

No Linux, **todo processo nasce de outro processo**.

---

## PID

PID (Process ID):
- Identificador único do processo
- Atribuído pelo kernel

Processo especial:
- PID 1 → `systemd`
- Pai de todos os processos de usuário

---

## Processo Pai e Filho

- Todo processo (exceto PID 1) tem um pai
- Criação via `fork()`
- Execução via `exec()`

Visualização:
- `ps -ef`
- `pstree`

---

## Estados de Processo

Estados comuns:
- `R` → Running
- `S` → Sleeping
- `D` → Uninterruptible sleep
- `Z` → Zombie
- `T` → Stopped

Zombie:
- Processo terminou
- Pai não coletou status

---

## Threads

- Processo pode ter várias threads
- Compartilham memória
- Kernel agenda threads, não processos

---

## Sinais

Sinais são **mensagens enviadas pelo kernel ou por processos**.

Usados para:
- Encerrar
- Pausar
- Recarregar
- Notificar

---

## Sinais Importantes

- `SIGTERM (15)` → encerramento gracioso
- `SIGKILL (9)` → encerramento forçado
- `SIGINT (2)` → Ctrl + C
- `SIGHUP (1)` → reload de configuração

---

## Enviando Sinais

- `kill PID`
- `kill -9 PID`
- `pkill nome`
- `killall nome`

---

## Prioridade e Nice

- Nice varia de `-20` (mais prioridade)
- Até `19` (menos prioridade)

Comandos:
- `nice`
- `renice`

---

## Processos em Background

- `&` → executa em background
- `jobs`
- `fg`
- `bg`

---

## Monitoramento

Ferramentas comuns:
- `ps`
- `top`
- `htop`
- `atop`

---

## Erros Comuns

- Usar `kill -9` como primeira opção
- Não entender processos zumbis
- Confundir thread com processo

---

## Regra Prática

- Sempre tente `SIGTERM` antes de `SIGKILL`
- Se um processo trava, verifique estado `D`
- PID 1 é sempre especial
