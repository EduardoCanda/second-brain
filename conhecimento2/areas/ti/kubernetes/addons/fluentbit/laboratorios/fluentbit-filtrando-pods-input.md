---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
# Opção A — Selecionar pelo **arquivo** do container (mais direta)

Cada container gera um symlink em `/var/log/containers` no formato, [[fluentbit|fluentbit]]:

```
<pod>_<namespace>_<container>-<container-id>.log
```

Então você pode apontar o `tail` só para o seu [[pod]]/container com wildcard no `container-id`.

Exemplo (pod `logger`, ns `default`, container `logger`):

```yaml
# values-only-one-pod.yaml
extraVolumes:
  - name: outdir
    hostPath: { path: /var/fluent-bit/out, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: outdir
    mountPath: /out

config:
  service: |
    [SERVICE]
        Log_Level    info
        Parsers_File /fluent-bit/etc/parsers.conf
        HTTP_Server  On
        HTTP_Listen  0.0.0.0
        HTTP_Port    2020

  inputs: |
    [INPUT]
        Name              tail
        # <<< ajuste o padrão abaixo para o seu pod/ns/container >>>
        Path              /var/log/containers/logger_default_logger-*.log
        Tag               kube.test
        Parser            cri
        Mem_Buf_Limit     10M
        Skip_Long_Lines   On
        Refresh_Interval  5
        multiline.parser  cri,java,go

  filters: |
    [FILTER]
        Name                kubernetes
        Match               kube.*
        Merge_Log           On
        K8S-Logging.Parser  On
        K8S-Logging.Exclude Off

    [FILTER]
        Name         parser
        Match        kube.*
        Key_Name     log
        Parser       json
        Reserve_Data On

  outputs: |
    # Removi o stdout para não poluir os logs do próprio pod do Fluent Bit
    [OUTPUT]
        Name    file
        Match   kube.*
        Path    /out
        File    fluentbit.log
        Format  plain
        Mkdir   On
```

# Opção B — Ler tudo, mas **filtrar** pelo pod/container (flexível)

Se você preferir manter `Path /var/log/containers/*.log`, dá pra filtrar com `grep` usando os campos do filtro `kubernetes`:

```yaml
config:
  inputs: |
    [INPUT]
        Name              tail
        Path              /var/log/containers/*.log
        Tag               kube.*
        Parser            cri
        Mem_Buf_Limit     10M
        multiline.parser  cri,java,go

  filters: |
    [FILTER]
        Name   kubernetes
        Match  kube.*
        Merge_Log On

    # <<< mantenha só o que vier desse POD/NS/CONTAINER >>>
    [FILTER]
        Name   grep
        Match  kube.*
        Regex  $kubernetes['pod_name']        ^logger$
        Regex  $kubernetes['namespace_name']  ^default$
        Regex  $kubernetes['container_name']  ^logger$

  outputs: |
    [OUTPUT]
        Name   file
        Match  kube.*
        Path   /out
        File   fluentbit.log
        Format plain
        Mkdir  On
```

> Dica: você pode usar só um dos `Regex` (por exemplo, apenas por `pod_name`) — incluí os três pra te mostrar as possibilidades.

---

## Como aplicar e validar

1. Aplicar:
    

```bash
helm upgrade -i fluent-bit fluent/fluent-bit \
  -n logging --create-namespace \
  -f values-only-one-pod.yaml
```

2. Ver o arquivo sendo escrito:
    

```bash
POD=$(kubectl -n logging get po -l app.kubernetes.io/name=fluent-bit -o jsonpath='{.items[0].metadata.name}')
kubectl -n logging exec -it "$POD" -- sh -lc 'ls -lh /out && tail -n 30 /out/fluentbit.log'
```

3. Se você usar o mesmo pod de teste de antes:
    

```bash
# gera logs JSON 1/s
kubectl run logger --image=busybox --restart=Never -- \
  sh -c 'i=0; while true; do echo "{\"i\":$i,\"msg\":\"hello\"}"; i=$((i+1)); sleep 1; done'
```

4. Conferir o caminho exato do arquivo (se quiser montar o padrão A com precisão):
    

```bash
# dentro do pod do fluent-bit (ou no host), liste os symlinks daquele pod
kubectl -n logging exec -it "$POD" -- sh -lc 'ls /var/log/containers | grep logger'
# saída vai mostrar algo como: logger_default_logger-<container-id>.log
```

---

## Qual escolher agora?

- **Opção A (Path específico)**: mais silenciosa e direta para um teste rápido de um único pod.
    
- **Opção B (grep)**: útil se você quer mudar o alvo sem mexer no `Path` (por exemplo, filtrar por namespace, por app, etc.).
    

Se me disser o **nome do pod / [[namespace]] / container** que você quer mirar, eu já te devolvo o `values.yaml` certinho com o padrão ou as regras `grep` prontas.