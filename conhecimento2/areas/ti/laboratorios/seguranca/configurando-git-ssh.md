---
tags:
  - Laboratorio
  - NotaPermanente
categoria: versionamento
ferramenta: cli
---

Para configurar o [[Git]] local para utilizar o github como plataforma é possível realizar  a configuração via [[protocolo-ssh|ssh]], para isso siga o script abaixo:

```bash
# Abra o terminal e execute o comando abaixo para verificar se há chaves SSH existentes no seu sistema:
ls -al ~/.ssh

# Se você vir arquivos como `id_rsa` e `id_rsa.pub`, você já tem uma chave ssh. Caso contrário, precisará criar uma.

# Se você não tiver uma chave, gere uma com o seguinte comando:
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Se sua versão do SSH não suportar `ed25519`, use `rsa`:
ssh-keygen -t rsa -b 4096 -C "lucas.soul.master@gmail.com"

#Pressione **Enter** para aceitar o local padrão para salvar a chave (`~/.ssh/id_ed25519` ou `~/.ssh/id_rsa`) e defina uma senha (opcional, mas recomendada).

#Inicie o agente SSH:
eval "$(ssh-agent -s)"

# Adicione sua chave privada ao agente:
ssh-add ~/.ssh/id_ed25519
# Substitua `id_ed25519` por `id_rsa` se você gerou uma chave RSA.

# Copie o conteúdo da chave pública:
cat ~/.ssh/id_ed25519.pub

# Ou, se for RSA:
cat ~/.ssh/id_rsa.pub
```


### **Adicione sua chave SSH ao GitHub**

1. Acesse Configurações de SSH no 
2. Clique em "New SSH key".
3. Dê um nome para a chave (ex.: "Meu Computador") e cole o conteúdo da chave pública no campo correspondente.
4. Clique em "Add SSH key".


### **Teste a conexão**

No terminal, execute:
```bash
ssh -T git@github.com
```
Se a configuração estiver correta, você verá algo como:

`Hi username! You've successfully authenticated, but GitHub does not provide shell access.`


### **Configure o Git para usar o SSH**

Verifique a URL atual:
```bash 
git remote -v
```
    
Atualize para SSH:
```bash 
git remote set-url origin git@github.com:LucasBertiDev/repo.git
```

Substitua repo.git pelo nome do repositório