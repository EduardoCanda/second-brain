---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para configurar algumas propriedades do dispositivos sendo elas **autoconnect** e **managed** e as opções são yes ou no, os nomes são auto descritivos então não precisamos de detalhes.
# Exemplos

Tornando dispositivo não gerenciado pelo network manager

```bash
nmcli device set wlp4s0 managed no
```

Configurando dispositivo para não se conectar automaticamente
```bash
nmcli device set wlp4s0 autoconnect no
```