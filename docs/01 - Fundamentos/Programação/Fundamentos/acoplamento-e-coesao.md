# Acoplamento e Coesão

## Definição
Acoplamento mede dependência entre módulos; coesão mede o quanto as responsabilidades de um módulo fazem sentido juntas.

## Por que isso importa
Baixo acoplamento e alta coesão facilitam manutenção, testes e deploys independentes.

## Exemplo de código
```java
class PedidoService {
    private final PagamentoService pagamento;
    private final EstoqueService estoque;

    PedidoService(PagamentoService pagamento, EstoqueService estoque) {
        this.pagamento = pagamento;
        this.estoque = estoque;
    }
}
```

## Modelo mental
Módulos bons mudam por um motivo principal. Se uma mudança quebra cinco partes não relacionadas, há acoplamento excessivo.

## Erros comuns
- Criar classes “faz-tudo” com baixa coesão.
- Acoplar lógica de negócio a frameworks específicos.
- Dependências cíclicas entre pacotes.

## Conceitos relacionados
[[Abstração]]
[[Composição vs Herança]]
[[Contratos de API]]
