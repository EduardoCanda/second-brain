---
tags:
  - SRE
  - NotaBibliografica
  - Segurança
categoria: metricas
ferramenta: prometheus
---
# **Remoção de Métricas do TSDB do Prometheus**

Se as métricas indesejadas já foram armazenadas no [[time-series|TSDB]] (Time Series Database) do [[prometheus]], a abordagem para lidar com elas é diferente da filtragem durante o [[scrapping|scraping]]. Aqui estão as opções disponíveis:

## **1. Soluções para Métricas já Armazenadas**

### **A. Exclusão Manual de Série Temporal**
O Prometheus oferece uma API administrativa para exclusão de séries específicas:

```bash
# Exemplo: Remover todas as séries com o nome 'debug_metric'
curl -X POST -g 'http://localhost:9090/api/v1/admin/tsdb/delete_series?match[]={__name__=~"debug_.*"}'

# Remover séries específicas de um job
curl -X POST -g 'http://localhost:9090/api/v1/admin/tsdb/delete_series?match[]={job="my-job",__name__=~"unwanted_metric"}'
```

**Requisitos**:
- A flag `--web.enable-admin-api` deve estar ativada no Prometheus.
- Isso só remove os dados **para frente**, não exclui blocos históricos compactados.

### **B. Limpeza Completa de Dados Antigos**
Para remover completamente os dados (incluindo blocos antigos):

```bash
# 1. Primeiro marque as séries para exclusão
curl -X POST -g 'http://localhost:9090/api/v1/admin/tsdb/delete_series?match[]={__name__=~"unwanted_metric.*"}'

# 2. Force a compactação para limpar os dados marcados
curl -X POST 'http://localhost:9090/api/v1/admin/tsdb/clean_tombstones'
```

### **C. Soluções para Dados Históricos**
Se você usa soluções como **[[thanos]]** ou **Cortex**:
- **Thanos Compactor**: Pode executar downsampling e limpeza de séries deletadas.
- **Cortex**: Permite exclusão via API de operações.

## **2. Prevenção para o Futuro**
Para evitar que as métricas indesejadas sejam armazenadas novamente:

1. **Adicione `metric_relabel_configs`** (como mencionado anteriormente) para filtrar durante o scraping.
2. **Revise os Exporters**: Configure para não gerar métricas desnecessárias.
3. **Use [[recording-rules]]**: Agregue métricas problemáticas para reduzir cardinalidade.

## **3. Limitações Importantes**
- **Dados históricos**: A API `delete_series` não remove dados já compactados em blocos antigos.
- **Performance**: Operações de exclusão em massa podem impactar o Prometheus temporariamente.
- **Thanos/Cortex**: Se estiver usando armazenamento de longo prazo, consulte a documentação específica.

## **Resumo das Opções**
| Cenário | Solução |
|---------|---------|
| **Métricas recentes** | API `delete_series` + `clean_tombstones` |
| **Prevenção futura** | `metric_relabel_configs` no scraping |
| **Dados históricos** | Thanos Compactor ou recriação do TSDB |

**Próximo passo**: Se as métricas são críticas, considere fazer backup do diretório `data/` do Prometheus antes de executar operações de exclusão!