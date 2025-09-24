---
tags:
  - Linux
  - Fundamentos
ferramenta: cli
---
Quando se fala em comandos linux de maneira geral existem duas técnicas para execução dos mesmos, nesta nota eu mostro duas abordagens que são usadas para esse proposito, a primeira é a [[Estilo Unix]] e a segunda é a [[Estilo GNU]] ambas apresentam caracteristicas distintas e podem ser usadas em conjunto, geralmente comandos Unix são mais simplificados enquanto comandos GNU são mais descritivos.

Exemplo abordagem UNIX:
```bash
kubectl get pod -A
```

Exemplo abordagem GNU:
```bash
kubectl get pod --all-namespaces
```

### **Comparação prática entre Unix Style e GNU Style**

| Aspecto               | Unix Style                        | GNU Style                                   |
| --------------------- | --------------------------------- | ------------------------------------------- |
| **Filosofia**         | Faça uma coisa bem.               | Ofereça o máximo de funcionalidades.        |
| **Opções de comando** | Simples, opções curtas (`-o`).    | Opções curtas (`-o`) e longas (`--option`). |
| **Saída**             | Minimalista, legível por máquina. | Mais formatada, amigável para humanos.      |
| **Compatibilidade**   | Altamente compatível (POSIX).     | Maior foco no Linux/GNU.                    |
| **Documentação**      | Limitada.                         | Documentação rica com `--help`.             |
