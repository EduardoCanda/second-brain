---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando umount é utilizado para desmontar um sistema de arquivo, ele é extremamente simples e objetivo, com isso podemos desmontagem sistemas de arquivos no nosso [[Estrutura de Diretorios|FHS]], para entender mais sobre montagens acesse [[Montagem|aqui]]

O Comando umount deve desmontar dispositivos que não estão em uso, caso haja algum processo que tenha acesso ao volume durante a tentativa de montagem o comando retornara um erro `umount: /media/berti/pendrive: o alvo está ocupado.`.Para resolver esse problema você pode usar o comando [[fuser]], para identificar um possível processo que está bloqueando o sistema de arquivos alvo.

## **Exemplos de utilização**

```bash
sudo umount /media/berti/pendrive -v
```
Ao Rodar esse comando é possível observar a saída:
![[mount-v.png]]
Além disso é possível usar identificadores alternativos para desmontar os diretórios como: 