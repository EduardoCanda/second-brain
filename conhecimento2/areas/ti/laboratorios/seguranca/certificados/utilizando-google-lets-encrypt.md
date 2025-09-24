---
tags:
  - Segurança
  - NotaPermanente
categoria: criptografia
ferramenta: openssl
---
Quando utilizamos o lets encrypt para gerar [[certificado-digital|certificados digitais]], precisamos de uma ferramenta para nos auxiliar no processo de validação, isso é, se o registro do tipo TXT realmente já está sendo emitido pelo servidor [[protocolo-dns|DNS]], e para isso temos uma ferramenta útil que pode nos ajudar a identificar se já está disponível.

Isso é importante pois ao utilizar o certbot por exemplo, caso o registro não esteja públicado na web teremos problemas e perderemos todo o processo, havendo risco de ter que aguardar o servidor limpar o cache(isso pode demorar um tempo).

[Google ToolBox](https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.lucasberti.com.br)