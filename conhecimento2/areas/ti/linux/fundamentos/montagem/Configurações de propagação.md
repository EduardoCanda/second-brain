---
tags:
  - Linux
  - NotaPermanente
  - Fundamentos
categoria: sistema_arquivos
---
Os pontos de montagem compartilham uma característica de modo de propagação, com isso é possível compartilhar informações ou não entre pontos de montagem, isso é associado geralmente a [[Namespaces]],Por exemplo:

È possível que um dispositivo seja montado em pontos distintos, com isso podemos configurar o comportamento esperado nesses casos, se um ponto for desmontado, isso pode impactar o outro ? Respondendo essa pergunta vai depender do modo como esse dispositivo foi montado, existem três formas distintas de montagem, segue abaixo as possibilidades:

## **Montagem em modo shared**

Com essa opção o ponto de montagem se torna compartilhado, isso significa que podemos replicas um ponto de montagem em outros namespaces, quando houver desmontagem desse, todos os outros são desmontados juntos, em um efeito de espelhamento.

O que acontece no namespace/host pai **é refletido no filho**, e o que acontece no filho **é refletido no pai**.

**Exemplo:**

No pai, você monta `/dev/sda1` em `/mnt/device1`
No filho, você imediatamente vê `/mnt/device1` montado.
Se no filho você desmontar `/mnt/device1`
O pai também perde essa montagem.

## **Montagem em modo slave**

Essa opção favorece a atualização direcional, tudo que é feito no [[Namespaces|namespace]]/host pai é refletido no [[Namespaces|namespace]] filho, porém tudo que é feito no filho não afeta no pai.

**Quando usar `slave**

Essa opção é útil em cenários como:

- **Configuração de contêineres ou chroot**: Quando você quer que um [[Namespaces|namespace]] receba atualizações do sistema de arquivos principal, mas as alterações feitas dentro do namespace (como montar ou desmontar algo) não afetem o sistema de arquivos principal.
    
- **Gerenciamento de namespaces de montagem**: Se você está configurando [[Namespaces|namespaces]] personalizados e precisa de um comportamento mais restrito que o modo compartilhado, mas ainda precisa refletir mudanças externas no [[Namespaces|namespace]].

Alterações no pai **são refletidas no filho**, mas alterações no filho **não afetam o pai**.

**Exemplo:**

No pai, você monta `/dev/sda1` em `/mnt/device1`
No filho, você vê `/mnt/device1` montado automaticamente.
No filho, você desmonta `/mnt/device1`:
O pai **não é afetado**, e `/mnt/device1` permanece montado no pai.

## **Montagem em modo privado**

Nesse estilo de montagem não há comunicação nem no ponto de montagem nem nos [[Namespaces|namespaces]] filhos.

 **Exemplo:**

No pai, você monta `/dev/sda1` em `/mnt/device1`:
No filho, **você não vê** `/mnt/device1`.
Se no filho você montar algo em `/mnt/device1`, o pai **não será afetado**.

## **Propagação de montagens é sobre pontos de montagem, não sobre os dados**

As opções de propagação (`shared`, `private`, `slave`, etc.) controlam **como eventos de montagem/desmontagem** (como `mount` ou `umount`) são propagados entre os pontos de montagem em diferentes namespaces ou no mesmo sistema. Elas **não afetam os dados** contidos nos sistemas de arquivos montados.

Por exemplo:

- Se você altera um arquivo em um sistema de arquivos montado em `/mnt/ns1` e `/mnt/ns2`, a alteração será visível em ambas as montagens, pois ambas apontam para o mesmo **sistema de arquivos subjacente**.

---

### **Por que isso acontece?**

Quando você monta um sistema de arquivos, está apenas criando uma **nova visualização ou "acesso lógico"** para o mesmo sistema subjacente. O ponto de montagem é como uma "janela" para o mesmo conjunto de dados. Assim:

- Montagens separadas no mesmo sistema de arquivos não criam cópias independentes dos dados, apenas acessos ao mesmo local.
- As alterações feitas em um ponto de montagem são refletidas em qualquer outro ponto que referencia o mesmo sistema de arquivos.

#### **Exemplo prático**

Imagine o seguinte:

Você monta um sistema de arquivos em dois locais:
```bash
mount /dev/sdb1 /mnt/ns1
mount /dev/sdb1 /mnt/ns2
```

Você cria ou modifica um arquivo em `/mnt/ns1/test.txt`:
```bash
echo "Olá, mundo!" > /mnt/ns1/test.txt
```

O mesmo arquivo estará visível e com o mesmo conteúdo em `/mnt/ns2/test.txt`:
```bash
cat /mnt/ns2/test.txt
```

Saída:
```bash
Olá, mundo!
```

Mesmo que você defina o ponto de montagem `/mnt/ns2` como `private`:
```bash
mount --make-private /mnt/ns2
```

Isso não altera o comportamento acima, pois a propagação `private` controla apenas **eventos de montagem/desmontagem**, e não as alterações nos dados do sistema de arquivos.

### **Se eu quiser isolar os dados?**

Se a intenção for criar montagens onde alterações nos arquivos sejam isoladas, você precisará usar técnicas específicas, como:

#### a) **OverlayFS (ou UnionFS)**

O **OverlayFS** permite criar uma camada de "escrita" separada para montagens. As alterações feitas em um ponto de montagem não são refletidas no sistema de arquivos original.

Exemplo:

Configure um OverlayFS:
```bash
mkdir /mnt/upper /mnt/work /mnt/overlay 
mount -t overlay overlay -o\
	lowerdir=/mnt/ns1,\
	upperdir=/mnt/upper,\
	workdir=/mnt/work /mnt/overlay
```
    
Agora, se você modificar algo em `/mnt/overlay`, as alterações serão armazenadas em `/mnt/upper` (camada de escrita), e o sistema de arquivos original (`/mnt/ns1`) permanecerá inalterado.

#### b) **Criar uma cópia do sistema de arquivos**

Se você precisa de isolação total, criar uma cópia do sistema de arquivos original é uma opção. Isso pode ser feito com ferramentas como:

- `rsync` para copiar os dados.
- Snapshots de sistemas de arquivos como **ZFS** ou **Btrfs**, que são eficientes e rápidos.

#### c) **Usar namespaces de montagem com cópias de arquivos**

Dentro de namespaces de montagem, você pode criar novas montagens que isolam o acesso:
```bash
unshare --mount --fork bash mount --bind /mnt/ns1 /mnt/new_ns1
```

Nesse ambiente isolado, você pode copiar os arquivos manualmente e trabalhar na cópia sem impactar o original.

### **Resumo**

- Propagações (`shared`, `private`, etc.) afetam **montagens e desmontagens**, não os dados.
- Alterar um arquivo em um sistema de arquivos montado em dois lugares afeta ambos, pois eles acessam o mesmo sistema de arquivos.
- Para isolar alterações nos dados, você pode usar:
    - **OverlayFS** para camadas de escrita independentes.
    - **Cópias do sistema de arquivos** para isolar os dados completamente.
    - **Namespaces de montagem combinados com cópias**.
