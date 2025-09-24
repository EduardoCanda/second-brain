---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
 O comando `ip link property del` segue a mesma lógica do `add`, mas ele remove uma propriedade de uma interface de rede.

Hoje a única possibilidade de atualização é utilizar a propriedade altname, a sintaxe é relativamente simples como no exemplo abaixo
# **Sintaxe básica:**

```bash
ip link property del dev <interface> <propriedade>
```

# **Exemplos**

Removendo o alias mock, da interface dummy

```bash
ip link property del dev dummy altname aliasinterface 
```