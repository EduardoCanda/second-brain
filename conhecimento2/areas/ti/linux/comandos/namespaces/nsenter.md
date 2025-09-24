---
tags:
  - Linux
  - Namespaces
ferramenta: cli
---
O Comando nsenter é utilizado para adentrar no contexto de uma namespace criado, com isso podemos executar o comando específicado no namespace de sua escolha, por padrão ele usa o comando de shell **/bin/sh**.

Para acessar um namespace é possível através do pid por exemplo, basta usar a flag --target para específicar o pid do processo que está acessando algum namespace desejado, normalmente para obter essa informação é utilizado o comando [[lsns]].

## Exemplos

Entrando em um namespace de pid em que o proc está apartado em um mount especifico

```bash
sudo nsenter --pid --mount --target PID
```