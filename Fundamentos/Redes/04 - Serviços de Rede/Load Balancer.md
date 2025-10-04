Quando uma aplicação começa a receber muitas requisições, é natural que um servidor só não aguente a demanda, portanto terá uma réplica dele para dividir o tráfego.  
  
Então quando a aplicação possui um **Load Balancer**, a requisição será recebida por ele primeiro e enviará a mesma para um dos servidores.  
  
O Load Balancer usa diferentes algoritmos para decidir qual servidor receberá a requisição. [[Round-robin]] e [[Weighted]] são exemplos de algoritmos utilizados. Em cada um deles há diferentes regras levadas em consideração para passar a requisição ao servidor menos ocupado.  
  
Periocamente, os Load Balancers também fazem chegagens para saber a saúde dos servidores, isso se chama **Health check**. Com base nas checagens, se um servidor não responder apropriadamente, o tráfego não será mais direcionado a ele até que se ele se estabeleça novamente.

![[Pasted image 20251003202154.png]]