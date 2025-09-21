### Oque é?
O protocolo TCP age na camada de transporte do [[Modelo OSI]]. Este protocolo é utilizado para trocas de pacotes entre cliente e servidor.

Para a conexão acontecer, é necessário o **estabelecimento de conexão**, conhecido como [[Handshake]].

---
### **Transferência de dados (sessão):**  
Durante a **sessão TCP** (após o [[Handshake]]), cliente e servidor precisam garantir que nenhum lado envie mais dados do que o outro pode processar.  Para isso, existe um mecanismo chamado **janela de recepção (receive window)**, que informa **quantos bytes o receptor ainda consegue receber** sem perder dados. 

Essa **adequação de parâmetros** é dinâmica: o tamanho da janela pode **aumentar ou diminuir** dependendo da capacidade momentânea do receptor. Se a janela for **0**, o cliente para de enviar dados e esperar até o servidor enviar um **Window Update**.

**Exemplo prático**:
1. O servidor anuncia que possui **janela de 1024 bytes**.
    
2. O cliente envia **124 bytes**.
    - Agora, a janela do servidor passa a ser **900 bytes livres**.
        
3. Se o cliente tentar enviar **1200 bytes de uma vez**, ele **não poderá** —  
    terá que respeitar o tamanho da janela.  
    Ele envia o que cabe (900 bytes) e **aguarda um novo ACK** do servidor.

Quando o servidor processa os dados recebidos, ele envia um **ACK** de volta ao cliente, **atualizando o valor da janela de recepção** (por exemplo, avisando que tem mais 1024 bytes livres novamente).

---
### Término da ligação:
A fase de encerramento é divida em quatro etapas, em que cada parte(cliente e servidor) se responsabiliza pelo encerramento da sua conexão. No momento, em que uma parte quer encerrar a conexão, é enviado um pacote com a flag FIN ao destino. 
O outro lado responde ao estímulo de término com ACK. A conexão ficará semiaberta em caso de apenas uma parte solicitar o encerramento. Em outras palavras, a parte que mantiver a conexao aberta ainda pode enviar dados, no entanto não receberá dadps de volta porque uma parte já se encerrou.
Por fim, o lado que mantém a conexão aberta pode enviar um pacote com a flag FIN também e o processo de encerramento se repete(FIN-ACK).


