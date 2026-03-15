# Estado e efeitos colaterais

## Definição
Estado é o valor armazenado ao longo do tempo; efeito colateral é qualquer impacto externo além do retorno da função.

## Por que isso importa
Entender onde há estado e efeitos ajuda a controlar bugs difíceis de reproduzir em produção.

## Exemplo de código
```java
class Contador {
    private int total = 0;

    int incrementar() {
        total++;
        return total;
    }
}
```

## Modelo mental
Código mais previsível separa cálculo puro de operações com I/O, banco, rede e relógio.

## Erros comuns
- Esconder escrita em banco dentro de métodos “inofensivos”.
- Misturar regra de negócio e logging sem isolamento.
- Depender de estado global para decisões críticas.

## Conceitos relacionados
[[Funções puras]]
[[Imutabilidade]]
[[Debugging]]
