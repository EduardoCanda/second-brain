# Funções puras

## Definição
Função pura retorna sempre o mesmo resultado para a mesma entrada e não causa efeitos colaterais.

## Por que isso importa
Funções puras são fáceis de testar, paralelizar e reutilizar.

## Exemplo de código
```java
static BigDecimal calcularDesconto(BigDecimal valor, BigDecimal taxa) {
    return valor.multiply(taxa);
}
```

## Modelo mental
Trate funções puras como “blocos matemáticos” confiáveis. Quanto mais domínio em funções puras, menor a superfície de erro.

## Erros comuns
- Ler relógio/sistema dentro de função que deveria ser pura.
- Alterar coleções recebidas por parâmetro.
- Escrever em log ou banco em função de cálculo.

## Conceitos relacionados
[[Estado e efeitos colaterais]]
[[Imutabilidade]]
[[Testes]]
