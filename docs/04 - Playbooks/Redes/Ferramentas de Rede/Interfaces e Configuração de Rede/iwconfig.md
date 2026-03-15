# iwconfig

## O que é

Ferramenta wireless legada do pacote **wireless-tools** (pré-nl80211). Ainda útil em sistemas antigos e ambientes embarcados.

## Para que serve

- Ver parâmetros básicos da interface Wi-Fi (ESSID, modo, frequência, qualidade)
- Ajustes simples legados (txpower, channel, mode)
- Diagnóstico rápido quando `iw` não está disponível

## Quando usar

- Distribuição antiga/firmware legado sem suporte completo ao `iw`
- Scripts antigos de provisionamento Wi-Fi que ainda usam wireless-tools
- Equipamentos embarcados com stack antiga

## Exemplos de uso

```bash
iwconfig
iwconfig wlan0
iwconfig wlan0 channel 6
iwconfig wlan0 txpower 15
```

## Exemplos de saída

```text
$ iwconfig wlan0
wlan0     IEEE 802.11  ESSID:"Corp-WiFi"
          Mode:Managed  Frequency:2.437 GHz  Access Point: 34:60:F9:12:34:56
          Bit Rate=72.2 Mb/s   Tx-Power=15 dBm
          Retry short limit:7   RTS thr:off   Fragment thr:off
          Power Management:on
          Link Quality=57/70  Signal level=-53 dBm
```

Leitura prática:
- `Link Quality` e `Signal level` ajudam a avaliar estabilidade do enlace.
- `Power Management:on` pode gerar economia de energia com aumento de latência.

## Dicas de troubleshooting

- Se os campos aparecerem vazios/limitados, a placa pode estar usando driver moderno (prefira `iw`).
- Em lentidão, teste desativar power save pelo gerenciador de rede.
- Valide frequência/canal para evitar 2.4GHz congestionado em escritório.
- Cruce com `dmesg | rg -i 'wlan|wifi|firmware'` para falhas de driver/firmware.

## Flags importantes

- `<iface> essid <nome>`: define ESSID (legado).
- `<iface> channel <n>`: altera canal.
- `<iface> txpower <dbm>`: ajusta potência de transmissão.
- `<iface> mode managed|monitor|master`: muda modo da interface (dependente de driver).

## Boas práticas

- Trate `iwconfig` como compatibilidade, não como padrão para novos runbooks.
- Para automação nova, use `iw` + ferramentas de gestão (NetworkManager, wpa_supplicant).
- Documente claramente limitações de hardware/driver em ambiente legado.

## Referências

- `man iwconfig`
- wireless-tools: https://hewlettpackard.github.io/wireless-tools/
- nl80211 vs wireless extensions: https://wireless.docs.kernel.org/en/latest/en/developers/documentation/nl80211.html
