---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para listar as rotas disponíveis no host, ele segue um padrão de listagem em tabela, ele é o comando padrão executado ao executar [[ip route]] ou simplesmente [[ip route|route]].
# Exemplos

```bash
ip route show
```

![[ip-route-show.png]]

O Output terá sempre uma logica envolvida, por exemplo na primeira linha retornada da tabela:

* **default via 192.168.15.1:** Significa que por padrão, caso um endereço não seja especificado, por padrão ele irá seguir através do gateway 192.168.15.1.
* **dev enp5s0:** Seguindo a linha de raciocinio acima ele usara a interface enp5s0 em conjunto com o gateway selecionado acima.
* **proto dhcp:** O meio em que a rota foi gerada
* **src 192.168.15.1**: Endereço na interface selecionada que será utilizado para gerar os pacotes.
* **metric 100:** A metrica de priorização utilizada para essa rota, quanto menor, melhor, no caso por se tratar de uma interface ethernet, o [[NetworkManager]], gerou essa com prioridade em relação a interface wifi.

È importante observar que foi gerada rotas duplicadas tanto para interface enp5s0 quanto para interface wlp4s0, pois ambas se conectam na mesma rede, porém é possível visualizar no final da tabela um campo chamado **metric**, este campo se refere a prioridade da rede, quanto menor, maior a prioridade de um pacote ser direcionado para aquela interface.