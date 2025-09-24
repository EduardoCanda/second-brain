---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: logs
ferramenta: fluentbit
---
boa! pensa na **tag** do Fluent Bit como um **rótulo de roteamento** colado em **cada registro de log** assim que ele entra pelo `INPUT`.  
Os **FILTERS** e **OUTPUTS** escolhem o que processar/enviar usando esse rótulo, via `Match` (curinga) ou `Match_Regex` (regex).

## Em 1 linha

**Tag = rótulo para roteamento interno.**  
**Match = regra que diz “quais tags eu aceito”.**

## Por que isso é útil?

- Você pode ter **vários pipelines** dentro do mesmo Fluent Bit.
    
- Cada `OUTPUT` pega **só** os registros com tags que ele **Match**.
    
- Fica fácil isolar testes (ex.: apenas um pod) sem mudar o cluster todo.
    

## Mini exemplo (didático)

```ini
[SERVICE]
  Log_Level info

[INPUT]
  Name  tail
  Path  /var/log/containers/logger_default_logger-*.log
  Tag   kube.test              # ← damos uma TAG aos logs desse arquivo
  Parser cri

[FILTER]
  Name  kubernetes
  Match kube.*                 # ← este filtro pega qualquer tag que comece com "kube."

[OUTPUT]
  Name  file
  Match kube.test              # ← só envia a tag "kube.test" para arquivo
  Path  /out
  File  fluentbit.log
  Format plain
```

O fluxo fica: **tail** (gera tag `kube.test`) → **kubernetes filter** (aplica porque `kube.*` casa) → **file output** (só escreve porque `Match kube.test` casa).

## Padrões que você pode usar

- `Match kube.*` → casa `kube.test`, `kube.nginx`, `kube.qualquercoisa`.
    
- `Match app.frontend` → só exatamente essa tag.
    
- `Match_Regex ^kube\.nginx-.*$` → usa regex para algo mais específico.
    

## O que a tag **não** é

- **Não** é label do Kubernetes (namespace/pod/container).
    
- **Não** é label do Loki/Elastic.
    
- É só um **rótulo interno de roteamento**. (Alguns outputs podem **opcionalmente** imprimir a tag, mas por padrão ela serve para decidir o caminho.)
    

## Como escolher boas tags

- Simples e estáveis: `kube.*`, `nginx.access`, `payments.api`, etc.
    
- Use-as para **separar classes de logs** (por origem, app ou propósito).
    
- Evite colocar coisas que mudam o tempo todo (ex.: IDs aleatórios) — não precisa.
    

## Dicas rápidas

- Você define a tag principalmente no **`[INPUT]`** com `Tag ...`.
    
- Pode “ramificar” depois: ter **vários `OUTPUTS`** com `Match` diferentes.
    
- Para mudar/duplicar tags dinamicamente existe o filtro **`rewrite_tag`** (avançado); no começo, mantenha tags fixas no input.
    

se quiser, eu adapto seu `values.yaml` atual e:

- dou uma **tag única** só para o pod que você quer testar,
    
- deixo um `OUTPUT` para arquivo/`stdout`,
    
- e outro `OUTPUT` (desativado) para quando você quiser enviar a um backend.