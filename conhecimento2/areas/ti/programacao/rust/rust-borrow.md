---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Rust
---
Bora! Em Rust, “borrow” (empréstimo) é o mecanismo de **acessar um valor sem tomar posse dele**. Em vez de mover o valor (ownership), você cria **referências** para ele:

- `&T` → referência **imutável** (leitura).
    
- `&mut T` → referência **mutável** (leitura + escrita).
    

Regras de ouro (o compilador garante):

1. Você pode ter **várias** referências imutáveis ao mesmo tempo **ou** **uma única** referência mutável — nunca ambos ao mesmo tempo.
    
2. Uma referência **nunca pode viver mais** do que o dono do valor.
    
3. Referências são sempre válidas (sem null/“dangling pointers”).
    

---

# Exemplos práticos

## 1) Borrow imutável

```rust
fn len_texto(s: &str) -> usize {
    s.len()
}

fn main() {
    let s = String::from("olá");
    let n = len_texto(&s);   // empresta &s (imutável)
    println!("len={n}, ainda tenho s: {s}");
}
```

## 2) Borrow mutável

```rust
fn add_exc(s: &mut String) {
    s.push('!');
}

fn main() {
    let mut s = String::from("ola");
    add_exc(&mut s);         // empresta de forma mutável
    println!("{s}");         // "ola!"
}
```

### Conflitos comuns (o compilador vai barrar)

```rust
fn main() {
    let mut s = String::from("x");

    // 2 mutáveis ao mesmo tempo: ERRO
    let r1 = &mut s;
    // let r2 = &mut s; // ❌ cannot borrow `s` as mutable more than once at a time
    println!("{r1}");

    // imutável + mutável ao mesmo tempo: ERRO
    let mut t = String::from("y");
    let i1 = &t;
    // let m1 = &mut t; // ❌ cannot borrow as mutable because it's also borrowed as immutable
    println!("{i1}");
}
```

### Encerrando um borrow para depois mutar

Com o _non-lexical lifetimes_ (NLL), o compilador encerra o empréstimo quando a última utilização acontece:

```rust
fn main() {
    let mut s = String::from("abc");
    let r = &s;
    println!("{r}");         // última vez que uso `r`
    let m = &mut s;          // agora é permitido
    m.push('!');             
    println!("{s}");
}
```

## 3) Borrow em coleções e _slices_

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];

    // Várias leituras: ok
    let a = &v[0..2];            // & [i32]
    let b = &v[2..];             // outra leitura
    println!("{a:?} {b:?}");

    // Duas mutações em partes disjuntas: use split_at_mut
    let (left, right) = v.split_at_mut(2);
    left[0] = 10;
    right[0] = 99;
    println!("{v:?}");           // [10, 2, 99, 4, 5]
}
```

## 4) Reborrow (reemprestar temporariamente)

Você pode “reemprestar” um `&mut T` como `&T` por um tempinho:

```rust
fn main() {
    let mut x = 10;
    let r_mut = &mut x;    // &mut i32
    let r_imm: &i32 = &*r_mut;   // reborrow imutável temporário
    println!("{r_imm}");
    *r_mut += 1;           // volta a usar o mutável
}
```

## 5) Métodos: `&self` vs `&mut self`

```rust
struct Counter { n: i32 }

impl Counter {
    fn peek(&self) -> i32 { self.n }   // só leitura
    fn inc(&mut self) { self.n += 1 }  // altera estado
}

fn main() {
    let mut c = Counter { n: 0 };
    c.inc();
    println!("{}", c.peek());
}
```

## 6) Lifetimes (tempo de vida) em funções que retornam referências

Normalmente o compilador **infere** lifetimes. Às vezes é preciso anotar:

```rust
fn maior<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}
```

Isso diz: a referência retornada vive **pelo menos** tanto quanto `a` e `b`.

> Dica: nunca tente retornar referência para algo criado dentro da função (seria _dangling_). Retorne `String` (ownership) ou referencie argumentos.

## 7) Iteradores e empréstimos

```rust
fn main() {
    let mut v = vec![1, 2, 3];

    for x in v.iter() {            // empresta imutável durante o loop
        println!("{x}");
    }

    for x in v.iter_mut() {        // empresta mutável (um por vez)
        *x *= 2;
    }

    // Dentro de um `iter_mut`, não dá pra empurrar no mesmo `Vec` (conflito de empréstimos).
}
```

## 8) “Quero mutar via `&self`”: Interior Mutability

Quando você precisa mutar por trás de uma referência imutável (ex.: cache/log), use padrões seguros como `RefCell<T>` (thread-único) ou `Mutex<T>` (thread-safe):

```rust
use std::cell::RefCell;

struct Log {
    buf: RefCell<String>,
}
impl Log {
    fn write(&self, s: &str) {     // &self, mas muta internamente
        self.buf.borrow_mut().push_str(s);
    }
}

fn main() {
    let log = Log { buf: RefCell::new(String::new()) };
    log.write("oi");
}
```

---

# Memorizando

- **Java**: tudo é referência por padrão; o GC cuida da vida útil.
    
- **Rust**: por padrão, valores **movem**; você **empresta** explicitamente com `&`/`&mut`. O compilador garante segurança de memória em tempo de compilação.
    

Se quiser, posso adaptar esses exemplos para casos do seu projeto (p.ex., emprestar `&str` em vez de mover `String`, ou usar `&mut` em serviços/ports que atualizam estado).