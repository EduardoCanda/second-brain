---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Perfeito — o erro é claro:

> `storage class "prom" does not exist`

Ou seja: o [[prometheus-operator|Operator]] tentou criar o **[[statefulset|StatefulSet]]** do Prometheus com um PVC usando `storageClassName: prom`, mas **não existe** uma StorageClass com esse nome.

Aqui vai o conserto, direto ao ponto.

# O que fazer

## 1) Descobrir quais StorageClasses você tem

```bash
kubectl get sc -o custom-columns=NAME:.metadata.name,DEFAULT:.metadata.annotations.storageclass\.kubernetes\.io/is-default-class,PROVISIONER:.provisioner
```

Anote um nome válido (ex.: `gp3`, `standard`, `pd-ssd`, `longhorn`, `rook-ceph-block`, etc).

## 2) Corrigir seu `values.yaml` do kube-prometheus-stack

No caminho **exato** (é esse que o Operator usa):

```yaml
prometheus:
  prometheusSpec:
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: <SEU_STORAGECLASS>
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 200Gi
```

Depois:

```bash
helm upgrade --install <release> prometheus-community/kube-prometheus-stack \
  -n monitoring -f values.yaml
```

> Dica: se você **quer usar a StorageClass default do cluster**, simplesmente **remova** a linha `storageClassName:` (não use `""`). O Kubernetes usará a default automaticamente.

## 3) Verificar que subiu

```bash
kubectl -n monitoring get sts,pvc,pods -l app.kubernetes.io/name=prometheus
```

# Ajustes relacionados (frequentes)

- **Alertmanager também tem PVC** (se habilitado):
    
    ```yaml
    alertmanager:
      alertmanagerSpec:
        storage:
          volumeClaimTemplate:
            spec:
              storageClassName: <SEU_STORAGECLASS>
              accessModes: ["ReadWriteOnce"]
              resources: { requests: { storage: 10Gi } }
    ```
    
- **ThanosRuler** (se você usa) idem: `thanosRuler.thanosRulerSpec.storage.volumeClaimTemplate.spec.storageClassName`.
    

# Se você _quer_ manter o nome `prom`

Crie uma StorageClass chamada `prom` apropriada ao seu provedor:

**AWS (EBS CSI, gp3)**

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: prom
provisioner: ebs.csi.aws.com
parameters:
  type: gp3
  fsType: xfs
  encrypted: "true"
allowVolumeExpansion: true
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

**GKE (PD CSI, SSD)**

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: prom
provisioner: pd.csi.storage.gke.io
parameters:
  type: pd-ssd
allowVolumeExpansion: true
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

> Observação: para dados de Prometheus, `reclaimPolicy: Retain` costuma ser preferível para evitar deleção acidental do histórico ao remover o PVC.

---

Se você me disser o **nome de uma StorageClass existente no seu cluster**, eu te devolvo o patch pronto do `values.yaml` (e, se quiser, também dos blocos de Alertmanager/ThanosRuler).