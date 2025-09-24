---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Sync Policies no Argo CD: Explicação Completa e Detalhada**  

O **sync policy** no [[introducao-argocd|Argo CD]] define **como e quando** o estado desejado (definido no [[Git]]) é sincronizado com o cluster [[kubernetes]]. Ele controla:  
- **Se** a sincronização é automática ou manual.  
- **Como** os recursos são aplicados (prune, self-heal, etc.).  
- **Ordem** de sincronização ([[sync-waves|sync waves]], [[hooks|hooks]]).  

Abaixo está uma análise detalhada de todos os componentes e comportamentos.

---

## **📌 Tipos de Sync Policies**
### **1. `automated` (Sincronização Automática)**
Habilita a sincronização automática quando o Git é atualizado.  
**Exemplo**:
```yaml
syncPolicy:
  automated:
    prune: true       # Remove recursos do cluster se forem excluídos no Git
    selfHeal: true    # Corrige alterações manuais no cluster (drift)
    allowEmpty: false # Falha se nenhum recurso for gerado (ex: Helm com valores inválidos)
```
**Comportamento**:  
- O Argo CD **sincroniza imediatamente** após detectar mudanças no Git.  
- Útil para **ambientes não críticos** (dev, staging).  

---

### **2. `syncOptions` (Opções de Sincronização)**
Configurações adicionais para controlar o comportamento do sync.  
**Exemplo**:
```yaml
syncPolicy:
  syncOptions:
    - Validate=true           # Valida recursos com o schema do Kubernetes
    - CreateNamespace=true    # Cria o namespace se não existir
    - PruneLast=true          # Executa prune após aplicar novos recursos
    - RespectSyncWave=true    # Respeita a ordem definida por sync waves
```
**Opções Disponíveis**:
| Opção                  | Efeito                                                                 |
|------------------------|-----------------------------------------------------------------------|
| `Validate=false`       | Desativa validação de schemas (útil para CRDs customizados).          |
| `PrunePropagationPolicy=foreground` | Define como recursos são excluídos (background, foreground, orphan). |
| `ServerSideApply=true` | Usa server-side apply (evita conflitos em campos gerenciados).        |

---

### **3. `retry` (Tentativas de Sincronização)**
Configura retentativas em caso de falha.  
**Exemplo**:
```yaml
syncPolicy:
  retry:
    limit: 5            # Número máximo de tentativas
    backoff:
      duration: 5s      # Intervalo inicial entre tentativas
      factor: 2         # Multiplicador de duração (ex: 5s → 10s → 20s)
      maxDuration: 3m   # Tempo máximo entre tentativas
```

---

## **🔧 Como o Sync Funciona Internamente?**
1. **Fase de Planejamento**:  
   - O Argo CD compara o estado do Git com o cluster (`kubectl diff`).  
   - Gera uma lista de operações (create, update, delete).  

2. **Fase de Execução**:  
   - Aplica as mudanças na ordem definida por:  
     - **Sync waves** (recursos com `argocd.argoproj.io/sync-wave`).  
     - **Hooks** (Pré-sync, Sync, Pós-sync).  
   - Se `prune: true`, exclui recursos do cluster que não existem no Git.  

3. **Fase de Verificação**:  
   - Checa o status dos recursos (Health Checks).  
   - Se `selfHeal: true`, corrige drifts imediatamente.  

---

## **🚨 Cenários de Conflito**
### **1. Recursos Gerenciados por Outros Controladores**  
- **Problema**: Um operador (ex: Istio) modifica um recurso que o Argo CD gerencia.  
- **Solução**:  
  ```yaml
  metadata:
    annotations:
      argocd.argoproj.io/sync-options: SkipDryRunOnMissingResource=true
  ```

### **2. Exclusão de Recursos com Dependências**  
- **Problema**: Um `PersistentVolumeClaim` é excluído antes do `Pod` que o usa.  
- **Solução**:  
  ```yaml
  syncPolicy:
    syncOptions:
      - PruneLast=true  # Aplica novos recursos antes de excluir os antigos
  ```

---

## **📊 Diferença Entre `automated` e `syncOptions`**
| **Configuração**       | `automated`                          | `syncOptions`                        |
|------------------------|--------------------------------------|--------------------------------------|
| **Propósito**          | Quando sincronizar                   | Como sincronizar                     |
| **Exemplo**           | `prune: true`                        | `CreateNamespace: true`              |
| **Impacto**           | Define automação                     | Ajusta comportamento do sync         |

---

## **⚙️ Exemplo Completo**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: minha-app
spec:
  source:
    repoURL: https://github.com/meu-org/repo.git
    path: kustomize/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: minha-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - RespectSyncWave=true
    retry:
      limit: 3
      backoff:
        duration: 10s
```

---

## **✅ Melhores Práticas**
1. **Em produção**: Desative `auto-sync` ou use **approval manual**.  
2. **Para CRDs**: Use `Validate=false` se houver schemas complexos.  
3. **Para multi-cluster**: Combine com `ApplicationSet` para consistência.  

---

## **🔍 Referência Oficial**
- [Argo CD Sync Policies](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/)  
- [Sync Waves e Hooks](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/)  

Quer um exemplo com tratamento de falhas? Posso elaborar um cenário passo a passo! 😊[]()