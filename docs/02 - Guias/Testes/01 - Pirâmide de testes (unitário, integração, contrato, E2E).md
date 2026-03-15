# 🔺 Pirâmide de testes (unitário, integração, contrato, E2E)

A pirâmide de testes é um modelo para distribuir esforço de validação por camadas, equilibrando **velocidade**, **cobertura comportamental** e **custo de manutenção**.

## Mapa visual

```ascii
                /\
               /  \        E2E
              /____\       Poucos, críticos, ponta-a-ponta
             /\    /\
            /  \  /  \     Contrato
           /____\/____\    Verifica compatibilidade entre serviços
          /\          /\
         /  \        /  \  Integração
        /____\______/____\ Fluxos entre módulos, DB, fila, cache
       /                  \
      /      Unitário      \ Muitos, rápidos, determinísticos
     /______________________\
```

## Níveis da pirâmide

### 1) Testes unitários

**Foco:** regra de negócio isolada, funções, classes e componentes sem dependências externas reais.

- Devem ser rápidos (milissegundos), previsíveis e independentes de ambiente.
- Capturam regressões cedo e com baixo custo de diagnóstico.
- São ideais para validar bordas: valores nulos, arredondamento, timezone, idempotência.

### 2) Testes de integração

**Foco:** colaboração entre componentes reais (aplicação + banco + mensageria + cache etc.).

- Validam mapeamento ORM, transações, serialização, retries e timeouts.
- Cobrem erros que unitário não enxerga: schema divergente, encoding, latency, lock.
- Exigem bom isolamento de dados de teste (fixtures e cleanup).

### 3) Testes de contrato

**Foco:** compatibilidade de interface entre produtor e consumidor (API HTTP, eventos, gRPC).

- Reduzem quebra entre times em arquiteturas distribuídas.
- Mais baratos que E2E para garantir integração inter-serviços.
- Tornam mudanças de contrato explícitas e negociáveis.

### 4) Testes E2E

**Foco:** jornada real do usuário e integração total do sistema.

- São os mais próximos da realidade e também os mais caros/lentos.
- Devem cobrir fluxos críticos de negócio (compra, pagamento, autenticação, onboarding).
- Evite usar E2E para validar todas as variações: deixe isso para níveis abaixo.

## Proporção recomendada (ponto de partida)

Não existe número universal, mas um baseline útil:

- **60-75%** unitários
- **15-25%** integração
- **5-10%** contrato
- **<5%** E2E

Ajuste conforme contexto (domínio regulado, legado, criticidade, maturidade do time).

## Anti-padrões comuns

- “Sorvete de casquinha”: muitos E2E e poucos unitários.
- Suite lenta sem paralelismo nem particionamento por risco.
- Testes frágeis (flaky) mascarados com retries infinitos.
- Cobertura de linha como único KPI de qualidade.
