---
tags:
  - Linux
  - Fundamentos
ferramenta: cli
---
Nessa abordagem de comandos é priorizada a legibilidade e funcionalidade sendo considerada human like, pois sempre apresenta tanto a possibilidade de usar opções curtas(-a) quanto opções longas(--all), geralmente os comandos são mais formatados e legíveis por humanos, e sendo focada no mundo [[Linux GNU]], geralmente os comandos apresentam documentação detalhada quando apresentada a flag --help, e tende a oferecer o máximo de funcionalidades na sua composição.

```bash
ls --human-readable --size --all -l
```

Como no exemplo acima é possível ter uma visão muito clara da abordagem, ela tende a ter uma clareza nas opções, para simplificar a analise humana, com isso pode ter impacto na portabilidade já que não segue rigorosamente o padrão [[POSIX]] #NotaPermanente 
