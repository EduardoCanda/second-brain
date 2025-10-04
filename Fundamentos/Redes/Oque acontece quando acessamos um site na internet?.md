![[Pasted image 20251003182940.png]]  
  
---  
  
Ao digitar um domínio no navegador, "[google.com](http://google.com)" por exemplo é necessário encontrar o IP correspodente do mesmo. Para isso, o DNS consulta o IP primeiramente no cache local (navegador, sistema operacional e até roteador). Em caso de não encontrar o IP, então o DNS consulta so servidores recursivos, para chegar aos servidores autoritativos e enfim retornar o IP correspodente ao domínio.  
  
Com o IP encontrado, a requisição pode passar por um Web Application Firewall, uma camada de segurança que bloqueia requisições maliciosas. Por exemplo [[SQL Injection]], [[XSS]] .
  
Passando o Firewall, a requisição passa por um Load Balancer, responsável por direcionar o tráfego para o servidor menos ocupado.  
  
O tráfego conecta na porta 80(http) ou 443(https), para acessar ao servidor da aplicação. A aplicação devolverá seu contéudo que pode ter passado por um banco de dados para devolver a página em HTML ou simplesmente devolver os arquivos estáticos HTML e CSS.  
Por fim, o site é exibido no navegador.  
  
---  
### Notas relacionadas:  
- [[DNS]]
- [[WAF]]
- [[Load Balancer]]
- [[IP]]
- [[TCP]]
- [[Portas Mais Conhecidas]]
- [[TLS]]
- [[SSL]]
