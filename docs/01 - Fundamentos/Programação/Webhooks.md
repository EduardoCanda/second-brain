# Webhooks

> Mecanismo HTTP orientado a eventos: um sistema envia notificação para outro quando algo acontece.

## Conceito

**Webhook** é uma chamada HTTP (geralmente `POST`) disparada por evento. Em vez de consultar periodicamente uma API (polling), o consumidor recebe notificações quando o evento ocorre.

## Como funciona (resumo)

1. Sistema consumidor cadastra URL callback.
2. Provedor dispara evento e envia payload para essa URL.
3. Consumidor valida autenticidade e responde com status HTTP.
4. Em erro, o provedor pode reenviar com política de retry.

## Relação com redes

- Usa HTTP/HTTPS tradicional, fácil de integrar com infra existente.
- Reduz tráfego desnecessário comparado ao polling frequente.
- Depende da disponibilidade do endpoint receptor.

## Vantagens

- Simples para integração entre sistemas.
- Acoplamento menor via eventos de negócio.
- Boa eficiência de rede para notificações assíncronas.

## Desvantagens

- Entrega pode ser duplicada ou fora de ordem.
- Exige endpoint público e seguro.
- Depuração pode ser complexa sem rastreabilidade.

## Casos de uso

- Pagamentos (aprovado/estornado/expirado).
- Integração GitHub/GitLab com CI/CD.
- E-commerce notificando criação/atualização de pedido.
- SaaS integrando CRM, ERP, suporte e mensageria.

## Segurança

- Validar assinatura (HMAC/assinatura assimétrica).
- Validar timestamp/nonce para evitar replay.
- Implementar idempotência por `event_id`.
- Responder rápido (`2xx`) e processar assíncrono em fila.

## Arquitetura em projetos

- Bufferizar eventos em fila para absorver picos.
- Aplicar retries com backoff + jitter.
- Monitorar taxa de erro, latência e eventos em DLQ.

## Quando escolher Webhooks

Use quando o foco é **integração entre sistemas** por eventos, sem necessidade de conexão contínua.

## Nota relacionada

- Compare com [[WebSocket]] quando houver necessidade de tempo real no front-end.
