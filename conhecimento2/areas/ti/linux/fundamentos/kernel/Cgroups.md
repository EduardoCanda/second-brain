---
tags:
  - Linux
  - Fundamentos
  - NotaBibliografica
---
### **O que são cgroups (Control Groups)?**  
**cgroups** (Control Groups) é um recurso do kernel Linux que permite **agrupar processos** e **gerenciar/limitar recursos** como CPU, memória, E/S de disco e rede para esses grupos. Ele é fundamental para **virtualização, containers (Docker, LXC) e sistemas em nuvem**, pois possibilita o isolamento e controle de recursos entre aplicações.

---

## **Principais Funcionalidades dos cgroups**  
1. **Limitação de Recursos**  
   - Define quotas de **CPU**, **memória**, **disco** e **rede** para grupos de processos.  
   - Ex.: Um container Docker não pode usar mais que 50% da CPU.  

2. **Priorização**  
   - Altera a **prioridade** de processos (ex.: um serviço crítico pode ter mais CPU que um backup).  

3. **Isolamento**  
   - Mantém processos separados, evitando que um consuma todos os recursos do sistema.  

4. **Monitoramento**  
   - Permite coletar métricas de uso de recursos por grupo (útil para análise de desempenho).  

---

## **Versões de cgroups**  
- **cgroups v1** → Primeira versão, com subsistemas separados (CPU, memória, E/S).  
- **cgroups v2** → Versão mais recente (desde o kernel 4.5), unificada e mais eficiente.  
  - Melhor suporte a **containers** e **sistemas modernos** (Docker, Kubernetes, systemd).  

---

## **Como os cgroups são Usados?**  
### **1. Por Containers (Docker, LXC, Kubernetes)**  
- Docker e Kubernetes usam cgroups para **isolar recursos** entre containers.  
- Exemplo:  
  ```bash
  docker run --cpus=2 --memory=1g nginx  # Limita NGINX a 2 CPUs e 1GB de RAM
  ```

### **2. Pelo systemd (em Distribuições Linux)**  
- O systemd usa cgroups para gerenciar serviços.  
- Exemplo de limite para um serviço:  
  ```ini
  # /etc/systemd/system/meu-servico.service
  [Service]
  CPUQuota=50%       # Limita a 50% da CPU
  MemoryLimit=512M   # Limita a 512MB de RAM
  ```

### **3. Manualmente (via Terminal)**  
É possível criar e gerenciar cgroups manualmente em `/sys/fs/cgroup/`:  
```bash
# Criar um grupo para limitar CPU
sudo mkdir /sys/fs/cgroup/cpu/meu_grupo
echo 50000 > /sys/fs/cgroup/cpu/meu_grupo/cpu.cfs_quota_us  # Limita a 50% da CPU
echo $PID > /sys/fs/cgroup/cpu/meu_grupo/tasks              # Adiciona um processo ao grupo
```

---

## **Principais Subsistemas (Controladores) do cgroups**  
| Subsistema       | Controle Oferecido                          |
|------------------|--------------------------------------------|
| **cpu**          | Limita uso da CPU (ex.: 50% de um core).   |
| **memory**       | Restringe uso de RAM e swap.               |
| **io**           | Controla E/S de disco (leitura/escrita).   |
| **net_cls**      | Prioriza tráfego de rede.                  |
| **pids**         | Limita o número de processos por grupo.    |

---

## **Como Verificar cgroups em Execução?**  
- **Listar cgroups de um processo** (ex.: PID 1234):  
  ```bash
  cat /proc/1234/cgroup
  ```
- **Ver hierarquia de cgroups** (v2):  
  ```bash
  ls /sys/fs/cgroup/
  ```
- **Monitorar uso** (com `systemd-cgtop`):  
  ```bash
  systemd-cgtop
  ```

---

## **Diferença entre cgroups e namespaces**  
- **cgroups** → Controla **recursos** (CPU, memória, disco).  
- **namespaces** → Isola **processos** (PID, rede, sistema de arquivos).  
Juntos, eles formam a base de **containers** (Docker, LXC).  

---

## **Problemas Comuns**  
🔹 **Aplicação sem limites** → Pode consumir todos os recursos (use cgroups para evitar).  
🔹 **Compatibilidade cgroups v1 vs v2** → Algumas ferramentas antigas não suportam v2.  
🔹 **Configuração incorreta** → Pode causar travamentos (teste limites gradualmente).  

Quer aprender a configurar cgroups para um caso específico? 😊