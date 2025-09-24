---
tags:
  - Fundamentos
  - Redes
  - NotaBibliografica
---
O **RIP (Routing Information Protocol)** é um protocolo de roteamento dinâmico do tipo **distance-vector**, utilizado em redes **IP** para compartilhar informações de roteamento entre roteadores. Ele é um dos protocolos mais antigos (padronizado na **RFC 1058** para RIP v1 e **RFC 2453** para RIP v2) e opera na **camada de aplicação** (usando UDP porta **520**). 

---

## **1. Características Principais do RIP**
- **Métrica baseada em saltos (*hop count*)**:
  - Considera apenas o número de roteadores entre a origem e o destino.
  - O limite máximo é **15 hops** (16 = destino inalcançável).
- **Atualizações periódicas**:
  - Roteadores enviam tabelas de roteamento a cada **30 segundos** (RIPv1/v2).
- **Algoritmo de Bellman-Ford**:
  - Calcula as melhores rotas com base em informações recebidas de vizinhos.
- **Suporte a VLSM e autenticação** (apenas RIP v2).
- **Não usa largura de banda ou latência como métrica** (limitado a *hops*).

---

## **2. Como o RIP Funciona?**
### **A. Inicialização**
1. Cada roteador inicia com sua **própria tabela de roteamento**, contendo apenas redes diretamente conectadas (métrica = 0).
2. Exemplo:
   - Roteador A conhece a rede `192.168.1.0/24` (0 hops).
   - Roteador B conhece a rede `10.0.0.0/8` (0 hops).

### **B. Troca de Informações**
1. **Atualizações periódicas**:
   - Roteadores enviam suas tabelas de roteamento para vizinhos via **broadcast (RIPv1)** ou **multicast (RIPv2: `224.0.0.9`)**.
   - Exemplo de mensagem RIP:
     ```plaintext
     Rede: 192.168.1.0, Métrica: 1
     Rede: 10.0.0.0, Métrica: 2
     ```

2. **Processamento de atualizações**:
   - Se um roteador recebe uma rota com métrica menor que a atual, atualiza sua tabela.
   - Exemplo:
     - Roteador C recebe: `Rede 192.168.1.0, Métrica 1` → Adiciona à tabela com métrica `1 + 1 = 2`.

### **C. Convergência da Rede**
- O RIP demora até alguns minutos para estabilizar todas as rotas (*slow convergence*).
- Mecanismos para evitar loops:
  - **Split Horizon**: Não anuncia uma rota de volta para o roteador de onde ela veio.
  - **Poison Reverse**: Anuncia rotas inalcançáveis (métrica = 16) para evitar loops.
  - **Holddown Timer**: Ignora atualizações de rotas instáveis por 180 segundos.

---

## **3. Versões do RIP**
| **Característica**       | **RIPv1** (RFC 1058)         | **RIPv2** (RFC 2453)          | **RIPng** (IPv6)             |
|--------------------------|-----------------------------|-------------------------------|------------------------------|
| **Suporte a Subnetting** | Não (usa máscaras padrão)   | Sim (VLSM/CIDR)               | Sim (IPv6)                   |
| **Autenticação**         | Não                         | Sim (MD5 ou texto plano)      | Sim                          |
| **Envio de Atualizações**| Broadcast                   | Multicast (`224.0.0.9`)       | Multicast (`FF02::9`)        |
| **Mensagens**            | Sem campos adicionais       | Inclui *next-hop* e *tags*    | Adaptado para IPv6           |

---

## **4. Exemplo de Configuração (Cisco IOS)**
```bash
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# network 192.168.1.0
Router(config-router)# network 10.0.0.0
Router(config-router)# no auto-summary  # Desativa sumarização automática (RIPv2)
```

---

## **5. Limitações do RIP**
1. **Lentidão na convergência**: Atualizações periódicas (não reage rápido a falhas).
2. **Métrica simplista**: Ignora largura de banda e latência.
3. **Limite de 15 hops**: Inviável para redes grandes.
4. **Tráfego desnecessário**: Envia tabelas completas mesmo sem mudanças.

---

## **6. Comparação com Outros Protocolos**
| **Protocolo**  | **Tipo**          | **Métrica**           | **Convergência** | **Uso Típico**         |
|---------------|------------------|----------------------|-----------------|-----------------------|
| **RIP**       | Distance-Vector  | Hop Count (15 max)   | Lenta           | Redes pequenas         |
| **OSPF**      | Link-State       | Custo (banda/latência)| Rápida          | Redes médias/grandes   |
| **EIGRP**     | Advanced DV      | Banda + atraso + confiabilidade | Rápida | Redes Cisco           |

---

## **7. Quando Usar o RIP?**
- **Redes pequenas e homogêneas** (até 15 roteadores).
- **Ambientes com pouca variação de topologia**.
- **Legacy systems** que não suportam OSPF ou EIGRP.

---

## **8. Segurança no RIP**
- **RIPv2** suporta autenticação para evitar ataques:
  ```bash
  Router(config-router)# key-chain MY_CHAIN
  Router(config-keychain)# key 1
  Router(config-keychain-key)# key-string SENHA123
  Router(config-router)# authentication mode md5
  Router(config-router)# authentication key-chain MY_CHAIN
  ```

---

## **9. Conclusão**
O RIP é um protocolo simples e fácil de configurar, mas limitado para redes complexas. Sua principal vantagem é a simplicidade, enquanto suas desvantagens (como convergência lenta e métrica restrita) incentivam o uso de alternativas como **OSPF** ou **EIGRP** em cenários mais demandantes.

Se quiser explorar **exemplos de captura de pacotes RIP** ou **configurações em outros dispositivos** (Linux/Windows), posso detalhar!