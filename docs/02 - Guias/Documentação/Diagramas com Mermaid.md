# Mermaid no Markdown: guia prático com exemplos

O **Mermaid** é uma linguagem de diagrama baseada em texto. Em vez de desenhar caixas manualmente, você escreve código e o diagrama é renderizado automaticamente.

---

## Por que usar Mermaid?

- Diagramas versionáveis no Git.
- Revisão em pull request como qualquer código.
- Fácil de manter e atualizar.
- Ótimo para documentação técnica em Markdown.

---

## Estrutura básica

Para criar um diagrama, use um bloco de código com `mermaid`:

```markdown
```mermaid
graph TD
  A[Início] --> B[Processamento]
  B --> C[Fim]
```
```

> `graph TD` significa um grafo de cima para baixo (**Top Down**).

---

## 1) Flowchart (fluxograma)

### Exemplo simples

```mermaid
graph TD
  A[Usuário acessa aplicação] --> B{Autenticado?}
  B -->|Sim| C[Carrega dashboard]
  B -->|Não| D[Redireciona para login]
  D --> E[Preenche credenciais]
  E --> B
```

### Direções úteis

- `TD` / `TB`: Top Down (cima para baixo)
- `LR`: Left to Right (esquerda para direita)
- `RL`: Right to Left
- `BT`: Bottom to Top

### Formatos de nós

```mermaid
graph LR
  A[Retângulo] --> B(Retângulo arredondado)
  B --> C{Decisão}
  C --> D[(Banco de dados)]
  C --> E>Assimétrico]
```

---

## 2) Sequence Diagram (sequência)

Útil para mostrar troca de mensagens entre serviços.

```mermaid
sequenceDiagram
  participant U as Usuário
  participant FE as Frontend
  participant API as API
  participant DB as Banco

  U->>FE: Acessa /pedidos
  FE->>API: GET /pedidos
  API->>DB: SELECT * FROM pedidos
  DB-->>API: Lista de pedidos
  API-->>FE: 200 OK + JSON
  FE-->>U: Renderiza lista
```

---

## 3) Class Diagram (classes)

Bom para modelagem de domínio e orientação a objetos.

```mermaid
classDiagram
  class Usuario {
    +String nome
    +String email
    +login()
  }

  class Pedido {
    +UUID id
    +Decimal valorTotal
    +fechar()
  }

  class ItemPedido {
    +String sku
    +int quantidade
  }

  Usuario "1" --> "*" Pedido : cria
  Pedido "1" --> "*" ItemPedido : contém
```

---

## 4) State Diagram (máquina de estados)

Excelente para ciclos de vida (pedido, ticket, deploy etc.).

```mermaid
stateDiagram-v2
  [*] --> Criado
  Criado --> Pago: pagamento aprovado
  Criado --> Cancelado: timeout
  Pago --> Enviado: separação concluída
  Enviado --> Entregue: confirmação
  Cancelado --> [*]
  Entregue --> [*]
```

---

## 5) ER Diagram (entidade-relacionamento)

Para representar entidades e relacionamentos de banco de dados.

```mermaid
erDiagram
  CLIENTE ||--o{ PEDIDO : realiza
  PEDIDO ||--|{ ITEM_PEDIDO : possui
  PRODUTO ||--o{ ITEM_PEDIDO : compoe

  CLIENTE {
    int id PK
    string nome
    string email
  }

  PEDIDO {
    int id PK
    date criado_em
    string status
  }

  ITEM_PEDIDO {
    int id PK
    int quantidade
    decimal preco_unitario
  }

  PRODUTO {
    int id PK
    string nome
    decimal preco
  }
```

---

## 6) Gantt Chart (cronograma)

Ótimo para planejamento de projetos.

```mermaid
gantt
  title Roadmap - Plataforma X
  dateFormat  YYYY-MM-DD
  section Planejamento
  Discovery            :done,  p1, 2026-01-01, 7d
  Arquitetura          :done,  p2, after p1, 5d
  section Implementação
  Backend MVP          :active,p3, 2026-01-15, 14d
  Frontend MVP         :       p4, after p3, 10d
  section Entrega
  Testes integrados    :       p5, after p4, 7d
  Go-live              :milestone, m1, after p5, 1d
```

---

## 7) Journey Diagram (jornada)

Bom para experiência do usuário e processos.

```mermaid
journey
  title Jornada de compra
  section Descoberta
    Vê anúncio: 4: Usuário
    Entra no site: 5: Usuário
  section Avaliação
    Compara produtos: 3: Usuário
    Lê avaliações: 4: Usuário
  section Conversão
    Finaliza compra: 5: Usuário
    Recebe confirmação: 5: Usuário
```

---

## 8) Pie Chart (distribuição)

```mermaid
pie title Distribuição de incidentes por tipo
  "Aplicação" : 42
  "Infra" : 28
  "Banco de dados" : 18
  "Rede" : 12
```

---

## 9) Mindmap (mapa mental)

```mermaid
mindmap
  root((Plano de estudos DevOps))
    Linux
      Shell
      Redes
      Permissões
    Cloud
      AWS
      Kubernetes
    Observability
      Prometheus
      Grafana
      OpenTelemetry
```

---

## 10) Git Graph (histórico de branches)

```mermaid
gitGraph
  commit id: "init"
  branch feature/mermaid
  checkout feature/mermaid
  commit id: "nota mermaid"
  checkout main
  commit id: "hotfix"
  merge feature/mermaid
  commit id: "release"
```

---

## Dicas de escrita

- Prefira nomes curtos nos nós.
- Divida diagramas grandes em partes menores.
- Use `subgraph` em flowchart para agrupar contextos.
- Mantenha estilo consistente (setas, idioma, nomenclatura).

Exemplo com `subgraph`:

```mermaid
graph LR
  subgraph Cliente
    A[Browser]
  end

  subgraph Backend
    B[API]
    C[Worker]
  end

  subgraph Dados
    D[(PostgreSQL)]
    E[(Redis)]
  end

  A --> B
  B --> D
  B --> E
  B --> C
```

---

## Erros comuns

- Esquecer o fence de linguagem: deve ser ` ```mermaid `.
- Misturar sintaxe de tipos diferentes no mesmo bloco.
- Usar caracteres especiais sem testar (aspas e `:` em labels).
- Diagramas muito densos sem quebra por contexto.

---

## Atalho rápido (cola)

```mermaid
graph TD
  A[Evento] --> B{Condição}
  B -->|OK| C[Ação 1]
  B -->|Falha| D[Ação 2]
  C --> E[Fim]
  D --> E
```

Se quiser, duplique este arquivo como template e adapte os exemplos para cada tema do seu estudo.
