# iftop

## O que é

Monitor interativo de tráfego por fluxo (host origem/destino) em tempo real, semelhante ao `top` para rede.

## Para que serve

- Identificar rapidamente **quem** está consumindo banda
- Detectar fluxos inesperados (backup fora de janela, replicação, exfiltração)
- Ver volume por conexão sem precisar abrir captura completa no Wireshark

## Quando usar

- Interface saturada e você precisa do "top talkers" agora
- Suspeita de tráfego anômalo entre hosts internos
- Troubleshooting de "rede lenta" com causa potencial em poucos fluxos pesados

## Exemplos de uso

```bash
# monitora interface padrão
sudo iftop -i eth0

# sem resolução DNS e mostrando portas
sudo iftop -i eth0 -n -P

# mostra taxa em bytes/s (útil para casar com logs de app)
sudo iftop -i eth0 -B
```

## Exemplo de saída

```text
                 10.0.1.15:443 => 10.0.2.40:53122   120Mb 110Mb 105Mb
                 10.0.2.40:53122 <= 10.0.1.15:443    12Mb  10Mb   9Mb
TX: 122Mb  RX: 14Mb  TOTAL: 136Mb
```

Como interpretar:
- três colunas por fluxo = média curta/média/longa (2s/10s/40s)
- `=>` é tráfego saindo da interface monitorada; `<=` entrando
- `TX/RX/TOTAL` ajuda a confirmar saturação e direção dominante

## Dicas de troubleshooting

- Usar `-n` para evitar atraso por DNS reverso durante incidente
- Filtrar por rede crítica (tecla `f`) para reduzir ruído
- Se precisar evidência forense, complementar com `tcpdump` (iftop não salva pcap)
- Atenção a bond/VLAN: monitorar a interface correta (`bond0`, `eth0.100`, etc.)

## Comparação com ferramentas similares

- **iftop vs nload**: iftop mostra por fluxo; nload mostra agregado por interface
- **iftop vs bmon**: bmon é melhor para série temporal de interface, iftop para top consumers

## Flags importantes

- `-i <if>`: interface
- `-n`: sem resolução de nomes
- `-P`: exibe portas
- `-B`: unidade em bytes/s
- `-N`: não resolve portas por serviço
- `-F <filtro>`: filtro de rede/host na captura

## Boas práticas

- Executar com `sudo` para visibilidade completa
- Registrar prints dos fluxos mais pesados no incidente
- Cruzar horário do pico no iftop com logs de aplicação/jobs
- Em produção crítica, preferir janelas curtas de observação para reduzir overhead

## Referências

- `man iftop`
- https://github.com/soarpenguin/iftop
