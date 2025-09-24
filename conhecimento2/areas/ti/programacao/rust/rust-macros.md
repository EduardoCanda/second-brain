---
tags:
  - Fundamentos
  - Programacao
  - NotaBibliografica
linguagem: Rust
---
Perfeito, vamos “destravar” isso com calma. Vou separar em blocos curtos e exemplificar.

# 1) O que é **AST** (Abstract Syntax Tree)?

Quando você escreve código, o compilador segue (simplificando) este fluxo:

```
texto → [lexing] → tokens → [parsing] → AST → [expansão de macros] → AST expandida
    → [resolução de nomes / tipos] → HIR/MIR → LLVM → binário
```

- **Tokens**: pedaços léxicos (`fn`, `ident`, `{`, `}`, `+`, números, etc.).
    
- **AST**: uma **árvore** que representa a estrutura **sintática** do seu programa: nós como `ItemFn`, `ItemStruct`, `ExprCall`, `ExprIf`, `TypePath`, etc.
    
- Pense na AST como um “JSON” estrutural do seu código, **antes** de checagem de tipos.
    

Exemplo (mental) de AST para:

```rust
fn soma(a: i32, b: i32) -> i32 { a + b }
```

A AST teria um nó `ItemFn` com:

- nome: `soma`
    
- params: `a: i32`, `b: i32`
    
- retorno: `i32`
    
- corpo: um `ExprBinary` representando `a + b`
    

> Importante: macros atuam **antes** da parte “semântica/tipagem**; elas mexem nos **tokens/AST sintática** e geram mais código.

---

# 2) O que é **macro** em Rust?

**Macro** = mecanismo de **geração/transformação de código** em tempo de compilação (fase de expansão).  
Objetivos:

- Evitar repetição/boilerplate,
    
- Criar sintaxe conveniente (mini-DSL),
    
- Fazer coisas que funções não fazem (ex.: aceitar **número variável de argumentos**).
    

Existem **dois grandes tipos**:

1. **Macros declarativas**: `macro_rules!`
    
    - Funcionam como um “`match` de tokens”: você **casa padrões** e **expande** em código.
        
    - Trabalham com **Token Trees** (TT), não com tipos.
        
2. **Macros procedurais** (precisam de crate `proc-macro`):
    
    - **`#[derive(TraitX)]`** (_derive-like_): recebem o item e **geram `impl`** de uma trait.
        
    - **`#[attr(...)]`** (_attribute-like_): recebem o item anotado e **o transformam**.
        
    - **`nome!(...)`** (_function-like_): parecem função, mas **geram código**.
        

---

# 3) Macros **declarativas** (`macro_rules!`) — o “match de tokens”

## Anatomia

```rust
macro_rules! nome {
    ( PADRÃO_1 ) => { EXPANSÃO_1 };
    ( PADRÃO_2 ) => { EXPANSÃO_2 };
    // ...
}
```

- **Matchers** (capturas) comuns:
    
    - `$x:expr` (expressão), `$i:ident` (identificador), `$t:ty` (tipo),
        
    - `$p:pat` (padrão), `$l:lifetime`, `$path:path`, `$tt:tt` (qualquer token).
        
- **Repetição**:
    
    - `$( ... ),*` → repete com vírgula, 0 ou + vezes
        
    - `$( ... );*` → repete com `;`
        
    - `+` = 1 ou mais, `*` = 0 ou mais
        

## Exemplo 1 — varargs simples

```rust
macro_rules! soma {
    ( $( $n:expr ),* ) => {{
        let mut total = 0;
        $( total += $n; )*
        total
    }};
}
fn main() {
    assert_eq!(soma!(1, 2, 3), 6);
}
```

## Exemplo 2 — DSL leve

```rust
macro_rules! log_if {
    (level: $lvl:ident, $($args:tt)+) => {{
        if cfg!(feature = "log") {
            println!("[{}] {}", stringify!($lvl), format!($($args)+));
        }
    }};
}
fn main() {
    log_if!(level: INFO, "user id={}", 42);
}
```

- `stringify!(INFO)` → `"INFO"` em compile-time.
    
- `$($args:tt)+` captura **qualquer sequência** de tokens, 1+ vezes (como `println!`).
    

## Higiene (macro hygiene)

- Macros são “**higiênicas**”: nomes internos não “colidem” com variáveis do chamador.
    
- Para referenciar itens do seu próprio crate dentro de uma macro de biblioteca, use **`$crate::`** (garante caminho correto).
    

## Dicas de depuração

- Instale `cargo expand` e rode `cargo expand` para **ver o código expandido**.  
    Isso clareia mensagens de erro que parecem “misteriosas”.
    

---

# 4) Macros **procedurais** — quando `macro_rules!` não basta

São **funções** especiais (em um crate com `proc-macro = true`) que recebem `TokenStream` (tokens) e devolvem `TokenStream`. Normalmente você usa as libs **`syn`** (parse AST) e **`quote`** (gerar código).

Três sabores:

## 4.1 `#[derive(...)]` (_derive-like_)

Quando você escreve:

```rust
#[derive(Debug, Clone, PartialEq)]
struct Pessoa { nome: String, idade: u32 }
```

- Cada item do `derive(...)` invoca uma **proc-macro** registrada (por ex., a da `Debug`).
    
- Ela lê a **estrutura** (campos, tipos) e **gera** `impl Debug for Pessoa { ... }`.
    

### Exemplo mínimo (visão geral)

Crate `meu_derive` (proc-macro):

```rust
// Cargo.toml: [lib] proc-macro = true
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(ToCsv)]
pub fn to_csv(input: TokenStream) -> TokenStream {
    let item = parse_macro_input!(input as DeriveInput);
    let nome = &item.ident;
    let gen = quote! {
        impl ToCsv for #nome {
            fn to_csv(&self) -> String {
                String::new() // aqui você geraria usando os campos (via syn)
            }
        }
    };
    gen.into()
}
```

Crate usuário:

```rust
use meu_derive::ToCsv;
trait ToCsv { fn to_csv(&self) -> String; }

#[derive(ToCsv)]
struct Pessoa { nome: String, idade: u32 }
```

> **Observação**: Proc-macros **ficam em um crate do tipo `proc-macro`** e, em geral, são usadas a partir **de outro crate** que as importa.

## 4.2 `#[meu_attr]` (_attribute-like_)

Transforma itens anotados:

```rust
#[trace]
fn f(x: i32) -> i32 { x + 1 }
```

A macro pode envolver o corpo em logs, checagens, gerar código adicional, etc.

## 4.3 `minha_macro!(...)` (_function-like_)

Chamadas estilo função, mas geram código:

```rust
json_map! { "a": 1, "b": 2 } // você parseia tokens e gera um mapa
```

Útil para **DSLs** mais ricas (como `serde_json::json!`), onde `macro_rules!` já não é confortável.

---

# 5) **Token Tree** vs **AST** (por que isso importa?)

- **Token Tree (TT)**: sequência hierárquica de tokens (delimitadores `() [] {}` formam subárvores), **sem** entender tipos.
    
    - `macro_rules!` casa **padrões de TT**.
        
- **AST**: estrutura sintática rica (nós como `ExprCall`, `TypePath`).
    
    - Proc-macros recebem **TokenStream**; elas **podem** convertê-lo para AST com `syn` (se quiserem entender campos, tipos sintáticos, atributos, etc.).
        

Resumo:

- `macro_rules!` = regras léxicas/sintáticas leves em **TT**.
    
- Proc-macro = você pode **parsear para AST**, inspecionar, e **gerar** código complexo.
    

---

# 6) Quando usar **macro** vs **funções genéricas/traits**?

Use **funções/traits** quando:

- Uma função genérica expressa bem a intenção;
    
- Você quer **erros de tipo** mais claros e melhor IDE/auto-complete;
    
- Não precisa de varargs ou DSL.
    

Use **macros** quando:

- Precisa de **varargs** (ex.: `println!`, `vec!`);
    
- Quer **eliminar boilerplate** repetitivo (gerar muitos `impl`s parecidos);
    
- Precisa de **DSL** (ex.: `serde_json::json!`, `sqlx::query!`);
    
- Quer **customizar sintaxe** além do que funções permitem.
    

---

# 7) Armadilhas e boas práticas

- **Mensagens de erro**: podem ficar menos claras — compense com bons exemplos na doc e `cargo expand`.
    
- **Parênteses/virgulas**: defina bem os padrões; aceite **vírgula final** quando fizer sentido.
    
- **Side effects/ordem de avaliação**: macros expandem texto; a avaliação é do resultado — não confie em “atalhos mágicos”.
    
- **`$crate::`** em bibliotecas para endereçar caminhos internos de forma robusta.
    
- **Teste** macros com vários casos (incluindo erros) e documente.
    

---

# 8) `#[derive(...)]` por dentro (mais didático)

Quando você escreve:

```rust
#[derive(Debug)]
struct X { a: i32 }
```

A pipeline faz:

1. Encontra `derive(Debug)` → há uma **proc-macro** registrada para `Debug`?
    
2. Passa os **tokens** da `struct X { a: i32 }` para a macro.
    
3. A macro **lê** (via `syn`) os campos e **gera** algo como:
    
    ```rust
    impl ::core::fmt::Debug for X {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            // corpo gerado
        }
    }
    ```
    
4. O compilador segue com a AST **expandida** e só depois faz **tipagem/borrow checker**.
    

> Por isso `#[derive(...)]` é incrivelmente útil: você não escreve manualmente dezenas de `impl`s.

---

# 9) Glossário rápido

- **Lexing**: quebrar texto em tokens.
    
- **Parsing**: transformar tokens em **AST**.
    
- **Token Tree (TT)**: agrupamento hierárquico de tokens pelos delimitadores.
    
- **AST**: representação sintática em árvore.
    
- **Expansão de macros**: etapa que substitui macros por **código gerado**.
    
- **Higiene**: isolamento de nomes gerados pela macro.
    
- **`syn`/`quote`**: libs para proc-macros (parse AST / gerar código).
    

---

Se você quiser, eu monto **dois exemplos completos** na sequência:

1. Um `macro_rules!` com múltiplos braços (inclui vírgula opcional, erros de uso), e
    
2. Um `#[derive(ToCsv)]` real que percorre os **campos** com `syn` e gera um `impl` de verdade.  
    É só falar que já trago os códigos.