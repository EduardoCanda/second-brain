# Kubernetes — Exemplo de Manifestos

## Deployment + Service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app-web
  template:
    metadata:
      labels:
        app: app-web
    spec:
      containers:
        - name: app-web
          image: nginx:stable
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "300m"
              memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: app-web
spec:
  selector:
    app: app-web
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

## Dicas
- Sempre defina `requests` e `limits`.
- Use probes para evitar tráfego em pods indisponíveis.
- Mantenha versionamento dos manifestos no Git.
