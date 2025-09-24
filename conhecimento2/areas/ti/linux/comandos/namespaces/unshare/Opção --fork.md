---
tags:
  - Linux
  - Namespaces
  - NotaBibliografica
ferramenta: cli
---
A flag `--fork` no comando `unshare` é usada para iniciar um **novo processo filho** no namespace recém-criado, enquanto o processo original permanece fora do namespace. Isso é útil quando você deseja que o processo que executa o comando permaneça isolado no novo namespace sem alterar o ambiente do processo pai.

---

### Como funciona `--fork` em detalhes

1. **Sem `--fork`:** Quando você executa `unshare` sem a flag `--fork`, o processo atual é movido para o novo namespace. Nesse caso:

    - O processo **não cria um filho**.
    - O namespace criado afeta diretamente o processo que chamou o `unshare`.
    - Quando o processo termina, o namespace é destruído (se temporário).

**Exemplo:**

Aqui, o processo `bash` é movido diretamente para o namespace de rede.
```bash
sudo unshare --net bash
```

 **Com `--fork`:** Quando você usa `--fork`, o `unshare` cria um **novo processo filho** e coloca esse filho no novo namespace, enquanto o processo original (pai) permanece no namespace do host. Isso permite que você mantenha o ambiente do processo pai inalterado.

```bash
sudo unshare --net --fork bash
```
- O processo pai (`unshare`) cria um processo filho (`bash`).
- O processo `bash` é executado no namespace de rede recém-criado.
- O processo pai (`unshare`) permanece no namespace do host.

### Benefícios de `--fork`

1. **Separação clara**: O processo pai (que chama `unshare`) não é afetado pelo namespace criado.
2. **Controle adicional**: Você pode continuar rodando comandos no host enquanto o processo filho opera no namespace isolado.
3. **Evita mudanças permanentes**: O processo pai mantém seu namespace original e retorna ao shell ou script principal quando o filho termina.

### Exemplo prático com e sem `--fork`

#### Sem `--fork`:

```bash
sudo unshare --net bash
```
O terminal atual agora está no namespace de rede isolado.

Verifique as interfaces de rede:
```bash
ip addr
```

Saia do namespace:
```bash
exit
```
Você volta ao terminal do host.

#### Com `--fork`:
```bash
sudo unshare --net --fork bash
```
- Um novo processo filho é criado no namespace isolado.
- O terminal original (pai) permanece no namespace do host.
- Quando o processo filho termina, o namespace é destruído (se não for persistente).

### Combinando `--fork` com outros namespaces

A flag `--fork` é especialmente útil quando combinada com namespaces como `--pid`, onde o isolamento de processos é necessário.

**Exemplo

```bash
sudo unshare --net --pid --fork --mount-proc bash
```
- Cria namespaces de rede e PID.
- O processo filho `bash` é isolado no novo ambiente.
- O `/proc` é montado no novo namespace PID, permitindo visualizar os processos isolados.

Dentro do namespace:
```bash
ps aux
```
Você verá apenas o processo atual no novo namespace.