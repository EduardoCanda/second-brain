# Composição vs Herança

## Definição
Herança reutiliza comportamento via relação "é um"; composição reutiliza via relação "tem um".

## Por que isso importa
Composição costuma ser mais flexível em sistemas reais, porque permite trocar comportamentos sem hierarquias rígidas.

## Exemplo de código
```java
class NotificadorEmail {
    void enviar(String msg) {}
}

class PedidoService {
    private final NotificadorEmail notificador;

    PedidoService(NotificadorEmail notificador) {
        this.notificador = notificador;
    }
}
```

## Modelo mental
Prefira composição por padrão. Use herança quando a relação de subtipo for estável e semanticamente correta.

## Erros comuns
- Criar hierarquias profundas difíceis de entender.
- Usar herança apenas para reutilizar código.
- Quebrar princípio de substituição de Liskov.

## Conceitos relacionados
[[Acoplamento e Coesão]]
[[Abstração]]
[[Encapsulamento]]
