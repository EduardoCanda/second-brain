# O que é Inteligência Artificial

## Definição clara
Inteligência Artificial (IA) é o campo da computação que desenvolve sistemas capazes de executar tarefas que normalmente exigem inteligência humana, como percepção, tomada de decisão, linguagem e aprendizado.

## Explicação conceitual
Para engenharia de software, IA é uma forma de implementar comportamento adaptativo orientado por dados. Em vez de codificar todas as regras manualmente, o sistema aprende padrões a partir de exemplos e probabilidades.

## Como funciona internamente
1. **Entrada de dados**: texto, imagem, áudio, eventos.
2. **Representação**: dados são convertidos para estruturas numéricas.
3. **Modelo**: algoritmo aprende parâmetros (pesos/regras).
4. **Inferência**: modelo produz uma saída para novos dados.
5. **Feedback**: métricas e monitoramento orientam melhoria contínua.

## Exemplos práticos
- Filtro de spam em e-mail.
- Recomendação de produtos em e-commerce.
- Classificação automática de tickets de suporte.

## Quando usar
- Quando regras fixas não capturam a complexidade do problema.
- Quando há dados históricos suficientes.
- Quando o problema admite decisões probabilísticas.

## Limitações
- Dependência de qualidade e volume de dados.
- Pode reproduzir vieses existentes nos dados.
- Custos de infraestrutura e manutenção em produção.

## Relação com outros conceitos
- Base para [Aprendizado Supervisionado](../Machine%20Learning/Aprendizado%20Supervisionado.md) e [Aprendizado Não Supervisionado](../Machine%20Learning/Aprendizado%20N%C3%A3o%20Supervisionado.md).
- Subárea [Redes Neurais Artificiais](../Deep%20Learning/Redes%20Neurais%20Artificiais.md) dentro de Deep Learning.
- Aplicações modernas incluem [Transformers](../Deep%20Learning/Transformers.md) e [Retrieval-Augmented Generation (RAG) em Produção](../LLM%20Engineering/Retrieval-Augmented%20Generation%20(RAG)%20em%20Produ%C3%A7%C3%A3o.md).

## Exemplos em Python quando aplicável
```python
# Exemplo simples de inferência com regra probabilística mock
import random

def classificar_ticket(texto: str) -> str:
    classes = ["incidente", "duvida", "solicitacao"]
    return random.choice(classes)

print(classificar_ticket("API retornando 500 em produção"))
```
