---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O comando `dd` no Linux é uma ferramenta poderosa para copiar e converter dados em baixo nível. Ele é frequentemente usado para criar backups, gravar imagens em dispositivos, recuperar dados, e muito mais. O funcionamento básico do comando envolve a leitura de um fluxo de entrada **(input)** e sua escrita em um fluxo de saída **(output)**, com a possibilidade de conversão ou manipulação dos dados no processo.

Com ele conseguimos zerar um disco, medir velocidade de escrita em um disco, gravar imagens em um pendrive e até criar imagens de disco, tudo isso em [[Exemplos de dispositivos de blocos|dispositivos de bloco]].

## **Estrutura do comando:**
```bash
dd if=<arquivo_entrada> of=<arquivo_saida> [opções]
```
- **`if`** (input file): Especifica o arquivo ou dispositivo de entrada (pode ser um arquivo, partição ou dispositivo como `/dev/sda`).
- **`of`** (output file): Especifica o arquivo ou dispositivo de saída.
- **Opções**: Permitem ajustar o tamanho dos blocos, quantidade de dados copiados, e outras configurações.

## **Exemplos**

#### **Copiando um arquivo byte a byte**
```bash
dd if=arquivo_origem of=arquivo_destino
```

#### **Cria uma imagem binária de todo o disco `/dev/sda`.**
```bash
dd if=/dev/sda of=/caminho/para/imagem.img
```

#### **Grava imagem em um pendrive em blocos de 4MB, e exibe o progresso.**
```bash
dd if=imagem.img of=/dev/sdb bs=4M status=progress
```

#### **Apagando um disco com zeros.**
```bash
dd if=/dev/zero of=/dev/sda bs=1M
```

#### **Testar a velocidade de gravação escrevendo 1GB de zeros**.
```bash
dd if=/dev/zero of=/tmp/teste bs=1M count=1024

```

#### **Cria uma imagem binária de todo o disco `/dev/sda`.**
```bash
dd if=/dev/sda of=/caminho/para/imagem.img
```


## **Opções Comuns**

- **`bs=<tamanho>`**: Define o tamanho do bloco. Ex.: `bs=4M` (blocos de 4 MB).
- **`count=<número>`**: Especifica o número de blocos a serem copiados.
- **`status=progress`**: Mostra o progresso da operação.
- **`conv=<opções>`**: Realiza conversões, como `notrunc` (não truncar o arquivo de saída) ou `ucase` (converter para maiúsculas).

## **Cuidados**

- **Risco de Sobrescrever Dados**: Como o `dd` trabalha em baixo nível, erros podem causar perda de dados. Verifique **com cuidado** os caminhos de entrada e saída.
- **Performance**: Ajuste o tamanho do bloco (`bs`) para melhorar a velocidade de transferência.
- **Permissões**: Para acessar dispositivos de bloco, normalmente são necessárias permissões de administrador (`sudo`).
## **Trabalhando com unidades corretas de bytes `bs`**

Por padrão o comando dd trabalha com o numero de 512 bytes, porém é possível alterar essa quantidade a depender da necessidade, desde uma copia de dispositivos grandes como HDs e SSDs, até em micro dispositivos como pendrives etc....

```bash
dd if=arquivo_origem of=arquivo_destino bs=512
```

Quanto menor a quantidade de bytes, mais operações de leitura/escrita serão executadas podendo tornar o processo mais lento.

#### **Pequenos blocos**

- **Tamanho do bloco**: 512 bytes.
- O comando fará muitas operações de leitura/escrita, uma para cada 512 bytes.
- **Contras**: Mais lento, devido ao grande número de operações.
- **Prós**: Útil para copiar sistemas de arquivos ou dispositivos onde a granularidade importa, como discos com setores de 512 bytes.

#### **Blocos grandes**

```bash
dd if=arquivo_origem of=arquivo_destino bs=4M
```

- **Tamanho do bloco**: 4 MB.
- O comando fará menos operações, já que lê e escreve mais dados de uma vez.
- **Prós**: Geralmente mais rápido, ideal para copiar grandes volumes de dados como imagens de disco.
- **Contras**: Pode consumir mais memória e ser menos eficiente se o dispositivo ou sistema de arquivos não suportar tamanhos de bloco grandes.

#### **Testando o impacto do tamanho do bloco**

Você pode medir o desempenho com diferentes tamanhos de bloco. Por exemplo:

```bash
dd if=/dev/zero of=teste.img bs=512 count=100000 status=progress 
dd if=/dev/zero of=teste.img bs=4M count=10 status=progress
```
- O primeiro comando copia 50 MB em blocos de 512 bytes.
- O segundo copia 40 MB em blocos de 4 MB.
- Compare o tempo que cada operação leva.
#### **Determinando o tamanho ideal do bloco**

- **Dispositivos de bloco (discos, USBs):** Um tamanho de bloco maior, como 1 MB (`bs=1M`) ou 4 MB (`bs=4M`), geralmente oferece melhor desempenho.
- **Arquivos pequenos ou sistemas com pouca memória:** Blocos menores (512 bytes ou 4 KB) podem ser mais adequados.
- **Setores de disco:** Verifique o tamanho do setor físico ou lógico do disco (geralmente 512 bytes ou 4096 bytes) e escolha um `bs` múltiplo desse valor.

#### Comando para verificar o tamanho de setor de um disco:

```bash
sudo fdisk -l
```
