---
tags:
  - Linux
  - Fundamentos
  - NotaPermanente
ferramenta: cli
---
È possível também no linux utilizar conexões de comandos, isso é, podemos executar comandos em forma sequencial conforme nossa necessidade, isso é podemos combinar vários comandos em sequencia

### Abaixo a tabela com os caracteres especiais que podemos usar para esse propósito

| **Meta Caractere** | **Utilização**                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **;**              | Executa comando de forma sequencial independente do resultado                             |
| **&&**             | Executa comando de forma sequencial, desde que o anterior apresente um resultado positivo |
### **Exemplos

1. Executando dois comandos independentes
```bash
sudo apt update; sudo apt dist-upgrade
```
2. Executando dois comandos de forma dependente
```bash
ls -lsh && echo Funcionou
```
Nesse execução irá funcionar porém se o primeiro comando falhar como a seguir não irá ser impresso o texto no comando echo
```bash
ls -lsh diretorio_imaginario && echo 'Não ira imprimir isso!!'
```
