# AWS Developer — Checklist de revisão rápida

## Serviços e integrações
- [ ] Criar Lambda com variáveis e permissões corretas
- [ ] Expor endpoint com API Gateway
- [ ] Persistir dados em DynamoDB
- [ ] Integrar fila com SQS
- [ ] Publicar eventos no EventBridge

## Segurança
- [ ] Entender diferença entre usuário, grupo e role no IAM
- [ ] Aplicar princípio de menor privilégio
- [ ] Usar Secrets Manager para credenciais
- [ ] Criptografar dados com KMS

## Operação
- [ ] Configurar logs estruturados no CloudWatch
- [ ] Criar alarmes por erro e latência
- [ ] Entender tracing com X-Ray

## Deploy
- [ ] Empacotar e deployar com SAM/CDK
- [ ] Executar rollback de versão
- [ ] Definir ambientes (dev/hml/prod)
