# CI/CD — Fundamentos

CI/CD é o conjunto de práticas para integrar código continuamente (CI) e entregar/deployar mudanças com segurança e frequência (CD).

## Pilares
- Build automatizado
- Testes automatizados
- Análise de qualidade e segurança
- Empacotamento
- Deploy progressivo
- Observabilidade pós-release

## Fluxo comum
1. Push/PR no repositório.
2. Pipeline de CI: lint, test, build, scan.
3. Publicação de artefato/imagem.
4. Pipeline de CD: deploy em ambiente alvo.
5. Validação e rollback se necessário.
