# Thread safety

## Definição
Thread safety é a capacidade de um código funcionar corretamente quando acessado por múltiplas threads.

## Por que isso importa
Sem thread safety, comportamento pode ficar incorreto sob carga, mesmo que funcione em desenvolvimento.

## Exemplo de código
```java
class Sequenciador {
    private final AtomicLong seq = new AtomicLong(0);

    long proximo() {
        return seq.incrementAndGet();
    }
}
```

## Modelo mental
Pense em invariantes compartilhados. Se há escrita concorrente, use imutabilidade, confinamento ou primitivas de sincronização.

## Erros comuns
- Usar coleções não thread-safe em contexto concorrente.
- Sincronizar demais e gerar gargalo.
- Não documentar expectativas de concorrência da classe.

## Conceitos relacionados
[[Concorrência]]
[[Race conditions]]
[[Imutabilidade]]
