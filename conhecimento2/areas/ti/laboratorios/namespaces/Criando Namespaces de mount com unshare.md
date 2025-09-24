---
tags:
  - Linux
  - NotaPermanente
categoria: namespaces
ferramenta: cli
---
#### **Criando namespace de montagem simples**

Crie um namespace de montagem isolado:

```bash
sudo unshare --mount --fork bash
```    
- `--mount`: Cria o namespace de montagem.
- `--fork`: Inicia um novo processo no namespace.

Dentro do namespace, veja os pontos de montagem:
```bash
findmnt -o +PROPAGATION
```

Uma curiosidade é que ao executar o  comando findmnt com a opção de listar o tipo de propagação é possível visualizar que todo sistema de arquivos visível dentro do namespaces está com a opção [[Configurações de propagação#**Montagem em modo privado**|private]], reforçando assim nosso aprendizado em modos de propagação de pontos de montagem 

Tente montar algo no namespace:
```bash
sudo mount -t tmpfs tmpfs /mnt
```

Isso cria um sistema de arquivos temporário (`tmpfs`) montado em `/mnt` **somente dentro do namespace**.
    
4. Verifique no host:
```bash
mount | grep /mnt
```
O host não verá o `/mnt` montado dentro do namespace.
5. Saia do namespace:
```bash
exit
```
O namespace é destruído e o ponto de montagem isolado desaparece.

#### **Combinando namespaces de montagem e PID**

Você pode combinar namespaces de montagem com outros, como PID, para criar ambientes mais isolados.

Exemplo:
```bash
sudo unshare --mount --pid --fork --mount-proc bash 
mount --make-slave /
mkdir /mnt/test 
mount -t tmpfs tmpfs /mnt/test 
ps aux > /mnt/test/processes.txt
```

Nesse caso:

- O namespace de montagem isola os pontos de montagem.
* Nesse exemplo foi feito uma alteração de propagação para [[Configurações de propagação#**Montagem em modo slave**|slave]]
- O namespace de PID isola os processos.
- Você cria um sistema de arquivos temporário para armazenar os dados do namespace.
