Docker é uma plataforma para criação, distribuição e execução de aplicações em containers.

## Conceitos-chave
- Container: processo isolado que compartilha o kernel do host
- Imagem: template imutável usado para criar containers
- Docker Engine: runtime responsável por gerenciar containers
- Docker CLI: interface de linha de comando
- Docker Daemon (dockerd): processo que executa as operações

## Base técnica
- Namespaces: isolamento (PID, NET, MNT, UTS, IPC)
- Cgroups: controle de recursos (CPU, memória)
- Union File System: camadas de imagem
- OCI: padrão aberto para containers