---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O comando `ip link property add` é usado para adicionar propriedades a uma interface de rede no Linux. Essas propriedades são metadados que influenciam o comportamento da interface, especialmente no contexto de configurações avançadas de rede.

Hoje a única possibilidade de atualização é utilizar a propriedade altname, a sintaxe é relativamente simples como no exemplo abaixo


# **Sintaxe básica:**
```bash
ip link property add dev <interface> [<propriedade> <valor>]
```

# Exemplos

Adicionar um altname (alias) a uma interface

```bash
ip link property add dev veth0 altname aliasinterface
```