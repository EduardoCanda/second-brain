Dockerfile é um arquivo de texto que contém um conjunto de instruções usadas pelo Docker para construir uma imagem.

Cada instrução no Dockerfile cria uma **camada** na imagem final.

---

## Estrutura básica

```dockerfile
FROM imagem_base
INSTRUCAO argumentos
```

### Exemplo simples:

```Dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html
```

### Instruções principais
**FROM**
Define a imagem base.
```Dockerfile
FROM openjdk:21-jdk-slim
```

Deve ser a primeira instrução (exceto ARG)
Pode haver múltiplos FROM (multistage build)

**RUN**
Executa comandos durante o build da imagem.
```
RUN apt-get update && apt-get install -y curl
```
Cria uma nova camada
Preferir encadear comandos para reduzir camadas

**CMD**
Define o comando padrão a ser executado quando o container inicia.
```
CMD ["nginx", "-g", "daemon off;"]
```
Pode ser sobrescrito no docker run
Deve existir apenas um CMD

**ENTRYPOINT**
Define o comando principal do container.
```
ENTRYPOINT ["java", "-jar", "app.jar"]
```
Mais rígido que CMD
Pode ser combinado com CMD

**COPY**
Copia arquivos do host para a imagem.
```
COPY app.jar /app/app.jar
```
Preferir COPY em vez de ADD

**ADD**
Semelhante ao COPY, porém com funcionalidades extras.
ADD arquivo.tar.gz /app

Pode extrair arquivos automaticamente
Uso geralmente desencorajado

**WORKDIR**
Define o diretório de trabalho dentro do container.
```
WORKDIR /app
```
Evita uso excessivo de cd

**ENV**
Define variáveis de ambiente.
```
ENV APP_ENV=production
```

**EXPOSE**
Documenta a porta usada pela aplicação.
```
EXPOSE 8080
```
Não publica a porta automaticamente

**USER**

Define o usuário que executará o processo.
```
USER appuser
```
Boa prática de segurança
Evita execução como root

**HEALTHCHECK**
Define um comando para verificar a saúde do container.
```
HEALTHCHECK CMD curl -f http://localhost:8080 || exit 1
```

**Multistage Build**
Permite criar imagens menores separando build e runtime.
```
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn package

FROM eclipse-temurin:21-jre
COPY --from=build /app/target/app.jar app.jar
CMD ["java", "-jar", "app.jar"]
```
Vantagens:
- Imagens menores
- Mais seguras
- Mais rápidas para deploy

Boas práticas
    Usar imagens base pequenas
    Minimizar número de camadas
    Evitar instalar pacotes desnecessários
    Não armazenar segredos no Dockerfile
    Usar .dockerignore

Comandos relacionados

docker build -t minha-imagem .
docker history minha-imagem
docker inspect minha-imagem

Relações
[Imagens](../01 - Imagens/Imagens.md)
[Containers](../02 - Containers/Containers.md)
[Docker Compose](../05 - Compose/Docker Compose.md)
[Segurança](../07 - Segurança/Segurança.md)
