---
tags:
  - Fundamentos
  - Cloud
  - NotaBibliografica
  - Redes
categoria_servico: hibrido
cloud_provider: aws
---
Lembre-se: cada NACL tem **regras de entrada** e **regras de saída**, e elas precisam ser configuradas separadamente (porque NACL é _stateless_).

---

# 📄 **Exemplo 1: Subnet pública**

Subnets públicas normalmente precisam permitir tráfego da Internet para HTTP/HTTPS e SSH.

✅ **Regras de entrada:**

|Regra #|Protocolo|Porta|Origem|Ação|
|---|---|---|---|---|
|100|TCP|80|0.0.0.0/0|ALLOW|
|110|TCP|443|0.0.0.0/0|ALLOW|
|120|TCP|22|0.0.0.0/0|ALLOW|
|_default_|ALL|ALL|0.0.0.0/0|DENY|

✅ **Regras de saída:**

|Regra #|Protocolo|Porta|Destino|Ação|
|---|---|---|---|---|
|100|ALL|ALL|0.0.0.0/0|ALLOW|

---

# 📄 **Exemplo 2: Subnet privada**

Para subnets privadas, você normalmente só quer que elas façam chamadas de saída (egress), e não aceitem nada da Internet.

✅ **Regras de entrada:**

|Regra #|Protocolo|Porta|Origem|Ação|
|---|---|---|---|---|
|100|TCP|1024–65535|0.0.0.0/0|ALLOW|
|_default_|ALL|ALL|0.0.0.0/0|DENY|

✅ **Regras de saída:**

|Regra #|Protocolo|Porta|Destino|Ação|
|---|---|---|---|---|
|100|ALL|ALL|0.0.0.0/0|ALLOW|

> Obs.: A entrada na porta alta (1024–65535) é para permitir o retorno das conexões de saída iniciadas pela instância.

---

# 📄 **Exemplo 3: Bloquear um IP específico**

Suponha que você quer bloquear o IP malicioso `198.51.100.23` em toda a subnet.

✅ **Regras de entrada:**

|Regra #|Protocolo|Porta|Origem|Ação|
|---|---|---|---|---|
|100|ALL|ALL|198.51.100.23/32|DENY|
|110|ALL|ALL|0.0.0.0/0|ALLOW|

✅ **Regras de saída:**

|Regra #|Protocolo|Porta|Destino|Ação|
|---|---|---|---|---|
|100|ALL|ALL|0.0.0.0/0|ALLOW|

---

# 📄 **Exemplo 4: Apenas comunicação interna**

Subnet isolada, só permite tráfego de/para a própria VPC (digamos `10.0.0.0/16`).

✅ **Regras de entrada:**

|Regra #|Protocolo|Porta|Origem|Ação|
|---|---|---|---|---|
|100|ALL|ALL|10.0.0.0/16|ALLOW|
|_default_|ALL|ALL|0.0.0.0/0|DENY|

✅ **Regras de saída:**

|Regra #|Protocolo|Porta|Destino|Ação|
|---|---|---|---|---|
|100|ALL|ALL|10.0.0.0/16|ALLOW|
|_default_|ALL|ALL|0.0.0.0/0|DENY|

---

# 📄 **Resumo das práticas:**

- Sempre termine com uma regra implícita de **DENY** (isso já é o padrão).
    
- Use números de regra com intervalos (por exemplo 100, 110, 120) para facilitar ajustes futuros.
    
- Lembre que NACL é stateless → precisa espelhar regras de entrada e saída.
    

---

Se quiser, posso também montar um **diagrama visual** com NACL, Security Groups e Subnets mostrando onde cada um atua. Quer?