# nload

## O que é

Ferramenta TUI simples para visualizar throughput de entrada/saída por interface, com gráfico temporal leve.

## Para que serve

- Ver tendência rápida de uso de banda sem detalhar fluxos
- Confirmar se há pico sustentado ou rajada curta
- Acompanhar interface durante deploy, backup ou teste de carga

## Quando usar

- Você quer diagnóstico rápido da interface sem complexidade
- Ambiente mínimo (jump host/VM) onde ferramentas mais pesadas não estão instaladas
- Durante execução de `iperf3` para observar comportamento em tempo real

## Exemplos de uso

```bash
# monitora interface específica
nload eth0

# mostra múltiplas interfaces
nload -m

# unidade em bits e atualização a cada 500ms
nload -u b -t 500 eth0
```

## Exemplo de saída

```text
Device eth0 [=====>      420.35 Mbit/s]
Incoming: 380.12 Mbit/s   Outgoing: 40.23 Mbit/s
Min/Avg/Max: 10.2 / 210.4 / 512.8 Mbit/s
```

Como interpretar:
- `Incoming/Outgoing` mostra taxa instantânea por direção
- `Min/Avg/Max` ajuda a identificar burst vs carga estável
- gráfico facilita perceber padrão cíclico (ex.: sincronização a cada minuto)

## Dicas de troubleshooting

- Se taxa oscila muito, reduzir intervalo (`-t`) para capturar burst curto
- Usar junto com `iftop` quando precisar descobrir qual fluxo gerou o pico
- Conferir se está na interface certa (bridge, bond, vlan)
- Se números parecem baixos, verificar unidade (`-u h|b|B`) para não interpretar errado

## Comparação com ferramentas similares

- **nload vs bmon**: nload é mais simples e direto; bmon tem mais métricas detalhadas
- **nload vs iftop**: nload é agregado por interface, iftop é por fluxo

## Flags importantes

- `-m`: múltiplas interfaces na mesma tela
- `-u <h|b|B>`: unidade (auto, bits, bytes)
- `-t <ms>`: intervalo de refresh
- `-a <seg>`: janela de cálculo da média
- `-i <max>` / `-o <max>`: escala máxima de entrada/saída

## Boas práticas

- Padronizar unidade (bits/s ou bytes/s) no time para evitar confusão
- Capturar valores de pico e média durante incidentes
- Usar em conjunto com métricas históricas (Prometheus/Netdata) para contexto
- Evitar concluir causa raiz apenas com nload; complementar com ferramenta por fluxo/pacote

## Referências

- `man nload`
- https://github.com/rolandriegel/nload
