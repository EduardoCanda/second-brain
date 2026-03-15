# ifconfig

## O que é

Utilitário legado do pacote **net-tools** para visualizar/configurar interfaces. Ainda aparece em distribuições antigas e scripts herdados.

## Para que serve

- Consultar rapidamente IP, máscara, MAC e contadores RX/TX
- Subir/descer interface em ambientes antigos (`up/down`)
- Ajustar MTU em troubleshooting pontual legado
- Entender scripts antigos que ainda não migraram para `ip`

## Quando usar

- Você está em servidor antigo (RHEL/CentOS antigos, appliances, imagens minimalistas)
- Script legado usa `ifconfig` e precisa manutenção urgente
- Precisa comparar saída antiga com nova após migração para `ip`

## Exemplos de uso

```bash
ifconfig -a
ifconfig eth0
ifconfig eth0 mtu 1400
ifconfig eth0 down && ifconfig eth0 up
```

## Exemplos de saída

```text
$ ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.10.20.15  netmask 255.255.255.0  broadcast 10.10.20.255
        inet6 fe80::5054:ff:fe12:3456  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:12:34:56  txqueuelen 1000  (Ethernet)
        RX packets 892340  bytes 1302298301 (1.3 GB)
        RX errors 0  dropped 221  overruns 0  frame 0
        TX packets 640221  bytes 712339102 (712.3 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Leitura prática:
- `dropped` alto em RX pode apontar gargalo local (buffer/driver/CPU).
- `carrier`/`collisions` são pistas clássicas de problema físico em rede antiga.

## Dicas de troubleshooting

- Se `ifconfig` divergir de `ip a`, use `ip` como fonte de verdade atual.
- Após mudar MTU com `ifconfig`, valide com teste real de tráfego (não só `ping`).
- Em incidentes, capture `ethtool eth0` junto para confirmar link/duplex.
- Evite depender de parsing textual do `ifconfig`; formato varia entre distros.

## Flags importantes

- `-a`: mostra interfaces ativas e inativas.
- `<iface> up|down`: altera estado administrativo da interface.
- `<iface> mtu <valor>`: altera MTU.
- `<iface> <ip> netmask <mask>`: define IP/máscara (legado).

## Boas práticas

- Use `ip` para novos playbooks; mantenha `ifconfig` apenas para compatibilidade.
- Documente claramente quando alteração foi feita por ferramenta legada.
- Em automação, evite `ifconfig`; priorize `ip -j` para parsing robusto.

## Referências

- `man ifconfig`
- net-tools: https://sourceforge.net/projects/net-tools/
- Migração para iproute2: https://www.redhat.com/en/blog/deprecated-linux-command-replacements
