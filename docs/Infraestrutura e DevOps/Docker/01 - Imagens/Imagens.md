# Docker — Imagens

Imagem Docker é um conjunto de camadas somente leitura que define como um container será criado.

## Características
- Imutáveis
- Compostos por camadas
- Cacheáveis
- Identificadas por tag e digest

## Dockerfile
- FROM
- RUN
- CMD
- ENTRYPOINT
- COPY / ADD
- WORKDIR
- ENV
- EXPOSE
- USER
- HEALTHCHECK

## Boas práticas
- Usar imagens base pequenas
- Multistage build
- Minimizar camadas

## Relações
- [Dockerfile](../00 - Fundamentos/Dockerfile.md)
- [Containers](../02 - Containers/Containers.md)
- [Registry](../08 - Registry/Registry.md)
