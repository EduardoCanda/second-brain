# Race conditions

## Definição
Race condition acontece quando o resultado depende da ordem de execução entre threads/processos.

## Por que isso importa
É uma fonte clássica de bugs intermitentes e difíceis de reproduzir.

## Exemplo de código
```java
class Contador {
    int total = 0;
    void inc() { total++; } // não é atômico
}
```

## Modelo mental
Se duas operações tocam o mesmo dado, assuma risco de corrida até provar o contrário com sincronização ou desenho sem compartilhamento.

## Erros comuns
- Achar que operações simples são automaticamente atômicas.
- Depender de testes locais para provar ausência de corrida.
- Não proteger leitura e escrita de estado compartilhado.

## Conceitos relacionados
[[Concorrência]]
[[Thread safety]]
[[Debugging]]
