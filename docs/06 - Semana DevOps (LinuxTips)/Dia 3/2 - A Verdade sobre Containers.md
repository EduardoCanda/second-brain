Se você disser "Vou entrar no container" para uma pessoa engenheira sênior de verdade, ela vai rir. Sabe por quê?

**Porque Container não existe.**

Não existe um "objeto físico" ou uma máquina virtual chamada container. O que chamamos de container é apenas uma aplicação rodando no Linux, sobre a qual o Kernel aplicou duas "táticas de ilusão":

1. **Namespaces (A Ilusão da Solidão):**
    
    O Linux engana a sua aplicação. Ele cria um _namespace_ isolado e diz para o seu processo: _"Você é o único que existe nesta máquina, você é o PID 1 (Process ID 1), você tem a sua própria placa de rede"_. A aplicação acredita e roda isolada.
    
2. **Cgroups (A Coleira de Recursos):**
    
    Os _Control Groups_ (Cgroups) limitam o uso de recursos de um processo. Você diz: _"Essa aplicação só pode usar 500MB de RAM e meia CPU"_. Se ela tentar usar 501MB, o Kernel do Linux puxa a coleira.
    

Quando você junta **Namespaces + Cgroups + um sistema de arquivos isolado (Rootfs)** = O mercado decidiu chamar isso de "Container".