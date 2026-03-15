Subir 5 containers no seu notebook (usando Docker ou Podman) é fácil.

Mas como você gerencia 5.000 containers distribuídos em 100 servidores (Nodes)? Se um servidor queimar a fonte de energia de madrugada, quem move os containers dele para os outros 99 servidores que ainda estão vivos?

**Isso é Orquestração.** E o rei da orquestração é o Kubernetes (K8s).

### O Cérebro (Control Plane) e os Trabalhadores (Worker Nodes)

O Kubernetes é dividido em duas grandes partes:

- **Control Plane:** É a gerência. Ele não roda a sua aplicação. Ele guarda anotações (etcd), decide onde os containers vão rodar (scheduler) e expõe uma recepção para você falar com ele (API Server).
    
- **Worker Nodes:** São os servidores braçais. Lá roda a sua aplicação.
    

### O Soldado do Linux: Kubelet

Em cada Worker Node, roda um processo chamado **Kubelet**. Ele é quem recebe as ordens da gerência e fala pro Sistema Operacional (Linux): _"Cria um Namespace e um Cgroup aqui pra essa aplicação rodar"_.

### O Superpoder: Desired State (Estado Desejado)

O K8s trabalha com um conceito chamado **Loop de Reconciliação**.

Você não diz para ele: _"Crie 3 cópias do meu site"_.

Você diz (Declarativo): _"O Estado Desejado é existirem 3 cópias"_.

O Kubernetes então entra num loop infinito de observação:

1. _Quantos sites eu tenho agora? 1._
2. _Qual é o desejo? 3._
3. _Ação: O Kubernetes manda o Kubelet subir mais 2 para empatar a realidade com o Desejo._