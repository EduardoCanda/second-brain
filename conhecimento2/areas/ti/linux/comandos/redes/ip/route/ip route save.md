---
tags:
  - Linux
  - "#Redes"
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado em par com o comando [[ip route restore]], sua principal finalidade é exportar rotas para a saída padrão do sistema, com isso podemos redirecionar para arquivos e posteriormente restaurar as configurações.
# Exemplos

Exportando rotas do sistema

```bash
ip route save > backup_rotas.txt
```
