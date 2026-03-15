# Contratos de API

## Definição
Contrato de API define formato, semântica e regras de interação entre clientes e serviços.

## Por que isso importa
Contratos claros evitam que mudanças internas quebrem consumidores externos.

## Exemplo de código
```java
@GetMapping("/v1/pedidos/{id}")
public PedidoResponse buscar(@PathVariable String id) {
    return service.buscar(id);
}
```

## Modelo mental
Pense em API como produto: versione mudanças, documente erros e preserve compatibilidade.

## Erros comuns
- Mudar campos sem versionamento.
- Retornar erros inconsistentes sem padrão.
- Não definir SLA/SLO e limites de uso.

## Conceitos relacionados
[[Abstração]]
[[Serialização]]
[[Observabilidade]]
