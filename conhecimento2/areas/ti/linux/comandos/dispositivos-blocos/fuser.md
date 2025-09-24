---
tags:
  - Linux
  - Redes
  - NotaPermanente
categoria: sistema_arquivos
ferramenta: cli
---
O Comando fuser é usado para identificar os processos que estão usando arquivos ou soquetes, ele tem uma grande utilidade no processo de [[umount]], também pode ser muito útil na identificação de processos que utilizam uma porta especifica, ele retorna o id do processo que está usando o recurso especificado.

Para o [[Sistema de arquivos|sistema de arquivos]], é possível usar esse comando tanto para localizar um processo usando um diretório, quanto um arquivo também.

## **Tipos de Acesso**

O `fuser` também indica como um recurso está sendo usado por um processo. Ele usa **letras** para mostrar o tipo de acesso:

- **r**: Leitura.
- **w**: Escrita.
- **e**: Execução.
- **f**: Arquivo aberto.
- **m**: Mapeamento de memória.


## **Opções úteis**

- **`-k`**: Envia um sinal para os processos que estão utilizando o recurso (padrão: SIGKILL).
- **`-i`**: Solicita confirmação antes de matar um processo.
- **`-v`**: Ativa o modo detalhado (verbose).
- **`-n <namespace>`**: Especifica um namespace (ex.: `tcp`, `udp`, ou `file`).
- **`-a`**: Mostra todos os arquivos especificados, mesmo que nenhum processo os esteja utilizando.
- **`-u`**: Exibe o nome do usuário proprietário do processo.

## **Diferença entre [[lsof|lsof]] e `fuser`**

- Ambos podem identificar processos que estão usando arquivos ou portas, mas:
    - **`fuser`**: Mais simples, focado em um arquivo ou recurso específico.
    - **`lsof`**: Mais poderoso e detalhado, usado para listar descritores de arquivos abertos no sistema inteiro.

## **Exemplos**

#### **1. Verificar quem está usando um arquivo**
```bash
fuser arquivo.txt
```
- Mostra os processos que estão utilizando o arquivo `arquivo.txt`.
#### **2. Verificar processos que usam um diretório**
```bash
fuser /mnt/diretorio
```
- Lista os processos que estão acessando arquivos no diretório `/mnt/diretorio`.
#### **3. Identificar quem está usando uma porta de rede**
```bash
fuser -n tcp 8080
```
- Exibe os processos usando a porta TCP 8080.
- Use `udp` no lugar de `tcp` para portas UDP.

#### **4. Forçar a liberação de um arquivo/diretório**
```bash
fuser -k arquivo.txt
```
- Envia um sinal **SIGKILL** para os processos que estão utilizando `arquivo.txt`, encerrando-os.
#### **5. Listar os nomes dos processos**
```bash
fuser -v arquivo.txt
```

- Mostra uma saída mais detalhada, incluindo:
    - Nome do comando.
    - Usuário do processo.
    - Tipo de acesso ao recurso (leitura, gravação, etc.).

#### **6. Identificar quem impede o desmontar de uma partição**
```bash
fuser -v /mnt/diretorio
```
- Útil para descobrir quais processos estão bloqueando uma partição montada.
#### **7. Usar sinais personalizados**
```bash
fuser -k -TERM arquivo.txt
```
- Envia um sinal **SIGTERM** (em vez de SIGKILL) para os processos, permitindo que eles finalizem de forma graciosa.