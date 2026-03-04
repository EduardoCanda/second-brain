A internet está cheia de tutoriais que pulam o básico. O estudante aprende a subir um banco de dados na AWS, mas não sabe o que é um `PID` (Process ID) no Linux.

Quando o banco cair às 3h da manhã, a AWS não vai consertar o seu SQL mal otimizado que travou a CPU da máquina.

### Por que estudar Troubleshooting de verdade?

O profissional que o mercado paga bem não é o que decora o comando de subir o servidor. É o que sabe investigar por que ele caiu.

- **`journalctl` / `tail -f /var/log/syslog`:** Não tenha medo dos logs. Eles convergem as dores do sistema em texto. Leia-os com calma.
- **`strace`:** Quando uma aplicação travar sem motivo aparente, o `strace` mostra as chamadas de sistema (System Calls) que ela está tentando fazer ao Kernel do Linux. É o raio-X do erro.
- **Memória e CPU (`top`, `htop`, `/proc/meminfo`):** Descobrir quem está matando a máquina antes que o Kernel acione o OOM Killer (Out Of Memory Killer) e mate a sua aplicação.

### Redes: O Calcanhar de Aquiles

Se você não sabe a diferença entre _DNS não resolvido_ e _TCP sem resposta (timeout)_, você vai sofrer muito em Kubernetes e Cloud.

Metade dos problemas em arquiteturas modernas é uma porta bloqueada ou um registro de DNS vencido. Não é "bruxaria", é protocolo de rede mal configurado.