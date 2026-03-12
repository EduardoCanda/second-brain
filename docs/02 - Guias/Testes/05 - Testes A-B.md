# 🧭 Testes A/B

Teste A/B é uma técnica de experimentação controlada para comparar variantes e decidir com base em evidência estatística.

## Estrutura básica

- **A (controle):** experiência atual.
- **B (variante):** mudança proposta.
- **Métrica primária:** objetivo principal (ex.: conversão).
- **Métricas de guarda:** evitam ganho local com dano global (ex.: erro, churn, acessibilidade).

## Fluxo de execução

```mermaid
flowchart LR
    A[Hipótese] --> B[Desenho experimental]
    B --> C[Randomização da audiência]
    C --> D[Coleta de eventos]
    D --> E[Análise estatística]
    E --> F[Decisão: promover, iterar ou descartar]
```

## Cuidados estatísticos e operacionais

- Definir tamanho de amostra e duração mínima antes de iniciar.
- Evitar “p-hacking” (encerrar cedo porque o resultado agradou).
- Controlar sazonalidade (dia da semana, campanhas, datas especiais).
- Segmentar resultados por coortes críticas (device, região, novo vs recorrente).

## Quando NÃO usar A/B

- Mudanças de correção urgente de segurança.
- Recursos mandatórios por compliance.
- Base de tráfego insuficiente para detectar efeito.

## Checklist de experimento saudável

- [ ] Hipótese explícita com impacto esperado.
- [ ] Critério de sucesso e de interrupção definidos.
- [ ] Instrumentação validada antes do início.
- [ ] Métrica de guarda de acessibilidade e performance ativa.
- [ ] Decisão registrada com aprendizado para próximos experimentos.
