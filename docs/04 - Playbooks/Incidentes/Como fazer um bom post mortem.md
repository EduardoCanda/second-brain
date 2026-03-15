# Como fazer um bom post mortem

## Objetivo

Um bom post mortem transforma um incidente em aprendizado prático para o time. O foco é responder **o que aconteceu, por que aconteceu e como evitar recorrência**, sem buscar culpados.

---

## Princípios de um post mortem de qualidade

1. **Sem culpa, com responsabilidade**
   - Foque em sistemas, processos e decisões.
   - Evite linguagem acusatória.

2. **Baseado em fatos e evidências**
   - Use métricas, logs, traces e timeline real.
   - Diferencie fato de hipótese.

3. **Ações concretas e priorizadas**
   - Toda ação deve ter dono, prazo e critério de sucesso.
   - Prefira melhorias sistêmicas a "tomar mais cuidado".

4. **Claro para quem não participou do incidente**
   - Explique contexto, impacto e termos técnicos.
   - Escreva para o "eu do futuro".

5. **Curto o suficiente para ser lido, completo o suficiente para ser útil**
   - Resumo executivo no início.
   - Detalhes técnicos no corpo.

---

## Estrutura recomendada

## 1) Resumo executivo

- Data do incidente.
- Serviços afetados.
- Impacto no cliente/negócio.
- Duração total.
- Status atual.

## 2) Impacto

- Quem foi impactado (usuários, clientes, times internos).
- Escopo (% de erro, degradação, indisponibilidade).
- Métricas principais (SLO/SLI, perdas estimadas).

## 3) Linha do tempo (timeline)

Liste os eventos com horário (UTC ou fuso padronizado):

- Detecção.
- Primeira resposta.
- Mitigações aplicadas.
- Recuperação.
- Encerramento.

> Dica: timeline é factual; análises ficam na seção de causa raiz.

## 4) Causa raiz

Use abordagem como **5 porquês** ou **árvore causal**:

- Causa técnica imediata.
- Fatores contribuintes (monitoramento, processo, arquitetura, comunicação).
- Por que não detectamos/prevenimos antes.

## 5) O que funcionou bem

- Alertas que ajudaram.
- Runbooks eficazes.
- Decisões que reduziram impacto.

## 6) O que não funcionou

- Lacunas em observabilidade.
- Falhas de processo (change management, revisão, rollout).
- Gargalos de comunicação.

## 7) Ações corretivas e preventivas

Para cada ação:

- **Descrição**
- **Tipo** (corretiva, preventiva, detecção, processo)
- **Responsável**
- **Prazo**
- **Prioridade**
- **Critério de sucesso**

## 8) Anexos

- Gráficos relevantes.
- Queries/links para dashboards.
- PRs e incident channel.

---

## Checklist de qualidade antes de publicar

- [ ] Está sem linguagem de culpa.
- [ ] O impacto foi quantificado.
- [ ] A timeline está completa e com horário.
- [ ] A causa raiz foi além do sintoma.
- [ ] Existem ações com dono e prazo.
- [ ] Há pelo menos 1 ação de detecção precoce.
- [ ] Há pelo menos 1 ação de prevenção sistêmica.

---

## Exemplo fictício (preenchido)

## Título

Post mortem — Falha de checkout após deploy do serviço de pagamentos

## 1) Resumo executivo

Em 2026-02-14, entre 19:07 e 19:52 (BRT), o checkout apresentou aumento de erros 500 após deploy da versão `payments-api v2.31.0`. Aproximadamente 18% das tentativas de pagamento falharam nesse período. O incidente foi mitigado com rollback às 19:34 e totalmente normalizado às 19:52 após drenagem de fila e reprocessamento parcial.

## 2) Impacto

- **Usuários impactados:** clientes no fluxo de pagamento por cartão.
- **Escopo:** pico de 18% de erro HTTP 500 no endpoint `/checkout/confirm`.
- **Negócio:** queda de 11% na conversão na janela do incidente.
- **SLO:** violação do SLO de disponibilidade mensal do checkout (99,9%).

## 3) Timeline

- **19:07** — Deploy de `payments-api v2.31.0` concluído em produção.
- **19:11** — Alerta de 5xx (threshold > 5%) acionado.
- **19:13** — Incident commander definido e sala de crise aberta.
- **19:18** — Hipótese inicial: degradação no banco de dados (não confirmada).
- **19:24** — Identificada alta taxa de timeout em chamada ao antifraude.
- **19:30** — Detectado aumento indevido de retries no novo cliente HTTP.
- **19:34** — Rollback iniciado para `v2.30.4`.
- **19:39** — Erros 500 caem para 3%, mas fila de pagamentos pendentes cresce.
- **19:44** — Reprocessamento controlado da fila iniciado.
- **19:52** — Métricas voltam ao baseline; incidente encerrado.

## 4) Causa raiz

### Causa técnica imediata

A versão `v2.31.0` introduziu uma configuração incorreta de retries no cliente do antifraude (`maxRetries=5` sem backoff), aumentando latência e esgotando pool de conexões em picos.

### Fatores contribuintes

- Testes de carga não cobriam timeout do antifraude com retries agressivos.
- Alerta estava baseado apenas em 5xx; não havia alerta preditivo para saturação do pool de conexões.
- Revisão de mudança não destacou risco da alteração em política de retries.

### Por que não prevenimos antes

- Ausência de checklist obrigatório para mudanças em clients externos.
- Canário validava apenas erro HTTP, sem métricas de latência de dependência.

## 5) O que funcionou bem

- Alerta de 5xx detectou o problema em 4 minutos.
- Comunicação em canal único evitou desencontro de decisões.
- Rollback automatizado foi executado em menos de 5 minutos.

## 6) O que não funcionou

- Diagnóstico inicial desviou para banco e atrasou mitigação.
- Falta de dashboard dedicado para dependências críticas.
- Ausência de proteção de circuito (circuit breaker) no cliente antifraude.

## 7) Ações

1. **Adicionar circuit breaker no cliente antifraude**
   - Tipo: preventiva
   - Responsável: Time Payments
   - Prazo: 2026-02-21
   - Prioridade: Alta
   - Critério de sucesso: latência p95 estável com falha simulada do antifraude sem aumento > 2% de erro no checkout.

2. **Criar alerta de saturação do pool de conexões**
   - Tipo: detecção
   - Responsável: SRE
   - Prazo: 2026-02-18
   - Prioridade: Alta
   - Critério de sucesso: alerta dispara em ambiente de teste em até 2 min ao atingir 85% de uso.

3. **Atualizar checklist de change review para políticas de retry/timeout**
   - Tipo: processo
   - Responsável: Engenharia de Plataforma
   - Prazo: 2026-02-20
   - Prioridade: Média
   - Critério de sucesso: 100% dos PRs com mudança de client externo usando checklist.

4. **Expandir teste de carga com cenários de dependência degradada**
   - Tipo: preventiva
   - Responsável: QA + Payments
   - Prazo: 2026-03-01
   - Prioridade: Média
   - Critério de sucesso: suite executa em pipeline semanal com relatório de regressão.

## 8) Status final

- Serviço estabilizado.
- Ações 1 e 2 classificadas como bloqueadoras para próximo release de pagamentos.

---

## Template rápido (copiar e preencher)

```md
# Post mortem — <título do incidente>

## 1) Resumo executivo
- Data:
- Duração:
- Serviços afetados:
- Impacto:
- Status atual:

## 2) Impacto
- Usuários afetados:
- Escopo técnico:
- Impacto no negócio:
- SLO/SLI afetado:

## 3) Timeline
- HH:MM —
- HH:MM —
- HH:MM —

## 4) Causa raiz
- Causa imediata:
- Fatores contribuintes:
- Lacunas de prevenção/detecção:

## 5) O que funcionou
-

## 6) O que não funcionou
-

## 7) Ações
1. <ação>
   - Tipo:
   - Responsável:
   - Prazo:
   - Prioridade:
   - Critério de sucesso:

## 8) Anexos
- Dashboard:
- Logs:
- PRs/commits:
```
