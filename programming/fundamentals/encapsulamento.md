# Encapsulamento

## Definição
Encapsulamento é proteger estado interno e expor apenas operações seguras sobre esse estado.

## Por que isso importa
Ele evita inconsistências e reduz efeitos colaterais inesperados, algo essencial em sistemas com múltiplos serviços e times trabalhando juntos.

## Exemplo de código
```java
class Conta {
    private BigDecimal saldo = BigDecimal.ZERO;

    public void depositar(BigDecimal valor) {
        if (valor.signum() <= 0) throw new IllegalArgumentException();
        saldo = saldo.add(valor);
    }

    public BigDecimal getSaldo() {
        return saldo;
    }
}
```

## Modelo mental
Pense em invariantes: quais regras do domínio nunca podem ser violadas? Encapsulamento existe para proteger essas regras.

## Erros comuns
- Expor atributos públicos para escrita direta.
- Adicionar setters genéricos que ignoram regras de negócio.
- Misturar lógica de domínio com acesso externo sem validação.

## Conceitos relacionados
[[Abstração]]
[[Imutabilidade]]
[[Thread safety]]
