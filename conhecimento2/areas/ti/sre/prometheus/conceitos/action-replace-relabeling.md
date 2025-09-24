---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Ação `replace` no Relabeling do Prometheus**

A ação **`replace`** é a mais comum e versátil no [relabeling](relabeling.md) do [[prometheus]]. Ela permite **modificar ou criar [[labels-prometheus|labels]]** dinamicamente com base em outras labels, valores estáticos ou expressões regulares.

---

## **Como Funciona a Ação `replace`?**

### **Fluxo Básico**
1. **Seleciona** valores de uma ou mais `source_labels` (labels de origem).
2. **Aplica** uma expressão regular (`regex`) para extrair partes do valor.
3. **Atribui** o resultado a uma `target_label` (label de destino).

### **Parâmetros Principais**
| Parâmetro       | Obrigatório? | Descrição                                                                                      | Exemplo                        |
| --------------- | ------------ | ---------------------------------------------------------------------------------------------- | ------------------------------ |
| `source_labels` | Sim          | Labels de origem para extrair valores.                                                         | `[__meta_kubernetes_pod_name]` |
| `separator`     | Não          | Separador para juntar múltiplas `source_labels` (padrão: `;`).                                 | `separator: "/"`               |
| `regex`         | Não          | Expressão regular para filtrar/extrair partes do valor (padrão: `(.*)`).                       | `regex: "pod-(.+)"`            |
| `replacement`   | Não          | Valor de substituição (pode referenciar grupos da `regex` com `$1`, `$2`, etc.). Padrão: `$1`. | `replacement: "app-$1"`        |
| `target_label`  | Sim          | Label que receberá o valor processado.                                                         | `target_label: "pod_name"`     |

---

## **Casos de Uso Comuns**

### **1. Renomear uma Label Existente**
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_name]
    regex: (.+)
    target_label: pod_name  # Renomeia __meta_kubernetes_pod_name para pod_name
```

### **2. Extrair Parte de um Valor com Regex**
```yaml
relabel_configs:
  - source_labels: [__address__]
    regex: "([^:]+):\\d+"  # Captura apenas o IP (ignora a porta)
    replacement: "$1"
    target_label: instance_ip
```

### **3. Criar uma Label Baseada em Múltiplas Source Labels**
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_pod_name]
    separator: "/"  # Junta os valores com "/"
    regex: (.+)
    target_label: k8s_resource
```
- Se `__meta_kubernetes_namespace=prod` e `__meta_kubernetes_pod_name=app-1`, resulta em:  
  `k8s_resource="prod/app-1"`.

### **4. Valor Estático (Ignorando Source Labels)**
```yaml
relabel_configs:
  - target_label: env
    replacement: "production"  # Define um valor fixo
```

### **5. Modificar o Endpoint de Scrape (__metrics_path__)**
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
    regex: (.+)
    target_label: __metrics_path__  # Altera o caminho do scrape (ex.: /custom-metrics)
```

---

## **Exemplo Completo ([[kubernetes]])**
```yaml
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      # Extrai o nome do deployment do pod name
      - source_labels: [__meta_kubernetes_pod_name]
        regex: "(.+)-[a-z0-9]+-[a-z0-9]+"  # Captura o prefixo (ex.: "app-59d8f5ddc6-abc123" → "app")
        replacement: "$1"
        target_label: app

      # Adiciona uma label 'tier' baseada em uma annotation do pod
      - source_labels: [__meta_kubernetes_pod_annotation_tier]
        regex: (.+)
        target_label: tier

      # Define um valor estático para 'monitoring_source'
      - target_label: monitoring_source
        replacement: "prometheus"
```

---

## **Diferença Entre `replace` e Outras Ações**
| Ação | Descrição | Quando Usar |
|------|-----------|-------------|
| **`replace`** | Modifica/cria labels dinamicamente. | Quando você precisa transformar valores ou criar novas labels. |
| **`keep`/`drop`** | Filtra targets (não modifica labels). | Para selecionar quais targets devem ser monitorados. |
| **`labelmap`** | Renomeia labels usando regex (útil para `__meta_*`). | Quando você quer mapear várias labels de uma vez. |

---

## **Regras Importantes**
1. Se `regex` não for especificada, o padrão é `(.*)` (captura tudo).  
2. Se `replacement` não for definido, o padrão é `$1` (primeiro grupo da regex).  
3. Se a `regex` não der match, a label **não é modificada**.  

---

## **Resumo**
- A ação **`replace`** é usada para **transformar valores de labels** ou **criar novas labels**.  
- Pode extrair partes de strings com **regex** e referenciar grupos com `$1`, `$2`, etc.  
- É essencial para **enriquecer métricas** com metadados (ex.: Kubernetes, cloud).  

Quer um exemplo específico para seu cenário? Posso ajudar a criar uma regra personalizada! 😊