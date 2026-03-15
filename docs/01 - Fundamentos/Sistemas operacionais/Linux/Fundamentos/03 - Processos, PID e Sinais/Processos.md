## Processos

Processo é um programa em execução com contexto próprio controlado pelo kernel.

---

## Componentes principais de um processo

- Código (text)
- Dados globais
- Heap
- Stack
- Registradores e contador de programa
- Tabela de arquivos abertos

---

## Ciclo de vida

1. Criação (`fork`)
2. Carga de programa (`exec`)
3. Execução (running/sleeping)
4. Finalização (`exit`)
5. Coleta pelo pai (`wait`) para evitar zombie

---

## Escalonamento

O scheduler define quem usa CPU e por quanto tempo.

Fatores:
- Prioridade
- Nice
- Classe de escalonamento
- Estado do processo

---

## Isolamento

Cada processo possui:
- Espaço de memória separado
- IDs e permissões
- Recursos próprios com controle do kernel

Isso aumenta segurança e estabilidade do sistema.

---

## Comandos úteis

- `ps aux`
- `top` / `htop`
- `pstree`
- `kill`, `pkill`, `killall`

---

## Regra prática

- Processos isolam melhor; threads escalam melhor dentro do mesmo processo.
