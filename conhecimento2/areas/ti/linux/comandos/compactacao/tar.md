---
tags:
  - Linux
  - NotaPermanente
categoria: sistema_arquivos
linguagem: ShellScript
ferramenta: cli
---
O Comando tar é utilizado para diversas funcionalidades, tanto para [[Compactacão|compactação]], [[Descompactação|descompactação]], [[Compressao|compressão]] e [[Visualização de Conteudo de Arquivo Compactado|visualização de arquivos compactados]].

Ele é amplamente utilizado em diversas [[Distribuições Linux]] e com ele é possível simplificar diversos processos operacionais de tecnologia como por exemplo [[Transferencia de Dados|transferência de dados]] e também [[Backup|backup]] otimizando, organizando e simplificando o uso do disco, para mais detalhes sobre essas disciplinas consulte os links para notas a respeito dessas.

## Organização de opções do comando

- Modo de operação Principal
- Modificadores de operação
- Seleção de nome de arquivo Local
- Opções de correspondência de nome de arquivo (afeta ambos padrões de
 exclusão e inclusão)
 - Controle de sobrescrita
 - Seleção de fluxo de saída
 - Tratamento de atributos de arquivo
 - Tratamento de atributos estendidos de arquivo
 - Seleção e troca de dispositivo
 - Blocagem de dispositivo
 - Opções de formato do arquivo
 - Opções de compressão
 - Seleção de arquivo local
 - Transformações de nome de arquivo
 - Saída informativa
 - Opções de compatibilidade
 - Outras opções

Independente da operação desejada existem flags que sempre são utilizadas nesse comando como por exemplo ***(-v)*** ou ***(--verbose)*** em uma abordagem [[Estilo GNU|estilo gnu]],
também geralmente é usada a opção ***(-f)*** ou ***(--file)*** para apontar o arquivo que será feita a [[Compactacão|compactação]] ou [[Descompactação|descompactação]], então é sempre importante ter isso em mente. 

## Principais opções

| Opção                          | Description                                                    | Divisão de opção                 |
| ------------------------------ | -------------------------------------------------------------- | -------------------------------- |
| -x, --extract, --get           | Extrai arquivos de um arquivo tar compactado                   | Modo de operação principal       |
| -c, --create                   | Cria um novo arquivo compactado                                | Modo de operação principal       |
| -t, --list                     | Lista o conteudo de um arquivo compactado                      | Modo de operação principal       |
| -d, -diff                      | Compara o conteudo compactado com o sistema de arquivos origem | Modo de operação principal       |
| -f, --file                     | Usa o arquivo com nome especificado                            | Seleção e troca de dispositivo   |
| -v, --verbose                  | Exibe em formato de lista os arquivos processados              | Saída informativa                |
| -C, --directory                | Executa a operação no diretório especificado                   | Seleção de nome de arquivo Local |
| -j, --bzip2                    | Comprime/Descomprime o arquivo com o algoritmo bzip2           | Opções de compressão             |
| -J, --xz                       | Comprime/Descomprime o arquivo utilizando o algoritmo XZ       | Opções de compressão             |
| -z, --gzip, --gunzip, --ungzip | Comprime/Descomprime o arquivo utilizando o algoritmo gzip     | Opções de compressão             |

## Exemplo de compressão, descompressão e visualização

```bash
# Criando um arquivo para nosso exemplo
echo opa > arquivo-alvo.txt

# Compactando o arquivo alvo com algoritmo de compressao:
tar -cvjf arquivo.tar.bz2 arquivo-alvo.txt

# Listando conteudo do arquivo tar criado:
tar --list --verbose --file arquivo.tar.bz2

# Criando o diretorio para nosso output:
mkdir output

# Extraindo conteudo de um arquivo tar:
tar --extract --verbose --file arquivo.tar.bz2 --directory output

# Listando diretorio de output
ls output

# Limpando todos arquivos criados

rm arquivo-alvo.txt
rm arquivo.tar.bz2
rm -rf output
```

Em todos esses comandos foi possível ver diversas combinações do comando tar usando tanto opções [[Estilo Unix]] quanto no [[Estilo GNU]] e também operações misturadas de compactação e compressão resultando no arquivo .tar.bz2, lembrando que isso é uma combinação, tanto do empacotamento tar quanto da compressão do bzip, quando se trata de usar essa combinação existe o beneficio de economia de espaço e também multiplos arquivos mantendo a estrutura de diretórios. 

Pros e Contras de usar as abordagens isoladas:

| Aspecto                  | `.bz2`                          | `.tar.bz2`                                           |
| ------------------------ | ------------------------------- | ---------------------------------------------------- |
| **Objetivo**             | Compactar **um único arquivo**. | Empacotar e compactar múltiplos arquivos/diretórios. |
| **Suporte a diretórios** | Não suporta.                    | Suporta.                                             |
| **Tamanho final**        | Compacta o arquivo individual.  | Compacta o pacote `.tar`.                            |
| **Descompressão**        | Usa `bunzip2`.                  | Usa `tar` com a opção `-j`.                          |

Além do bzip2 existem outras alternativas de compressão como xz, e gzip.



## Visualizando conteúdo compactado


Quando se faz uma compactação de arquivos, muitas vezes é necessário se certificar que o conteúdo resultante para avaliar se ele permanece integro ou se houve alguma modificação indesejada, para isso é possível usar a opção diff, ele apresenta uma serie de vantagens possibilitando uma camada de segurança ao realizar ao realizar a operação 

### **Cenário**

Você tem um diretório chamado `meus_dados/` com os seguintes arquivos:

meus_dados/ ├── arquivo1.txt 
			  ├── arquivo2.txt 
				  └── subdir/     
					  └── arquivo3.txt
 
Você cria um backup desses arquivos em um arquivo tar chamado `backup.tar`

Posteriormente, alguém altera o conteúdo de `arquivo1.txt`, apaga `arquivo2.txt`, e modifica permissões de `arquivo3.txt`. 

Agora você usa o `tar --diff` para identificar as diferenças entre o `backup.tar` e o diretório atual.


### **Passos Práticos**

#### 1. Crie o diretório e os arquivos para o exemplo:
```bash
mkdir -p meus_dados/subdir 
echo "Este é o arquivo 1" > meus_dados/arquivo1.txt 
echo "Este é o arquivo 2" > meus_dados/arquivo2.txt 
echo "Este é o arquivo 3" > meus_dados/subdir/arquivo3.txt
```
#### 2. Crie o arquivo tar com um backup do diretório:

```bash
tar -cvf backup.tar meus_dados/
```
- Saída esperada:
```bash
meus_dados/ 
meus_dados/arquivo1.txt 
meus_dados/arquivo2.txt 
meus_dados/subdir/ 
meus_dados/subdir/arquivo3.txt
```
#### 3. Faça alterações no diretório:

- **Modifique o conteúdo de `arquivo1.txt`:**
```bash
echo "Este é o arquivo 1 MODIFICADO" > meus_dados/arquivo1.txt
```
- **Remova `arquivo2.txt`:**
```bash
rm meus_dados/arquivo2.txt
```

- **Altere as permissões de `arquivo3.txt`:**
```bash
chmod 600 meus_dados/subdir/arquivo3.txt
```
   
#### 4. Use o comando `tar --diff` para verificar as diferenças:

```bash
tar --diff -f backup.tar
```
#### 5. Saída esperada:

```
meus_dados/arquivo1.txt: Modificação de tamanho detectada meus_dados/arquivo2.txt: Arquivo ausente meus_dados/subdir/arquivo3.txt: Modificação de permissões detectada
```

---

### **O que está acontecendo?**

- **`arquivo1.txt`:** O conteúdo foi modificado, então o `tar --diff` detecta uma diferença no tamanho.
- **`arquivo2.txt`:** O arquivo foi removido, então o `tar --diff` o reporta como ausente.
- **`arquivo3.txt`:** As permissões foram alteradas, o que é identificado pelo comando.

---

### **Verificações adicionais**

- **Use a opção `-v` para mais detalhes:**
```bash
tar --diff -v -f backup.tar
```

- **Reverter mudanças para confirmar integridade:**
Restaure o backup:
```bash
tar -xvf backup.tar
```
Faça a comparação novamente
```bash
tar --diff -v -f backup.tar
```
### **Resumo**

O exemplo acima demonstra como o `tar --diff` ajuda a detectar alterações em arquivos e diretórios comparando com um backup tar. Essa abordagem é útil para auditorias, verificações de integridade e manutenção de backups confiáveis.