---
tags:
  - Linux
  - Fundamentos
  - NotaPermanente
ferramenta: cli
---
As aspas no contexto de comandos tem um papel fundamental, entender a usabilidade de cada variante é essencial, porém é muito simples, temos duas opções de uso para elas.

## **Aspas Simples**
São utilizadas para representar um texto puro sem nenhum tipo de interpretação
```bash
echo 'Hello World $HOME'
```
Nesse exemplo, mesmo que tenhamos uma tentativa de interpretação de váriavel não irá funcionar pois aspas simples tratam texto sempre como puro, um uso que podemos abordar é a utilização delas para enviar comandos de interpolação para o [[kubernetes|kubernetes]], com isso podemos evitar do terminar substituir variáveis indesejadas.
```bash
kubectl run nginx --image=busybox --restart=Never -it --rm -- /bin/sh -c 'echo "Hello World $HOME"'
```
Nesse  exemplo a variável $HOME utilizada é a do [[pod|pod]] do [[kubernetes|kubernetes]] e não a da maquina host
## **Aspas Duplas**

São utilizadas quando há necessidade de interpolação do conteúdo, o mesmo exemplo acima agora irá funcionar como esperado.
```bash
echo "Hello World $HOME"
```