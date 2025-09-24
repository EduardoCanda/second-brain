---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
---
### O que é Golang?

---

## 🧠 **Guia Completo de Go (Golang) – Para Entrevistas Técnicas de Alto Nível**

---

### 📌 1. **Goroutines e Concorrência**

**Goroutines** são unidades leves de execução, gerenciadas pelo runtime de Go, usadas para concorrência massiva.

### Características:

- Extremamente leves (~2 KB de stack inicial).
- Criadas com `go func() { ... }`.
- Multiplexadas em threads do sistema operacional.
- Agendadas por um **runtime scheduler M:N**.
- Pré-emptivas desde Go 1.14.

### Comunicação:

- Usam **channels** (baseado no modelo CSP — Communicating Sequential Processes).
- Preferem a comunicação explícita sobre o compartilhamento de memória.

### Comparação com Java Virtual Threads:

| Aspecto | Goroutines (Go) | Virtual Threads (Java) |
| --- | --- | --- |
| Gerenciadas pelo runtime | Sim | Sim |
| Paradigma | CSP + channels | Thread tradicional leve |
| Stack leve | Sim (~2 KB) | Sim (~1 KB) |
| Compatibilidade legado | Limitada | Alta |
| Comunicação | Channels | `Future`, `synchronized` etc. |

---

### 🗑️ 2. **Garbage Collector (GC) do Go**

O GC do Go é **concurrent, incremental e tri-color**.

### Como funciona:

1. **Tri-color marking**: marca objetos vivos como branco, cinza, preto.
2. **Incremental**: coleta pequenos pedaços do heap por vez.
3. **Concurrent**: coleta roda paralelamente ao código da aplicação.
4. **STW (Stop-the-world)** mínimo: pausas de microssegundos.

### Pontos fortes:

- Baixa latência.
- Otimizado para servidores de alto throughput.
- Boas heurísticas para heap growth.

### Pontos fracos:

- Você **não controla o GC diretamente**.
- Determinismo menor comparado ao `malloc/free` ou linguagens com RAII como Rust.

### Dica:

Evite alocar objetos em laços intensos. Prefira pools (`sync.Pool`) em cenários críticos de alocação.

---

### 🧵 3. **Multithreading e Scheduling**

Go **não expõe threads diretamente**.

### Funcionamento:

- **Goroutines são agendadas** pelo runtime em threads reais.
- Go implementa um agendador **M:N**:
    - **M**: threads do SO.
    - **N**: goroutines.
- O agendador utiliza 3 componentes principais:
    - `M` (Machine): representa uma thread do SO.
    - `P` (Processor): fila local de goroutines.
    - `G` (Goroutine): unidade de execução.

### Detalhes:

- Cada `P` possui uma fila de goroutines.
- Quando ocioso, um `M` pode **roubar goroutines** de outra fila (`work stealing`).
- Desde Go 1.14, o scheduler é **preemptivo**, evitando starvation.

---

### ❗ 4. **Tratamento de Erros (Error Handling)**

O Go **não usa `try/catch`**. Em vez disso, **erros são valores**.

### Exemplo básico:

```go
go
CopiarEditar
result, err := divide(10, 0)
if err != nil {
    fmt.Println("Erro:", err)
}

```

### Conceitos importantes:

- Funções retornam `(resultado, error)`.
- Erros devem ser tratados **logo após a chamada**.
- Use `fmt.Errorf("msg: %w", err)` para **encadear erros**.
- Use `errors.Is()` ou `errors.As()` para inspeção de tipo.

### Tratamento avançado:

```go
go
CopiarEditar
var pathErr *os.PathError
if errors.As(err, &pathErr) {
	fmt.Println("Erro de sistema de arquivos:", pathErr.Path)
}

```

### Panic/Recover:

- Para **falhas catastróficas**, use `panic()` e `recover()`.
- Não use `panic` para controle de fluxo.

### Vantagens:

- Explícito e previsível.
- Menor risco de erros silenciosos.
- Facilita testes.

### Desvantagens:

- Verboso.
- Repetitivo (`if err != nil`).
- Sem stack trace automático (dependência de logs/observabilidade).

---

### 🧭 Conclusão e Relevância para Staff Engineers

> O Go prioriza simplicidade, previsibilidade e clareza — características extremamente valorizadas em arquiteturas distribuídas de alta escala.
> 

Como Staff Engineer:

- Você deve saber **comunicar bem essas limitações e vantagens**.
- Demonstrar como usar Go em soluções resilientes e eficientes.
- Avaliar cenários em que o **modelo explícito de concorrência e erros** é vantajoso em comparação com outras linguagens/frameworks.

