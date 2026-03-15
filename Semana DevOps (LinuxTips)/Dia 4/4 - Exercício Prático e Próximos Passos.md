### Exercício Prático (Mental / Pesquisa)

No seu projeto atual ou empresa:

1. Quanto tempo demora entre um código ser aprovado no Pull Request e ele estar no ar, sendo usado por um cliente? Dias? Semanas?
    
2. Como funciona a reversão (Rollback) se a versão de hoje introduzir um bug grave amanhã de manhã? É manual ou automatizado?
    
3. Em qual provedor Cloud a sua empresa roda (ou você usaria para um projeto pessoal)? Pesquise quanto custa uma instância **t3.medium** (2 vCPU, 4GB RAM) na AWS em São Paulo vs Virginia. A diferença de preço entre regiões vai te surpreender.
    
4. Pesquise sobre a sigla **GitOps** (Ferramentas: ArgoCD ou Flux). O que acontece com o seu Cluster se o código da Infra (YAML) estiver declarando 5 pods, mas uma pessoa sysadmin entrar lá correndo e mudar manualmente para 10 pods? O GitOps permite isso?
    

---

### Próximos Passos

Hoje vocês entenderam as veias e artérias da entrega de software. O fluxo desde a digitação (Dev), passando pela Cloud (Infra), até a fatura do servidor (Ops e FinOps).

Amanhã é o clímax. O dia onde nós juntamos as peças do "Bonde" num projeto de arquitetura completo. Fim da teoria. Veremos tudo se encaixar.

**Tema do Dia 5:** _Arquitetando o Projeto Completo na Prática_

**Aviso:** O "Transformer" será ligado amanhã. Estejam prontos para a graxa!