# Observabilidade para Aplicações com LLM

## Definição clara
Observabilidade de LLM é o conjunto de práticas para medir qualidade, custo, latência, segurança e comportamento de aplicações baseadas em modelos de linguagem.

## Explicação conceitual
Aplicações com LLM têm variabilidade estocástica. Métricas tradicionais de API não bastam: é preciso observar também qualidade semântica e aderência a políticas.

## Como funciona internamente
1. Coleta de logs de prompt, contexto e resposta.
2. Métricas técnicas: latência, tokens, erro, custo.
3. Métricas de qualidade: relevância, groundedness, toxicidade.
4. Tracing fim a fim do pipeline (retrieval + geração).
5. Alertas e loops de melhoria contínua.

## Exemplos práticos
- Dashboard por endpoint com custo por requisição.
- Alertas de aumento de alucinação.
- Auditoria de respostas que violam políticas.

## Quando usar
- Qualquer aplicação LLM em produção.
- Ambientes regulados com trilha de auditoria.
- Times que precisam otimizar custo/latência.

## Limitações
- Avaliação automática imperfeita para qualidade semântica.
- Volume de logs pode gerar custo alto.
- Privacidade exige anonimização cuidadosa.

## Relação com outros conceitos
- Suporta [[Avaliação e Guardrails para LLMs]].
- Necessário para operar [[Retrieval-Augmented Generation (RAG) em Produção]].
- Faz parte de [[Arquitetura de Sistemas de IA em Produção]].

## Exemplos em Python quando aplicável
```python
import time

start = time.time()
# chamada ao modelo aconteceria aqui
latency_ms = (time.time() - start) * 1000

log = {
    "model": "gpt-4.1-mini",
    "latency_ms": round(latency_ms, 2),
    "prompt_tokens": 320,
    "completion_tokens": 120,
}
print(log)
```
