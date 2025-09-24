---
tags:
  - Linux
  - Fundamentos
  - Redes
---
No linux possuímos um sistema para gerenciar redes chamado NetworkManager, ele não é um componente universal disponível em todas distribuições linux, porém no caso do ubuntu podemos utilizar esse para gerenciar conexões de rede **Ethernet, Wi-Fi, VPNs, veths, bridges e outras interfaces virtuais**.

Ele se torna uma alternativa ao o metodo de configuração como ifconfig e arquivos de configurações manuais,(`/etc/network/interfaces` no Debian ou `/etc/sysconfig/network-scripts/` no RHEL) e scripts customizados.
Podemos usar alguns comandos para utilizar essa ferramenta como

* [[nmcli]]
* [[nmtui]]

# ✅ Principais vantagens

- Detecta e configura redes automaticamente.
- Alterna entre redes Wi-Fi e Ethernet sem interrupção.
- Suporta VPNs, modems 4G/5G e redes virtuais.
- Possui interface gráfica, CLI (`nmcli`), TUI (`nmtui`) e API D-Bus.
- Suporta **persistência de configurações**.

# 📌 Componentes do NetworkManager

O NM funciona como um **daemon** (`NetworkManager.service`) que gerencia as conexões através de diferentes ferramentas:

| **Componente**                                | **Função**[]()                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| **`NetworkManager.service`**                  | O serviço principal que gerencia conexões.                                     |
| **`nmcli`**                                   | Interface de linha de comando (CLI).                                           |
| **`nmtui`**                                   | Interface baseada em texto (TUI).                                              |
| **`nm-connection-editor`**                    | Interface gráfica (GUI) para gerenciar conexões.                               |
| **`dnsmasq` / `systemd-resolved`**            | Gerencia o DNS quando NM está ativado.                                         |
| **`wpa_supplicant`**                          | Gerencia conexões Wi-Fi.                                                       |
| <br><br><br><br><br>**`NetworkManager.conf`** | Arquivo de configuração principal (`/etc/NetworkManager/NetworkManager.conf`). |

# Manual

[manual](https://man.archlinux.org/man/NetworkManager.8.en)