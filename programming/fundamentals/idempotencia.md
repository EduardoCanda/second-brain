# Idempotência

## Definição
Uma operação idempotente pode ser executada múltiplas vezes com o mesmo efeito final.

## Por que isso importa
Em sistemas distribuídos, retries acontecem. Idempotência evita cobranças duplicadas, criação duplicada de recursos e inconsistência.

## Exemplo de código
```java
@PutMapping("/usuarios/{id}")
public Usuario atualizar(@PathVariable String id, @RequestBody Usuario payload) {
    return service.salvar(id, payload);
}
```

## Modelo mental
Sempre pergunte: “Se essa requisição chegar duas vezes, o estado final continua correto?”

## Erros comuns
- Usar POST sem chave de idempotência em operações críticas.
- Assumir entrega única em filas/mensageria.
- Não versionar atualização de estado concorrente.

## Conceitos relacionados
[[Retries e timeouts]]
[[Contratos de API]]
[[Tolerância a falhas]]
