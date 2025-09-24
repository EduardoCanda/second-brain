---
tags:
  - Linux
  - Redes
ferramenta: cli
---
O Comando nmcli é utilizado para gerenciar redes e interfaces de rede de maneira persistente(principal diferença em relação ao comando [[Areas/TI/Redes/Protocolos/Pilha de Protocolos TCP/IP]]), é possível realizar diversas operações/personalizações, podemos tornar tudo isso persistente. Ele representa a interface de linha de comandos do [[NetworkManager]].

Ele oferece uma gama de opções para visualização detalhada de interfaces de redes e suas configurações, podemos criar interfaces virtuais entre outras diversas opções de uso.

A Operabilidade desse comando a simular com a do comando [[Areas/TI/Redes/Protocolos/Pilha de Protocolos TCP/IP]], não é necessário usar todo o comando para executar algo por exemplo, podemos simplificar da forma a baixo.

```bash
nmcli connection show
nmcli con show
nmcli co sh
nmcli c s
```

### Conceitos Fundamentais

1. **NetworkManager**: Serviço que gerencia automaticamente conexões de rede.
2. **Dispositivo**: Interface física ou virtual de rede (exemplo: `eth0`, `wlan0`).
3. **Conexão**: Configuração associada a um dispositivo (exemplo: DHCP, IP estático).
4. **Perfis de Conexão**: Permitem salvar diferentes configurações para uma mesma interface.
5. **UUID**: Identificador único de conexões no NetworkManager.


As **Conexões** são extremamente interessantes pois conseguimos atribuir uma infinidade de configurações de rede diferentes para uma mesma interface e com isso, podemos trocar o "perfil" de execução daquela interface com poucos comandos, para mais detalhes sobre conexões é possível acessar [[nmcli connection|aqui]], *È importante sempre lembrar que conexões no network manager se refere a uma configuração específica em uma interface de rede.*

O nmcli ou nmtui grava as conexões em disco, sendo possível visualizar esses arquivos e editar eles manualmente, porém isso acaba sendo necessário somente em um cenário de excessão e via de regra é recomendável realizar essas alterações via linha de comando, facilitando assim essa gestão.

[Aqui](https://manpages.org/nm-settings/5) possúi uma vasta lista de configurações possíveis no network manager.

# Manual
[Manual Nmcli](https://networkmanager.dev/docs/api/latest/nmcli.html)
# Objetos disponíveis

[[nmcli connection|connection]]
[[nmcli device|device]]
[[nmcli general|general]]
[[nmcli general|monitor]]
[[nmcli general|agent]]
[[nmcli general|networking]]