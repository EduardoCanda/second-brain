# Playbook — Troubleshooting de Kubernetes (Pods)

## Quando usar

Use para investigar pods em `CrashLoopBackOff`, `Pending`, `ImagePullBackOff` e `ErrImagePull`.

## Checklist inicial

```bash
kubectl get pods -A
kubectl get events -A --sort-by=.lastTimestamp
kubectl top pods -A
```

## Fluxo de diagnóstico

### 1) Pod em CrashLoopBackOff

```bash
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -n <ns> --previous
```

Verificar:
- erro de inicialização da aplicação;
- variável de ambiente/secret ausente;
- falha de conexão em dependência crítica.

Ações comuns:
- corrigir config/secret;
- ajustar probe (liveness/readiness);
- aumentar recurso mínimo se houver OOMKilled.

### 2) Pod em Pending

```bash
kubectl describe pod <pod> -n <ns>
kubectl get nodes
```

Verificar:
- falta de CPU/memória no cluster;
- `nodeSelector`/`taints` incompatíveis;
- volume PVC não provisionado.

Ações comuns:
- ajustar requests/limits;
- corrigir regras de scheduling;
- escalar node group.

### 3) ImagePullBackOff / ErrImagePull

```bash
kubectl describe pod <pod> -n <ns>
```

Verificar:
- nome/tag da imagem;
- credencial de registry (`imagePullSecrets`);
- conectividade do nó com registry.

Ações comuns:
- corrigir tag;
- renovar secret de pull;
- validar permissão IAM/service account.

## Decisão de mitigação

- Se problema localizado: corrigir deployment e redeploy controlado.
- Se impacto alto e release recente: rollback imediato.

## Critério de resolução

```bash
kubectl get pods -n <ns>
kubectl rollout status deployment/<deploy> -n <ns>
```

Condição esperada:
- pods `Running` e `Ready`;
- erro zerado ou em baseline;
- eventos críticos cessaram.
