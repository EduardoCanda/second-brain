# Cache

## Definição
Cache guarda dados frequentemente acessados para reduzir latência e carga no sistema de origem.

## Por que isso importa
Em backend, cache bem aplicado reduz custo e melhora tempo de resposta de forma significativa.

## Exemplo de código
```java
@Cacheable("usuarios")
public Usuario buscarUsuario(String id) {
    return repo.findById(id).orElseThrow();
}
```

## Modelo mental
Cache é aposta probabilística: quando acerta, ganha performance; quando erra, precisa fallback correto.

## Erros comuns
- Não definir TTL e servir dados obsoletos indefinidamente.
- Ignorar invalidação ao atualizar dado fonte.
- Cachear sem medir hit rate e p95.

## Conceitos relacionados
[[HashMap]]
[[Observabilidade]]
[[Tolerância a falhas]]
