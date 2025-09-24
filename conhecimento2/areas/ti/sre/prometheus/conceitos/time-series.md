---
tags:
  - SRE
  - NotaBibliografica
  - Conceito
categoria: metricas
ferramenta: prometheus
---
# **Banco de Dados de Séries Temporais (Time-Series Database - TSDB) no Prometheus**

O **[[prometheus]]** usa um banco de dados otimizado para séries temporais (**TSDB**), projetado para armazenar e consultar métricas de forma eficiente. Vamos explorar seu funcionamento, estrutura e como ele grava diferentes tipos de métricas (como `Counter`, `Gauge`, etc.).

---

## **1. O que é um Banco de Dados de Séries Temporais?**
Um **TSDB** é especializado em armazenar dados associados a **carimbos de tempo (timestamps)**, onde cada entrada representa um valor em um momento específico. No Prometheus, o TSDB:
- **Armazena métricas** como séries temporais multidimensionais (identificadas por **nomes + labels**).
- **Otimiza consultas** para intervalos de tempo (`range queries`) e agregações (`sum`, `rate`, etc.).
- **Compacta dados** automaticamente para reduzir armazenamento.

---

## **2. Estrutura do TSDB do Prometheus**
### **A. Componentes Principais**
| Componente                       | Função                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------- |
| **Série Temporal (Time Series)** | Sequência de pontos `(timestamp, valor)` associados a uma métrica + labels.     |
| **Head Block**                   | Bloco em memória (RAM) que armazena dados **recentes** (ainda não persistidos). |
| **Block (Bloco Persistido)**     | Dados compactados em disco, organizados em intervalos fixos (ex.: 2h).          |
| **WAL (Write-Ahead Log)**        | Log de escritas para recuperação após falhas.                                   |

### **B. Formato de Armazenamento**
Cada métrica é armazenada como:
```
<metric_name>{<label1>=<value1>, <label2>=<value2>, ...}  <valor>  <timestamp>
```
Exemplo:
```
http_requests_total{method="GET", status="200"}  100  1625097600
http_requests_total{method="GET", status="200"}  105  1625097660
```
- **Métrica + Labels** definem a "chave" da série.
- **Valor + Timestamp** são os pontos de dados.

---

## **3. Como Diferentes Tipos de Métricas são Armazenadas?**
### **A. Counter (Contador)**
- **Armazenamento**: Cada incremento gera um novo ponto `(timestamp, valor acumulado)`.
  ```
  # Timestamp (Unix) | Valor
  1625097600         | 100
  1625097660         | 105  (+5)
  1625097720         | 110  (+5)
  ```
- **Consulta**: Usa funções como `rate()` ou `increase()` para calcular crescimentos em intervalos.

### **B. Gauge (Medidor)**
- **Armazenamento**: Grava o **valor atual** em cada timestamp.
  ```
  # Timestamp (Unix) | Valor
  1625097600         | 42
  1625097660         | 38  (diminuiu)
  1625097720         | 45  (aumentou)
  ```
- **Consulta**: Usa `avg()`, `max()`, etc., para análise instantânea.

### **C. Histogram e Summary**
- **Armazenamento**: Geram múltiplas séries:
  - **Histogram**:  
    ```plaintext
    http_request_duration_seconds_bucket{le="0.1"} 10
    http_request_duration_seconds_bucket{le="0.5"} 25
    http_request_duration_seconds_sum 123.4
    http_request_duration_seconds_count 50
    ```
  - **Summary**:  
    ```plaintext
    api_latency_seconds{quantile="0.5"} 0.2
    api_latency_seconds_sum 45.3
    api_latency_seconds_count 120
    ```

---

## **4. Esquema do Banco de Dados (TSDB)**
### **A. Estrutura em Disco**
```
data/
├── 01BKGTZQ1SYQJTR4PB43C8PDHH/  # Bloco (2h de dados)
│   ├── chunks/                   # Dados brutos (compactados)
│   │   └── 000001                # Segmento de séries temporais
│   ├── index                     # Índice para busca rápida
│   └── meta.json                 # Metadados do bloco
├── wal/                          # Write-Ahead Log (dados não persistidos)
│   └── 000000002                 # Registros recentes
└── lock                          # Arquivo de lock
```

### **B. Compactação e Retenção**
- **Compactação**: Dados antigos são compactados em **blocos imutáveis** (2h por padrão).  
- **Retenção**: Configurável via `--storage.tsdb.retention.time` (padrão: 15 dias).  

---

## **5. Consultas no TSDB**
### **A. Exemplo de Query ([[promql]])**
```promql
# Média de latência nos últimos 5 minutos
avg(rate(http_request_duration_seconds_sum[5m])) by (service)
```

### **B. Otimizações para Séries Temporais**
- **Indexação**: Rápida busca por métrica + labels.  
- **Amortização de Escrita**: Dados são agrupados em memória antes de persistir.  
- **Algoritmos de Compactação**: Usa **delta encoding** e **XOR compression** para reduzir tamanho.  

---

## **6. Comparação com Bancos Tradicionais (SQL vs. TSDB)**
| Característica      | TSDB (Prometheus)                                                 | Banco SQL Tradicional            |
| ------------------- | ----------------------------------------------------------------- | -------------------------------- |
| **Modelo de Dados** | Séries temporais (timestamp + valor)                              | Tabelas relacionais              |
| **Escrita**         | Alta velocidade (append-only)                                     | Transações [[ACID E BASE\|ACID]] |
| **Consulta**        | Otimizada para `range queries`                                    | JOINs complexos                  |
| **Cardinalidade**   | Problema crítico (evitar [[labels-prometheus\|labels]] dinâmicas) | Menos sensível                   |

---

## **7. Quando Usar um TSDB?**
- **Monitoramento** (métricas de infraestrutura, aplicações).  
- **IoT** (dados de sensores com timestamp).  
- **Financeiro** (séries históricas de preços).  

---

## **Resumo**
- O **TSDB do Prometheus** armazena séries temporais como `(timestamp, valor)` + labels.  
- **Counters** registram valores acumulados; **Gauges** armazenam estados instantâneos.  
- Dados são organizados em **blocos compactados** e otimizados para consultas temporais.  
- **Evite alta cardinalidade** para não sobrecarregar o TSDB.  

Se quiser mergulhar em detalhes de implementação ou otimização, posso explicar como o Prometheus lida com compressão, indexação ou até como migrar para soluções escaláveis como **Thanos**! 🚀