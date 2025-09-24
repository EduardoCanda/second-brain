---
tags:
  - Linux
  - NotaPermanente
  - NotaBibliografica
categoria: sistema_arquivos
ferramenta: cli
---

È possível espelhar um ponto de montagem através da opção --bind, com ela podemos especificar onde queremos espelhar tal dispositivo, porém é importante ressaltar que caso o origem seja desmontado, a montagem destino continuará vinculada e vice versa.

A vantagem dessa estratégia em comparação com a criação de [[ln|links]], é o fato de haver a possibilidade de alterar as configurações de [[Permissoes Arquivo|permissões]] do diretório destino.

## Exemplo basico usando diretórios

```bash
mount --bind olddir newdir
```

Com essa primeira opção temos um problema, caso haja necessidade de espelhar todos os pontos de montagens internos ao olddir, será necessário especificar um a flag `--rbind`

```bash
mount --rbind olddir newdir
```
Dessa forma, se houver outros pontos de montagem internos no olddir o newdir conseguirá visualizar.

## Exemplo montando somente um arquivo

È possível também usar essa estratégia para apontar somente para uma parte do dispositivo por exemplo um arquivo, e montar este em um outro ponto de sua escolha, isso demonstra a granularidade de configurações possíveis com o comando bind

```bash
mount --bind arquivoAlvo.txt arquivoEspelho.txt
```

## Um exemplo completo

**Crie um ambiente de teste:**

```bash 
mkdir -p /mnt/test/origem /mnt/test/destino /mnt/test/origem/subdir 
mount -t tmpfs none /mnt/test/origem/subdir
```

**Teste com `--bind`:**
```bash
mount --bind /mnt/test/origem /mnt/test/destino
```

Verifique o conteúdo:
```bash
ls /mnt/test/destino
```

Você verá `subdir`.
Tente acessar `/mnt/test/destino/subdir`:

```bash
ls /mnt/test/destino/subdir
```
**Erro!** O tmpfs montado não foi replicado.

**Teste com `--rbind`:**

```bash
umount /mnt/test/destino 
mount --rbind /mnt/test/origem /mnt/test/destino
```

Agora, você verá `/mnt/test/destino/subdir` acessível, com o conteúdo do tmpfs replicado.


## Resumo

- **`--bind`**: Vincula apenas o diretório/arquivo principal.
- **`--rbind`**: Vincula o diretório principal e também replica qualquer ponto de montagem dentro dele.
- Use `--bind` para cenários simples e `--rbind` quando há complexidade com submontagens.