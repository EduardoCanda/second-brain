O núcleo do **Windows Domain** é o **Active DIrectory Domain Service (AD DS)**. Esse serviço é um catálogo que contém a informação de todos os "objetos" que existem na rede. Usuários, grupos, máquina, impressoras, compartilhados e muitos outros.

---
# Objetos:

## Usuários:
Usuário é um tipo de objeto mais comum no AD. Este objeto é dos que são conhecidos como **security principals**, oque signfica que podem ser autenticados por um domínio e possuir privilégios sobre os **recursos**, como arquivos ou impressoras por exemplo.

Usuários podem ser usados por dois tipos de entidades:
- **Pessoas:** Usuários geralmente representam pessoas em uma organização que precisam de acesso a rede. Funcionários, por exemplo.

- **Serviços**: IIS ou MSSQL são exemplos de serviços. Cada serviço requer um usuário para rodar, mas usuários de serviços são diferentes de usuários convencionais. Eles possuem privilégios necessários para rodar um serviço específico.

## Máquinas:
Para todo computador que se juntar ao Active Direcotry Domain, um objeto de máquina será criada. Máquinas também são consideras **Security Principal** e são associadas a uma conta, assim como os **Usuários**.

As contas de máquinas possuem acesso de administrador para o computador a qual elas pertencem, geralmente não são acessadas por ninugém, exceto quem possui suas respectivas credenciais (usuário e senha).

**Nota**: Senhas de máquinas são geradas randomicamente e possuem 120 caracteres.

Indentificar uma conta de máquina é relativamente fácil. Elas seguem uma padronização de nomenclatura. É o nome da conta da máquina seguida de um sinal de dólar. Por exemplo, uma máquina chamada **DC01** teria uma conta de máquina chamada "**DC01$**"

## Grupos de segurança:
Grupos de segurança servem como uma maneira mais organizada de definir privilégios em comum para vários usuários pertencentes do grupo. É prático e mais fácil de gerenciar.

Também são considerados como **security principals** e podem possuir privilégios sobre os recursos da rede.

Grupos podem usuários, máquinas e outros grupos como membros.

Por padrão no **Windows Domain** já possui diversos grupos criados com própositos bem definidos que devem atender a maioria das necessidades. Isso não significa que novos grupos com **privilégios** específicos não possam ser criados. Com certeza podem.

Alguns exemplos:

| **Grupo**          | **Descrição** |
| ------------------ | ------------- |
| Domain Admins      |               |
| Server Operators   |               |
| Backup Operators   |               |
| Account Operatos   |               |
| Domain users       |               |
| Domain computers   |               |
| Domain Controllers |               |
Mais grupos oficiais na [documentação Microsoft](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/active-directory-security-groups)


---



