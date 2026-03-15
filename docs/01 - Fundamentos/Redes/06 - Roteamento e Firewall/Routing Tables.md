# Routing Tables (Tabelas de Roteamento)

As **Routing Tables** (tabelas de roteamento) são estruturas que dizem ao sistema operacional ou ao roteador:

- para onde um pacote deve ir;
- por qual interface ele deve sair;
- qual próximo salto (*next hop*) usar.

Sem tabela de roteamento, um host até consegue falar com a própria rede local, mas não sabe como alcançar outras redes.

---

## 1) Visão mental rápida

Pense na tabela de roteamento como uma tabela de "decisão de caminho":

```text
Destino do pacote -> Existe rota mais específica?
                    -> Sim: usa essa rota
                    -> Não: usa rota padrão (default gateway)
                    -> Não existe padrão: descarta pacote
```

---

## 2) Anatomia de uma rota

Uma entrada típica possui:

- **Destino**: rede de destino (ex: `10.0.2.0/24`)
- **Gateway/Next Hop**: próximo roteador (ex: `192.168.1.1`)
- **Interface**: saída (ex: `eth0`)
- **Métrica**: custo/prioridade (menor normalmente vence)

Exemplo conceitual:

```text
+----------------+---------------+----------+---------+
| Destino        | Gateway       | Iface    | Métrica |
+----------------+---------------+----------+---------+
| 192.168.1.0/24 | on-link       | eth0     | 100     |
| 10.10.0.0/16   | 192.168.1.254 | eth0     | 200     |
| 0.0.0.0/0      | 192.168.1.1   | eth0     | 300     |
+----------------+---------------+----------+---------+
```

---

## 3) Como a escolha de rota acontece (Longest Prefix Match)

A regra principal é: **vence a rota mais específica**.

```text
Pacote para 10.10.10.8

Rotas disponíveis:
- 10.0.0.0/8
- 10.10.0.0/16
- 10.10.10.0/24

Escolha: 10.10.10.0/24 (mais específica)
```

Se houver empate de prefixo, entram critérios como métrica, política e ECMP.

---

## 4) Fluxo com desenho ASCII

```text
+-------------------+
| App gera pacote   |
+-------------------+
          |
          v
+-------------------+
| Kernel consulta   |
| Routing Table     |
+-------------------+
          |
          v
+---------------------------+
| Encontrou rota específica?|
+---------------------------+
      | sim                      | não
      v                          v
+--------------------+      +-----------------------+
| Usa rota escolhida |      | Existe rota default? |
+--------------------+      +-----------------------+
                                  | sim      | não
                                  v          v
                          +----------------+  +-------------------+
                          | Usa gateway    |  | Descarta pacote  |
                          | padrão         |  | (network unreachable)
                          +----------------+  +-------------------+
```

---

## 5) Tabela de roteamento no Linux

Comandos comuns:

```bash
ip route
ip route show table main
ip route get 8.8.8.8
```

Exemplo de saída simplificada:

```text
default via 192.168.0.1 dev eth0 proto dhcp src 192.168.0.20 metric 100
192.168.0.0/24 dev eth0 proto kernel scope link src 192.168.0.20 metric 100
10.20.0.0/16 via 192.168.0.254 dev eth0 metric 200
```

Leitura rápida:
- `default via 192.168.0.1`: tudo que não tiver rota específica vai para esse gateway;
- `192.168.0.0/24 dev eth0`: rede diretamente conectada;
- `10.20.0.0/16 via 192.168.0.254`: rede remota via roteador intermediário.

---

## 6) Diferença entre rota de host, rede e default

```text
Rota de host:   192.168.1.10/32  (um único IP)
Rota de rede:   192.168.1.0/24   (um bloco)
Rota default:   0.0.0.0/0        ("todo o resto")
```

Quanto maior o prefixo (ex: `/32`), mais específica é a rota.

---

## 7) Cenário prático (ASCII)

```text
            Rede A                       Rede B
   192.168.10.0/24                   10.0.0.0/24

 [Host A]----(eth0)---[R1]---(eth1)----[R2]---(eth0)----[Host B]
   .10                  .1      .254      .1               .20

Host A precisa de rota para 10.0.0.0/24 via 192.168.10.1.
R1 precisa conhecer caminho até 10.0.0.0/24 via R2.
```

Se uma rota faltar em qualquer salto, o pacote não chega no destino.

---

## 8) Pontos de troubleshooting

Checklist objetivo:

1. `ip a` -> interface está ativa e com IP?
2. `ip route` -> rota existe?
3. `ip route get <destino>` -> qual caminho real escolhido?
4. `ping <gateway>` -> next hop alcançável?
5. `traceroute <destino>` -> em qual salto para?

---

## 9) Relação com IPTables

- **Routing Table decide**: *por onde* o pacote vai.
- **IPTables decide**: *se* o pacote pode passar e se terá NAT.

As duas funcionam juntas no caminho do pacote.

#redes #linux #routing #fundamentos
