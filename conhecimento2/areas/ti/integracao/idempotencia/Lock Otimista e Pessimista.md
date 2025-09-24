---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
  - Integracoes
---
# Lock Pessimista vs. Lock Otimista

Estes são dois abordagens diferentes para controle de concorrência em sistemas de banco de dados ou aplicações:

## Lock Pessimista (Bloqueio Pessimista)
- **Princípio**: Assume que conflitos são prováveis e previne-os antecipadamente
- **Funcionamento**: Bloqueia o registro/dado assim que uma transação começa a acessá-lo
- **Vantagem**: Garante consistência absoluta
- **Desvantagem**: Pode causar contenção e reduzir desempenho
- **Uso típico**: Quando há alta probabilidade de conflitos

## Lock Otimista (Bloqueio Otimista)
- **Princípio**: Assume que conflitos são raros e só verifica no final
- **Funcionamento**: Permite leituras e escritas concorrentes, verificando no commit se houve mudanças
- **Vantagem**: Melhor desempenho em cenários de baixa contenção
- **Desvantagem**: Pode exigir retrabalho se houver conflito
- **Uso típico**: Quando a probabilidade de conflitos é baixa

Exemplo em bancos de dados: O lock pessimista seria como SELECT FOR UPDATE, enquanto o otimista usaria campos de versão para detectar mudanças.