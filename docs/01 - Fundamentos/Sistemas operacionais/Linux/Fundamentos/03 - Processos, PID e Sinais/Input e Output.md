## Input e Output (I/O)

**I/O** representa a troca de dados entre processo, memória, disco, rede e dispositivos.

---

## Tipos comuns de I/O

- I/O de arquivo (disco)
- I/O de rede (sockets)
- I/O de terminal (stdin, stdout, stderr)
- I/O de dispositivos (teclado, USB, sensores)

---

## Modos de I/O

- **Bloqueante**: processo espera a operação terminar
- **Não bloqueante**: processo segue execução e verifica depois
- **Assíncrono**: kernel notifica quando terminar

---

## Descritores de arquivo (FD)

No Linux, quase tudo é tratado como arquivo.

FD padrão:
- `0` → stdin
- `1` → stdout
- `2` → stderr

---

## Gargalos de I/O

Sinais de problema:
- CPU baixa com latência alta
- fila de disco grande
- muitas conexões em espera

Ferramentas úteis:
- `iostat`
- `iotop`
- `vmstat`
- `ss`

---

## Regra prática

- Em aplicações orientadas a rede/disco, o principal limite costuma ser I/O, não CPU.
