---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando é utilizado para limpar rotas seguindo um critério específico, ele recebe parametros para realizar a limpeza e caso nenhum seja informado não irá funcionar.
# Exemplos

Limpa todas as rotas padrões

```bash
ip route flush default
```

Limpando rotas que utilizem o endereço 192.168.15.1 como gateway.

```bash
ip route flush via 192.168.15.1
```

Limpando rotas para a rede 192.168.15.0/24

```bash
ip route flush 192.168.15.0/24
```

Limpando rotas de uma determinada tabela

```bash
ip route flush table 100
```

Limpando rotas que tenham uma determinada interface associada.

```
ip route flush dev enp5s0
```