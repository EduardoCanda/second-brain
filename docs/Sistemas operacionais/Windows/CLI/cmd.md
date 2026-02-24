## Informações básicas do sistema:

O comando **set** serve para demonstrar todas variáveis de ambiente do Windows
```bash
set
```

**systeminfo**, demonstra as infomações do sistema operacional
```bash
systeminfo
```

**ver**, apresenta a versão do sistema operacional
```bash
ver
```

---
## Network Troubleshooting:
Para checagem das informações de rede, usamos **ipconfig**. O output do comando mostrará o IP, subnet mask e o default gateway.

```bash
ipconfig
```

Também há a variação do comando para obter mais informações, como os servidores [DNS](../../../Redes/04 - Serviços de Rede/DNS/DNS.md) e confirmar se o [DHCP](../../../Redes/04 - Serviços de Rede/DHCP.md) está habilitado.

```bash
ipconfig /all
```

Uma abordagem muito comum é a checagem se o servidor consegue acessar outro servidor exposto a internet. Para isso usamos o comando **ping** para enviar um pacote [ICMP](../../../Redes/03 - Protocolos/ICMP.md) e ouvir a resposta.

```bash
ping example.com
```

Para trace de rede, podemos utilizar o **tracert**. Ele mostra por onde os pacotes passam até chegar em nosso destino final.

```bash
tracert example.com
```

Para consultar o endereço [IP](../../../Redes/03 - Protocolos/IP.md) de um servidor, podemos usar o **nslookup**

```bash
nslookup example.com
```

Para consultar as conexões atuais e as portas, podemos usar o **netstat**.
```bash
netstat
```

Ele também possui algumas flags para enriquecer a consulta:
- `-a` displays all established connections and listening ports
- `-b` shows the program associated with each listening port and established connection
- `-o` reveals the process ID (PID) associated with the connection
- `-n` uses a numerical form for addresses and port numbers

---
## Arquivos e Gerenciamento de Disco:

### Trabalhando com diretórios:
Para navegar entre um diretório e outro, basta usarmos o comando **cd** para trocar. Tanto diretórios "para cima" como "para baixo".
Para listar oque há dentro de diretório, o comando **dir** é o apropriado.
### Trabalhando com arquivos:
Para visualizar o conteúdo de um arquivo, podemos usar o **type nome_arquivo**, no entanto é recomendável para arquivos pequenos. Em caso de visualizar um arquivo com muitas linhas, é mais indicado o comando **more nome_arquivo**.

O comando **copy** permite copiar arquivos para outros arquivos (inclusive, passando o path do novo arquivo). E em caso de mover o arquivo para outro local, o **move** é o comando.

---
## Tarefas e gerenciamento de processos:
Normalmente utilzamos o MS Windows **Task Manager** para isso, no entanto o comando equivalente é o **tasklist**. Ele apresenta quais tasks estão rodando no sistema e o quanto de recurso computacional cada task está utilizando.

```bash
tasklist
```

Normalmente este comando irá trazer um output grande, devido a apresentação de diversos processos rodando no sistema. É possível fazer o filtro de algum processo específico pelo nome dele. Um exemplo procurando o programa notepad.

```bash
tasklist /FI "imagename eq notepad.exe"
```

E em caso de querer *matar* uma tarefa, podemos utilizar o comando **taskkill** passando qual é o **PID** do processo.

```bash
taskkill /PID 1516
```

---
