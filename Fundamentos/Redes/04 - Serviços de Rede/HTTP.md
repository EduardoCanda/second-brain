HTTP (Hypertext Transfer Protocol)
Este protocolo é a base de comunicação da World Wide Web, reside na camada de aplicação do [[Modelo OSI]]. A comunicação é composta por cliente-servidor, onde o cliente pode ser um navegador por exemplo, e o servidor pode ser um host onde um site está hospedado, entregando seu conteúdo em HTML.

# HTTPS
É a versão segura do HTTP, onde os dados trafegados agora são criptografados.

---
# Request e Response:
Para acessarmos um webserver por exemplo, o browser precisa fazer a requisição para receber de volta o conteúdo HTML, imagens etc. Para isso, é necessário dizer onde buscar o conteúdo. Para isso a **URL** vai ajudar.

### URL (Uniform Resource Locator):
Todos que acessam a internet, usam a URL. A URL predominantemente serve como um meio de como acessar a internet.

Abaixo todas as features da URL (Mas não usamos todas necessariamente na requisição)
(imagem)

**scheme**:

**user**:

**host**:

**port**:

**path**:

**query string**:

**fragment**:

### Fazendo a requisição:
É possível fazer a requisição com apenas uma linha:
        GET / HTTP/1.1

(imagem)

Mas para obter uma experiência mais rica, é necessário informar os [[Headers]]

Exemplo de resquest:
        GET / HTTP/1.1

        Host: tryhackme.com
        User-Agent: Mozilla/5.0 Firefox/87.0
        Referer: https://tryhackme.com/

Exemplo de response:
        HTTP/1.1 200 OK
        
        Server: nginx/1.15.8
        Date: Fri, 09 Apr 2021 13:34:03 GMT
        Content-Type: text/html
        Content-Length: 98
        
        
        <html>
        <head>
            <title>TryHackMe</title>
        </head>
        <body>
            Welcome To TryHackMe.com
        </body>
        </html>

---
# HTTP Methods:
HTTP methods are a way for the client to show their intended action when making an HTTP request. There are a lot of HTTP methods but we'll cover the most common ones, although mostly you'll deal with the GET and POST method.

GET Request
This is used for getting information from a web server.

POST Request
This is used for submitting data to the web server and potentially creating new records

PUT Request
This is used for submitting data to a web server to update information

DELETE Request
This is used for deleting information/records from a web server.

---

# HTTP Status Code

---

# Headers:

---

# 

---
