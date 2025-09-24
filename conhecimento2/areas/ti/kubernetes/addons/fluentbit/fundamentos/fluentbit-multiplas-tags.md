---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
Curta e clara:

- **Não**: um _registro_ no [[fluentbit|Fluent Bit]] não pode ter **várias tags ao mesmo tempo**.
    
- **Sim**: você pode **duplicar** o mesmo registro e **reatribuir** novas tags para cada cópia usando o filtro `rewrite_tag` — assim você “ramifica” o fluxo em várias tags.
    

## Três jeitos de “mandar para vários lugares”

1. **Vários outputs com a mesma tag**  
    Você não precisa de várias tags para fan-out: basta ter **dois `OUTPUT`** com `Match` na **mesma** tag, e ambos recebem o registro.
    
2. **Trocar a tag (mover)**  
    `rewrite_tag` com `KEEP=false` “renomeia” a tag (o registro troca de trilho).
    
3. **Clonar para várias tags (o que você quer)**  
    `rewrite_tag` com `KEEP=true` **duplica** o registro e re-emite com a **nova tag**. Use várias regras para gerar **múltiplas tags** a partir de uma só.
    

---

## Exemplo didático: uma entrada → duas tags → dois arquivos

Supondo que você já esteja lendo apenas o pod `logger` (como no teste anterior):

```ini
[SERVICE]
  Log_Level info

[INPUT]
  Name   tail
  Path   /var/log/containers/logger_default_logger-*.log
  Tag    kube.test
  Parser cri

[FILTER]
  Name  kubernetes
  Match kube.*

# === AQUI: clonamos para duas tags novas ===
[FILTER]
  Name  rewrite_tag
  Match kube.test
  # Clona para 'kube.test.raw' e mantém o original
  Rule  $TAG ^kube\.test$ kube.test.raw true
  # Clona para 'kube.test.json' e mantém o original
  Rule  $TAG ^kube\.test$ kube.test.json true

# (Opcional) filtros diferentes por tag
[FILTER]
  Name   parser
  Match  kube.test.json
  Key_Name log
  Parser json
  Reserve_Data On

[OUTPUT]
  Name  file
  Match kube.test.raw
  Path  /out
  File  raw.log
  Format plain
  Mkdir On

[OUTPUT]
  Name  file
  Match kube.test.json
  Path  /out
  File  json.log
  Format plain
  Mkdir On
```

O que acontece:

- O `INPUT` gera **tag `kube.test`**.
    
- O `rewrite_tag` **duplica**:
    
    - cria uma cópia com **`kube.test.raw`**,
        
    - cria outra com **`kube.test.json`**,
        
    - e **mantém** o original (se quiser, troque `true` por `false` para não manter o original).
        
- Cada `OUTPUT` pega **só** sua tag e escreve em um arquivo diferente.
    

> Dica: dá para usar regex com capturas no `NEW_TAG`, por exemplo  
> `Rule $TAG ^(.*)$ $1.branchA true`  
> para herdar/estender a tag original.

---

## Quando usar cada abordagem

- **Fan-out simples** (mesma transformação, vários destinos): use **vários outputs** com a **mesma tag** (mais simples).
    
- **Pipelines diferentes** (filtros distintos por “ramo”): use **`rewrite_tag`** para criar **novas tags** e aplique filtros/outputs por `Match` em cada tag.
    

Se quiser, mando esse bloco já encaixado no seu `values.yaml` (com `extraVolumes`/`/out`) pra você só dar um `helm upgrade` e ver dois arquivos (`raw.log` e `json.log`) sendo escritos em paralelo.