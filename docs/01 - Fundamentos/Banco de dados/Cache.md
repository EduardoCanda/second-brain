Cache é uma camada para armazenar dados acessados com frequência de forma mais rápida (normalmente em memória).

## Cache entra em banco de dados?
Sim. Cache não substitui o banco principal, mas complementa a arquitetura de dados.

## Para que serve
- reduzir latência;
- diminuir carga no banco principal;
- absorver picos de leitura;
- melhorar experiência do usuário.

## Padrões comuns
- **Cache-aside**: aplicação consulta o cache; se não achar, busca no banco e popula o cache.
- **Write-through**: escreve no cache e no banco ao mesmo tempo.
- **Write-back**: escreve primeiro no cache e persiste no banco depois (mais complexo, maior risco).

## Cuidados
- definir **TTL** (tempo de expiração);
- lidar com **invalidação** (parte mais difícil);
- monitorar hit rate e memória;
- evitar cache de dados que exigem consistência imediata sem estratégia clara.

## Tecnologias comuns
- **Redis** (mais popular para cache distribuído);
- **Memcached** (simples e eficiente para chave-valor).

> Regra prática: banco é a fonte de verdade; cache é aceleração.
