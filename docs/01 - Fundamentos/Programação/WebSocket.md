# WebSocket

> Protocolo para comunicação bidirecional e persistente em tempo real entre cliente e servidor.

## Conceito

O **WebSocket** permite que cliente e servidor troquem mensagens em **full-duplex** pela mesma conexão TCP, sem precisar abrir uma nova conexão HTTP a cada evento.

## Como funciona (resumo)

1. Cliente inicia requisição HTTP com cabeçalhos de upgrade.
2. Servidor responde com `101 Switching Protocols`.
3. A conexão vira WebSocket e permanece aberta.
4. Cliente e servidor enviam mensagens a qualquer momento.

## Relação com redes

- Opera sobre **TCP**, herdando confiabilidade, ordenação e controle de fluxo.
- Reduz overhead de conexões repetidas (vs polling intenso).
- Pode sofrer impacto de NAT/proxy/firewall em conexões ociosas.
- Usa heartbeat (`ping/pong`) para manter sessão ativa e detectar queda.

## Vantagens

- Baixa latência para atualização contínua.
- Comunicação realmente bidirecional.
- Boa experiência para aplicações interativas.

## Desvantagens

- Maior complexidade operacional e de escala.
- Exige estratégia de distribuição de estado (pub/sub, broker, etc.).
- Precisa de observabilidade e gestão de conexões simultâneas.

## Casos de uso

- Chat em tempo real.
- Colaboração simultânea (edição compartilhada).
- Dashboards com streaming de métricas.
- Jogos multiplayer e sistemas de alertas instantâneos.

## Segurança

- Preferir `wss://` (TLS).
- Autenticar no handshake e revalidar permissões por canal.
- Limitar taxa de mensagens por cliente.
- Encerrar sessões inválidas/ociosas por política.

## Arquitetura em projetos

- Para escalar horizontalmente, usar backplane/pub-sub (ex.: Redis/NATS/Kafka).
- Evitar estado crítico preso em um único nó.
- Aplicar reconexão com backoff no cliente.

## Quando escolher WebSocket

Use quando há requisito de **tempo real contínuo** e interação frequente entre cliente e servidor.

## Nota relacionada

- Compare com [[Webhooks]] para integrações orientadas a eventos entre sistemas.
