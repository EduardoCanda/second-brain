---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
cloud_provider: aws
---
### **4. Exemplo Prático: Migração para AWS**

Suponha que você esteja liderando a migração de um monolito on-premises para a AWS:

1. **Nuvem Híbrida** (transição gradual):
    
    - Mantenha o banco de dados crítico local (privado) com **AWS Direct Connect**.
    - Migre o frontend para **S3 + CloudFront** (pública).
    
2. **PaaS para acelerar**:
    
    - Substitua servidores físicos por **ECS/Fargate** (containers gerenciados).
    - Use **Lambda** para funções event-driven.
    