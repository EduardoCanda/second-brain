---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: armazenamento
ferramenta: kubernetes
---
Ótima! RWO e RWX são **modos de acesso** (“accessModes”) de volumes persistentes no Kubernetes. Eles dizem **quem pode montar o volume** e **de onde**.

## Definições rápidas

- **RWO — ReadWriteOnce**  
    Pode ser montado **como leitura/escrita por um único nó** de cada vez.
    
    > Vários Pods **no mesmo nó** podem usar o volume ao mesmo tempo, mas **apenas um nó** pode montá-lo.
    
- **RWX — ReadWriteMany**  
    Pode ser montado **como leitura/escrita por vários nós** ao mesmo tempo.
    
    > Ideal para compartilhamento entre Pods distribuídos em nós diferentes.
    

> (Para completar: existem **ROX** = _ReadOnlyMany_ e **RWOP** = _ReadWriteOncePod_ — este último restringe a **um único Pod**, nem dois Pods no mesmo nó podem montar ao mesmo tempo.)

---

## Por que isso importa (especialmente pro Fluent Bit/DaemonSet)

- **DaemonSet** cria **1 Pod por nó**.
    
- **RWO** **não** pode ser compartilhado entre nós; então **um único PVC RWO** não serve para todos os Pods do DS. Se tentar, os outros Pods **não agendam** (ou ficam “Pending”).
    
    - Com DS + RWO, você precisaria de **um volume exclusivo por pod/nó** (e.g., `hostPath` local, ou criar um PVC por nó de forma controlada).
        
- **RWX** permite que **todos** os Pods do DS montem **o mesmo PV** ao mesmo tempo.
    
    - **Cuidado**: o **conteúdo** do volume passa a ser **compartilhado**; se **todos os Pods escreverem no mesmo diretório**, há risco de **corrupção/“race”** para ferramentas que **não** foram feitas para multi-writer no **mesmo path** (caso do `storage.path` do Fluent Bit).
        

### Regra de ouro para o Fluent Bit

- **Um processo ⇔ um diretório de state exclusivo.**
    
    - DS + **`hostPath`** (recomendado): cada nó grava em `/var/fluent-bit/state` **local** — sem “race”.
        
    - RWX (NFS/EFS/CephFS): **isole por subdiretório** (ex.: `subPathExpr: state-$(NODE_NAME)`), assim cada Pod escreve no **seu** path e não pisa no outro.
        

---

## Exemplos YAML (PVC)

### PVC **RWO** (um nó por vez)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dados-rwo
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 20Gi
```

### PVC **RWX** (vários nós ao mesmo tempo)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dados-rwx
spec:
  accessModes: ["ReadWriteMany"]
  resources:
    requests:
      storage: 100Gi
```

### Montagem RWX com **subPathExpr** (isolar por nó — recomendado p/ DS)

```yaml
# dentro do Pod/DaemonSet
env:
  - name: NODE_NAME
    valueFrom:
      fieldRef: { fieldPath: spec.nodeName }

volumes:
  - name: state
    persistentVolumeClaim:
      claimName: dados-rwx

volumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state
    subPathExpr: state-$(NODE_NAME)   # cada Pod usa um diretório exclusivo
```

---

## Quando usar cada um

- **RWO**
    
    - Discos “zonais” (EBS/GCE/Azure Disk) normalmente são **RWO**.
        
    - Bom para **um pod por volume** (ex.: StatefulSet) ou **cache local por nó** (via `hostPath`).
        
    - Em DS: **prefira `hostPath`**; se usar PVC, será **um por nó**.
        
- **RWX**
    
    - Fornecedores típicos: NFS, EFS, CephFS, Azure Files.
        
    - Útil quando **vários Pods/nós** precisam montar **o mesmo PV**.
        
    - **Precisa isolar diretórios** para apps que **não** são multi-writer no mesmo path (como o `storage.path` do Fluent Bit).
        

---

## Dúvidas rápidas (FAQ)

- **“RWO bloqueia outros Pods no mesmo nó?”**  
    Não. **RWO** permite **vários Pods no mesmo nó**, mas **só aquele nó** pode montar o volume.
    
- **“RWOP é diferente de RWO?”**  
    Sim. **RWOP (ReadWriteOncePod)** restringe a **um único Pod** (nem dois no mesmo nó). Útil para evitar “duplo attach”.
    
- **“Quero ‘DR’ do buffer do Fluent Bit com PVC.”**  
    Use **RWX** com **subdir por nó**, ou considere arquitetura com **agregador central** (Deployment/StatefulSet) que usa **um PVC RWO** único (sem multi-writer), e os DaemonSets enviam via `forward`.
    
- **“Por que não compartilhar o mesmo diretório com RWX?”**  
    O engine de storage do Fluent Bit **não é** projetado para múltiplos processos escrevendo no **mesmo path** → risco de **corrupção**.
    

---

Se quiser, eu adapto seu manifest do DaemonSet para:

- `hostPath` (opção simples e performática), **ou**
    
- RWX com `subPathExpr` (isolado por nó),  
    incluindo `Retry_Limit False`, métricas, e um roteiro de teste de **queda do output** + **retenção no buffer**.