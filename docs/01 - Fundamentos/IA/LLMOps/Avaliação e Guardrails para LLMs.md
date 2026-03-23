# Avaliação e Guardrails para LLMs

## Definição clara
Avaliação e guardrails são práticas e mecanismos para medir qualidade de respostas e impor limites de segurança/compliance em aplicações com LLM.

## Explicação conceitual
Em engenharia de software, guardrails funcionam como validação de contrato: mesmo com saída probabilística, o sistema deve respeitar formato, políticas e limites operacionais.

## Como funciona internamente
1. Definição de rubricas e testes (offline/online).
2. Avaliação automática e humana de respostas.
3. Filtros de entrada/saída (PII, toxicidade, jailbreak).
4. Restrições estruturais (JSON schema, function calling).
5. Fallbacks: recusa segura, resposta padrão ou escalonamento humano.

## Exemplos práticos
- Bloquear geração de dados sensíveis.
- Validar saída obrigatória em JSON antes de persistir.
- Enviar casos ambíguos para revisão humana.

## Quando usar
- Aplicações externas com risco reputacional.
- Fluxos críticos (financeiro, saúde, jurídico).
- Produtos com requisitos de compliance e auditoria.

## Limitações
- Guardrails excessivos podem reduzir utilidade.
- Avaliação automática não captura todos os erros.
- Regras precisam ser atualizadas com novos ataques.

## Relação com outros conceitos
- Complementa [Observabilidade para Aplicações com LLM](Observabilidade%20para%20Aplica%C3%A7%C3%B5es%20com%20LLM.md).
- Depende de bons prompts em [Prompt Engineering](../LLM%20Engineering/Prompt%20Engineering.md).
- Em sistemas com busca, reforça segurança em [Retrieval-Augmented Generation (RAG) em Produção](../LLM%20Engineering/Retrieval-Augmented%20Generation%20(RAG)%20em%20Produ%C3%A7%C3%A3o.md).

## Exemplos em Python quando aplicável
```python
import json

def validar_resposta_json(resposta: str) -> bool:
    try:
        data = json.loads(resposta)
        return all(k in data for k in ["impacto", "causa", "acao_recomendada"])
    except Exception:
        return False

print(validar_resposta_json('{"impacto":"alto","causa":"timeout","acao_recomendada":"rollback"}'))
```
