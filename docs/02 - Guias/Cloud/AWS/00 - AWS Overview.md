# AWS na prática — mapa de arquitetura

Este guia organiza os serviços AWS em blocos para facilitar decisão arquitetural.

## Como estudar
1. Comece por **rede e segurança** (VPC, Subnet, Security Group, IAM).
2. Depois vá para **compute** (EC2, ECS, Lambda, EKS).
3. Em seguida **dados e integração** (S3, RDS, DynamoDB, SQS, SNS, EventBridge).
4. Finalize com **entrada e observabilidade** (API Gateway, ELB/ALB/NLB, Route 53, CloudFront, CloudWatch).

## Blocos principais
- **Rede e borda:** VPC, Subnet, Security Group, ELB, API Gateway, Route 53, CloudFront.
- **Execução:** EC2, ECS, EKS, Lambda, Auto Scaling.
- **Dados:** S3, RDS, DynamoDB, ElastiCache.
- **Mensageria/eventos:** SQS, SNS, EventBridge.
- **Segurança:** IAM, KMS, Secrets Manager, WAF.

## Regra prática
- Prefira **gerenciado** quando possível.
- Escolha serviço pelo **padrão de acesso** e pelo **trade-off operacional**.
- Defina desde o início: observabilidade, custo e segurança.
