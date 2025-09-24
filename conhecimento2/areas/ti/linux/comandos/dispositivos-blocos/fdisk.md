---
tags:
  - Linux
  - NotaBibliografica
categoria: sistema_arquivos
ferramenta: cli
---
O **`fdisk`** é um utilitário de linha de comando usado em sistemas **Linux/Unix** para **gerenciar partições de discos rígidos (HDDs, SSDs, pendrives, etc.)**. Ele permite criar, excluir, redimensionar e visualizar partições, além de definir seus tipos (como **ext4, NTFS, swap**).  

---

## 🔧 **Principais usos do `fdisk`**  

### 1️⃣ **Listar discos e partições**  
```bash
sudo fdisk -l
```
- Mostra **todos os discos disponíveis** (ex: `/dev/sda`, `/dev/nvme0n1`) e suas partições.  
- Útil para identificar o disco que você deseja modificar.  

### 2️⃣ **Entrar no modo interativo para editar um disco**  
```bash
sudo fdisk /dev/sdX
```
(Substitua **`sdX`** pelo disco desejado, como `/dev/sda` ou `/dev/nvme0n1`).  

### 3️⃣ **Comandos básicos no modo interativo**  
| Comando | Ação                                                                 |     |
| ------- | -------------------------------------------------------------------- | --- |
| **`m`** | Mostra o **menu de ajuda**.                                          |     |
| **`p`** | Lista as **partições existentes**.                                   |     |
| **`n`** | **Cria uma nova partição** (primária, estendida ou lógica).          |     |
| **`d`** | **Exclui uma partição**.                                             |     |
| **`t`** | Altera o **tipo da partição** (ex: `83` para Linux, `82` para swap). |     |
| **`w`** | **Salva as alterações** no disco.                                    |     |
| **`q`** | **Sai sem salvar** as alterações.                                    |     |

---

## 📝 **Exemplo Prático: Criando uma nova partição**  
1. **Liste os discos disponíveis**:  
   ```bash
   sudo fdisk -l
   ```
   - Identifique o disco (ex: `/dev/sdb`).  

2. **Inicie o `fdisk` no disco escolhido**:  
   ```bash
   sudo fdisk /dev/sdb
   ```

3. **Crie uma nova partição**:  
   - Pressione **`n`** (new).  
   - Escolha **`p`** (primária) ou **`e`** (estendida).  
   - Defina o **tamanho** (ex: `+10G` para 10 GB).  

4. **Altere o tipo da partição (se necessário)**:  
   - Pressione **`t`**, selecione a partição e digite o código (ex: `83` para ext4).  

5. **Salve as alterações**:  
   - Pressione **`w`** para gravar.  

6. **Formate a partição** (ex: para ext4):  
   ```bash
   sudo mkfs.ext4 /dev/sdb1
   ```

7. **Monte a partição** (ex: em `/mnt/dados`):  
   ```bash
   sudo mount /dev/sdb1 /mnt/dados
   ```

---

## ⚠️ **Cuidados ao usar o `fdisk`**  
- **Backup importante**: Alterar partições pode **apagar dados** se usado incorretamente.  
- **Não modifique partições em uso**: Desmonte-as antes (`umount`).  
- **Use `partprobe`** para atualizar a tabela de partições sem reiniciar:  
  ```bash
  sudo partprobe /dev/sdX
  ```

---

## 🔄 **Alternativas ao `fdisk`**  
| Ferramenta | Descrição |  
|------------|-----------|  
| **`parted`** | Mais avançado, suporta discos >2TB (GPT). |  
| **`gparted`** | Versão gráfica (GUI) do `parted`. |  
| **`cfdisk`** | Interface mais amigável que `fdisk`. |  

---

### 🏆 **Quando usar o `fdisk`?**  
✔ **Discos pequenos** (MBR, até 2TB).  
✔ **Criação/remoção rápida de partições**.  
✔ **Configuração manual de tabelas de partição**.  

### 🚫 **Quando evitar?**  
❌ **Discos grandes (GPT)** → Prefira `parted` ou `gdisk`.  
❌ **Sistemas em produção sem backup** → Risco de perda de dados!  

---

O `fdisk` é essencial para administradores de sistemas e usuários avançados que precisam gerenciar partições manualmente. Use com cautela e sempre verifique **duas vezes** antes de salvar (`w`)! 💾🔧