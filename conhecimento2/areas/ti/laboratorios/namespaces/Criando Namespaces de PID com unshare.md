---
tags:
  - Linux
  - NotaPermanente
categoria: namespaces
ferramenta: cli
---

### **Exemplos**
#### **Criando um namespace de PID**

```bash
sudo unshare --pid --fork --mount-proc bash
```

Abre uma nova shell com um namespace de PID isolado, também cria um ponto de montagem de proc(/proc), isso é util principalmente para os comandos de gestão de processos. com o --fork o processo é criado diretamente nesse novo namespace.

Execute `ps` dentro dele:

```bash
ps
```

Você verá apenas os processos dessa nova shell.