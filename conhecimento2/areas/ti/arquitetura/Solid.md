---
tags:
  - Fundamentos
  - Arquitetura
  - NotaBibliografica
---

# 🧱 Princípios SOLID com Exemplos em Java

---

## 🔠 1. **S — Single Responsibility Principle (SRP)**

> Uma classe deve ter apenas uma razão para mudar.
> 

---

### 📖 Explicação:

- Cada classe deve ter uma única responsabilidade, encapsulando apenas um motivo de mudança.
- Reduz o acoplamento e melhora a coesão interna.
- Fica mais fácil entender, manter e testar.

### ❌ Exemplo Ruim:

```java
java
CopiarEditar
public class Report {
    public void generate() {
        // lógica de geração
    }

    public void saveToFile(String filename) {
        // lógica de I/O
    }

    public void sendEmail(String email) {
        // lógica de envio
    }
}

```

### ✅ Exemplo com SRP:

```java
java
CopiarEditar
public class ReportGenerator {
    public String generate() {
        return "Conteúdo do relatório";
    }
}

public class FileSaver {
    public void save(String content, String filename) {
        // salvar conteúdo no arquivo
    }
}

public class EmailSender {
    public void send(String content, String email) {
        // enviar conteúdo por e-mail
    }
}

```

---

## ⚙️ 2. **O — Open/Closed Principle (OCP)**

> Entidades de software devem estar abertas para extensão, mas fechadas para modificação.
> 

---

### 📖 Explicação:

- Permite adicionar comportamentos sem alterar classes existentes.
- Usa interfaces, herança ou composição.
- Evita regressões e promove escalabilidade.

### ❌ Exemplo Ruim:

```java
java
CopiarEditar
public class DiscountCalculator {
    public double calculate(String type) {
        if (type.equals("VIP")) return 0.2;
        if (type.equals("Regular")) return 0.1;
        return 0.0;
    }
}

```

### ✅ Exemplo com OCP:

```java
java
CopiarEditar
public interface DiscountStrategy {
    double getDiscount();
}

public class VIPDiscount implements DiscountStrategy {
    public double getDiscount() { return 0.2; }
}

public class RegularDiscount implements DiscountStrategy {
    public double getDiscount() { return 0.1; }
}

public class DiscountCalculator {
    public double calculate(DiscountStrategy strategy) {
        return strategy.getDiscount();
    }
}

```

---

## 🧭 3. **L — Liskov Substitution Principle (LSP)**

> Subtipos devem ser substituíveis por seus tipos base.
> 

---

### 📖 Explicação:

- Uma subclasse deve manter o contrato da superclasse.
- Evita comportamentos inesperados ao usar herança.
- Permite uso seguro de polimorfismo.

### ❌ Exemplo Ruim:

```java
java
CopiarEditar
public class Bird {
    public void fly() {
        System.out.println("Voando...");
    }
}

public class Ostrich extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Avestruz não voa!");
    }
}

```

### ✅ Exemplo com LSP:

```java
java
CopiarEditar
public abstract class Bird {}

public abstract class FlyingBird extends Bird {
    public abstract void fly();
}

public class Sparrow extends FlyingBird {
    public void fly() {
        System.out.println("Pardal voando...");
    }
}

public class Ostrich extends Bird {
    // não voa, então não implementa fly
}

```

---

## 🧰 4. **I — Interface Segregation Principle (ISP)**

> Nenhuma classe deve ser forçada a depender de métodos que não usa.
> 

---

### 📖 Explicação:

- Interfaces devem ser pequenas e específicas.
- Classes só implementam o que de fato usam.
- Reduz acoplamento e melhora a clareza dos contratos.

### ❌ Exemplo Ruim:

```java
java
CopiarEditar
public interface Machine {
    void print();
    void scan();
    void fax();
}

```

### ✅ Exemplo com ISP:

```java
java
CopiarEditar
public interface Printer {
    void print();
}

public interface Scanner {
    void scan();
}

public class MultifunctionPrinter implements Printer, Scanner {
    public void print() { /* lógica */ }
    public void scan() { /* lógica */ }
}

public class SimplePrinter implements Printer {
    public void print() { /* lógica */ }
}

```

---

## 🔄 5. **D — Dependency Inversion Principle (DIP)**

> Dependa de abstrações, não de implementações.
> 

---

### 📖 Explicação:

- Módulos de alto nível não devem depender de detalhes.
- Ambos devem depender de **interfaces (abstrações)**.
- Implementações são injetadas (injeção de dependência).

### ❌ Exemplo Ruim:

```java
java
CopiarEditar
public class MySQLDatabase {
    public void save(String data) {
        // lógica MySQL
    }
}

public class UserService {
    private MySQLDatabase db = new MySQLDatabase();

    public void save(String user) {
        db.save(user);
    }
}

```

### ✅ Exemplo com DIP:

```java
java
CopiarEditar
public interface Database {
    void save(String data);
}

public class MySQLDatabase implements Database {
    public void save(String data) {
        // lógica
    }
}

public class UserService {
    private Database db;

    public UserService(Database db) {
        this.db = db;
    }

    public void save(String user) {
        db.save(user);
    }
}

```

---

## 📘 Resumo Geral

| Princípio | Significado | Objetivo | Resultado |
| --- | --- | --- | --- |
| SRP | Responsabilidade única | Clareza e foco | Manutenção fácil |
| OCP | Aberto para extensão, fechado para modificação | Evolução segura | Modularidade |
| LSP | Substituição por herança | Herança segura | Polimorfismo confiável |
| ISP | Interfaces específicas | Contratos limpos | Flexibilidade |
| DIP | Inversão de dependência | Abstração | Testabilidade e desacoplamento |

---

## 🧠 Dicas finais para Java

- Combine SOLID com padrões de projeto (Strategy, Factory, Adapter).
- Use interfaces e injeção de dependência (ex: Spring Framework).
- Use testes unitários com mocks (JUnit + Mockito).
- Integre com princípios como Clean Architecture ou Hexagonal para máxima escalabilidade.

