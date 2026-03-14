# Imutabilidade

## Definição
Um objeto imutável não muda após ser criado; qualquer alteração gera nova instância.

## Por que isso importa
Reduz bugs de concorrência e torna o fluxo de dados previsível, especialmente em processamento assíncrono.

## Exemplo de código
```java
record Usuario(String id, String nome) {}

Usuario u1 = new Usuario("1", "Ana");
Usuario u2 = new Usuario(u1.id(), "Ana Souza");
```

## Modelo mental
Dados imutáveis podem ser compartilhados com segurança entre threads e funções sem medo de modificação acidental.

## Erros comuns
- Modificar estado global em muitos lugares.
- Criar objetos quase-imutáveis com campos mutáveis internos.
- Ignorar custo de cópia em estruturas grandes sem estratégia.

## Conceitos relacionados
[[Estado e efeitos colaterais]]
[[Thread safety]]
[[Funções puras]]
