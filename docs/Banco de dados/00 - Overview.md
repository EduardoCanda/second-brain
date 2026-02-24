Banco de dados é uma estrutura organizada de informações para armazenamento e consulta.

Esses dados podem representar autenticação, clientes, produtos, pedidos, logs e muito mais.

## Tipos de banco de dados
- [[Banco relacional (SQL)]]
- [[Banco não relacional (noSQL)]]

## Como escolher: relacional ou não relacional?

### Prefira relacional (SQL) quando
- consistência e transações são críticas;
- há muitas regras de integridade;
- você precisa de consultas complexas com relacionamentos.

### Prefira não relacional (NoSQL) quando
- estrutura de dados muda com frequência;
- você precisa de escala horizontal rápida;
- o padrão de acesso é específico (documento, chave-valor, grafo, séries, etc.).

## Throughput alto ou baixo: impacto na escolha
- **Baixo throughput**: simplicidade e manutenção importam mais; normalmente um SQL bem modelado resolve.
- **Alto throughput**: pense em particionamento, replicação, distribuição de carga e padrões de cache.

## Arquitetura na prática
Em muitos sistemas, o melhor caminho é **híbrido**:
- SQL como sistema transacional principal;
- NoSQL para casos específicos de escala e flexibilidade;
- cache para reduzir latência e proteger o banco.

Veja também: [[Cache]]
