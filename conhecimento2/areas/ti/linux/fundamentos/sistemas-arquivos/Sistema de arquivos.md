---
tags:
  - Fundamentos
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
---

O Sistema de arquivos do linux, se trata do principal conceito a ser aprendido ele possui uma [[Estrutura de Diretorios|estrutura de diretorios]], que separa e define de forma organizada a finalidade de cada diretório, entender isso facilita muito o restante dos conceitos do Linux que estão em torno deste conceito.

O sistema de arquivos e diretórios do Linux é baseado em uma hierarquia organizacional estruturada como uma árvore, com um diretório raiz chamado **"root"** representado pelo símbolo **/**. Abaixo dessa raiz, estão organizados todos os diretórios, subdiretórios e arquivos, para informações sobre a hierarquia de arquivos acesse [[Estrutura de Diretorios|aqui]].

### **Características Principais**

1. **Tudo é um arquivo:** No Linux, tudo é tratado como um arquivo, incluindo dispositivos de hardware, processos e sockets. Por exemplo:
    
    - Um arquivo comum é um "arquivo regular".
    - Um disco rígido pode ser acessado como `/dev/sda`.
    - Informações sobre um processo são armazenadas em `/proc/<PID>`.
2. **Permissões de Arquivo:** Cada arquivo ou diretório tem permissões específicas atribuídas para três categorias de usuários:
    
    - **Dono** (Owner).
    - **Grupo** (Group).
    - **Outros** (Others). Permissões incluem leitura (r), escrita (w) e execução (x).
    Para mais informações sobre permissoes de arquivo acesse [[Permissoes Arquivo]]
    
1. **Links:**
    
    - **Links simbólicos (symlinks):** Atalhos para arquivos ou diretórios.
    - **Links físicos:** Referências adicionais ao mesmo arquivo físico.
4. **Montagem de Dispositivos:** No Linux, discos e partições não são automaticamente acessíveis como no Windows. Eles precisam ser **montados** em um ponto de montagem (um diretório existente), como `/mnt` ou `/media`.
    
5. **Sistema de Arquivos Virtual (proc, sys, etc.):**
    
    - **/proc**: Informações sobre processos, como `cpuinfo` e `meminfo`.
    - **/sys**: Interface com os dispositivos do kernel.
6. **Estrutura Modular:** Diferentes sistemas de arquivos (ext4, xfs, btrfs, etc.) podem ser usados para formatar partições, mas a estrutura hierárquica é a mesma.
    

### **Navegação Básica e Comandos**

- [[pwd]] Mostra o diretório atual.
- [[ls]] Lista arquivos e diretórios.
- [[cd]] Navega para um diretório.
- [[mkdir]] Cria um novo diretório.
- [[rm]]  Remove arquivos.
- [[rmdir]] Remove diretórios vazios.
- [[cp]] Copia arquivos.
- [[mv]] Move ou renomeia arquivos.

Essa organização e padronização permitem flexibilidade, segurança e facilidade na manutenção do sistema, tornando-o ideal para múltiplos tipos de uso, desde servidores até desktops.