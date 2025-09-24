---
tags:
  - Linux
  - Redes
  - NotaBibliografica
categoria: namespaces
ferramenta: cli
---
O Comando ip netns attach é utilizado quando precisando mover um processo específico para um namespace, o processo é movido e partir disto passa visualizar o contexto de rede do namespace que foi especificado, no caso ele criara um namespace em branco inicialmente, e poderá ser configurado conforme a necessidade

# Exemplos

Movendo um processo de ping para o namespace específicado, o pid é sempre o segundo argumento informado nesse comando.

```bash
sudo ip netns attach namespace1 1000
```

