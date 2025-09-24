---
tags:
  - Linux
  - Fundamentos
ferramenta: cli
---
 1Com as expansões é possível utilizar a saída de um determinado comando, como argumento para um outro comando, isso é muito útil quando precisamos de um valor variável que vem de outro comando não integrado ao comando de objetivo

### **Segue tabela com meta caracteres para espações e seus significados**


| Meta caractere | Utilização                                                                                 |     |
| -------------- | ------------------------------------------------------------------------------------------ | --- |
| $(COMANDO)     | Retorno do comando executado será substituido por um argumento                             |     |
| $[1 + 2]       | Retorno da expressão aritmética será substituído por um argumento                          |     |
| $              | Substitui o argumento por uma variável de ambiente, é possível combinar este com [[Aspas]] |     |

### **Exemplos**
1. Imprimindo a saida do comando ls com echo
```bash
echo $(ls)
```
2. Imprimindo o resultado da soma com echo
```bash
echo $[1 + 1]
```
2. Imprimindo o valor de uma variável de ambiente
```bash
echo $HOME
```