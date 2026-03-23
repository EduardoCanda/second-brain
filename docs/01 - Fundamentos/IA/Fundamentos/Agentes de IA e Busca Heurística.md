# Agentes de IA e Busca Heurística

## Definição clara
Um agente de IA é uma entidade de software que percebe um ambiente, decide ações e busca maximizar um objetivo. Busca heurística é a técnica de explorar estados com uma função de custo estimado.

## Explicação conceitual
Do ponto de vista de engenharia, agentes modelam automação orientada a objetivos. A heurística reduz espaço de busca, priorizando caminhos promissores em vez de explorar todas as possibilidades.

## Como funciona internamente
1. **Estado inicial** e **objetivo** definidos.
2. **Ações** geram novos estados possíveis.
3. **Heurística h(n)** estima distância até o objetivo.
4. Algoritmo (ex.: A*) escolhe próximo estado com menor custo total.

## Exemplos práticos
- Navegação de robôs em ambiente industrial.
- Planejamento de rotas em logística.
- Agentes em jogos e simulações.

## Quando usar
- Problemas com espaço de estados grande.
- Cenários de planejamento sequencial.
- Quando há boa função heurística disponível.

## Limitações
- Heurística ruim degrada performance.
- Espaço de estados ainda pode explodir.
- Em ambientes dinâmicos, plano pode ficar obsoleto rápido.

## Relação com outros conceitos
- Complementa aprendizado em [Aprendizado Supervisionado](../Machine%20Learning/Aprendizado%20Supervisionado.md).
- Pode usar modelos [Redes Neurais Artificiais](../Deep%20Learning/Redes%20Neurais%20Artificiais.md) como função de valor/política.
- Em sistemas modernos, integra com [Arquitetura de Sistemas de IA em Produção](../AI%20Systems/Arquitetura%20de%20Sistemas%20de%20IA%20em%20Produ%C3%A7%C3%A3o.md).

## Exemplos em Python quando aplicável
```python
from heapq import heappush, heappop

def busca_gulosa(inicio, objetivo, vizinhos, heuristica):
    fila = []
    heappush(fila, (heuristica(inicio, objetivo), inicio))
    visitados = set()

    while fila:
      _, estado = heappop(fila)
      if estado == objetivo:
          return True
      if estado in visitados:
          continue
      visitados.add(estado)
      for v in vizinhos(estado):
          if v not in visitados:
              heappush(fila, (heuristica(v, objetivo), v))
    return False
```
