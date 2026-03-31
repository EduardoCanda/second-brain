# RAID 5

## Definition
RAID 5 combina **striping + paridade distribuída**, exigindo no mínimo 3 discos.

## Why it exists
Existe para equilibrar capacidade útil, performance de leitura e tolerância a falha com custo menor que espelhamento completo.

## How it works
Os dados são distribuídos entre discos e a paridade também é distribuída (sem disco dedicado de paridade).
- Capacidade útil: `(N - 1) x tamanho do menor disco`.
- Tolerância a falhas: 1 disco.
- Leitura: boa performance.
- Escrita: penalidade por cálculo/atualização de paridade.

Com 4 discos de 1 TB:
- Capacidade útil: 3 TB
- Falha tolerada: 1 disco

## When to use
Use quando há necessidade de boa capacidade com redundância básica:
- File servers
- Repositórios de backup secundário
- Ambientes com predominância de leitura

Evite em workloads com escrita aleatória intensa ou discos muito grandes (rebuild mais demorado e arriscado).

## Examples
Exemplo real:
- NAS corporativo para compartilhamento de arquivos com 6 HDDs em RAID 5, priorizando capacidade e leitura.

## Visual Representation
```mermaid
flowchart TD
    A[Stripe 1: Dados + Paridade]
    A --> D1[Disco 1: A1]
    A --> D2[Disco 2: A2]
    A --> D3[Disco 3: P(A)]
```

## Related Notes
- [RAID](RAID.md)
- [RAID 6](RAID 6.md)
- [RAID 10](RAID 10.md)
- [Armazenamento e Mounts](Armazenamento e Mounts.md)
