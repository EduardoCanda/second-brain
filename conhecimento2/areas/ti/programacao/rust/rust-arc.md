---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Rust
---
Ótima! **`Arc<T>`** significa **A**tomic **R**eference **C**ounted: um ponteiro inteligente que permite **compartilhar** um mesmo `T` **entre threads** com **contagem de referências atômica**.

## Para que serve?

- Quando você precisa **ter várias “cópias” baratas** de um mesmo objeto (ex.: estado compartilhado) que **pode ser lido em várias threads** (web server, workers, etc.).
    
- Cada `clone()` do `Arc` **não copia `T`**: só **incrementa** um contador atômico. O último a ser liberado **destrói** o `T`.
    

## Por que não `Rc<T>`?

- `Rc<T>` _não_ é thread-safe (não é `Send`/`Sync`).
    
- `Arc<T>` **é** thread-safe (usa operações atômicas).
    
- Em servidores (ex.: Actix/Tokio), **use `Arc`**.
    

## Mutação: `Arc<T>` não dá mutabilidade por si

- `Arc<T>` só garante **compartilhamento**; para **mutar** com segurança entre threads, combine com **interior mutability**:
    
    - `Arc<Mutex<T>>` para exclusão mútua.
        
    - `Arc<RwLock<T>>` para vários leitores / um escritor.
        
- Sem isso, `Arc<T>` é essencialmente “somente leitura” do ponto de vista de aliasing.
    

### Exemplo simples

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let dados = Arc::new(Mutex::new(Vec::<u32>::new()));

let mut handles = vec![];
for i in 0..4 {
    let dados = Arc::clone(&dados); // barato: +1 no contador
    handles.push(thread::spawn(move || {
        dados.lock().unwrap().push(i);
    }));
}
for h in handles { h.join().unwrap(); }

assert_eq!(dados.lock().unwrap().len(), 4);
```

## Em Actix Web (e outros web frameworks)

- `web::Data<T>` é, na prática, um **wrapper de `Arc<T>`** para injeção de dependências/estado.
    
- Por isso você vê muito `web::Data<AppState>`; por baixo, é `Arc<AppState>`:
    
    - leitura concorrente = ok,
        
    - mutação: faça `AppState` conter `Mutex/RwLock` onde for preciso.
        

```rust
#[derive(Clone)]
struct AppState {
    contador: std::sync::RwLock<u64>, // estado mutável protegido
}

// Registro:
let state = actix_web::web::Data::new(AppState { contador: RwLock::new(0) });

// Uso no handler:
async fn incrementa(state: actix_web::web::Data<AppState>) -> String {
    *state.contador.write().unwrap() += 1;
    "ok".into()
}
```

## Custo e cuidados

- **Custo**: incrementar/decrementar a contagem é **atômico** (um pouco mais caro que `Rc`, mas necessário em multithread).
    
- **Ciclos**: como em `Rc`, dá pra criar **ciclos** que nunca se libertam. Use `Weak<T>` (`Arc::downgrade`) para evitar ciclos fortes.
    
- **Ergonomia**: `Arc<dyn Trait + Send + Sync>` é comum para **ports/adapters** injetados (polimorfismo + compartilhamento).
    

### Padrão comum em DI

```rust
use std::sync::Arc;

trait ContasPort: Send + Sync { fn exists(&self, id: u64) -> bool; }

struct AppState {
    contas: Arc<dyn ContasPort>,
}
```

## TL;DR

- `Arc<T>` = “ponteiro compartilhado thread-safe”.
    
- Clone é barato; o último **dropa** o valor.
    
- Para **mutar** com segurança: `Arc<Mutex<T>>` ou `Arc<RwLock<T>>`.
    
- Em Actix, `web::Data<T>` ≈ `Arc<T>`; use locks dentro do estado quando necessário.