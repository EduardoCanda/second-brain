---
tags:
  - Kubernetes
  - NotaBibliografica
---
# Referenciando um Serviço em Outro Namespace via DNS no Kubernetes

Para acessar um serviço localizado em outro namespace usando [[protocolo-dns|DNS]] no Kubernetes, você pode utilizar o FQDN (Fully Qualified Domain Name) completo do serviço. O [[kubernetes]] fornece automaticamente resolução DNS entre namespaces seguindo este padrão:

## Formato do DNS para Serviços entre [[Namespaces]]

O formato padrão é:

```
<nome-do-servico>.<namespace>.svc.cluster.local
```

### Exemplo de uso:

Se você tem:
- Serviço chamado `meu-servico-banco-dados`
- No namespace `banco-de-dados`

Você pode acessá-lo de outro namespace usando:

```bash
meu-servico-banco-dados.banco-de-dados.svc.cluster.local
```

## Casos de Uso Práticos

### 1. Em variáveis de ambiente:

```yaml
env:
- name: DB_HOST
  value: "meu-servico-banco-dados.banco-de-dados.svc.cluster.local"
```

### 2. Em configurações de aplicação:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-aplicacao
spec:
  template:
    spec:
      containers:
      - name: app
        image: minha-imagem
        env:
        - name: DATABASE_URL
          value: "postgres://user:pass@meu-servico-banco-dados.banco-de-dados.svc.cluster.local:5432/db"
```

### 3. Forma abreviada (dentro do mesmo cluster):

Você pode omitir `.svc.cluster.local` e usar apenas:
```
<nome-do-servico>.<namespace>
```

Exemplo: `meu-servico-banco-dados.banco-de-dados`

## Considerações Importantes

1. **Network Policies**: Verifique se não há políticas de rede bloqueando a comunicação entre namespaces
2. **[[portas|portas]]**: Certifique-se de que a porta do serviço está correta e acessível
3. **[[service-account]]**: Algumas configurações podem requerer permissões específicas

## Exemplo Completo de Service Discovery

```yaml
apiVersion: v1
kind: Service
metadata:
  name: meu-servico
  namespace: outro-namespace
spec:
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: meu-app
```

Para acessar este serviço de outro namespace:

```bash
curl http://meu-servico.outro-namespace.svc.cluster.local
```

Esta abordagem funciona para qualquer recurso dentro do cluster Kubernetes, desde que a comunicação entre namespaces não esteja bloqueada por políticas de rede.