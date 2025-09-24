---
tags:
  - Linux
  - Fundamentos
categoria: sistema_arquivos
---
O sistema de arquivos e diretórios do Linux é baseado em uma hierarquia **FHS(Filesystem Hierarchy Standard)** estruturada como uma árvore, com um diretório raiz chamado **"root"** representado pelo símbolo **/**. Abaixo dessa raiz, estão organizados todos os diretórios, subdiretórios e arquivos. Aqui está uma visão geral de como funciona:

---

### **Estrutura Hierárquica**

- **/ (Raiz):** É o ponto de partida de todo o sistema de arquivos. Tudo no Linux está localizado dentro deste diretório.
- Cada diretório tem um propósito específico. Os principais diretórios padrão incluem:
    - **/bin**: Contém executáveis essenciais, como comandos básicos (`ls`, `cp`, `mv`, etc.).
    - **/boot**: Arquivos necessários para inicializar o sistema, como o kernel e o gerenciador de inicialização (GRUB).
    - **/dev**: Contém arquivos especiais que representam dispositivos do sistema (ex.: `sda`, `tty`).
    - **/etc**: Arquivos de configuração do sistema.
    - **/home**: Diretórios pessoais dos usuários (`/home/user1`, `/home/user2`).
    - **/lib**: Bibliotecas compartilhadas essenciais para o funcionamento do sistema e programas.
    - **/mnt** e **/media**: Pontos de montagem para dispositivos externos (pen drives, discos).
    - **/opt**: Aplicativos opcionais e pacotes instalados manualmente.
    - **/proc**: Informações sobre processos em execução e o kernel (um sistema de arquivos virtual).
    - **/root**: Diretório pessoal do usuário root (administrador).
    - **/tmp**: Arquivos temporários (geralmente apagados em reinicializações).
    - **/usr**: Arquivos e programas de uso geral do sistema.
    - **/var**: Dados variáveis, como logs, filas de impressão, e-mails, etc.