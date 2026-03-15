## Threads

Uma **thread** é a menor unidade de execução dentro de um processo.

---

## Processo vs Thread

- Processo: isolamento de memória entre processos
- Thread: execução concorrente dentro do mesmo processo
- Threads compartilham heap, arquivos abertos e recursos do processo

---

## Vantagens

- Melhor aproveitamento de CPU multicore
- Menor custo de criação comparado a processos
- Boa estratégia para tarefas paralelas ou I/O concorrente

---

## Riscos

- **Race condition** (duas threads alteram o mesmo dado)
- **Deadlock** (espera circular por recursos)
- **Starvation** (uma thread fica sem acesso ao recurso)

---

## Sincronização

Mecanismos comuns:
- Mutex
- Semáforo
- RWLock
- Variáveis de condição

---

## Regra prática

- Compartilhar menos estado entre threads reduz bugs de concorrência.
