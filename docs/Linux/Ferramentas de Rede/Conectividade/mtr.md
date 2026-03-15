# mtr

## O que é

Ferramenta que combina `ping` e `traceroute` em execução contínua, mostrando por salto métricas como perda, latência média, melhor/pior caso e desvio.

## Para que serve

- Detectar **onde** a perda/latência começa e como evolui ao longo do tempo.
- Diferenciar evento pontual de problema persistente (por amostragem contínua).
- Gerar evidência objetiva para acionar provedor com hop e métrica afetados.
- Acompanhar qualidade de rota antes/depois de mudanças de rede.

## Quando usar

- `ping` acusa perda, mas você não sabe em qual hop a degradação inicia.
- Incidentes intermitentes ("oscila e volta"), difíceis de capturar com comando único.
- Comparação de qualidade entre dois links/ISPs/rotas.
- Troubleshooting de latência em aplicações sensíveis (VoIP, trading, banco de dados distribuído).

## Exemplos de uso

```bash
# Modo interativo
mtr 8.8.8.8

# Relatório para anexar em ticket (20 ciclos)
mtr -rw -c 20 api.exemplo.com

# Sem DNS reverso para leitura mais limpa
mtr -rw -n -c 50 1.1.1.1

# Usar TCP para simular tráfego HTTPS
mtr --tcp --port 443 -rw -c 30 api.exemplo.com
```

## Exemplo de saída

```text
$ mtr -rw -c 10 -n 8.8.8.8
Start: 2026-01-10T10:20:15+0000
HOST: srv-app-01                      Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 192.168.0.1                    0.0%    10    1.2   1.1   0.9   1.6   0.2
  2.|-- 10.10.0.1                      0.0%    10    4.8   4.7   4.5   5.1   0.2
  3.|-- 200.160.2.1                   20.0%    10   15.4  15.0  14.7  16.1   0.4
  4.|-- 8.8.8.8                       20.0%    10   18.7  18.3  17.9  19.2   0.5
```

Leitura prática da saída:

- `Loss%` no hop 3 e também no destino: perda real a partir do hop 3.
- `Loss%` em hop intermediário, mas destino 0%: provável rate-limit do roteador (falso positivo).
- `Wrst` e `StDev` altos: jitter significativo, impacto provável em tempo real.
- `Snt` baixo gera leitura fraca; aumente ciclos para confiabilidade.

## Dicas de troubleshooting

- Colete ao menos 50–100 sondas para incidentes intermitentes.
- Execute do cliente e do servidor para identificar se problema é direcional.
- Em cloud, teste também endpoints internos (gateway/NAT/LB) para isolar domínio do problema.
- Use modo relatório (`-rw`) em incidentes; saída interativa é ruim para auditoria posterior.

## Flags importantes

- `-r`: modo relatório (não interativo).
- `-w`: saída "wide" (sem truncar nomes).
- `-c <N>`: quantidade de ciclos.
- `-n`: sem resolução DNS reversa.
- `-i <seg>`: intervalo entre sondas.
- `-u` / `--udp`: força UDP.
- `-T` / `--tcp`: força TCP.
- `-P` / `--port`: porta de destino.

## Boas práticas

- Sempre anexar relatório completo (`mtr -rw`) com horário e origem do teste.
- Evitar conclusões com amostra curta (<20 ciclos), principalmente em jitter/perda baixa.
- Correlacionar com métricas de interface (`ip -s link`, erros/drops) e saturação de banda.
- Ao escalar para provedor, destacar hop inicial de degradação + impacto no destino final.

## Referências

- `man mtr`
- Projeto MTR: https://github.com/traviscross/mtr
