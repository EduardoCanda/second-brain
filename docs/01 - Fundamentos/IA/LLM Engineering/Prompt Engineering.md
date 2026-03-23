# Prompt Engineering

## Definição clara
Prompt Engineering é o processo de projetar instruções, contexto e exemplos para guiar o comportamento de um LLM em direção a saídas úteis e consistentes.

## Explicação conceitual
Na prática de engenharia, prompt é interface de programação para modelos generativos. Um bom prompt reduz variabilidade e melhora qualidade sem retrain.

## Como funciona internamente
1. Define papel, objetivo e formato de resposta.
2. Injeta contexto relevante (documentos, regras, exemplos).
3. Aplica técnicas (few-shot, chain-of-thought restrito, delimitação).
4. Avalia saída e itera com testes sistemáticos.

## Exemplos práticos
- Geração de resumo técnico padronizado.
- Classificação de tickets com JSON estruturado.
- Geração de queries SQL assistida.

## Quando usar
- Construção rápida de protótipos com LLM.
- Casos onde ajuste de prompt é suficiente.
- Integração de regras de negócio sem fine-tuning inicial.

## Limitações
- Fragilidade a pequenas mudanças de entrada.
- Dependência da janela de contexto.
- Pode não resolver lacunas de conhecimento factual.

## Relação com outros conceitos
- Complementa [Retrieval-Augmented Generation (RAG) em Produção](Retrieval-Augmented%20Generation%20(RAG)%20em%20Produ%C3%A7%C3%A3o.md).
- Depende da arquitetura [Transformers](../Deep%20Learning/Transformers.md).
- Precisa de validação contínua em [Avaliação e Guardrails para LLMs](../LLMOps/Avalia%C3%A7%C3%A3o%20e%20Guardrails%20para%20LLMs.md).

## Exemplos em Python quando aplicável
```python
from openai import OpenAI

client = OpenAI()

prompt = """
Você é um assistente de SRE.
Responda em JSON com campos: impacto, causa, ação_recomendada.
Incidente: aumento de latência em API de pagamentos.
"""

resp = client.responses.create(model="gpt-4.1-mini", input=prompt)
print(resp.output_text)
```
