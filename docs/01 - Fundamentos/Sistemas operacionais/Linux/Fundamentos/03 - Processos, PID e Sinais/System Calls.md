# System Calls

## O que são

**System calls** (ou **chamadas de sistema**) são a interface controlada entre um programa em **modo usuário** e o **kernel** do sistema operacional.

Elas existem para que aplicações possam solicitar serviços do sistema sem acessar diretamente hardware, memória protegida ou estruturas críticas do SO.

Em outras palavras:
- a aplicação pede;
- o kernel valida;
- o kernel executa com privilégios adequados;
- o resultado volta para a aplicação.

---

## Por que elas existem

Se qualquer programa pudesse acessar disco, memória, CPU, tabela de processos ou dispositivos diretamente, o sistema ficaria:
- inseguro;
- instável;
- inconsistente;
- difícil de padronizar.

As system calls resolvem isso fornecendo uma **porta de entrada oficial do kernel**.

Benefícios principais:
- isolamento entre aplicações e kernel;
- segurança;
- padronização de acesso a recursos;
- portabilidade maior para programas;
- controle de permissões e auditoria.

---

## Relação entre modo usuário e modo kernel

Em sistemas como Linux, a CPU opera em níveis de privilégio.

### Modo usuário
- aplicações comuns executam aqui;
- acesso restrito a memória e hardware;
- não pode executar operações privilegiadas diretamente.

### Modo kernel
- o kernel executa aqui;
- possui acesso total aos recursos do sistema;
- controla memória, processos, dispositivos e segurança.

A system call faz a transição segura de **user mode** para **kernel mode** e depois retorna ao processo chamador.

---

## Como uma system call funciona

Fluxo simplificado:

1. O programa chama uma função que eventualmente resulta em uma system call.
2. Os argumentos são preparados em registradores e/ou memória.
3. Uma instrução especial de trap/supervisor call é executada.
4. A CPU muda para modo kernel.
5. O kernel identifica o número da system call.
6. O kernel valida parâmetros, permissões e contexto.
7. O serviço solicitado é executado.
8. O kernel retorna um valor de sucesso ou erro.
9. A CPU volta ao modo usuário.

### Importante
Uma system call **sempre provoca troca de modo** entre usuário e kernel, mas **nem sempre gera troca de contexto** entre processos.

- **Mode switch:** acontece para entrar/sair do kernel.
- **Context switch:** só acontece se o processo bloquear, perder a CPU ou o escalonador decidir trocar a execução.

---

## Exemplo intuitivo

Quando um programa precisa escrever texto na tela, ele não conversa diretamente com o driver de vídeo. Em vez disso, ele faz uma solicitação ao sistema operacional por meio de uma system call como `write()`.

Da mesma forma:
- abrir arquivo → `open()`;
- ler arquivo → `read()`;
- criar processo → `fork()`;
- substituir programa em execução → `execve()`;
- encerrar processo → `exit()`.

---

## System call vs função de biblioteca

Nem toda função usada por um programa é uma system call.

### Função de biblioteca
É oferecida por bibliotecas como a **glibc**.
Exemplos:
- `printf()`
- `fopen()`
- `malloc()`

### System call
É a entrada real no kernel.
Exemplos:
- `write()`
- `open()`
- `mmap()`
- `fork()`

### Relação entre elas
Muitas funções de biblioteca são apenas **wrappers** para system calls.

Exemplo:
- `fopen()` é uma função de biblioteca;
- internamente, ela pode usar `open()`.

Outro exemplo:
- `printf()` normalmente faz buffering em espaço de usuário;
- em algum momento, o envio real de dados pode resultar em `write()`.

---

## Principais categorias de system calls

## 1. Controle de processos
Usadas para criar, executar, sincronizar e encerrar processos.

Exemplos:
- `fork()`
- `execve()`
- `wait()` / `waitpid()`
- `exit()`
- `getpid()`
- `kill()`

Casos de uso:
- criar processo filho;
- carregar outro programa;
- esperar término de filho;
- enviar sinais.

---

## 2. Manipulação de arquivos e diretórios
Permitem interagir com sistemas de arquivos.

Exemplos:
- `open()`
- `read()`
- `write()`
- `close()`
- `lseek()`
- `stat()`
- `unlink()`
- `mkdir()`

Casos de uso:
- abrir arquivo;
- ler conteúdo;
- gravar dados;
- remover arquivo;
- consultar metadados.

---

## 3. Gerenciamento de memória
Usadas para reservar, mapear e liberar memória.

Exemplos:
- `mmap()`
- `munmap()`
- `brk()`
- `mprotect()`

Casos de uso:
- mapeamento de arquivos em memória;
- criação de regiões anônimas;
- controle de permissões de páginas.

---

## 4. Gerenciamento de dispositivos e I/O
Permitem acesso padronizado a dispositivos por descritores e drivers.

Exemplos:
- `ioctl()`
- `read()`
- `write()`
- `poll()`
- `select()`

Casos de uso:
- configurar dispositivo;
- ler teclado, terminal, socket ou disco;
- esperar eventos de entrada e saída.

---

## 5. Comunicação entre processos (IPC)
Usadas para troca de dados e sincronização entre processos.

Exemplos:
- `pipe()`
- `socket()`
- `shmget()` / `shmat()`
- `msgget()`
- `semop()`
- `clone()`

Casos de uso:
- criar pipes;
- comunicação por sockets;
- memória compartilhada;
- semáforos.

---

## 6. Informações e controle do sistema
Fornecem dados sobre tempo, usuários, limites e configuração do sistema.

Exemplos:
- `uname()`
- `getuid()` / `setuid()`
- `gettimeofday()`
- `clock_gettime()`
- `umask()`

Casos de uso:
- obter identidade do usuário;
- consultar relógio do sistema;
- ajustar máscara padrão de permissões.

---

## Exemplos clássicos no Linux

### Criar um processo
```c
pid_t pid = fork();
```
- duplica o processo atual;
- pai e filho seguem executando a partir do mesmo ponto;
- retorno diferencia quem é pai e quem é filho.

### Substituir a imagem do processo
```c
execve("/bin/ls", argv, envp);
```
- o processo continua com o mesmo PID;
- o código em execução é substituído por outro programa.

### Ler de um arquivo
```c
ssize_t n = read(fd, buffer, sizeof(buffer));
```
- lê bytes de um descritor de arquivo;
- pode bloquear dependendo do recurso.

### Escrever em um descritor
```c
write(1, "Ola\n", 4);
```
- `1` representa a saída padrão (`stdout`).

---

## Valor de retorno e tratamento de erro

System calls normalmente retornam:
- valor útil em caso de sucesso;
- `-1` em muitos casos de erro, com detalhamento em `errno`.

Exemplo conceitual:
```c
int fd = open("arquivo.txt", O_RDONLY);
if (fd == -1) {
    // consultar errno
}
```

Erros comuns:
- `EACCES` → permissão negada;
- `ENOENT` → arquivo não existe;
- `ENOMEM` → memória insuficiente;
- `EINTR` → chamada interrompida por sinal.

---

## Interface de baixo nível

Em Linux, a system call real pode ser acionada por instruções como:
- `syscall` em arquiteturas modernas x86_64;
- `sysenter` em alguns contextos antigos;
- `int 0x80` em cenários históricos/legados de x86.

Na prática, programas quase sempre usam:
- bibliotecas padrão;
- wrappers da libc;
- linguagens/runtime que encapsulam essas chamadas.

Ou seja: desenvolvedores geralmente **não invocam o kernel “na mão”**, mas usam APIs que acabam chegando nas system calls.

---

## Papel das system calls em segurança

As system calls são parte central da segurança do sistema porque o kernel pode:
- validar permissões do processo;
- checar identidade do usuário;
- limitar acesso a arquivos, portas e dispositivos;
- registrar eventos de auditoria;
- aplicar políticas como namespaces, capabilities e seccomp.

Exemplo:
- um processo sem permissão não consegue abrir certos arquivos de `/etc`, mesmo que tente chamar `open()`.

---

## Impacto em desempenho

System calls têm custo maior que chamadas comuns de função porque envolvem:
- transição entre modos de execução;
- validação pelo kernel;
- possível cópia de dados entre user space e kernel space;
- eventual bloqueio e reescalonamento.

Por isso, bibliotecas e aplicações costumam:
- agrupar operações;
- usar buffers;
- reduzir número de chamadas pequenas repetidas;
- preferir interfaces eficientes quando possível.

Exemplo prático:
- fazer 1.000 chamadas pequenas de `write()` costuma ser pior do que fazer menos chamadas com buffers maiores.

---

## Observando system calls no Linux

Ferramentas úteis:

### `strace`
Mostra as system calls feitas por um processo.

Exemplos:
```bash
strace ls
strace -p 1234
```

### `ltrace`
Mostra chamadas de biblioteca, útil para diferenciar biblioteca de system call.

### `/proc`
Ajuda a inspecionar processos, descritores, mapas de memória e estado do processo.

---

## Diferença entre API, ABI e system call

### API
Conjunto de funções expostas para o programador.
Exemplo: funções da libc.

### ABI
Contrato binário entre programa, bibliotecas e sistema.
Inclui convenções de chamada, registradores e formato de binários.

### System call
Entrada formal do programa no kernel para solicitar um serviço do sistema operacional.

Resumo:
- API é o que o programador usa;
- ABI define como o binário conversa;
- system call é como o kernel presta o serviço.

---

## Boas práticas para estudo

- Primeiro entenda **processos**, **memória** e **descritores de arquivo**.
- Depois conecte cada recurso às system calls correspondentes.
- Estude pares clássicos do Linux:
  - `fork()` + `execve()`
  - `open()` + `read()` + `write()` + `close()`
  - `mmap()` + `munmap()`
  - `pipe()` + `fork()`
- Use `strace` para observar teoria e prática ao mesmo tempo.

---

## Resumo rápido

System calls são a **ponte entre aplicações e kernel**.

Sem elas:
- programas não acessariam serviços do SO de forma segura;
- cada software tentaria acessar hardware por conta própria;
- o sistema seria muito menos estável e confiável.

No Linux, entender system calls ajuda a compreender:
- processos;
- arquivos;
- permissões;
- memória;
- I/O;
- depuração e troubleshooting.

---

## Referência

- GeeksforGeeks. *System Call*. Disponível em: <https://www.geeksforgeeks.org/operating-systems/introduction-of-system-call/>.
