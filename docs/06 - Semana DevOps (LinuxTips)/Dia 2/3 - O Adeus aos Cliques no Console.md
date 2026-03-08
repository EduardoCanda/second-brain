Criar infraestrutura clicando num painel _(Console da AWS, GCP, etc.)_ é ótimo para estudo básico. Mas na vida real é um desastre:

- **Erro Humano:** Você nunca vai clicar exatamente nos mesmos 25 botões para recriar o ambiente de Produção igualzinho ao de Homologação.
- **Falta de Histórico (Auditoria):** Quem mudou a porta do banco de dados na sexta à noite? Ninguém sabe. Ninguém viu. O painel não tem botão de "desfazer".

**A Solução: IaC (Infrastructure as Code / Infraestrutura como Código).**

A infraestrutura não é mais um amontoado de fios e servidores físicos. É software. Sendo software, deve ser:

1. Versionada (guardada no Git).
2. Code Review (revisada por outros humanos do time).
3. Testada em pipeline (CI/CD).