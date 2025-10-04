Um **Sistema Operacional (SO)** é um **software fundamental** que atua como intermediário entre o **hardware** do computador e os **usuários/aplicações**.  
Ele gerencia recursos do sistema, fornece serviços essenciais e cria um ambiente para que programas possam ser executados.

---
## 📌 Principais Funções

1. **Gerenciamento de Processos**
   - Controla a execução dos programas (processos e threads).
   - Define prioridade e escalonamento (qual processo roda primeiro).

2. **Gerenciamento de Memória**
   - Aloca e libera memória RAM para processos.
   - Implementa técnicas como memória virtual, paginação e segmentação.

3. **Gerenciamento de Armazenamento**
   - Controla leitura e escrita em discos.
   - Organiza arquivos em **sistemas de arquivos** (ex.: NTFS, EXT4).

4. **Gerenciamento de Dispositivos (I/O)**
   - Controla a comunicação entre software e hardware (impressoras, teclado, rede).
   - Usa drivers para padronizar o acesso.

5. **Gerenciamento de Usuários e Segurança**
   - Define permissões de acesso a recursos.
   - Implementa autenticação, controle de contas e isolamento de processos.

---

## 🏷️ Exemplos de Sistemas Operacionais
- **Desktop/Servidor:** Windows, Linux, macOS, Unix, BSD.  
- **Mobile/Embarcados:** Android, iOS, FreeRTOS.  
- **Especializados:** Sistemas de tempo real (RTOS), mainframes.  

---

## 📊 Arquitetura
O SO normalmente é dividido em **camadas** ou **módulos**:
- **Núcleo (Kernel):** controla hardware, memória e processos.  
- **Chamadas de Sistema (System Calls):** interface para que programas interajam com o kernel.  
- **Shell/UI:** interface de interação com o usuário (linha de comando ou gráfica).  

---

## 🔗 Relacionamentos
- [[Kernel]]  
- [[Processos e Threads]]  
- [[Memória Virtual]]  
- [[Sistemas de Arquivos]]  
