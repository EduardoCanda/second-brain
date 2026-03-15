# iw

## O que é

Ferramenta moderna baseada em **nl80211/cfg80211** para inspeção e configuração de interfaces Wi-Fi no Linux.

## Para que serve

- Ver estado do link Wi-Fi (SSID, frequência, bitrate, sinal)
- Listar capabilities da placa (bandas, canais, modos)
- Fazer scan de redes e diagnosticar interferência/canal
- Investigar desconexões por baixa qualidade de sinal

## Quando usar

- Notebook/host Linux conecta no Wi-Fi, mas tráfego está lento ou instável
- Precisa confirmar banda (2.4GHz vs 5GHz) e largura de canal
- Troubleshooting de roaming, RSSI fraco, AP congestionado

## Exemplos de uso

```bash
iw dev
iw dev wlan0 link
iw dev wlan0 scan | head -n 40
iw phy phy0 info
```

## Exemplos de saída

```text
$ iw dev wlan0 link
Connected to 34:60:f9:12:34:56 (on wlan0)
	SSID: Corp-WiFi
	freq: 5180
	RX: 1293091 bytes (11930 packets)
	TX: 220183 bytes (2101 packets)
	signal: -62 dBm
	rx bitrate: 433.3 MBit/s MCS 9 40MHz short GI
	tx bitrate: 300.0 MBit/s MCS 15 40MHz short GI
```

Leitura prática:
- `signal` melhor que -67 dBm costuma ser aceitável para voz/vídeo.
- `freq` mostra em qual canal/banda você está operando.
- Bitrate alto com perda alta pode indicar interferência, não falta de banda.

## Dicas de troubleshooting

- Correlacione `signal` com perda real (`ping`) e throughput (`iperf3`).
- Se sinal oscila muito, investigue distância, obstáculos e canal do AP.
- Use `iw phy` para confirmar se adaptador suporta 5GHz/HT/VHT/HE.
- Se `iw dev wlan0 link` retorna "Not connected", valide NetworkManager/wpa_supplicant.

## Flags importantes

- `dev`: operações por interface (`wlan0`).
- `phy`: operações por rádio físico (`phy0`).
- `link`: estado de associação atual.
- `scan`: varredura de redes (pode exigir privilégios).
- `station dump`: métricas de clientes (modo AP).

## Boas práticas

- Prefira `iw` em vez de `iwconfig` em ambientes modernos.
- Em incidentes de Wi-Fi, colete também `journalctl -u NetworkManager`.
- Faça medições repetidas em diferentes horários para detectar congestionamento.

## Referências

- `man iw`
- Documentação wireless Linux: https://wireless.docs.kernel.org/
- Projeto iw: https://git.kernel.org/pub/scm/linux/kernel/git/jberg/iw.git/
