---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O Comando importa uma conexão, no momento essa opção só pode ser utilizada para conexões do tipo VPN, é possível utilizar a estratégia de import temporário usando a flag  `--temporary`

# Exemplos

```bash
nmcli connection import type VPN arquivo_origem.nmconnection
```