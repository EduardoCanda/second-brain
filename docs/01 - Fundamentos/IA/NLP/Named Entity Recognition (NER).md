# Named Entity Recognition (NER)

## Definição clara
NER é a tarefa de NLP que identifica e classifica entidades no texto, como pessoas, organizações, locais, datas e valores.

## Explicação conceitual
Para engenharia de software, NER estrutura texto não estruturado e permite automações orientadas a entidades de negócio.

## Como funciona internamente
1. Texto tokenizado.
2. Modelo contextual gera representação por token.
3. Camada de classificação rotula cada token (BIO/BILOU).
4. Tokens consecutivos formam entidades completas.

## Exemplos práticos
- Extração de cliente/produto em tickets.
- Parsing de contratos.
- Enriquecimento de logs e documentos.

## Quando usar
- Quando entidades são centrais para regras de negócio.
- Para transformar texto em registros estruturados.
- Em pipelines de compliance e auditoria.

## Limitações
- Sensível a domínio e idioma.
- Erros com ambiguidade contextual.
- Requer adaptação para vocabulário específico da empresa.

## Relação com outros conceitos
- Depende de [Tokenização e Embeddings](Tokeniza%C3%A7%C3%A3o%20e%20Embeddings.md).
- Pode usar [Transformers](../Deep%20Learning/Transformers.md) fine-tunados.
- Métricas de qualidade seguem [Métricas de Avaliação em Machine Learning](../Machine%20Learning/M%C3%A9tricas%20de%20Avalia%C3%A7%C3%A3o%20em%20Machine%20Learning.md).

## Exemplos em Python quando aplicável
```python
import spacy

nlp = spacy.load("pt_core_news_sm")
doc = nlp("A Nubank anunciou parceria com a OpenAI em São Paulo.")

for ent in doc.ents:
    print(ent.text, ent.label_)
```
