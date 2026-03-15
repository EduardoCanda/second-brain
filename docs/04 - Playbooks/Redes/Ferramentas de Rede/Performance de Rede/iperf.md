# iperf

## O que é

Ferramenta clássica de teste de banda (v2), ainda comum em ambientes legados. Funciona em modelo cliente/servidor para medir throughput TCP/UDP.

## Para que serve

- Validar capacidade de links antigos onde só existe iperf v2
- Medir limite de throughput entre dois hosts Linux
- Detectar perda em UDP sob carga
- Servir como comparação histórica em ambientes que já têm baseline antigo

## Quando usar

- Quando o endpoint remoto só suporta `iperf` (não `iperf3`)
- Em troubleshooting de links WAN/MPLS legados
- Para comparar resultado atual com medições históricas feitas em iperf v2

## Exemplos de uso

```bash
# servidor
iperf -s

# TCP por 15 segundos
iperf -c 10.0.0.20 -t 15

# UDP em 100 Mbps
iperf -c 10.0.0.20 -u -b 100M -t 15

# relatório a cada 1s
iperf -c 10.0.0.20 -i 1 -t 10
```

## Exemplo de saída

```text
$ iperf -c 10.0.0.20 -t 10
[  3]  0.0-10.0 sec  1.01 GBytes   867 Mbits/sec
```

Como interpretar:
- valor em `Mbits/sec` é a taxa média no intervalo
- em UDP, observe perda de datagramas e jitter para avaliar qualidade

## Dicas de troubleshooting

- Confirmar versão em ambos os lados (`iperf -v`) para evitar incompatibilidade
- Em testes UDP, começar com `-b` baixo e subir gradualmente
- Se houver throughput baixo, testar tamanho de janela TCP (`-w`) em links de alta latência
- Sempre comparar com `ping`/`mtr` para correlacionar throughput e latência/perda

## Comparação com ferramentas similares

- **iperf vs iperf3**: iperf é útil para legado; iperf3 é preferível para novos testes

## Flags importantes

- `-s`: servidor
- `-c <host>`: cliente
- `-u`: modo UDP
- `-b <taxa>`: taxa alvo no UDP
- `-t <seg>`: duração
- `-i <seg>`: intervalo de relatório
- `-w <janela>`: janela TCP

## Boas práticas

- Documentar claramente que o teste foi feito com v2
- Manter consistência de parâmetros entre execuções para comparar resultados
- Evitar executar junto com backup/sincronização para não distorcer medição
- Usar host dedicado quando possível para reduzir impacto de CPU/disco

## Referências

- `man iperf`
- https://iperf.fr/
