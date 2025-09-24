---
tags:
  - Linux
  - Fundamentos
  - Namespaces
  - NotaPermanente
---
 Os **namespaces no Linux** são uma tecnologia de kernel usada para isolar recursos entre processos. Eles permitem que diferentes conjuntos de processos vejam e acessem recursos como se fossem os únicos no sistema, criando ambientes isolados.

Namespaces são a base para tecnologias como contêineres (Docker, [[kubernetes]]) e permitem criar espaços independentes para rede, [[Sistema de arquivos|sistema de arquivos,]] processos, e outros recursos.

Por padrão ao criar namespaces ele torna os pontos de montagem como **private**, é necessário especificar a flag `--propagation` para alterar esse comportamento.

Quando associamos mais um uma flag de isolamento no comado [[unshare]], é criado vários namespaces diferentes, porém o processo que será executado irá utilizar todos estes namespaces. Um exemplo de tecnologia que utiliza namespaces é o [[docker]], por padrão ele cria namespaces de PID, montagem, rede, UTS e IPC. Isso é possível de ser observado ao executar o comando [[lsns]].
 <p style="color:red;text-decoration:line-through"> 
 È importante ressaltar que caso precisemos manter nosso namespace persistente basta criar um link simbólico com o comando [[ln]] para o namespace que deseja persistir.
 </p>
Foi realizada uma tentativa de persistir o namespace usando ln, porém sem sucesso por conta que esse comando cria um link estático para um diretório especifico e com isso temos um problema, por exemplo:

Se tentarmos criar um link para **/proc/self/ns/pid**, e na sequencia executar um nsenter **--pid=arquivoDestinoLink**, vamos ter a ilusão que funcionou, porém o namespace que iremos entrar é relativo ao terminal que abrimos e não ao namespace que tentamos persistir, isso acontece nesse exemplo por conta que o self do terminal aberto é diferente do self do namespace.

A Solução mais simples é passar durante a criação do namespace o caminho para onde o descritor deve ser criado, acessa [[unshare#Tornando Namespaces Persistentes|aqui]] para mais informações.

## Arquivos descritores

No nosso [[Sistema de arquivos|FHS]] é possível localizar informações sobre os namespaces de forma muito simples através do diretório **/proc/id_processo/ns**, existem diversos links simbólicos que apontam para os namespaces que o processo está apontando, estes links são chamados de **arquivos descritores de namespaces**.q
### **Como funcionam os namespaces?**

1. **Cada namespace cria uma "visão" independente de um recurso.**
    - Quando um processo é colocado em um namespace, ele enxerga apenas os recursos daquele namespace, isso significa que é possível manipular os dispositivos, processos, arquivos que um namespace pode enxergar.
    - Processos em namespaces diferentes podem coexistir no mesmo sistema sem interferir um no outro.
2. **Os namespaces são hierárquicos.**
    - Um namespace "pai" pode criar namespaces "filhos".
    - O processo pai tem controle sobre os filhos e pode configurar como eles compartilham os recursos.
3. **Isolamento não é total sem outras tecnologias.**
    - Namespaces isolam o **acesso**, mas não limitam o uso de recursos (como memória ou CPU). Para limitar recursos, usa-se [[Cgroups|cgroups]] junto com namespaces.


### **Tipos de Namespaces**

[[Namespaces de PID]]
[[Namespaces de Mount]]
[[Namespaces de Cgroup]]
[[Namespaces de IPC]]
[[Namespaces de Time]]
[[Namespaces de Usuario]]
[[Namespaces de Uts]]
[[Namespaces de Rede]]

### **Como criar namespaces?**

Namespaces podem ser criados manualmente com ferramentas como [[unshare]] para criação e , [[nsenter]], ou programaticamente através de chamadas de sistema (`clone`, `setns`).

#### **Comando `unshare`**

Para criar namespaces, é possível utilizar o comando [[unshare]], ele possui uma série de opções de isolamento para facilitar a criação e gestão 

#### **Comando `nsenter`**

Permite entrar em um namespace já existente é possível usar o comando [[nsenter]], com ele podemos através de algumas flags obter uma gama de opções. 


### **Como os namespaces funcionam juntos?**

Os namespaces podem ser combinados para criar um ambiente completamente isolado, como um contêiner. Por exemplo:

- Um namespace de rede isola o tráfego.
- Um namespace de PID isola os processos.
- Um namespace de montagem isola o sistema de arquivos.

### **Resumo**

- Namespaces isolam recursos no Linux.
- Eles são a base de tecnologias como contêineres.
- Cada tipo de namespace isola um aspecto específico do sistema.
- Combinados, permitem criar ambientes leves e isolados.