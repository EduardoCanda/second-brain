---
tags:
  - Kubernetes
  - NotaBibliografica
---
Um **ConfigMap** é um recurso do Kubernetes usado para **armazenar dados de configuração não sigilosos** (chaves/valores ou arquivos) separados da imagem do contêiner. Ele permite que você **injete configurações em Pods** sem precisar reconstruir a imagem.

# O que ele é e como é usado

- **Escopo**: _namespaced_.
    
- **Conteúdo**: texto (strings). Não use para segredos → use **Secret**.
    
- **Formas de consumir em Pods**:
    1. **Variáveis de ambiente** (`env` / `envFrom`)
    2. **Argumentos** de inicialização/execução
    3. **Arquivos** montados via **volume** (cada chave vira um arquivo)


# Exemplos

### 1) Criando um ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_MODE: "production"
  APP_TIMEOUT: "30"
  app.properties: |
    server.port=8080
    featureX.enabled=true
```

### 2) Consumindo como variáveis de ambiente

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo-env
spec:
  containers:
    - name: app
      image: busybox
      command: ["sh","-c","echo $APP_MODE && echo $APP_TIMEOUT"]
      envFrom:
        - configMapRef:
            name: app-config
      # ou chave específica:
      # env:
      #   - name: APP_MODE
      #     valueFrom:
      #       configMapKeyRef:
      #         name: app-config
      #         key: APP_MODE
```

### 3) Consumindo como arquivos (volume)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: demo-vol
spec:
  volumes:
    - name: cfg
      configMap:
        name: app-config
        items:
          - key: app.properties
            path: app.properties
  containers:
    - name: app
      image: busybox
      volumeMounts:
        - name: cfg
          mountPath: /config
      command: ["sh","-c","cat /config/app.properties"]
```

# Comandos úteis (`kubectl`)

```bash
# Literal(es)
kubectl create configmap app-config \
  --from-literal=APP_MODE=production \
  --from-literal=APP_TIMEOUT=30

# A partir de arquivo(s)
kubectl create configmap app-config \
  --from-file=app.properties

# A partir de um diretório (cada arquivo vira uma chave)
kubectl create configmap app-config \
  --from-file=./config-dir

# Ver conteúdo
kubectl get configmap app-config -o yaml
```

# Comportamento e pegadinhas importantes

- **Atualizações**:
    
    - Variáveis de ambiente são **carregadas na inicialização** do contêiner. Atualizar o ConfigMap **não** muda o que já está em execução → faça um **rollout/restart** do Deployment.
        
    - **Volumes de ConfigMap** atualizam os arquivos de forma **assíncrona** (normalmente em até ~1 minuto).  
        **Exceção**: se montar com `subPath`, **não** atualiza automaticamente.
        
- **Tamanho**: limite aproximado de **1 MiB por objeto** (use vários ConfigMaps se necessário).
    
- **Imutável (opcional)**: defina `immutable: true` para evitar alterações acidentais e reduzir carga no kubelet:
    
    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata: { name: app-config }
    immutable: true
    data: { KEY: "value" }
    ```
    
- **Erros comuns**:
    
    - `spec.containers.envFrom.configMapRef.name` apontando para nome errado → contêiner não inicia.
        
    - Chaves com caracteres inválidos quando montadas como arquivos (evite barras, etc.).
        
    - Usar ConfigMap para segredos (não faça isso) — **use Secret**.
        
- **Boas práticas**:
    
    - **Separar configuração de código** (12-factor).
        
    - Versionar ConfigMaps via Git (GitOps).
        
    - Em Deployments, use anotação com **checksum** do ConfigMap (p. ex. `checksum/config`) para **forçar rollout** quando o config muda (Helm/Kustomize).
        
    - Combine com _sidecars_ que recarregam a app (ou use sinal/endpoint de reload) quando arquivos mudarem.
        
    - Marcar volumes de ConfigMap como **readOnly** (padrão).
        

Se quiser, te mostro um exemplo completo com **Deployment + ConfigMap + rollout automático** via checksum (Helm/Kustomize) — bem útil em pipelines GitOps.