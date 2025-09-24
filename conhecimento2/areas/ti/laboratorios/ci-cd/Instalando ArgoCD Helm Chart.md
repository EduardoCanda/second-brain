---
tags:
  - Kubernetes
  - NotaBibliografica
  - Laboratorio
categoria: CD
ferramenta: argocd
---
# Instalação do Argo CD via Helm

Aqui está um guia passo a passo para instalar o [[introducao-argocd|Argo CD]] usando Helm:

## Pré-requisitos
- Cluster [[kubernetes]] configurado e acessível
- Helm 3 instalado
- `kubectl` configurado para acessar o cluster

## Passos para instalação

1. **Adicionar o repositório [[helm]] do Argo CD**
```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
```

2. **Criar um namespace para o Argo CD** (opcional, mas recomendado)
```bash
kubectl create namespace argocd
```

3. **Instalar o Argo CD usando Helm**
```bash
helm install argocd argo/argo-cd -n argocd
```

## Configurações comuns

Para personalizar a instalação, você pode criar um arquivo `values.yaml` e passar para o Helm:

```yaml
# Exemplo de values.yaml
server:
  service:
    type: LoadBalancer  # Para expor o servidor Argo CD externamente
  ingress:
    enabled: true       # Habilitar ingress
    hosts:
      - argocd.example.com
```

E então instalar com:
```bash
helm install argocd argo/argo-cd -n argocd -f values.yaml
```

## Acessando o Argo CD

1. **Obter a senha admin inicial**:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

2. **Acessar a UI**:
- Se você configurou um Ingress/LoadBalancer, acesse o endereço configurado
- Alternativamente, fazer port-forward:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
E acesse http://localhost:8080 (usuário: admin, senha: obtida no passo anterior)

## Atualizando o Argo CD

Para atualizar uma instalação existente:
```bash
helm upgrade argocd argo/argo-cd -n argocd -f values.yaml
```

## Considerações importantes

- O Argo CD gerencia seus próprios recursos, então evite modificar diretamente os recursos que ele cria
- Recomenda-se habilitar HTTPS para conexões seguras
- Considere configurar SSO para autenticação em ambientes de produção

Precisa de ajuda com alguma parte específica da instalação ou configuração?