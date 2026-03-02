# WebSocket e Webhooks

> **Nota:** você escreveu “webgooks”; o termo correto é **webhooks**.

## Visão geral rápida

- **WebSocket**: protocolo de comunicação bidirecional e persistente sobre TCP, ideal para troca de mensagens em tempo real entre cliente e servidor.
- **Webhook**: mecanismo de notificação orientado a eventos via HTTP, normalmente unidirecional (sistema A avisa sistema B quando algo acontece).
- **Resumo prático**:
  - Precisa de **tempo real contínuo** (chat, jogo, dashboard ao vivo)? → WebSocket.
  - Precisa de **integração entre sistemas** quando um evento ocorre (pagamento aprovado, push de repositório)? → Webhook.

---

## 1) WebSocket em detalhes

## 1.1 Como funciona

1. Cliente abre uma conexão HTTP com cabeçalhos de upgrade.
2. Servidor responde com `101 Switching Protocols`.
3. A conexão é “promovida” para WebSocket e permanece aberta.
4. Cliente e servidor podem enviar mensagens a qualquer momento.

### 1.2 Relação com redes

- Roda sobre **TCP** (camada de transporte), então herda confiabilidade, ordenação e controle de fluxo.
- Usa uma conexão longa, reduzindo overhead de abrir/fechar conexões repetidamente.
- Em redes com NAT/firewall/proxy, conexões ociosas podem ser derrubadas; por isso usa-se heartbeat (`ping/pong`).
- Em escala, exige atenção com:
  - balanceamento com afinidade de sessão (ou camada de pub/sub para estado compartilhado),
  - número máximo de conexões por nó,
  - limites de file descriptors e memória por conexão.

### 1.3 Vantagens

- Baixa latência para atualizações frequentes.
- Comunicação full-duplex real.
- Menor tráfego de controle comparado a polling agressivo.

### 1.4 Desvantagens

- Operação e observabilidade mais complexas.
- Escalabilidade horizontal exige arquitetura de estado/distribuição.
- Nem todo ambiente corporativo lida bem com conexões persistentes.

### 1.5 Casos de uso

- Chat em tempo real.
- Colaboração simultânea (edição compartilhada).
- Telemetria e dashboards ao vivo.
- Jogos multiplayer com eventos frequentes.
- Trading, alertas financeiros e monitoramento operacional.

---

## 2) Webhooks em detalhes

## 2.1 Como funciona

1. Sistema consumidor cadastra uma URL callback.
2. Quando um evento ocorre no provedor, ele envia `POST` HTTP para essa URL.
3. O consumidor valida autenticidade, processa e responde com status HTTP.
4. Em falha, normalmente há retries com backoff.

### 2.2 Relação com redes

- Usa HTTP/HTTPS tradicional: fácil atravessar infraestrutura existente.
- Como é orientado a evento, evita polling constante, reduzindo consumo de rede.
- Depende de disponibilidade do endpoint de destino e de tempos de resposta adequados.

### 2.3 Vantagens

- Integração simples entre serviços diferentes.
- Arquitetura desacoplada por eventos.
- Economia de recursos comparado a consulta periódica.

### 2.4 Desvantagens

- Entrega pode ser duplicada ou fora de ordem (depende do provedor).
- Requer endpoint público/seguro e boa estratégia de idempotência.
- Depuração pode ser difícil sem observabilidade e “replay” de eventos.

### 2.5 Casos de uso

- Gateway de pagamento notificando status da transação.
- GitHub/GitLab acionando pipelines em push/merge.
- E-commerce notificando criação de pedido.
- Sistemas SaaS notificando criação/atualização de recursos.

---

## 3) Comparativo direto

| Critério | WebSocket | Webhook |
|---|---|---|
| Modelo | Conexão persistente | Requisição por evento |
| Direção | Bidirecional | Geralmente unidirecional |
| Latência | Muito baixa e contínua | Baixa a moderada (depende do envio) |
| Padrão de uso | Tempo real interativo | Integração assíncrona entre sistemas |
| Estado de conexão | Mantém sessão aberta | Stateless por request |
| Complexidade operacional | Maior | Menor |

---

## 4) Segurança: pontos críticos

## 4.1 WebSocket

- Preferir `wss://` (TLS).
- Validar autenticação na abertura e no ciclo de vida da sessão.
- Aplicar autorização por canal/assunto.
- Limitar taxa de mensagens por cliente para evitar abuso.
- Encerrar conexões inválidas ou ociosas por política.

## 4.2 Webhooks

- Assinar payload com HMAC (ou assinatura assimétrica) e validar no recebimento.
- Validar timestamp/nonce para evitar replay.
- Implementar idempotência por `event_id`.
- Responder rapidamente (ex.: `2xx`) e processar pesado em fila.
- Registrar tentativas, falhas, retries e dead-letter queue.

---

## 5) Boas práticas de arquitetura em projetos

- **Desacoplamento**: usar fila/event bus para absorver picos.
- **Idempotência**: essencial para webhooks e reconexões WebSocket.
- **Observabilidade**:
  - logs com correlation ID,
  - métricas de latência/erro/retry,
  - tracing entre produtor e consumidor.
- **Resiliência**:
  - timeouts,
  - retry com backoff e jitter,
  - circuit breaker em integrações críticas.
- **Escala**:
  - WebSocket: pub/sub (Redis, NATS, Kafka) para broadcast/distribuição,
  - Webhook: workers concorrentes e filas com controle de taxa.

---

## 6) Aplicações em projetos reais

## Projeto A — Chat corporativo

- **Tecnologia principal**: WebSocket.
- **Por quê**: troca imediata de mensagens e presença online.
- **Complemento**: webhooks para integração com CRM ou sistema de tickets (ex.: “nova mensagem crítica”).

## Projeto B — Plataforma de pagamentos

- **Tecnologia principal**: webhooks.
- **Por quê**: notificações de pagamento aprovado, estornado, expirado.
- **Complemento**: WebSocket para atualizar painel operacional em tempo real.

## Projeto C — Monitoramento de infraestrutura

- **Tecnologia principal**: WebSocket para streaming de métricas/alertas em dashboard.
- **Complemento**: webhooks para abrir incidentes em ITSM/Slack/Teams automaticamente.

---

## 7) Estratégia de escolha (regra prática)

- Use **WebSocket** quando:
  - cliente precisa receber/mandar dados continuamente,
  - latência baixa é requisito de produto,
  - interação é em tempo real.
- Use **webhook** quando:
  - você integra sistemas independentes por eventos de negócio,
  - não há necessidade de conexão contínua,
  - simplicidade de integração é prioridade.
- Use **os dois** quando:
  - há backend orientado a eventos e front-end em tempo real.

---

## 8) Checklist de implementação

- [ ] Definir SLA de latência e disponibilidade.
- [ ] Mapear eventos e contratos de payload (versão incluída).
- [ ] Implementar autenticação/autorização.
- [ ] Garantir idempotência e tratamento de duplicidade.
- [ ] Definir política de retry e DLQ.
- [ ] Criar dashboards de métricas e alertas operacionais.
- [ ] Testar falhas de rede, reconexão e perda de pacotes.

---

## 9) Anti-patterns comuns

- Confiar que webhook será entregue **uma única vez**.
- Processar webhook síncrono pesado antes de responder `2xx`.
- Manter WebSocket sem heartbeat/reconexão automática.
- Armazenar estado crítico só em memória de um único nó.
- Ignorar versionamento de eventos/payloads.
