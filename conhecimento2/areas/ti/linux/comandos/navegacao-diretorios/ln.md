---
tags:
  - Linux
categoria: sistema_arquivos
ferramenta: cli
---
O Comando ln é usada para criação de links, isso significa que podemos criar "atalhos" para alguns diretórios, facilitando a navegação no [[Estrutura de Diretorios|FHS]], existe sempre uma comparação entre os o ln e o [[mount]], por conta que é possível ter o mesmo objetivo atingido usando os dois caminhos porém há algumas diferenças entre eles.

Ao usar o comando [[chmod]] em um link, o destino será afetado ao inves do link, pois links são ponteiros e não representam arquivos reais, para entender mais sobre permissoes clique [[Permissoes Arquivo|aqui]].

## **Exemplos**

Criando link simples

```
ln -s ALVO DESTINO
```

Manual do comando
```bash
man ln
```
## **Diferenças entre ln e move --bind**


Aqui vai um paralelo detalhado entre **links simbólicos (`ln -s`)** e **mounts bind (`mount --bind`)**, destacando como eles funcionam, suas semelhanças, diferenças e os casos de uso ideais.

---

### **1. O que são?**

|**Link Simbólico (`ln -s`)**|**Mount Bind (`mount --bind`)**|
|---|---|
|Um arquivo especial que aponta para outro arquivo ou diretório por caminho.|Uma montagem que espelha um diretório para outro local no sistema.|
|Apenas redireciona para um caminho armazenado.|Cria um vínculo lógico no kernel, usando o Virtual File System.|

---

### **2. Como funcionam?**

#### **Link Simbólico:**

- Armazena o **caminho absoluto ou relativo** para o alvo.
- Quando você acessa um link simbólico, o sistema operacional resolve o caminho e acessa o alvo.
- É independente do sistema de arquivos, ou seja, pode apontar para diretórios/arquivos em outros sistemas de arquivos.

#### **Mount Bind:**

- É uma entrada na **tabela de montagens do kernel**, que faz o destino referenciar os mesmos inodes do diretório/arquivo de origem.
- Funciona apenas dentro do mesmo sistema de arquivos (a menos que você use algo como um container ou chroot).

---

### **3. Acesso e funcionamento**

|**Link Simbólico**|**Mount Bind**|
|---|---|
|Apenas um ponteiro para outro caminho.|Totalmente transparente — o destino é tratado como o original.|
|Se o alvo for movido ou excluído, o link simbólico "quebra".|O destino permanece válido, pois está vinculado ao inode.|
|Resolvido pelo sistema operacional toda vez que é acessado.|Resolvido diretamente no kernel via VFS.|

---

### **4. Dependência do caminho**

|**Link Simbólico**|**Mount Bind**|
|---|---|
|Armazena o caminho do alvo.|Não depende do caminho — é baseado em inodes.|
|Se o alvo for renomeado ou movido, o link simbólico deixa de funcionar.|O vínculo permanece ativo mesmo que o diretório original seja renomeado.|

---

### **5. Propagação e submontagens**

|**Link Simbólico**|**Mount Bind**|
|---|---|
|Não lida com subdiretórios que são montagens separadas.|Por padrão, não replica submontagens (precisa do `--rbind`).|
|Não há propagação de eventos de montagem ou desmontagem.|A propagação de mudanças de montagem pode ser controlada.|

---

### **6. Performance**

|**Link Simbólico**|**Mount Bind**|
|---|---|
|Menor impacto na performance, já que é apenas um ponteiro para o caminho.|Ligação mais direta via kernel, sem precisar resolver caminhos.|
|Pode ser mais lento se o caminho for muito longo ou em sistemas com alta latência.|Performance melhor em sistemas que precisam de muitas operações no diretório.|

---

### **7. Casos de uso comuns**

#### **Link Simbólico:**

- **Atalhos** para arquivos ou diretórios.
    - Exemplo: Criar um link simbólico para `/var/www` em `/home/user/www`.
```bash
ln -s /var/www /home/user/www
```
- **Redirecionamento de bibliotecas ou arquivos de configuração.**
    - Exemplo: Apontar `/etc/nginx/nginx.conf` para um arquivo personalizado.
    ```bash
ln -s /home/user/custom_nginx.conf /etc/nginx/nginx.conf
```
- **Cross-filesystem links** (links para arquivos ou diretórios em sistemas de arquivos diferentes).

#### **Mount Bind:**

- **Espelhamento transparente de diretórios.**
    
    - Exemplo: Tornar `/mnt/backup` acessível em `/backup` sem alterar programas que dependem do caminho `/backup`.

```bash
mount --bind /mnt/backup /backup
```

- **Isolamento ou encapsulamento.**
    
    - Usado para compartilhar diretórios em ambientes chroot, containers ou namespaces.    ``
    ```bash
mount --bind /mnt/chroot/base /mnt/chroot/container
```
- **Controle de permissões.**
    
    - Você pode configurar permissões específicas no destino após o bind, como tornar o destino somente leitura:
```bash
mount --bind /mnt/origem /mnt/destino 
mount -o remount,ro /mnt/destino
```

---

### **8. Vantagens e Desvantagens**

|**Aspecto**|**Link Simbólico**|**Mount Bind**|
|---|---|---|
|**Independência de Sistema de Arquivos**|Funciona entre diferentes sistemas de arquivos.|Limitado ao mesmo sistema de arquivos.|
|**Simplicidade**|Mais simples e direto.|Requer permissões de root ou sudo.|
|**Transparência**|Não é transparente (precisa resolver o link).|Totalmente transparente para programas.|
|**Persistência**|Quebra se o alvo for renomeado ou excluído.|Persistente enquanto montado.|

---

### **Quando usar qual?**

#### Use **Link Simbólico** quando:

- Você precisa de um **atalho simples** ou redirecionamento para outro arquivo/diretório.
- O alvo pode estar em outro sistema de arquivos.
- Você precisa de algo que seja gerenciável sem permissões de root.
- Não há problema se o link "quebrar" ao mover o alvo.

#### Use **Mount Bind** quando:

- Você precisa de um **espelhamento transparente** que funcione como o diretório original.
- O destino deve manter o mesmo conteúdo, mesmo que o diretório original seja renomeado ou excluído.
- Precisa de integração com sistemas como **containers**, **chroot**, ou **namespaces**.
- Deseja manipular permissões no destino sem alterar a origem.