# RAID 1

## Definition
RAID 1 é um nível de RAID baseado em **mirroring**, no qual os mesmos dados são gravados em dois ou mais discos.

## Why it exists
Existe para aumentar disponibilidade e simplificar recuperação após falha de disco, mantendo cópia idêntica em tempo real.

## How it works
Cada escrita é replicada para todos os discos do espelho.
- Capacidade útil: equivalente ao menor disco do espelho.
- Tolerância a falhas: depende da quantidade de cópias; com 2 discos, tolera falha de 1.
- Leitura pode ser balanceada entre discos (dependendo da implementação), melhorando desempenho de leitura.

Com 2 discos de 1 TB:
- Capacidade útil: 1 TB
- Falha tolerada: 1 disco

## When to use
Use quando confiabilidade é prioridade e a perda de 50% da capacidade é aceitável:
- Partições de sistema
- Bancos de dados pequenos e críticos
- Serviços que exigem recuperação rápida

## Examples
Exemplo real:
- Servidor de autenticação com dois SSDs em RAID 1 para manter serviço online mesmo com falha de um disco.

## Visual Representation
```mermaid
flowchart LR
    W[Escrita] --> M1[Disco A]
    W --> M2[Disco B]
    M1 -. cópia idêntica .- M2
```

## Related Notes
- [RAID](RAID.md)
- [RAID 0](RAID 0.md)
- [RAID 10](RAID 10.md)
- [Armazenamento e Mounts](Armazenamento e Mounts.md)
