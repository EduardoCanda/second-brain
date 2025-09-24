---
tags:
  - Kubernetes
  - NotaPermanente
categoria: CD
ferramenta: argocd
---
Em algumas situações é interessante que não seja declaradas configurações que serão utilizadas para alvo de sincronização, por exemplo o número de replicas que podem ser gerenciador por um [[hpa]], portanto muitas vezes é interessante não declarar essas informações na spec do [[deployment]] por exemplo:

```yaml
apiVersion: apps/v1 
kind: Deployment 
metadata: name: nginx-deployment 
spec: 
	# do not include replicas in the manifests if you want replicas to be controlled by HPA 
	# replicas: 1 
	template: 
		spec: 
		containers: 
			- image: nginx:1.7.9 
			  name: nginx 
			  ports: 
			  containerPort: 80 ...
```