---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
cloud_provider: aws
---
Define **onde** a infraestrutura de nuvem está localizada e quem a gerencia:

# Nuvem Pública

- **O que é**: Serviços oferecidos por provedores como AWS, Azure ou GCP, compartilhados entre múltiplos clientes.
    
- **Prós**:
    - Escalabilidade ilimitada.
    - Pagamento por uso ([[Opex e Capex|OPEX]]).
    - Sem manutenção de hardware.

- **Contras**:
    - Menos controle sobre a infraestrutura física.
    - Preocupações com compliance em setores regulamentados (ex: saúde).

- **Exemplo na AWS**: Usar [[EC2]] (máquinas virtuais) ou [[S3]] (armazenamento) sem dedicar hadware físico. 

# Nuvem Privada

- **O que é**: Infraestrutura exclusiva para uma única organização (geralmente on-premises ou hospedada por terceiros).
    
- **Prós**:
    - Controle total sobre segurança e compliance.
    - Personalização extrema.
- **Contras**:
    - Alto custo de manutenção ([[Opex e Capex|CAPEX]]).
    - Escalabilidade limitada.

- **Exemplo**: Usar **VMware no datacenter da empresa** ou **AWS Outposts** (AWS em infraestrutura local).
    

# Nuvem Híbrida

- **O que é**: Combina nuvem pública + privada, com integração entre elas.
    
- **Prós**:
    
    - Flexibilidade para manter cargas sensíveis on-premises e escalar na nuvem.
    - Migração gradual para a nuvem.
        
- **Contras**:
    
    - Complexidade de gerenciamento.
    - Latência entre ambientes.
        
- **Exemplo na AWS**: **AWS Direct Connect** (conexão dedicada entre datacenter local e AWS) + **RDS** (banco de dados na nuvem).
    

# Multicloud

- **O que é**: Uso de múltiplos provedores de nuvem (ex: AWS + Azure) para evitar vendor lock-in ou atender a requisitos específicos.
    
- **Prós**:
    - Redundância adicional.
    - Aproveitar melhores serviços de cada provedor (ex: AWS Lambda + Azure AI).

- **Contras**:
    - Custo maior de integração e operação.
    - Curva de aprendizado ampliada.

---