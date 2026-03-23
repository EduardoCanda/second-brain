# Retrieval-Augmented Generation (RAG) em Produção

## Definição clara
RAG combina recuperação de contexto em fontes externas com geração por LLM para responder com base em dados atualizados e verificáveis.

## Explicação conceitual
Para engenharia de software, RAG separa conhecimento (base de documentos) de raciocínio (LLM), reduzindo custo de fine-tuning e melhorando governança.

## Como funciona internamente
1. Ingestão de documentos e chunking.
2. Geração de embeddings e indexação vetorial.
3. Recuperação `top-k` com similaridade semântica.
4. Montagem de prompt com contexto recuperado.
5. Geração da resposta com citação/fonte quando possível.

## Exemplos práticos
- Assistente para runbooks de SRE.
- Busca técnica em documentação interna.
- FAQ corporativo com respostas auditáveis.

## Quando usar
- Base de conhecimento muda com frequência.
- Necessidade de usar dados internos privados.
- Requisito de rastreabilidade de resposta.

## Limitações
- Qualidade depende de chunking e retrieval.
- Latência maior por pipeline de busca + geração.
- Risco de recuperar contexto irrelevante.

## Relação com outros conceitos
- Usa [Tokenização e Embeddings](../NLP/Tokeniza%C3%A7%C3%A3o%20e%20Embeddings.md) para indexação.
- Qualidade de prompt depende de [Prompt Engineering](Prompt%20Engineering.md).
- Operação contínua exige [Observabilidade para Aplicações com LLM](../LLMOps/Observabilidade%20para%20Aplica%C3%A7%C3%B5es%20com%20LLM.md).

## Exemplos em Python quando aplicável
```python
# Exemplo simplificado de pipeline RAG (pseudo-código executável)
from typing import List

def recuperar_contexto(pergunta: str) -> List[str]:
    return ["Documento A: política de deploy blue-green"]

def responder(pergunta: str) -> str:
    contexto = "\n".join(recuperar_contexto(pergunta))
    return f"Contexto usado:\n{contexto}\n\nResposta: use rollout progressivo."

print(responder("Como reduzir risco de deploy?"))
```
