---
tags:
  - Linux
  - Namespaces
  - NotaPermanente
categoria: sistema_arquivos
---

Os namespaces de montagem isolam o sistema de arquivos, com isso podemos ter uma visão de montagem de nosso sistema dentro do sistema de arquivos do namespace, para entender mais como esse processo funciona com mounts, acesse [[Configurações de propagação|aqui]]

Ele permite que processos vejam e interajam com pontos de montagem que podem ser diferentes do sistema de arquivos do host, ou até compartilhar pontos de montagem com o host utilizando modo de propagação [[Configurações de propagação#**Montagem em modo shared**|shared]], ou [[Configurações de propagação#**Montagem em modo slave**|slave]].

Alterações feitas nos pontos de montagem dentro de um namespace de montagem **não afetam o host** (e vice-versa), isso é possível graças ao modo padrão de montagem do namespace que é [[Configurações de propagação#**Montagem em modo privado**|private]], porém é possível alterar essa configuração e utilizar outros modos.                                                     

É útil para criar ambientes isolados, chroot-like, ou para montar e testar sistemas de arquivos de forma segura.

Para entender como criar namespaces de mount acesse [[Criando Namespaces de mount com unshare|aqui]]

**Características dos namespaces de mount** 

- Isola a visão de sistemas de arquivos montados.
- Cada namespace pode ter seus próprios pontos de montagem.
- Exemplo: Um contêiner pode ter uma estrutura de diretórios diferente da máquina host.