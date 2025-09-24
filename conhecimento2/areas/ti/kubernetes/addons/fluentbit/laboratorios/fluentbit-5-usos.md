---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
perfeito! aqui vão **5 variações prontas de `values.yaml`** (uma por cenário) [[fluentbit]]. Todas têm:

- `tail` dos logs do K8s,
    
- enrich com metadados (`kubernetes`),
    
- parse opcional de JSON no campo `log`,
    
- buffer em disco (estado) e DB do `tail` (performance/segurança),
    
- anotação pra **não injetar [[Linkerd]]** no [[DaemonSet]].
    

Escolha 1 arquivo, salve-o e aplique com o `helm upgrade` indicado.

---

## 0) Comum a todos (o que manter em mente)

- Ajuste `multiline.parser` se precisar (Java/Go).
    
- Para testar **só um [[pod]]**, você pode:
    
    - **Pelo caminho**: trocar `Path` por algo como `/var/log/containers/logger_default_logger-*.log`, **ou**
        
    - **Por filtro**: ativar o bloco `grep` (comentado nos exemplos).
        

---

## 1) Didático: **K8s → arquivo no host**

**`values-file.yaml`**

```yaml
podAnnotations:
  linkerd.io/inject: "disabled"

extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
  - name: outdir
    hostPath: { path: /var/fluent-bit/out, type: DirectoryOrCreate }

extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state
  - name: outdir
    mountPath: /out

config:
  service: |
    [SERVICE]
        Flush                     1
        Log_Level                 info
        Parsers_File              parsers.conf
        HTTP_Server               On
        HTTP_Listen               0.0.0.0
        HTTP_Port                 2020
        storage.path              /var/fluent-bit/state
        storage.sync              normal
        storage.backlog.mem_limit 100M

  inputs: |
    [INPUT]
        Name               tail
        Path               /var/log/containers/*.log
        # Para um único pod/container, use um Path mais específico:
        # Path             /var/log/containers/logger_default_logger-*.log
        Tag                kube.app
        Parser             cri
        Mem_Buf_Limit      50M
        Skip_Long_Lines    On
        Refresh_Interval   5
        DB                 /var/fluent-bit/state/tail.db
        DB.Sync            normal
        Read_from_Head     Off
        storage.type       filesystem
        multiline.parser   cri

  filters: |
    # Opcional: filtrar apenas um alvo
    # [FILTER]
    #     Name   grep
    #     Match  kube.*
    #     Regex  $kubernetes['pod_name']       ^logger$
    #     Regex  $kubernetes['namespace_name'] ^default$
    #     Regex  $kubernetes['container_name'] ^logger$

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
    [OUTPUT]
        Name    file
        Match   kube.*
        Path    /out
        File    fluentbit.log
        Format  plain
        Mkdir   On
```

**Aplicar:**

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging --create-namespace -f values-file.yaml
```

---

## 2) Produção comum: **K8s → OpenSearch/Elasticsearch**

**`values-opensearch.yaml`**

```yaml
podAnnotations:
  linkerd.io/inject: "disabled"

extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

config:
  service: |
    [SERVICE]
        Flush 1
        Log_Level info
        Parsers_File parsers.conf
        HTTP_Server On
        HTTP_Listen 0.0.0.0
        HTTP_Port 2020
        storage.path /var/fluent-bit/state
        storage.sync normal
        storage.backlog.mem_limit 200M

  inputs: |
    [INPUT]
        Name             tail
        Path             /var/log/containers/*.log
        Tag              kube.app
        Parser           cri
        Mem_Buf_Limit    100M
        DB               /var/fluent-bit/state/tail.db
        DB.Sync          normal
        storage.type     filesystem
        multiline.parser cri

  filters: |
    [FILTER]
        Name  kubernetes
        Match kube.*
        Merge_Log On

    [FILTER]
        Name         parser
        Match        kube.*
        Key_Name     log
        Parser       json
        Reserve_Data On

  outputs: |
    # Plugin "es" funciona para Elasticsearch e OpenSearch
    [OUTPUT]
        Name                es
        Match               kube.*
        Host                opensearch.logging.svc
        Port                9200
        HTTP_User           admin            # ajuste
        HTTP_Passwd         changeme         # ajuste (ou use Secret + env)
        # TLS (se precisar)
        # tls               On
        # tls.verify        Off

        Logstash_Format     On               # index diário
        Logstash_Prefix     logs
        Replace_Dots        On
        Include_Tag_Key     On
        Buffer_Size         8M

        # Buffer de entrega robusto
        Suppress_Type_Name  On
        Time_Key            @timestamp

        # Paralelismo (se suportado pela versão)
        workers             2
```

**Aplicar:**

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging -f values-opensearch.yaml
```

---

## 3) Arquivamento/Compliance: **K8s → Amazon S3**

**`values-s3.yaml`**

```yaml
podAnnotations:
  linkerd.io/inject: "disabled"

extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

# Se usar IRSA, anote a SA aqui (exemplo):
# serviceAccount:
#   create: true
#   annotations:
#     eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/fluentbit-irsa

config:
  service: |
    [SERVICE]
        Flush 1
        Log_Level info
        Parsers_File parsers.conf
        HTTP_Server On
        HTTP_Listen 0.0.0.0
        HTTP_Port 2020
        storage.path /var/fluent-bit/state
        storage.sync normal
        storage.backlog.mem_limit 200M

  inputs: |
    [INPUT]
        Name             tail
        Path             /var/log/containers/*.log
        Tag              kube.app
        Parser           cri
        Mem_Buf_Limit    100M
        DB               /var/fluent-bit/state/tail.db
        DB.Sync          normal
        storage.type     filesystem
        multiline.parser cri

  filters: |
    [FILTER]
        Name  kubernetes
        Match kube.*
        Merge_Log On

    [FILTER]
        Name         parser
        Match        kube.*
        Key_Name     log
        Parser       json
        Reserve_Data On

  outputs: |
    [OUTPUT]
        Name                 s3
        Match                kube.*
        bucket               meu-bucket-logs
        region               sa-east-1          # ajuste
        total_file_size      50M                # rotação por tamanho
        upload_timeout       5m                 # rotação por tempo
        compression          gzip
        store_dir            /var/fluent-bit/state/s3
        s3_key_format        /k8s/%Y/%m/%d/%H/%M/%S/$TAG-$UUID.gz
        s3_key_format_tag_delimiters .-_
        # force_path_style   On   # Útil p/ MinIO/compatível S3
        # sts_endpoint       https://... # se usar STS custom
        # Para credenciais: IRSA (preferível) ou env vars no pod (AWS_ACCESS_KEY_ID/SECRET)
```

**Aplicar:**

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging -f values-s3.yaml
```

---

## 4) Roteamento avançado: **K8s → Fluentd (aggregator)**

**`values-forward-to-fluentd.yaml`**

```yaml
podAnnotations:
  linkerd.io/inject: "disabled"

extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

config:
  service: |
    [SERVICE]
        Flush 1
        Log_Level info
        Parsers_File parsers.conf
        HTTP_Server On
        HTTP_Listen 0.0.0.0
        HTTP_Port 2020
        storage.path /var/fluent-bit/state
        storage.sync normal
        storage.backlog.mem_limit 200M

  inputs: |
    [INPUT]
        Name             tail
        Path             /var/log/containers/*.log
        Tag              kube.appo agente empurra micro-lotes (chunks) do fluxo para os destinos.


        Parser           cri
        Mem_Buf_Limit    100M
        DB               /var/fluent-bit/state/tail.db
        DB.Sync          normal
        storage.type     filesystem
        multiline.parser cri

  filters: |
    [FILTER]
        Name  kubernetes
        Match kube.*
        Merge_Log On

    [FILTER]
        Name         parser
        Match        kube.*
        Key_Name     log
        Parser       json
        Reserve_Data On

  outputs: |
    [OUTPUT]
        Name          forward
        Match         kube.*
        Host          fluentd.logging.svc   # seu Service do Fluentd
        Port          24224
        # TLS/segurança (opcional)
        # tls         On
        # tls.verify  Off
        # Shared_Key  mysharedkey
        # self_hostname fluent-bit
        # workers     2
```

**Aplicar:**

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging -f values-forward-to-fluentd.yaml
```

---

## 5) Testes e POCs: **K8s → HTTP (serviço seu)**

**`values-http.yaml`**

```yaml
podAnnotations:
  linkerd.io/inject: "disabled"

extraVolumes:
  - name: state
    hostPath: { path: /var/fluent-bit/state, type: DirectoryOrCreate }
extraVolumeMounts:
  - name: state
    mountPath: /var/fluent-bit/state

config:
  service: |
    [SERVICE]
        Flush 1
        Log_Level info
        Parsers_File parsers.conf
        HTTP_Server On
        HTTP_Listen 0.0.0.0
        HTTP_Port 2020
        storage.path /var/fluent-bit/state
        storage.sync normal
        storage.backlog.mem_limit 100M

  inputs: |
    [INPUT]
        Name             tail
        Path             /var/log/containers/*.log
        Tag              kube.app
        Parser           cri
        Mem_Buf_Limit    50M
        DB               /var/fluent-bit/state/tail.db
        DB.Sync          normal
        storage.type     filesystem
        multiline.parser cri

  filters: |
    [FILTER]
        Name  kubernetes
        Match kube.*
        Merge_Log On

    [FILTER]
        Name         parser
        Match        kube.*
        Key_Name     log
        Parser       json
        Reserve_Data On

  outputs: |
    [OUTPUT]
        Name           http
        Match          kube.*
        Host           my-ingestor.default.svc    # ajuste
        Port           8080                       # ajuste
        URI            /logs                      # ajuste
        Format         json
        Json_Date_Key  ts
        Json_Date_Format iso8601
        Header         Content-Type application/json
        # Header       Authorization Bearer <token>
        tls            Off        # On se exposto em https
        compress       gzip
        # workers      2
```

**Aplicar:**

```bash
helm upgrade -i fluent-bit fluent/fluent-bit -n logging -f values-http.yaml
```

---

### Dicas finais

- **Comece pelo `values-file.yaml`** (mais didático), valide o fluxo e só então troque o bloco `[OUTPUT]` conforme o destino real.
    
- Mantenha **poucos filtros** e só onde precisa (performance).
    
- Use o **`grep`** (comentado) para testar com **um único pod/container**.
    
- Monitore o agente: habilite o endpoint em `:2020/api/v1/metrics/prometheus`.
    

Se me disser **qual desses cenários você quer usar primeiro**, já deixo o `values.yaml` com seu **namespace/pod/container** específicos preenchidos e, se for o caso, com **credenciais/IRSA** (S3) ou **TLS** (Fluentd/HTTP) ajustados.