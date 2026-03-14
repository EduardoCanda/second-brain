# Programação orientada a eventos

## Definição
É um modelo em que componentes reagem a eventos emitidos por outros componentes.

## Por que isso importa
Reduz acoplamento temporal entre serviços e melhora escalabilidade em fluxos assíncronos.

## Exemplo de código
```java
@KafkaListener(topics = "pedido-criado")
public void aoCriarPedido(String evento) {
    // processa evento
}
```

## Modelo mental
Trate eventos como fatos imutáveis do domínio, e consumidores como projeções/reação a esses fatos.

## Erros comuns
- Publicar evento sem contrato/versionamento.
- Assumir ordem global em múltiplas partições.
- Não tratar reprocessamento de mensagens.

## Conceitos relacionados
[[Idempotência]]
[[Contratos de API]]
[[Tolerância a falhas]]
