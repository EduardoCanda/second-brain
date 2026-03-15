# Debugging

## Definição
Debugging é o processo sistemático de identificar causa raiz de um comportamento incorreto.

## Por que isso importa
Saber debugar rápido reduz MTTR e evita correções superficiais que voltam a quebrar.

## Exemplo de código
```java
public void processar(Pedido p) {
    if (p == null) throw new IllegalArgumentException("pedido nulo");
    // breakpoint aqui para inspecionar estado
}
```

## Modelo mental
Comece por reproduzir o problema, delimitar escopo e testar hipóteses com evidência, não achismo.

## Erros comuns
- Pular direto para correção sem reproduzir o bug.
- Alterar várias coisas ao mesmo tempo e perder causalidade.
- Confiar só em logs sem métricas/traces complementares.

## Conceitos relacionados
[[Observabilidade]]
[[Call stack]]
[[Estado e efeitos colaterais]]
