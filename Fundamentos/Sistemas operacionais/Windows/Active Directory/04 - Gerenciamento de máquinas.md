Por padrão, todas as máquinas que se juntam ao domínio, são colocadas no container chamado "**Computers**". Todos os servidores, notebooks e PCs da rede estarão lá.

Provavelmente o conjunto de regras e privilégios de umas máquinas não serão de outras. Não há uma regra de ouro para todas elas. Então a primeira **boa prática** é segregrar as máquinas de acordo com o uso delas.

A segregação geralmente segue pelo menos 3 categorias:

## Workstations:
Essa categoria é a primeira mais comum no AD. Cada usuário possui sua estação de trabalho. Utilizam ela para suas tarefas diárias. Esses dispositivos não devem ter usuários com privilégios elevados.

---
## Servers:
A categoria de servidores também é a segunda mais comum. Servidores geralmente oferecem serviços para usuários ou para outros servidores.

---
## Domain Controllers:
A terceira mais comum é a categoria de Domain Controllers. Permitem o administrador do sistema gerenciar o AD Domain.

---

