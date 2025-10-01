DNS (Domain name system)  serve para nos conectar a dispostivos na internet sem que a gente tenha que saber o seu respectivo endereço [[IP]].

---
# Hierarquia dos domínios:
![[Hierarquia de dominios.png]]

### TLD (Top-Level Domain):
O TLD é a parte da direita do domínio. Por exemplo, em "google.com", o TLD é o "**.com**". 

Há dois tipos de TLD:
- **gTLD** (Generic Top Level Domain)
- **ccTLD** (Country Code Top Level Domain)

Historicamente, o gTLD serve para indicar o propósito do domínio. Por exemplo .com, é para fins comerciais, .gov para fins governamentais, .edu para fins educacionais. Com o passar dos anos, a demanda dos sites aumentaram e surgiram outros tipos como .net, .online, .club, .biz e vários outros. Há uma lista completa [aqui](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)

O ccTLD é usado para o propósito geográfico. Por exemplo, .ca são sites do Canada, .br são sites do Brasil e assim por diante.

### Second-Level Domain:
Ainda pegando o site do google.com como exemplo, o TLD é o .com, já o "google" é o Second-Level Domain. Quando vamos registrar um domínio, o Second-Level Domain é limitado até 63 caracteres + o TLD que pode usar a regra de a-z 0-9 e hífens (mas não pode começar ou terminar com hífens ou ter hífens consecutivos)

### Subdomain:
O subdomain é a parte esquerda do Second-Level Domain. Por exemplo no nome "admin.google.com", o "admin" é o subdomain. O subdomain tem as mesmas regras de criação de nomenclatura.

É possível usar múltiplos subdomains, para criação de nomes mais longos. Por exemplo "jupiter.servers.admin.google.com", no entanto o tamanho máximo é de 253 caracteres ou menos. Não há um limite de subdomains para criação de um domain.

---
# Record Types:
DNS não serve apenas para websites. Há múltiplos tipos de registros.
## A Record

## AAAA Record

## CNAME Record

## MX Record

## TXT Record


---
# Como funciona a requisição do DNS?
