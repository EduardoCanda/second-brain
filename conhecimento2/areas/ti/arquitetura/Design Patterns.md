---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---
## 🧠 **O que são Design Patterns?**

Design Patterns (padrões de projeto) são **soluções reutilizáveis para problemas recorrentes no design de software**.

Eles não são código pronto, mas **estruturas conceituais** que guiam boas implementações.

Os padrões mais clássicos foram organizados no livro *“Design Patterns: Elements of Reusable Object-Oriented Software”* (GoF – *Gang of Four*), e são divididos em **3 categorias**:

---

## 🔧 **1. Criacionais (Creational Patterns)**

> Focados na criação e instanciamento de objetos de forma flexível e desacoplada.
> 

### 🔹 **Singleton**

- Garante que exista apenas **uma instância de uma classe**.
- Muito usado para gerenciar conexões únicas, cache, loggers.
- ⚠️ Deve ser usado com cuidado em ambientes concorrentes.

🧠 Exemplo:

> Serviço de configuração global, onde apenas uma instância deve carregar os parâmetros de ambiente.
> 

---

### 🔹 **Factory Method**

- Permite criar objetos **sem expor a lógica de criação ao cliente**.
- Muito útil para **encapsular lógica de construção** com base em parâmetros.

🧠 Exemplo:

> Criar diferentes implementações de TransacaoService com base no tipo de produto PJ (credito, investimento, etc.).
> 

---

### 🔹 **Abstract Factory**

- Uma “fábrica de fábricas” — cria **famílias de objetos relacionados**, mantendo a coerência entre eles.

🧠 Exemplo:

> Interface de UI que alterna entre DarkThemeFactory e LightThemeFactory para gerar botões, menus, etc.
> 

---

### 🔹 **Builder**

- Ideal para construir objetos **complexos passo a passo**, sem construtores com muitos parâmetros.

🧠 Exemplo:

> Montar um relatório financeiro com filtros opcionais, campos dinâmicos e múltiplas seções.
> 

---

### 🔹 **Prototype**

- Permite criar novos objetos **clonando uma instância existente**.

🧠 Exemplo:

> Clonar uma transação padrão de teste com todos os campos preenchidos para novos testes.
> 

---

## 🏗️ **2. Estruturais (Structural Patterns)**

> Lidam com como os objetos se conectam ou se organizam entre si.
> 

### 🔹 **Adapter**

- Conecta interfaces incompatíveis, **convertendo chamadas entre elas**.

🧠 Exemplo:

> Criar um adaptador entre um serviço legado REST e um consumidor que espera um padrão gRPC.
> 

---

### 🔹 **Facade**

- Fornece **uma interface simplificada** para um subsistema complexo.

🧠 Exemplo:

> Uma PagamentoFacade que orquestra antifraude, gateway de pagamento, emissão de recibo e notificação.
> 

---

### 🔹 **Decorator**

- Adiciona funcionalidades **sem modificar a classe original**, de forma encadeável.

🧠 Exemplo:

> Aplicar camadas de validação extra em um serviço de transação sem alterar seu código principal.
> 

---

### 🔹 **Proxy**

- Intercepta chamadas para **adicionar controle de acesso, cache, ou lazy loading**.

🧠 Exemplo:

> Um proxy de autorização que verifica o token JWT antes de delegar a chamada ao serviço real.
> 

---

### 🔹 **Composite**

- Permite tratar objetos individuais e coleções de objetos **de forma uniforme**.

🧠 Exemplo:

> Sistema de permissões onde PermissãoSimples e PermissãoComposta implementam a mesma interface.
> 

---

## ⚙️ **3. Comportamentais (Behavioral Patterns)**

> Focados em como os objetos interagem entre si e distribuem responsabilidades.
> 

### 🔹 **Strategy**

- Encapsula diferentes **algoritmos ou comportamentos**, permitindo trocá-los em tempo de execução.

🧠 Exemplo:

> Calcular a comissão de um gerente PJ com estratégias diferentes para produtos de crédito, câmbio e investimentos.
> 

---

### 🔹 **Observer**

- Permite que **múltiplos objetos sejam notificados** quando algo muda.

🧠 Exemplo:

> Ao aprovar uma proposta, notificar por e-mail, salvar log de auditoria e enviar evento para Kafka.
> 

---

### 🔹 **Command**

- Encapsula uma ação como um objeto, permitindo **fila, histórico e desfazer**.

🧠 Exemplo:

> Fila de comandos para atualizar o status de contratos com possibilidade de reprocessamento ou retry.
> 

---

### 🔹 **Chain of Responsibility**

- Permite **encadear múltiplos manipuladores** para processar uma requisição.

🧠 Exemplo:

> Pipeline de validação: antifraude → política de risco → checagem de compliance.
> 

---

### 🔹 **Template Method**

- Define um **esqueleto de algoritmo**, delegando partes da implementação para subclasses.

🧠 Exemplo:

> Um fluxo de integração bancária que sempre executa: autenticar → consultar → transformar → logar, mas com variações por banco.
> 

---

## ✅ **Conclusão para entrevista**

> “Design patterns são soluções reutilizáveis para problemas comuns de design. Os principais se dividem em três categorias: criacionais, estruturais e comportamentais. Uso Factory Method e Strategy com frequência em arquiteturas orientadas a domínio, especialmente quando preciso isolar comportamentos que variam por cliente, produto ou canal. Também já usei Singleton com cautela para caches e gateways, e Facade para orquestrar chamadas entre microsserviços. Mais do que aplicar o padrão, sempre busco o equilíbrio entre clareza, extensibilidade e performance.”

