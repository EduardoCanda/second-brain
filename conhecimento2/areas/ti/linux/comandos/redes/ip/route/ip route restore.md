---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizada para restaurar rotas salvas, ele funciona em par com o comando [[ip route save]], e sua utilização é analoga, porém ele sempre pede um arquivo como argumento.
# Exemplos

Restaurando rotas salvas pelo comando [[ip route save]]

```bash
ip route restore < backup_rotas.txt
```