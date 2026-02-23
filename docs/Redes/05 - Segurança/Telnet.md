
## Visão Geral

**Telnet** (abreviação de *Telecommunication Network*) é um protocolo de rede usado para acesso remoto a dispositivos e servidores através de uma interface de linha de comando.  
Ele foi um dos primeiros protocolos da Internet, permitindo que um usuário controlasse um computador remoto como se estivesse fisicamente presente nele.

---

## Porta Padrão

- **Porta TCP 23**

---

## Funcionamento

1. O cliente inicia uma conexão TCP com o servidor Telnet na porta 23.  
2. Após estabelecida a conexão, o cliente tem acesso a um terminal remoto.  
3. Todos os dados, incluindo credenciais, são transmitidos em **texto simples** (sem criptografia).

---

## Comandos Básicos

| Comando | Descrição |
|----------|------------|
| `telnet <host> <porta>` | Conecta ao host e porta especificados |
| `quit` | Encerra a sessão Telnet |
| `open <host> <porta>` | Abre uma nova conexão |
| `close` | Fecha a conexão atual |
| `status` | Exibe o status da sessão Telnet |

**Exemplo:**
```bash
telnet 192.168.0.10 23
```

---

## Usos Comuns

- Testar **conectividade de rede** e **portas abertas**.
- Acessar **equipamentos de rede** (como roteadores e switches antigos).
- Depurar **serviços de rede** (como SMTP, POP3, HTTP).

**Exemplo de teste de porta SMTP:**
```bash
telnet mail.servidor.com 25
```

---

## Limitações e Riscos

- **Sem criptografia:** todos os dados, inclusive senhas, trafegam em texto simples.  
- **Obsoleto:** substituído por protocolos mais seguros, como o **SSH (Secure Shell)**.  
- **Risco de invasão:** não deve ser usado em redes públicas ou ambientes de produção.

---

## Alternativas Seguras

- **SSH (Secure Shell):** fornece autenticação segura e criptografia de dados.  
- **Netcat (nc):** ferramenta moderna e flexível para testes de rede.

---

## Referências Cruzadas

- [[SSH]]
- [[TCP]]
- [[Protocolos de Rede]]