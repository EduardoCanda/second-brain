# 🔥 Smoke testes

Smoke tests são verificações rápidas e essenciais para responder: **“o sistema está minimamente funcional após build/deploy?”**

## Características

- Curta duração.
- Escopo mínimo de sobrevivência da aplicação.
- Executados em pontos críticos: pós-build, pós-deploy e pós-rollback.

## Exemplo de escopo de smoke

```ascii
[Healthcheck] -> [Autenticação básica] -> [Endpoint crítico de negócio]
      |                   |                         |
      +----- se falhar ---+----------- BLOQUEIA ----+
```

## Smoke x Sanity x E2E

- **Smoke:** valida sobrevivência geral do sistema.
- **Sanity:** valida ajuste específico após mudança pontual.
- **E2E:** valida jornadas completas com mais profundidade.

## Onde executar

- Em PR (versão reduzida, se houver ambiente efêmero).
- Em staging após deploy.
- Em produção com escopo seguro (sem mutações perigosas).

## Boas práticas

- Cobrir o caminho feliz mínimo de negócio.
- Ter oráculo claro de sucesso/falha (status, payload, tempo de resposta).
- Integrar com rollback automático quando aplicável.
- Evitar dependência de dados frágeis e estado compartilhado.

## Template simples de suíte de smoke

- [ ] Serviço responde `200` em `/health`.
- [ ] Login de usuário de teste funciona.
- [ ] Fluxo crítico principal responde dentro do SLO.
- [ ] Erros de aplicação e infraestrutura abaixo do limiar definido.
