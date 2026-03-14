# Deadlocks

## Definição
Deadlock é bloqueio mútuo: duas ou mais threads esperam indefinidamente por recursos presos entre si.

## Por que isso importa
Pode congelar processamento e causar indisponibilidade parcial ou total.

## Exemplo de código
```java
Object a = new Object();
Object b = new Object();

synchronized (a) {
    synchronized (b) {}
}
// outra thread pode fazer na ordem inversa e travar
```

## Modelo mental
Mantenha ordem global de aquisição de locks e reduza escopo de bloqueio.

## Erros comuns
- Bloquear recursos em ordem variável.
- Segurar lock durante I/O lento.
- Ignorar timeouts em aquisição de lock distribuído.

## Conceitos relacionados
[[Concorrência]]
[[Thread safety]]
[[Tolerância a falhas]]
