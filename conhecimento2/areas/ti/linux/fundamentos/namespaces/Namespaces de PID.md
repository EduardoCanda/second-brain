---
tags:
  - Linux
  - Namespaces
  - NotaBibliografica
---
Os **namespace de PID** isola os identificadores de processos (PIDs). Dentro de um namespace de PID, os processos têm seus próprios PIDs independentes do sistema host. Isso significa que um processo pode ter um PID diferente dentro de um namespace e outro PID no sistema host.

Quando criamos um namespace de pid, dentro do contexto do namespace o processo associado recebe o pid 1, e quando esse processo é encerrado, o namespace também se extingue.

Para mais informações de como criar namespaces de pid acesse [[Criando Namespaces de PID com unshare|aqui]]


**Características dos namespaces de PID** 

- Isola os IDs de processos.
- Cada namespace tem sua própria numeração de processos, começando do PID 1.
- Exemplo: Um contêiner pode acreditar que está executando sozinho no sistema.

## Considerações de Segurança

Namespaces de PID são uma camada importante de segurança em contêineres, mas não são suficientes por si só. Eles devem ser usados em conjunto com outras funcionalidades do Linux, como:

- **Control Groups (cgroups)**: Para limitar o uso de recursos (CPU, memória, etc.).
- **Capabilities**: Para restringir permissões de processos.
- **Seccomp**: Para filtrar chamadas de sistema.