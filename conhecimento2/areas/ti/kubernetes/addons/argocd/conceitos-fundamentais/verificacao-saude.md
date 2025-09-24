---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: CD
ferramenta: argocd
---
### **Health Check no Argo CD vs. Kubernetes: Divisão de Responsabilidades**

Tanto o **[[introducao-argocd|Argo CD]]** quanto o **[[kubernetes]]** realizam verificações de saúde (*health checks*), mas com propósitos e métodos diferentes. Aqui está a distinção clara:

---

## **🔍 Kubernetes: Health Checks Nativos**
O Kubernetes possui mecanismos internos para monitorar a saúde de recursos:  
1. **Liveness Probes**:  
   - Verifica se o container está **rodando**.  
   - Se falhar, o Kubernetes reinicia o container.  

2. **Readiness Probes**:  
   - Verifica se o container está **pronto para receber tráfego**.  
   - Se falhar, o Service para de enviar requisições ao Pod.  

3. **Status de Recursos**:  
   - Exemplo: Um `Deployment` é considerado saudável quando todas as réplicas estão disponíveis (`availableReplicas == desiredReplicas`).  

**Ferramentas**:  
- Essas verificações são configuradas nos manifests do Kubernetes (ex: `deployment.yaml`).  
- São executadas pelo **kubelet** (nó do worker) e pelo **[[control-plane|control plane]]** do Kubernetes.  

**Exemplo**:  
```yaml
# deployment.yaml
containers:
  - name: nginx
    livenessProbe:
      httpGet:
        path: /health
        port: 80
```

---

## **🔍 Argo CD: Health Checks Adicionais**  
O Argo CD complementa o Kubernetes com verificações de alto nível, focadas em **[[GitOps]] e gestão de aplicações**:  
1. **Status de Recursos Customizados**:  
   - Verifica se [[custom-resources|CRDs]] (ex: `Ingress`, `Argo Rollouts`) estão saudáveis.  

2. **Dependências entre Recursos**:  
   - Exemplo: Um `Ingress` só é considerado saudável se o `Service` e os `Pods` estiverem prontos.  

3. **Health Checks Customizáveis**:  
   - Você pode definir regras personalizadas em Lua para recursos não padrão.  

**Ferramentas**:  
- O Argo CD usa seu próprio **mecanismo de avaliação**, além de consultar o [[kubernetes-api-server|Kubernetes API]].  
- Os resultados são exibidos na **UI/CLI** do Argo CD.  

**Exemplo**:  
```yaml
# Customização para um CRD (ex: CertManager Certificate)
resourceCustomizations: |
  cert-manager.io/Certificate:
    health.lua: |
      hs = {}
      if obj.status.conditions[1].status == "True" then
        hs.status = "Healthy"
      else
        hs.status = "Degraded"
      end
      return hs
```

---

## **📌 Divisão de Responsabilidades**  
| **Verificação**               | **Kubernetes**                          | **Argo CD**                                |  
|-------------------------------|----------------------------------------|--------------------------------------------|  
| **Liveness/Readiness**        | ✅ Sim (nativo)                        | ❌ Não (só lê o status do Kubernetes)      |  
| **Status de Deployments**     | ✅ Sim (controla réplicas)             | ✅ Sim (consolida status para a UI)        |  
| **CRDs Customizados**         | ❌ Não                                 | ✅ Sim (via health.lua)                    |  
| **Dependências entre Recursos**| ❌ Não                                 | ✅ Sim (ex: Ingress → Service → Pods)      |  

---

## **⚙️ Como o Argo CD Obtém os Dados?**  
1. **Consulta o Kubernetes API** para obter o estado atual dos recursos.  
2. **Aplica regras de saúde** (nativas ou customizadas).  
3. **Exibe o resultado** na UI:  
   - **Healthy**: Recurso está conforme o esperado.  
   - **Progressing**: Em atualização (ex: rollout em andamento).  
   - **Degraded**: Falha detectada (ex: CrashLoopBackOff).  
   - **Missing**: Recurso não existe no cluster.  

---

## **🛠️ Exemplo Prático**  
### **Cenário**: Um [[deployment]] com réplicas indisponíveis.  
1. **Kubernetes**:  
   - Marca os Pods como `Not Ready` (se a `readinessProbe` falhar).  
   - Atualiza o status do `Deployment` para `UnavailableReplicas`.  

2. **Argo CD**:  
   - Detecta o status via Kubernetes API.  
   - Mostra a aplicação como **"Degraded"** na UI.  
   - Se `selfHeal: true`, tenta corrigir (ex: recriar os Pods).  

---

## **💡 Por Que Essa Dupla Camada é Útil?**  
- **Kubernetes**: Garante que os containers estão rodando corretamente.  
- **Argo CD**: Fornece uma visão **GitOps-centrica**, mostrando se o cluster está alinhado com o estado desejado no Git.  

---

## **📚 Referências**  
- [Health Checks no Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)  
- [Custom Health Checks no Argo CD](https://argo-cd.readthedocs.io/en/stable/operator-manual/health/)  

Precisa de ajuda para configurar verificações personalizadas? Posso ajudar com exemplos! 😊