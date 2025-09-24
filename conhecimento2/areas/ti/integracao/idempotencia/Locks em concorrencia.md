---
tags:
  - Fundamentos
  - Integracoes
  - NotaBibliografica
---
Ao travar uma transação e houver concorrência, a segunda irá aguardar certo? e quando houver o desbloqueio a outra deve reaproveitar o processamento anterior?
## Comportamento com Locks em Caso de Concorrência

1. **Sim, a segunda transação aguardará** (dependendo do tipo de lock):
   - Se for um lock [[Lock Otimista e Pessimista|**bloqueante** (pessimista)]], a segunda transação ficará em espera até que:
     - A primeira libere o lock (commit/rollback)
     - Ou ocorra timeout (configurável)
   - Se for um lock **otimista**, a segunda transação falhará imediatamente se detectar conflito

2. **Sobre reaproveitar o processamento anterior**:
   - **Não é automático** - quando a segunda transação obtém o lock, ela precisa decidir se:
     a) Reprocessa do zero (com risco de duplicação)
     b) Reutiliza resultados parciais (se aplicável)
     c) Verifica se a operação já foi concluída

## Padrões Recomendados para Lidar com Isso:

### 1. Padrão de Revalidação Idempotente:
```python
def process_with_retry(idempotency_key):
    # Verifica se já foi processado completamente
    if existing := db.get_result(idempotency_key):
        return existing
    
    try:
        with distributed_lock(idempotency_key, timeout=10):
            # Dentro do lock, verifica novamente (double-check)
            if existing := db.get_result(idempotency_key):
                return existing
                
            result = execute_operation()
            db.store_result(idempotency_key, result)
            return result
    except LockTimeout:
        # Pode implementar retry com backoff
        raise OperationRetryableError()
```

### 2. Tabela de Estado de Processamento:
```sql
CREATE TABLE operations (
    idempotency_key VARCHAR(255) PRIMARY KEY,
    status ENUM('pending', 'completed', 'failed'),
    result JSON,
    locked_until TIMESTAMP
);
```

### 3. Estratégias para Decidir o Que Fazer ao Obter o Lock:

| Situação Encontrada      | Ação Recomendada                   |
| ------------------------ | ---------------------------------- |
| Operação já completada   | Retornar resultado existente       |
| Operação em progresso    | Aguardar e verificar novamente     |
| Operação falha anterior  | Tentar reprocessar (se for seguro) |
| Nenhum registro anterior | Processar normalmente              |

## Fluxo Recomendado:

1. Primeira transação:
   - Obtém lock
   - Processa
   - Armazena resultado marcando como completo
   - Libera lock

2. Segunda transação:
   - Tenta obter lock (aguarda se necessário)
   - Ao obter acesso:
     - Verifica se a primeira já completou
     - Se sim, retorna resultado
     - Se não, processa (ou decide não processar)

## Atenção a Armadilhas:

1. **Timeout do lock**: Configure um tempo razoável para evitar deadlocks
2. **Cleanup de locks**: Implemente mecanismos para liberar locks abandonados
3. **Atomicidade**: Garanta que a marcação "completo" e o resultado sejam persistidos atomicamente

Exemplo em Java com Spring:
```java
@Transactional
public Result processIdempotent(String idempotencyKey) {
    return idempotencyService.executeWithIdempotency(
        idempotencyKey, 
        () -> {
            // Sua lógica de negócios aqui
            return expensiveOperation();
        }
    );
}
```

Essa abordagem garante que mesmo com concorrência, apenas uma execução ocorra e as subsequentes reutilizem o resultado já computado.