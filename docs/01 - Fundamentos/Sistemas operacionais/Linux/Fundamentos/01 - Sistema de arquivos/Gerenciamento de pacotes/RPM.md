RPM (Red Hat Package Manager) é um sistema de gerenciamento de pacotes utilizado em distribuições
Linux como Red Hat Enterprise Linux, Fedora, CentOS e openSUSE.

Ele permite instalar, verificar, consultar e remover pacotes `.rpm` no
sistema.

------------------------------------------------------------------------

## O que é um arquivo `.rpm`?

Um arquivo com extensão `.rpm` é um pacote binário pré-compilado que
contém:

-   Arquivos do programa
-   Metadados (nome, versão, arquitetura)
-   Dependências
-   Scripts de pré/pós instalação
-   Assinatura digital

Download normalmente pode ser feito via:

``` bash
wget https://exemplo.com/programa.rpm
```

------------------------------------------------------------------------

## Conferência de assinatura

Antes de instalar, é recomendado verificar a integridade e assinatura
digital:

``` bash
rpm -K file.rpm
```

ou

``` bash
rpm --checksig file.rpm
```

Resultado esperado: - OK → pacote íntegro e assinatura válida - NOT OK →
arquivo pode estar corrompido ou adulterado

------------------------------------------------------------------------

## Instalação de pacotes

``` bash
rpm -ivh file.rpm
```

Parâmetros: - -i → install - -v → verbose - -h → barra de progresso

### Atualizar ou instalar:

``` bash
rpm -Uvh file.rpm
```

-   -U → upgrade (instala ou atualiza)

### Forçar instalação (cuidado):

``` bash
rpm -ivh --force file.rpm
```

### Ignorar dependências (não recomendado):

``` bash
rpm -ivh --nodeps file.rpm
```

------------------------------------------------------------------------

## Queries (Consultas)

Listar todos os pacotes instalados:

``` bash
rpm -qa
```

Buscar pacote específico:

``` bash
rpm -qa | grep nome
```

Informações detalhadas:

``` bash
rpm -qi nome-do-pacote
```

Listar arquivos instalados pelo pacote:

``` bash
rpm -ql nome-do-pacote
```

Descobrir qual pacote instalou um arquivo:

``` bash
rpm -qf /caminho/do/arquivo
```

------------------------------------------------------------------------

## Remoção (Uninstall)

``` bash
rpm -e nome-do-pacote
```

Observações: - Use o nome do pacote, não o nome do arquivo `.rpm` - RPM
não resolve dependências automaticamente ao remover

------------------------------------------------------------------------

## RPM vs DNF/YUM

RPM trabalha diretamente com arquivos `.rpm` e não resolve dependências
automaticamente.

Ferramentas como DNF e YUM utilizam RPM internamente, mas oferecem:

-   Resolução automática de dependências
-   Download via repositórios
-   Atualizações completas do sistema

Exemplo recomendado:

``` bash
sudo dnf install pacote.rpm
```

------------------------------------------------------------------------

## Relações

-   Linux Package Management
-   DNF
-   YUM
-   APT
-   Distribuições Linux

------------------------------------------------------------------------

## Resumo

-   Trabalha diretamente com arquivos `.rpm`
-   Permite verificação de assinatura
-   Possui sistema avançado de consultas
-   Não resolve dependências automaticamente
