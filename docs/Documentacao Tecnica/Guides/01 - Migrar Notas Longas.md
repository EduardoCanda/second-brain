# Migrar Notas Longas para Páginas Menores

Descrição curta: método de refatoração editorial para transformar material extenso em documentos escaneáveis.

## Sumário rápido
- [Passos](#passos)
- [Critérios de divisão](#criterios-de-divisao)
- [Exemplo](#exemplo)
- [Ver também](#ver-tambem)

## Passos
1. Identifique assuntos misturados na nota original.
2. Separe por intenção: conceito, tutorial, referência, troubleshooting.
3. Crie uma página para cada intenção.
4. Adicione cross-links em “Ver também”.

## Critérios de divisão
- Mais de 8 subtítulos → dividir.
- Mais de 2 públicos na mesma página → dividir.
- Mistura de teoria + comandos + erro comum → separar.

## Exemplo
```md
Nota original: "Redes completas"
- Página A: Fundamentos TCP/IP (#concept)
- Página B: Configuração de DNS (#tutorial)
- Página C: Comandos de rede (#reference)
- Página D: Erros de resolução de nome (#troubleshooting)
```

## Ver também
- [Lab: Refatoração Completa](../Labs/01%20-%20Lab%20Refatoracao%20de%20Nota.md)
