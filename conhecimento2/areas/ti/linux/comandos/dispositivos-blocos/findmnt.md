---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando findmnt(Find Mounts) é utilizado para buscas de montagens, com isso é possível ter uma visão detalhada sobre os pontos de montagem. Existem diversas opções úteis desse comando que pode facilitar e descrever pontos de montagem com detalhes,como por exemplo, ponto de montagem, dispositivo que representa esse ponto, sistema de arquivos, opções que foram usadas para montagem do dispositivo entre outros.

O Comando pode usar como base os arquivos /etc/fstab, /etc/mtab ou/proc/self/mountinfo descritos [[Arquivos de Configuração|aqui]].

Esse comando tem a capacidade de listar somente blocos que já estão montados em nosso sistema de arquivo.

**Exemplos de uso:**

```bash
findmnt  
```

Com esse comando é possível obter uma saída obtendo detalhes dos [[Montagem|mounts]] parecida com essa: 
![[findmnt.png]]

Ainda é possível especificar as colunas que serão apresentadas, podendo diminuir/aumentar a quantidade de colunas

```bash
findmnt --output=TARGET,PROPAGATION
```
È possível alterar a flag --output para somente -o, no padrão [[Estilo Unix|unix]], ao adicionar o + é possível adicionar uma coluna extra a lista de colunas padrões, no manual do comando tem uma lista de colunas disponíveis.
![[findmnt-output.png]]