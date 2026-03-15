O problema de não estudar Linux é que você fica míope no Kubernetes.

**Caso Clássico: OOMKilled**

Seu Pod morre e a interface gráfica (ex: Lens, K9s) diz `Reason: OOMKilled`.

_Mito:_ "O Kubernetes é mau e matou minha aplicação".

_Fato:_ A sua aplicação ultrapassou o limite do **Cgroup** (Memória) que estava definido no YAML dela. O Kernel do Linux (OOM Killer - Out Of Memory Killer) avisou o Kubelet e fuzilou o processo para proteger o resto do servidor.

**Comunicações Paradas (Networking)**

Não existe "Rede do Kubernetes". Existe rede do Linux.

Veth pairs (cabos de rede virtuais), IPTABLES (regras de firewall manipuladas pelo kube-proxy da sua máquina host), e o CoreDNS (que converte o nome do serviço para um IP). Se um Pod não acha o banco de dados, a culpa é de 90% das vezes do DNS. Aja como agiria no Linux!

**O PID 1 e os Sinais (Signals)**

Quando você diminui a escala (Scale Down) de 3 para 2, o Kubernetes não desliga o servidor na tomada. Ele tenta ser educado:

Ele manda um _Signal_ do Linux chamado **SIGTERM** (Sinal de Terminação). Ele fala pro seu processo: _"Pare de aceitar novas requisições e feche a conexão com o banco devagar, você vai morrer"_. (Isso é Graceful Shutdown).

Se a sua aplicação foi mal programada e ignorou o SIGTERM após um tempo limite (geralmente 30 segundos), o Linux mete pé na porta e manda um **SIGKILL** (Morte instantânea impossível de ignorar). E aí, sua conexão cai de vez.