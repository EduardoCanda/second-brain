---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
categoria_servico: paas
cloud_provider: aws
---
## 🧠 **O que é Lambda@Edge? (Revisão rápida)**

Lambda@Edge é uma extensão do AWS [[Lambda Detalhes|Lambda]] que permite executar funções **nas edge locations** da AWS, por meio do **Amazon CloudFront**. Ele é usado para **modificar requisições e respostas HTTP** antes que elas atinjam o backend, ou depois que saem dele.

> Ele se integra ao pipeline do CloudFront para processar as requisições em quatro pontos estratégicos:
> 
> 
> `Viewer Request`, `Origin Request`, `Origin Response`, `Viewer Response`.
> 

---

## ☁️ **O que é CloudFront Functions?**

**CloudFront Functions** é uma alternativa mais leve e performática ao Lambda@Edge, lançada pela AWS para **casos de uso extremamente rápidos e simples**, como reescrita de URLs, redirecionamentos e headers HTTP.

A grande diferença está em **performance, custo e capacidade computacional**.

---

## ⚖️ **Comparativo técnico: Lambda@Edge vs CloudFront Functions**

| Característica | Lambda@Edge | CloudFront Functions |
| --- | --- | --- |
| **Fase de execução** | Todas as 4 fases do CloudFront | Apenas **Viewer Request** e **Viewer Response** |
| **Linguagem suportada** | Node.js, Python | Apenas JavaScript (ECMAScript 5.1) |
| **Tempo máximo de execução** | **5 segundos** | **1 milissegundo** |
| **Tamanho do código** | Até 1 MB (compactado) | Até 10 KB |
| **Recursos disponíveis** | Acesso a contextos ricos, parsing, regex | Suporte limitado (sem acesso a rede, tempo, etc.) |
| **Permite chamadas externas?** | ❌ (restrito na borda) | ❌ (nenhum acesso a rede) |
| **Custos** | Mais caro, por invocação e tempo | Muito barato e otimizado para alto volume |
| **Ideal para** | Lógica moderada (JWT, geo, A/B testing) | Reescrita de URL, redirecionamento, headers |
| **Tempo de deploy** | Até 15 minutos para propagação global | Alguns segundos |

---

## 🎯 **Quando usar cada um?**

### Use **CloudFront Functions** quando:

- Precisa de **performance máxima e custo mínimo**
- A lógica é simples e baseada apenas na requisição/resposta
- Exemplo: reescrever URL de `/blog` para `/pt/blog`, redirecionar por `User-Agent`, adicionar headers de segurança básicos

### Use **Lambda@Edge** quando:

- Precisa de lógica **mais complexa**
- Precisa atuar em mais de uma fase (ex: `Origin Request`)
- Precisa decodificar/validar tokens, fazer parsing profundo, aplicar regras condicionais mais elaboradas
- Exemplo: validar **JWT no header**, aplicar redirecionamento **geográfico com fallback**, simular feature flags com base no caminho ou cookie

---

## 🔐 **Exemplo prático de decisão (bancário)**

### 🔸 CloudFront Functions:

> Redirecionar usuários de países não suportados para uma página de aviso (baseado em CloudFront-Viewer-Country)
> 

### 🔸 Lambda@Edge:

> Validar um token JWT assinado em Authorization, extrair o sub, e bloquear o acesso à API caso o cliente esteja com restrição PJ — tudo sem atingir o backend.
> 

---

## ✅ **Conclusão para entrevista**

> “CloudFront Functions e Lambda@Edge são duas formas de executar lógica na borda da rede, mas com propósitos diferentes. CloudFront Functions é ideal para tarefas leves, rápidas e de alto volume, como redirecionamentos e headers simples, enquanto Lambda@Edge é indicado para lógica mais rica, como validação de tokens, geolocalização com fallback, personalização de conteúdo e A/B testing. Já usei os dois em projetos — inclusive combinando ambos: CloudFront Function para pré-filtragem e Lambda@Edge para validação mais pesada. Essa separação ajuda a otimizar custo, performance e manutenibilidade.”
> 


