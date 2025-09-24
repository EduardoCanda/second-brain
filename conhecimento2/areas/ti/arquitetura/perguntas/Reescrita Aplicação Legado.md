---
tags:
  - Arquitetura
  - NotaBibliografica
categoria: questoes
---

## Quais critérios você utiliza para avaliar se vale a pena reescrever uma aplicação legada?

### ✅ **Resposta completa:**

Reescrever uma aplicação legada é uma das decisões **mais arriscadas e dispendiosas** em engenharia de software. Por isso, eu só considero essa opção quando **há justificativa clara baseada em riscos, valor de negócio e inviabilidade de evolução incremental.**

---

### **Minha avaliação segue 4 critérios principais:**

---

### **1. Grau de deterioração técnica e operacional**

- Avalio o nível de **dívida técnica**, legibilidade do código, testes, documentação e capacidade de evolução.
- Verifico se o sistema causa **frequentes incidentes**, **downtime**, **custo elevado de manutenção** ou **risco operacional elevado**.

> Exemplo: uma aplicação onde cada nova funcionalidade exige semanas de retrabalho por falta de testes ou acoplamento extremo pode justificar reescrita.
> 

---

### **2. Inviabilidade de atender novos requisitos**

- Se o legado **não consegue suportar mudanças estruturais** que o negócio precisa (ex: alta escalabilidade, arquitetura orientada a eventos, integração via APIs modernas), a reescrita pode se justificar.
- Nesse ponto, comparo o **custo de adaptação** com o de reescrita modular.

---

### **3. Alinhamento com a estratégia de longo prazo**

- A decisão precisa estar conectada com a **estratégia da empresa**: adoção de cloud, containerização, multi-região, modernização de stack, etc.
- A reescrita deve **gerar valor tangível**: acelerar time-to-market, reduzir custo, habilitar inovação ou facilitar compliance.

---

### **4. Capacidade de execução e risco controlado**

- Reescrita total é rara. Prefiro **abordagens modulares e incrementais**: *strangler fig pattern*, extração de componentes ou microsserviços ao redor do legado.
- Considero o impacto em operações, integração contínua, revalidação de testes e **duplicação temporária de fontes de verdade.**

---

### ✅ **Exemplo prático:**

Na minha experiência com aplicações Java legadas no setor bancário, optamos por **reescrever gradualmente** uma aplicação monolítica que tratava contratos de crédito:

- Fizemos assessment técnico e mapeamos os pontos mais instáveis.
- Começamos a extrair os domínios em microsserviços (com foco em escopo bem definido).
- Evitamos reescrita em “big bang” e mantivemos **canary deploys e métricas comparativas** entre legado e novo.

---

### ✅ Conclusão:

A decisão de reescrever uma aplicação não pode ser emocional ou puramente técnica. Deve ser **baseada em evidências, com foco em risco, custo, valor de negócio e capacidade de execução segura.** Sempre que possível, prefiro **evolução controlada ao invés de substituição total.**

