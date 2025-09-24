---
tags:
  - Linux
  - NotaPermanente
categoria: processos
ferramenta: cli
---
O Comando jobs é utilizado para gerenciar mais de um processo em um mesmo terminal, é possível enviar processos para serem executados em background e verificar estes também, o termo job se refere a processos executando em paralelo a ação principal naquele shell.

## Exemplo basico

Listando todos os jobs atuais
```bash
jobs
```

Enviando um processo para executar em um job

```bash
sleep 3600 &
```

Assumindo o controle de um job "foreground"

```bash
fg %id_job
```

Enviando um processo para execução em background

```bash
bg %id_job
```


Suspendendo um processo depois retomando ele em background

```bash
sleep 3600
CTRL + Z
bg %id_job
```

