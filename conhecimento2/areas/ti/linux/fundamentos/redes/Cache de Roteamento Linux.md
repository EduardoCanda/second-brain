---
tags:
  - Fundamentos
  - Linux
  - NotaBibliografica
  - Redes
---
## 📌 **1. Como o kernel decide quando descartar rotas temporárias?**

Desde que o cache global de rotas foi removido no **Linux 3.6**, o kernel Linux usa um **modelo dinâmico** para gerenciar informações temporárias de roteamento. Essas informações podem ser removidas da memória nos seguintes casos:

### 🔹 **Critérios que afetam a expiração das rotas em cache**

1️⃣ **Uso ativo** → Se uma rota está sendo usada frequentemente, ela tende a ser mantida na memória por mais tempo.  
2️⃣ **Mudança na tabela de roteamento** → Se uma nova rota for adicionada ou modificada, as antigas podem ser invalidadas.  
3️⃣ **Mudança no estado da interface** → Se a interface de rede for desligada (`down`), as rotas associadas a ela são removidas.  
4️⃣ **Timeout automático** → Algumas informações de roteamento têm um tempo de vida configurável.

---

## 📌 **2. O timeout pode ser configurado?**

Sim! O kernel usa um sistema chamado **"fib GC threshold"** para decidir quando descartar rotas da memória.

🔹 Para verificar os valores atuais:

bash

CopiarEditar

`sysctl net.ipv4.route.gc_timeout sysctl net.ipv4.route.gc_interval sysctl net.ipv4.route.gc_elasticity`

📌 Explicação:

- `gc_timeout` → Tempo padrão antes de uma rota ser descartada.
    
- `gc_interval` → Frequência com que o kernel verifica as rotas para remoção.
    
- `gc_elasticity` → Define quantas rotas podem ficar armazenadas antes da remoção começar.
    

🔹 Para alterar os valores temporariamente:

bash

CopiarEditar

`sysctl -w net.ipv4.route.gc_timeout=300  # 300 segundos (5 minutos)`

🔹 Para tornar a mudança permanente, adicione ao `/etc/sysctl.conf`:

ini

CopiarEditar

`net.ipv4.route.gc_timeout=300`

---

## 📌 **3. Como verificar se uma rota está em cache?**

Embora o kernel Linux moderno **não tenha cache global de rotas**, ele ainda mantém informações temporárias para otimizar o encaminhamento.

🔹 Para ver as rotas em cache:

bash

CopiarEditar

`ip route show cache`

🔹 Para IPv6:

bash

CopiarEditar

`ip -6 route show cache`

---

## 🚀 **Resumo**

- **Não há um tempo fixo** para uma rota permanecer em cache.
    
- O kernel descarta informações com base no **uso, mudanças na rede e regras de timeout**.
    
- O comportamento pode ser ajustado com **sysctl**.
    
- `ip route show cache` exibe rotas armazenadas temporariamente.
    

Quer testar alguma configuração? 😃