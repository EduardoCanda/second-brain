---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Rust
---
ótima! vamos por partes — o “**o que são**”, a “**sintaxe**”, “**quando exigem**” e “**exemplos práticos/erros comuns**”.

# O que são `Send` e `Sync`?

Eles são **auto-traits marcadores** do Rust para **segurança em concorrência**:

- **`Send`**: um tipo é `Send` se pode **ter sua posse movida** com segurança **de uma thread para outra**.  
    mental model: “eu posso pegar este valor e entregar para outra thread cuidar dele?”
    
- **`Sync`**: um tipo é `Sync` se é seguro que **várias threads compartilhem referências imutáveis** a ele, isto é, `&T` é `Send`.  
    mental model: “é seguro ter **&T** ao mesmo tempo em múltiplas threads?”
    

Não têm métodos; são só marcas que o compilador usa para aceitar/recusar usos concorrentes. O compilador **implementa automaticamente** (auto-traits) para quase todos os tipos **desde que todos os seus campos também o sejam**. Se algum campo não for `Send`/`Sync`, o composto deixa de ser.

# Sintaxe (onde você vê `Send + Sync`)

- Em **bounds de generics**:
    
    ```rust
    fn run_in_pool<T: Send + 'static>(val: T) { /* ... */ }
    ```
    
    Aqui eu exijo que `T` possa ser movido para outra thread (`Send`) e que não capture referências de vida curta (`'static`).
    
- Em **objetos dinâmicos**:
    
    ```rust
    let x: Arc<dyn Service + Send + Sync> = /* ... */;
    ```
    
    O objeto de trait precisa ser seguro para compartilhar/mandar entre threads.
    
- Em **tipos de estado de servidor** (Actix, Axum, etc.):
    
    ```rust
    struct AppState { /* ... */ }
    // geralmente o framework exige AppState: Send + Sync + 'static
    ```
    

# Intuição com exemplos

- **`i32`, `String`, `Vec<T>`** → são `Send` e `Sync` (desde que `T` também seja).
    
- **`Rc<T>`** → **não é `Send` nem `Sync`** (contador de ref não atômico).  
    Use **`Arc<T>`** para multithread.
    
- **`RefCell<T>` / `Cell<T>`** → **não são `Sync`** (não têm sincronização).  
    Para multithread, use **`Mutex<T>`**, **`RwLock<T>`** ou **atomics**.
    
- **`Mutex<T>`** → é `Send` e `Sync` (com restrições padrão: `Mutex<T>` é `Send` se `T: Send`; `&Mutex<T>` é `Sync`).
    
- **Ponteiros crus** (`*mut T`, `*const T`) → normalmente não são `Send`/`Sync` (você precisa provar segurança manualmente — o padrão é negar).
    

# Regras úteis de bolso

- `T: Send` ⇒ **mover** `T` entre threads é seguro.
    
- `T: Sync` ⇒ **compartilhar** `&T` entre threads é seguro (portanto `&T: Send`).
    
- `Arc<T>` **não dá mutabilidade** por si. Para **estado mutável compartilhado**, use `Arc<Mutex<T>>` ou `Arc<RwLock<T>>`.
    

# Por que seu web server pede `Send + Sync`?

Servidores async multithread (Actix/Tokio) espalham seu estado/handlers entre **vários workers**. Para permitir isso:

- **estado compartilhado** (ex.: `web::Data<AppState>`) precisa ser `Sync` (várias threads seguram `&AppState`);
    
- às vezes também precisa ser `Send` (o estado pode ser **movido** para um worker);
    
- **futuros** executados pelo runtime (ex.: `tokio::spawn`) exigem que **o `Future` seja `Send`** (para poder pular de thread).
    

# Erros típicos (e como resolver)

### 1) “`Send` is not satisfied”

> _error: future cannot be sent between threads safely… not `Send`_

Causas comuns:

- Você capturou um `Rc<T>` dentro do `async` → troque **`Rc` por `Arc`**.
    
- Você capturou `RefCell<T>` → troque por **`Mutex<T>`/`RwLock<T>`** (ou redesenhe para evitar mutação compartilhada).
    
- Você capturou um **`&mut`** para algo que vive só na thread atual → reduza o escopo/capture por **owned** (`Arc`, `String` em vez de `&str` curto, etc.).
    

### 2) “`Sync` is not implemented”

> _error: the trait `Sync` is not implemented for `...`_

Causas comuns:

- Colocar `RefCell`, `Cell` ou estruturas não thread-safe dentro do **estado compartilhado** (`AppState`).  
    **Troque por locks** (ou atomics).
    

### 3) Trait object sem `Send + Sync`

```rust
let s: Arc<dyn Service> = /* ... */; // erro
```

Se o `Service` será compartilhado entre threads, declare:

```rust
let s: Arc<dyn Service + Send + Sync> = /* ... */;
```

E garanta que a implementação realmente seja `Send + Sync` (sem `Rc`, sem `RefCell`, etc.).

# Mini quadro-resumo

- `Send`: mover valor entre threads é seguro.
    
- `Sync`: compartilhar **&T** entre threads é seguro (logo `&T: Send`).
    
- `Rc`/`RefCell` → single-thread; `Arc`/`Mutex` → multi-thread.
    
- `web::Data<T>` ≈ `Arc<T>`; portanto **`T` deve ser `Send + Sync`**.
    
- Para mutação compartilhada: `Arc<Mutex<T>>` ou `Arc<RwLock<T>>`.
    

# Exemplos curtos

## Estado seguro em Actix

```rust
use std::sync::{Arc, RwLock};

struct AppState {
    contador: RwLock<u64>, // permite leituras concorrentes e 1 escrita por vez
}

let state = actix_web::web::Data::new(AppState { contador: RwLock::new(0) });
// AppState é Sync porque RwLock é Sync; e é Send pelo mesmo motivo.
```

## Polimorfismo seguro

```rust
trait ContasPort: Send + Sync {
    fn exists(&self, id: u64) -> bool;
}

struct AppState {
    contas: Arc<dyn ContasPort + Send + Sync>,
}
```

## Consertando um futuro que não é `Send`

Errado (captura `Rc`):

```rust
let v = std::rc::Rc::new(vec![1,2,3]);
tokio::spawn(async move { println!("{}", v.len()); }); // ERRO
```

Certo:

```rust
let v = std::sync::Arc::new(vec![1,2,3]);
tokio::spawn({
    let v = v.clone();
    async move { println!("{}", v.len()); } // OK (Future é Send)
});
```

---

se quiser, posso checar seu `AppState`/handlers e apontar exatamente quais campos estão “quebrando” `Send`/`Sync`, já sugerindo as trocas (`Rc`→`Arc`, `RefCell`→`Mutex`/`RwLock`, etc.).