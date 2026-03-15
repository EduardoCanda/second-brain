## 1. Conceito de Sidecar

Sidecar é um padrão arquitetural onde um container auxiliar roda junto
com o container principal dentro da mesma unidade de execução (Task no
ECS, Pod no Kubernetes).

Ele compartilha: - Rede (localhost) - Volumes - Ciclo de vida

Não é duas imagens no mesmo container. São múltiplos containers dentro
da mesma Task.

------------------------------------------------------------------------

## 2. Estrutura no Amazon ECS

Hierarquia:
```
Cluster\
└── Service\
  └── Task (Task Definition)\
    ├── App Container\
    ├── Sidecar 1\
    └── Sidecar 2
```

### Componentes:

-   **Cluster**: Agrupamento lógico de recursos.
-   **Service**: Mantém quantidade desejada de Tasks.
-   **Task Definition**: Define CPU, memória e containers.
-   **Task**: Instância em execução da Task Definition.

------------------------------------------------------------------------

## 3. Recursos (CPU e Memória)

No ECS (principalmente Fargate):

-   CPU e memória são definidos na Task.
-   Containers compartilham o total provisionado.
-   Você paga pelo total da Task.

Exemplo:

Task CPU: 1024
Task Memory: 2048

Distribuição possível:

-   App: 800 CPU
-   Sidecar: 200 CPU

Sempre manter margem de segurança (\~20-30%).

------------------------------------------------------------------------

## 4. Auto Scaling no ECS

O Auto Scaling escala **Tasks inteiras**.

Se cada Task contém: - 1 app - 2 sidecars

E o scaling sobe para 10 Tasks:

→ Total = 30 containers

O scaling nunca aumenta apenas o container principal.

### Métricas recomendadas:

-   Request Count (via Load Balancer)
-   Latência
-   Target tracking

Evitar depender apenas de CPU.

------------------------------------------------------------------------

## 5. Impacto Financeiro

Sidecar aumenta custo porque:

-   Cada Task consome mais recursos
-   Scaling multiplica esse custo
-   No Fargate você paga por Task provisionada

Quanto mais sidecars, maior o custo proporcional ao scaling.

------------------------------------------------------------------------

## 6. Quando Usar Sidecar

✔ Proxy local
✔ Service Mesh
✔ Coletor de logs
✔ Segurança acoplada
✔ Injeção de certificados

Use quando a infraestrutura precisa estar próxima da aplicação.

------------------------------------------------------------------------

## 7. Quando Evitar

✘ Alto consumo fixo
✘ Pode ser serviço compartilhado
✘ Escala diferente da aplicação
✘ Aumenta custo sem necessidade

Se você replica algo pesado 50 vezes que poderia rodar 3 vezes como
serviço separado, provavelmente não deve ser sidecar.

------------------------------------------------------------------------

## 8. Sidecar vs Serviço Separado

  Critério       Sidecar                   Serviço Separado
  -------------- ------------------------- ------------------
  Escala         Junto com app             Independente
  Custo          Proporcional ao scaling   Compartilhado
  Complexidade   Menor                     Maior
  Isolamento     Por Task                  Global

------------------------------------------------------------------------

## 9. Modelo Mental Final

Sem sidecar: Você escala apenas a aplicação.

Com sidecar: Você escala aplicação + infraestrutura embarcada.

Arquitetura madura não é usar sidecar sempre. É usar quando resolve um
problema real com justificativa técnica clara.

------------------------------------------------------------------------

# Conclusão

Sidecar é uma ferramenta poderosa que melhora segurança, padronização e
observabilidade.

Mas impacta:

-   Scaling
-   Consumo de recursos
-   Custo
-   Complexidade operacional

Decisão deve considerar consumo, modelo de scaling e previsibilidade
financeira.
