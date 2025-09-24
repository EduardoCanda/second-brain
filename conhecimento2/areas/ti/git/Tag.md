---
tags: []
categoria: versionamento
ferramenta: git
---
No [[Git]], **tags** (ou "etiquetas") são referências estáticas que apontam para um commit específico no histórico do repositório. Elas são frequentemente usadas para marcar versões importantes do projeto, como **releases** (ex.: `v1.0.0`, `v2.3.1`), pois são imutáveis (não se movem quando novos commits são adicionados).

---

### **Tipos de Tags no Git**
1. **Tags Leves (Lightweight Tags)**  
   - São apenas um "ponteiro" para um commit.  
   - Não armazenam metadados adicionais (como autor, data ou mensagem).  
   - Exemplo de criação:  
     ```bash
     git tag v1.0.1
     ```

2. **Tags Anotadas (Annotated Tags)**  
   - Armazenam informações extras: autor, data, mensagem e até uma assinatura GPG.  
   - São objetos completos no Git (úteis para releases públicas).  
   - Exemplo de criação:  
     ```bash
     git tag -a v1.0.0 -m "Versão 1.0.0 estável"
     ```

---

### **Comandos Úteis**
| Comando | Descrição |
|---------|-----------|
| `git tag` | Lista todas as tags. |
| `git tag -l "v1.*"` | Lista tags com filtro (ex.: versões 1.x). |
| `git show v1.0.0` | Mostra detalhes da tag (e do commit associado). |
| `git tag -d v1.0.0` | Deleta uma tag localmente. |
| `git push origin v1.0.0` | Envia uma tag específica para o repositório remoto. |
| `git push origin --tags` | Envia **todas** as tags para o remoto. |
| `git checkout v1.0.0` | "Viaja" no histórico para o commit da tag. |

---

### **Por que Usar Tags?**
- **Versionamento**: Marcar releases (ex.: `v2.5.0`).  
- **Estabilidade**: Referenciar um estado confiável do código.  
- **Deploy**: Facilitar a implantação de versões específicas.  

Exemplo de fluxo com tags:  
```bash
git commit -m "Nova feature"
git tag -a v2.1.0 -m "Release 2.1.0"
git push origin v2.1.0
```

---

### **Diferença entre Tag e [[branch 1]]**
- **Tag**: Congela um momento do histórico (imutável).  
- **Branch**: Ponteiro móvel que avança com novos commits.  

Se precisar corrigir um bug em uma versão antiga, crie um **branch** a partir da tag:  
```bash
git checkout -b hotfix-v1.0 v1.0.0
```

Tags são essenciais para gerenciar versões no Git! 🚀%%  %%