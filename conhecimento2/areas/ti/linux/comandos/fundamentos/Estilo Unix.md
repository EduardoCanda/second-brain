---
tags:
  - Linux
  - Fundamentos
  - "#NotaPermanente"
ferramenta: cli
---
Quando se trata da abordagem, temos um design simplificado, minimalista e modular, sendo utilizados comandos para um proposito único, com comandos pequenos e focados para um único objetivo, isso é combinado geralmente com [[Redirecionamento]]  de entrada e saída de comandos como por exemplo:

```bash
ls | grep 'pasta-1'
```

Além disso como as opções são representadas sempre de forma simplificada é possível combinar várias em uma unica expressão como no exemplo a seguir.
```bash
tar -cvf ArquivoDestino.tar ArquivoASerCompactado.txt -C diretorioDestino
```
Essa abordagem apresenta uma abordagem amigável para maquina, isso significa que é muito utilizada no [[Redirecionamento]] pois a saída tende a ser legível por outras maquinas e processos.

Geralmente essa abordagem apresenta compatibilidade com sistemas unix tradicionais seguindo o padrão [[POSIX]]. 