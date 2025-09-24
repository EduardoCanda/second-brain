---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando faz um reload completo em todo daemon do [[NetworkManager]], é possível também específicar apenas alguns aspectos que desejamos atualizar com opções porém por padrão ele reinicia tudo.
# Exemplos

Recarregando todo daemon
```bash
nmcli general reload 
```

Recarregando configurações contidas no NetworkManager.conf

```bash
nmcli general reload conf
```

Recarregando configurações de dns


```bash
nmcli general reload dns-rc
nmcli general reload dns-full

```