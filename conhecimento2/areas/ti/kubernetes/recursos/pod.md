---
tags:
  - Kubernetes
  - NotaBibliografica
---
No **Kubernetes**, um **Pod** é a **menor unidade de implantação** que pode ser criada, gerenciada e escalada.

Ele **não é** um contêiner em si, mas **um invólucro que agrupa um ou mais contêineres** que compartilham:

- **Rede** (mesmo endereço IP e portas visíveis entre si)
    
- **Sistema de arquivos** (volumes compartilhados)
    
- **Ciclo de vida** (os contêineres sobem e caem juntos)
    

---

## **Características principais de um Pod**

1. **Unidade básica de execução**
    
    - O Kubernetes não executa contêineres “puros”; ele sempre os encapsula em Pods.
        
    - Cada Pod representa uma _instância_ de aplicação ou processo.
        
2. **Um ou mais contêineres**
    
    - Pode conter um único contêiner (caso mais comum).
        
    - Pode conter múltiplos contêineres que precisam estar fortemente acoplados, como:
        
        - Um contêiner principal da aplicação.
            
        - Um _sidecar_ para logging, métricas ou proxy (por exemplo, no service mesh).
            
3. **Compartilhamento de recursos**
    
    - Mesma **pilha de rede**: todos os contêineres do Pod compartilham o mesmo IP.
        
    - **Volumes** podem ser montados em todos os contêineres para trocar dados.
        
4. **Ciclo de vida**
    
    - Se um contêiner dentro do Pod falha, o Kubernetes reinicia o Pod.
        
    - Se o Pod inteiro falha, ele é recriado em outro nó.
        
5. **Efêmero por natureza**
    
    - Pods não são “fixos” em um nó.  
        Se o nó cai, o Pod pode ser agendado em outro nó.
        
    - Dados precisam ser salvos em volumes persistentes, não no sistema de arquivos do Pod.
        

---

## **Exemplo visual de um Pod com dois contêineres**

```
+---------------------------------------+
|                Pod                    |
|   IP: 10.244.1.15                      |
|   +----------------+  +--------------+ |
|   |  App Container |  | Sidecar Log  | |
|   |  (Nginx)       |  |  Collector   | |
|   +----------------+  +--------------+ |
|   Volumes: /shared-data                |
+---------------------------------------+
```

---

## **Resumo**

- 📦 **Pod** = grupo de contêineres com rede e armazenamento compartilhados.
    
- 🔄 **Gerenciado pelo Kubernetes** para garantir o estado desejado.
    
- 🕒 **Curto prazo**: não é persistente, pode ser recriado em outro nó a qualquer momento.
    

---

Se você quiser, posso te explicar **por que o Kubernetes usa Pod como abstração em vez de rodar contêineres diretamente**, porque isso muda bastante como pensamos em arquitetura no K8s. Quer que eu aprofunde nisso?