A teoria é linda, mas DevOps se faz no terminal. Abaixo, temos um passo a passo para você sentir o que discutimos hoje na pele.

### Parte 1: O Raio-X do Linux com `strace`

Vamos criar uma situação simulando uma aplicação que tenta ler um arquivo que não existe e entender como o Linux enxerga isso.

1. **Abra o seu terminal Linux** (pode ser WSL no Windows, Linux nativo ou Cloud Shell).
2. Tente ler um arquivo inexistente usando o comando `cat`:

```bash
cat arquivo_secreto.txt
```

_Resultado esperado:_ `cat: arquivo_secreto.txt: No such file or directory`

3. **A Mágica do `strace`**: Agora vamos ver como o Sistema Operacional processou isso. Rode:

```bash
strace cat arquivo_secreto.txt
```

4. **Analise a saída**. Em meio a várias linhas, você encontrará algo parecido com: `openat(AT_FDCWD, "arquivo_secreto.txt", O_RDONLY) = -1 ENOENT (No such file or directory)`

> **Por que isso importa?** O `strace` interceptou a chamada de sistema (`openat`) que o comando `cat` fez ao Kernel pedindo para ler o arquivo. O Kernel respondeu com o código de erro `-1 ENOENT` (Error No Entry). Quando uma aplicação travou em produção sem motivo aparente, o `strace` mostra exatamente em qual chamada ela congelou.

### Parte 2: O Poder do Terraform na Prática

Vamos criar nossa primeira infraestrutura como código! Para facilitar e **não depender de contas na nuvem**, vamos usar um provedor local do Terraform.

1. **Instale o Terraform**: Siga as instruções em [developer.hashicorp.com/terraform/install](https://developer.hashicorp.com/terraform/install).
2. **Crie um diretório para o projeto e entre nele**:

```bash
mkdir meu-primeiro-terraform && cd meu-primeiro-terraform
```

3. **Crie o arquivo de configuração** `main.tf`:

```hcl
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5.0"
    }
  }
}

resource "local_file" "servidor_falso" {
  content  = "Esta é a minha infraestrutura provisionada pelo Terraform. O estado (State) está me vigiando!"
  filename = "${path.module}/servidor.txt"
}
```

4. **Inicie o Terraform (`init`)**: `terraform init` - Leu o seu código e baixou os plugins necessários.
5. **Planeje a Mudança (`plan`)**: `terraform plan` - Verificou a realidade vs o código. Exibe `+ create`.
6. **Aplique a Mudança (`apply`)**: `terraform apply` - Digite `yes`. O arquivo `servidor.txt` será criado!
7. **A Mágica do Estado**: Apague manualmente o arquivo com `rm servidor.txt`, rode `terraform plan` novamente e veja o Terraform alertar que precisa recriá-lo.
8. **Destrua Tudo (`destroy`)**: `terraform destroy` para limpar o laboratório.

---

### Próximos Passos

O chão está concretado. Você entende o Sistema Operacional e sabe que não se clica em painel.

Amanhã nós vamos empacotar nossa aplicação. A era heroica do sysadmin que instalava pacotes na mão passou.

**Tema do Dia 3:** _Containers e Orquestração para Engenharia da Escala_

(Spoiler: Você vai descobrir a maior mentira da internet: de que Kubernetes é mágica. **Kubernetes é Linux**).

**Aviso:** Traga capacete amanhã. O atrito vai aumentar.