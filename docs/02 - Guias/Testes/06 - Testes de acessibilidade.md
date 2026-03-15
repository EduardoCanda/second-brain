# ♿ Testes de acessibilidade

Acessibilidade não é “acabamento”; é requisito de qualidade, inclusão e, em muitos contextos, conformidade legal.

## Pirâmide de acessibilidade (operacional)

```ascii
            [E2E assistivo]
       Leitor de tela e navegação real

          [Integração UI]
  Fluxos com teclado, foco e estados dinâmicos

          [Automatizados]
  Regras WCAG automatizáveis (axe, pa11y, etc.)

              [Base]
  Semântica HTML, contraste, labels e heading
```

## Estratégia em camadas

### 1) Automação de regras objetivas

- Contraste mínimo.
- `aria-*` obrigatório em componentes customizados.
- Hierarquia de heading coerente.
- Inputs com label associado.

### 2) Testes funcionais de navegação

- Ordem de tabulação consistente.
- Foco visível e não “preso”.
- Operação completa sem mouse.

### 3) Testes assistivos manuais

- Leitor de tela (NVDA/VoiceOver) em fluxos críticos.
- Verificação de feedback auditivo em validação de formulário.
- Avaliação de conteúdo dinâmico (toasts, modais, loading).

## Métricas práticas

- % de páginas críticas sem violação automática bloqueante.
- Tempo médio para corrigir falhas de a11y.
- Cobertura de fluxos críticos com teste de teclado + leitor de tela.

## Integração com pipeline

- Executar scanner automático em PR (gate leve).
- Executar suíte estendida em main/release.
- Bloquear release para falhas severas (ex.: impossibilidade de navegação por teclado).
