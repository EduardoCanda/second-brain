---
tags:
  - Linux
  - NotaBibliografica
categoria: sistema_arquivos
ferramenta: cli
---
O comando `grep` (Global Regular Expression Print) é uma ferramenta poderosa em sistemas Unix/Linux usada para buscar padrões em arquivos ou na saída de outros comandos. Ele suporta expressões regulares e tem várias opções para personalizar a busca.

### Sintaxe básica:
```bash
grep [opções] "padrão" [arquivo(s)]
```

### Funcionamento:
1. **Busca em arquivos**:  
   O `grep` lê o conteúdo do arquivo (ou arquivos) especificado e imprime as linhas que contêm o padrão buscado.

   Exemplo:
   ```bash
   grep "erro" arquivo.log
   ```
   → Mostra todas as linhas de `arquivo.log` que contêm a palavra "erro".

2. **Busca em múltiplos arquivos**:
   ```bash
   grep "padrão" arquivo1.txt arquivo2.txt
   ```

3. **Busca recursiva** (em diretórios):  
   Use `-r` ou `-R` para buscar em todos os arquivos de um diretório e subdiretórios.
   ```bash
   grep -r "função" /caminho/do/diretório/
   ```

4. **Ignorar maiúsculas/minúsculas** (`-i`):  
   Faz a busca ser *case-insensitive*.
   ```bash
   grep -i "python" arquivo.txt
   ```
   → Encontra "Python", "PYTHON", "python", etc.

5. **Mostrar linhas que **não** contêm o padrão** (`-v`):  
   Útil para filtrar linhas indesejadas.
   ```bash
   grep -v "comentário" script.py
   ```

6. **Contar ocorrências** (`-c`):  
   Retorna o número de linhas que correspondem ao padrão.
   ```bash
   grep -c "404" access.log
   ```

7. **Mostrar números das linhas** (`-n`):  
   Exibe o número da linha junto com o resultado.
   ```bash
   grep -n "import" programa.py
   ```

8. **Buscar palavras inteiras** (`-w`):  
   Evita correspondências parciais (ex: "cat" não será encontrado em "category").
   ```bash
   grep -w "cat" animais.txt
   ```

9. **Usar expressões regulares**:  
   O `grep` suporta regex para buscas complexas.
   ```bash
   grep "^[A-Z]" arquivo.txt  # Linhas que começam com letra maiúscula
   grep "[0-9]{3}" dados.txt  # Busca sequências de 3 dígitos
   ```

10. **Pipe com outros comandos**:  
    Pode ser combinado com outros comandos via `|`.
    ```bash
    ps aux | grep "firefox"  # Encontra processos do Firefox
    ```

### Observações:
- Por padrão, `grep` usa *basic regex*. Para *extended regex* (suporte a `+`, `?`, `|`), use `-E` ou o comando `egrep`.
- Para cores na saída (destaque do padrão), use `--color=auto`.

### Exemplo avançado:
```bash
grep -rin --color=auto "error\|warning" /var/log/
```
→ Busca recursiva por "error" ou "warning" em todos os arquivos de `/var/log/`, mostrando números das linhas e ignorando maiúsculas/minúsculas.

O `grep` é essencial para análise de logs, filtragem de dados e processamento de texto no terminal! 🚀