# Operadores do terminal Linux

Os operadores de shell ajudam a **combinar comandos**, **controlar fluxo de execução** e **redirecionar entrada/saída** no terminal.

---

## 1) Pipe `|`

Envia a saída de um comando para a entrada do próximo.

```bash
ps aux | grep nginx
```

**Uso prático:** listar processos e filtrar apenas os que contêm `nginx`.

---

## 2) Redirecionamento de saída `>`

Sobrescreve um arquivo com a saída do comando.

```bash
echo "deploy iniciado" > status.txt
```

**Uso prático:** criar/atualizar um arquivo de status com um valor único.

---

## 3) Redirecionamento de saída em append `>>`

Adiciona a saída ao final do arquivo, sem apagar o conteúdo anterior.

```bash
date >> deploy.log
```

**Uso prático:** manter histórico de execuções em log.

---

## 4) Redirecionamento de erro `2>`

Envia apenas erros (`stderr`) para um arquivo.

```bash
ls /diretorio-inexistente 2> erros.log
```

**Uso prático:** separar erros de execução para troubleshooting.

---

## 5) Redirecionar saída e erro `&>`

Envia saída normal e erro para o mesmo destino.

```bash
./script.sh &> resultado.log
```

**Uso prático:** capturar tudo de uma automação em um único arquivo de log.

---

## 6) Operador lógico AND `&&`

Executa o próximo comando **somente se** o anterior for bem-sucedido.

```bash
npm ci && npm test
```

**Uso prático:** rodar testes apenas se a instalação de dependências funcionar.

---

## 7) Operador lógico OR `||`

Executa o próximo comando **somente se** o anterior falhar.

```bash
grep "ERROR" app.log || echo "Nenhum erro encontrado"
```

**Uso prático:** fornecer fallback/mensagem amigável quando não há resultado.

---

## 8) Sequência `;`

Executa comandos em sequência, com sucesso ou falha no anterior.

```bash
mkdir -p backup; cp app.log backup/
```

**Uso prático:** útil quando você quer tentar ambos os comandos independentemente do status do primeiro.

---

## 9) Execução em background `&`

Roda o comando em segundo plano.

```bash
python3 -m http.server 8000 &
```

**Uso prático:** subir um servidor temporário e continuar usando o terminal.

---

## 10) Substituição de comando `$(...)`

Executa um comando e usa sua saída dentro de outro.

```bash
echo "Host atual: $(hostname)"
```

**Uso prático:** montar mensagens dinâmicas em scripts.

---

## 11) Here document `<<EOF`

Permite enviar múltiplas linhas para a entrada padrão de um comando.

```bash
cat <<EOC > config.env
APP_NAME=second-brain
APP_ENV=dev
EOC
```

**Uso prático:** gerar arquivos de configuração rapidamente.

---

## 12) Encadeamento com agrupamento `()` e `{}`

- `()` executa em subshell.
- `{}` executa no shell atual.

```bash
(cd /tmp && pwd)
{ echo "inicio"; date; echo "fim"; } > bloco.log
```

**Uso prático:**
- com `()` você altera diretório sem afetar o shell principal;
- com `{}` você agrupa saída de vários comandos para um único redirecionamento.

---

## Dica DevOps

Em pipelines e scripts, os operadores mais usados no dia a dia tendem a ser:
- `|`
- `&&`
- `||`
- `>` / `>>`
- `2>`

Dominar esses operadores reduz tempo de troubleshooting e melhora automações.

---

## Notas relacionadas

- [systemctl](systemctl.md)
- [Logs e Troubleshooting](../08 - Logs e troubleshooting/Logs e Troubleshooting.md)
- [Processos, PID e Sinais](../03 - Processos, PID e Sinais/Processos, PID e Sinais.md)
