---
tags:
  - Linux
  - Redes
  - NotaBibliografica
ferramenta: cli
---
O comando **`nmcli general logging`** no Linux é usado para **configurar e visualizar os níveis de registro (logs) do NetworkManager**, o serviço que gerencia conexões de rede em muitas distribuições modernas (como Ubuntu, Fedora e RHEL).  

---

## **Para que serve?**  
- **Ajustar o nível de detalhes dos logs** do NetworkManager (útil para depuração de problemas de rede).  
- **Verificar o nível atual de logging** (para entender quanto detalhe está sendo registrado).  
- **Redefinir os logs para o padrão** (se você modificou e quer voltar ao normal).  

---

## **Sintaxe Básica**  
```bash
nmcli general logging [nível] [domínios]
```
- **`[nível]`** → Define o nível de detalhe dos logs (ex.: `ERR`, `INFO`, `DEBUG`).  
- **`[domínios]`** → Filtra quais componentes do NetworkManager serão logados (opcional).  

---

## **Níveis de Log (do menos para o mais detalhado)**  
| Nível     | Descrição                                                                 |
|-----------|--------------------------------------------------------------------------|
| **`OFF`**   | Desativa todos os logs.                                                  |
| **`ERR`**   | Mostra apenas **erros críticos**.                                        |
| **`WARN`**  | Registra **avisos** e erros.                                             |
| **`INFO`**  | Padrão. Mostra **informações básicas** sobre conexões.                   |
| **`DEBUG`** | **Modo detalhado** (útil para solucionar problemas complexos de rede).   |

---

## **Exemplos de Uso**  

### 1️⃣ **Ver o nível atual de logging**  
```bash
nmcli general logging
```
**Saída exemplo:**  
```
LEVEL  DOMAINS  
INFO   PLATFORM,RFKILL,ETHER,WIFI 
```

### 2️⃣ **Aumentar o nível de log para DEBUG (máximo detalhe)**  
```bash
nmcli general logging level DEBUG domains ALL
```
- `level DEBUG` → Ativa logs detalhados.  
- `domains ALL` → Aplica a todos os componentes (opcional).  

### 3️⃣ **Voltar ao padrão (INFO)**  
```bash
nmcli general logging level INFO
```

### 4️⃣ **Desativar logs completamente**  
```bash
nmcli general logging level OFF
```

---

## **Onde os logs são armazenados?**  
Depende da distribuição, mas geralmente ficam em:  
- **Systemd (journald)**:  
  ```bash
  journalctl -u NetworkManager
  ```
- **Arquivo de log tradicional (em algumas distros)**:  
  ```bash
  cat /var/log/syslog | grep NetworkManager
  ```

---

## **Quando usar?**  
✔ **Problemas de conexão WiFi/Ethernet** (para ver mensagens de erro detalhadas).  
✔ **Depuração de falhas no NetworkManager**.  
✔ **Verificar se um serviço de rede está sendo inicializado corretamente**.  

⚠ **Cuidado:** Logs em `DEBUG` podem gerar **muita informação** e ocupar espaço em disco. Use apenas quando necessário!  

---

## **Resetar Configurações Padrão**  
Se você modificou algo e quer voltar ao original:  
```bash
nmcli general logging reset
```

Quer filtrar logs de um domínio específico (ex.: apenas WiFi)? Posso te ajudar com isso! 😊