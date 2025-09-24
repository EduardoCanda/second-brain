---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: armazenamento
---
Quando um **[[persistent-volume|PersistentVolume]] (PV)** fica em **`Released`**, significa:

- A **[[persistent-volume-claim|PVC]] que o usava foi apagada**.
    
- O PV **ainda aponta** para aquela claim (tem `spec.claimRef`) e **pode manter os dados** no backend.
    
- Por isso, **não volta para `Available` automaticamente** (para evitar reuso acidental e vazamento de dados), **a menos** que você estivesse usando a política de reclaims antiga `Recycle` (deprecada/removida nas versões atuais).
    

Em resumo: `Released` = “o claim foi embora, mas o volume ainda está ‘marcado’ e possivelmente com dados; não está pronto para ser reusado”.

# Como “rebindar” (reutilizar) o mesmo PV

Depende da **reclaimPolicy** do PV:

## 1) `Retain` (caso típico para `Released`)

Passos recomendados:

1. **Sanitizar os dados** no backend (NFS, EBS, Ceph, etc.) — isso é manual e é sua responsabilidade.
    
2. **Limpar o claimRef** do PV para que ele volte a `Available`:
    
    ```bash
    kubectl patch pv <PV_NAME> -p '{"spec":{"claimRef": null}}'
    ```
    
    (Se preferir o caminho “100% limpo”: exporte o YAML do PV, remova `spec.claimRef` e todo o bloco `status`, delete e recrie o objeto PV apontando para o mesmo backend.)
    
3. **Criar a nova PVC** que combine com o PV (mesmo `storageClassName`, `accessModes` e capacidade).  
    Para garantir que esse PV específico será usado, **pré-vincule** na PVC:
    
    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: minha-nova-pvc
    spec:
      accessModes: ["ReadWriteOnce"]    # deve bater com o PV
      resources:
        requests:
          storage: 10Gi                 # <= igual ou menor que a capacidade do PV
      storageClassName: ""              # ou o mesmo SC do PV, se houver
      volumeName: <PV_NAME>             # pré-bind ao PV desejado
    ```
    
    > Observações:
    > 
    > - Se a PVC já existir **e estiver em `Pending`**, você pode patchar `spec.volumeName` antes de ela ser vinculada.
    >     
    > - Se a PVC já estiver **Bound**, não dá para “trocar” o PV; delete e recrie a PVC.
    >     
    

## 2) `Delete`

- Em volumes **dinamicamente provisionados**, o PV e o **recurso físico** (disco) são **apagados** quando a PVC é deletada. Não há “rebind”: crie uma **nova PVC** e o provisioner criará um novo volume.
    
- Em PVs **estáticos** com `Delete`, o comportamento pode variar (o cluster não sabe apagar o backend). Na prática, você pode acabar com um PV em `Released` — siga os passos do caso `Retain` (sanitizar e remover `claimRef`) ou simplesmente **delete o PV e recrie** apontando para o mesmo backend.
    

## 3) `Recycle` (legado/deprecado)

- Era o modo que “limpava” o volume e o colocava de volta em `Available`. Foi **deprecado/removido** em versões atuais. Não conte com ele.
    

# Dicas e pegadinhas

- **Compatibilidade de binding**: `accessModes`, `storageClassName` e capacidade **precisam bater** entre PV e PVC (a pré-amarração via `volumeName` ajuda, mas mantenha-os compatíveis).
    
- **PV está “preso” em Released**: geralmente é porque `spec.claimRef` ainda existe. Remova-o.
    
- **Segurança**: sempre **apague/sanitize os dados** no backend antes de liberar o PV para reuso.
    
- **Imutabilidade**: alguns campos do PV são imutáveis; se for difícil “consertar” no objeto existente, **delete e recrie** o PV apontando para o mesmo `volumeHandle`/path.
    
- **PVC já Bound**: não há “rebind” para outro PV; delete e recrie a PVC com `volumeName` definido.
    

Se quiser, te mostro um fluxo rápido com `kubectl` para exportar, limpar e recriar o PV a partir do YAML.