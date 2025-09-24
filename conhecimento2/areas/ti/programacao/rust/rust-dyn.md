---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Rust
---
Boa! Esse `dyn` aparece em tipos como `Arc<dyn ContasPort + Send + Sync>` porque aí estamos usando um **trait object** (despacho dinâmico) em vez de um tipo concreto ou genérico. Vamos por partes:

## O que é `dyn Trait`?

- `dyn Trait` é um **trait object**: um ponteiro “gordinho” (fat pointer) composto por:
    
    1. um ponteiro para os **dados** e
        
    2. um ponteiro para a **vtable** (tabela de funções do trait).
        
- Com ele, o compilador chama os métodos do trait por **despacho dinâmico** (em tempo de execução), sem saber o tipo concreto exato.
    

Antes do Rust 2018 você veria `Arc<Trait>`; hoje a sintaxe explícita é `Arc<dyn Trait>`.

## Por que usar `dyn` dentro de `Arc`?

- **Inversão de dependência / DI**: você quer guardar em `AppState` “algo que implementa `ContasPort`”, podendo trocar a implementação (real, fake, mock) sem mudar o tipo.
    
- **`Arc` aceita tipos não dimensionados (`?Sized`)**: `Arc<T: ?Sized>` permite possuir/alocar dinamicamente um `dyn Trait`. Então `Arc<dyn Trait>` funciona porque o “tamanho” é resolvido por trás do ponteiro.
    
    - Compare: `Vec<dyn Trait>` **não** compila, pois vetores precisam de elementos `Sized`. Já `Vec<Box<dyn Trait>>` funciona, porque o `Box` tem tamanho fixo.
        

## Por que não só generics?

- Com **genéricos**: `fn usa<T: ContasPort>(t: T) { ... }` dá **despacho estático** (zero-cost) e monomorfização, mas o tipo vira **paramétrico**. Se você precisar **trocar implementações em runtime** ou guardar **múltiplas implementações diferentes no mesmo campo/coleção**, genérico complica.
    
- Com **`dyn`**: `Arc<dyn ContasPort + Send + Sync>` guarda **qualquer** implementação no mesmo campo e decide em runtime qual método chamar. Custa uma indireção (vtable), mas te dá flexibilidade.
    

## E os `+ Send + Sync`?

- Como seu servidor é multithread, você precisa garantir que o objeto do trait é **seguro para enviar/compartilhar entre threads**:
    
    - `Send`: pode ser movido entre threads.
        
    - `Sync`: `&T` pode ser compartilhado entre threads.
        
- Escrever `Arc<dyn Trait + Send + Sync>` **restringe** o trait object a implementações que satisfaçam essas marcas.
    

## Regras importantes (object safety)

Nem todo trait pode virar `dyn Trait`. Para ser **object-safe**:

- Não pode ter métodos genéricos (com parâmetros de tipo).
    
- Métodos não podem retornar `Self` por valor (exceto usando truques como `where Self: Sized`).
    
- Não pode exigir `Sized` no trait.
    

Se o trait **não é object-safe**, você **não** consegue `Arc<dyn Trait>`; aí use genéricos ou mude a API.

## Exemplos rápidos

### 1) Com trait object (`dyn`) para DI

```rust
use std::sync::Arc;

trait ContasPort: Send + Sync {
    fn exists(&self, id: u64) -> bool;
}

struct AppState {
    contas: Arc<dyn ContasPort + Send + Sync>,
}

struct RealContas;
impl ContasPort for RealContas {
    fn exists(&self, id: u64) -> bool { id != 0 }
}

let state = AppState { contas: Arc::new(RealContas) };
assert!(state.contas.exists(42));
```

### 2) Alternativa com generics (sem `dyn`)

```rust
struct AppState<T: ContasPort> {
    contas: T,
}

fn cria_estado<T: ContasPort>(contas: T) -> AppState<T> { AppState { contas } }
```

Mais performático (estático), mas o tipo de `AppState` muda para cada implementação — ruim para coleções heterogêneas ou para interfaces/plug-ins selecionados em runtime.

### 3) Por que `Arc<dyn Trait>` e não `Box<dyn Trait>`?

- `Box<dyn Trait>`: posse única, **single-thread** por padrão; você pode usar em single-thread sem contagem compartilhada.
    
- `Arc<dyn Trait>`: **compartilhamento seguro entre threads**.
    
- Em servidores, `Arc` é o mais comum para estado compartilhado.
    

---

## Quando escolher cada um

- **Escolha `dyn`** quando precisar de **polimorfismo em runtime**, trocar implementações, coletá-las em listas/estruturas únicas, ou expor uma “porta” com múltiplos backends.
    
- **Escolha genéricos** quando a implementação é conhecida em compile-time e você quer **zero overhead**.
    

Resumindo: o `dyn` sinaliza ao compilador “use **trait object** aqui”, e é por isso que você vê `Arc<dyn Trait + Send + Sync>` — um **ponteiro compartilhado e thread-safe** para **qualquer** implementação daquele trait, ligada via **vtable** em tempo de execução.