# Abstração

## Definição
Abstração é focar no que um componente faz, escondendo detalhes de implementação de como ele faz. Em backend, interfaces e contratos são formas clássicas de abstração.

## Por que isso importa
Abstrações reduzem complexidade local. Você troca partes internas sem quebrar quem consome a funcionalidade, desde que o contrato permaneça estável.

## Exemplo de código
```java
interface PagamentoService {
    void cobrar(Pedido pedido);
}

class StripePagamentoService implements PagamentoService {
    public void cobrar(Pedido pedido) {
        // detalhes de integração com Stripe
    }
}
```

## Modelo mental
Engenheiros experientes desenham bordas estáveis entre módulos e deixam detalhes voláteis para dentro da implementação.

## Erros comuns
- Expor detalhes internos desnecessários no contrato público.
- Criar abstrações cedo demais sem necessidade real.
- Confundir abstração com complexidade extra de arquitetura.

## Conceitos relacionados
[[Encapsulamento]]
[[Contratos de API]]
[[Acoplamento e Coesão]]
