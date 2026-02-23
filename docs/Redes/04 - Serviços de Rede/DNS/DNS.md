DNS (Domain name system)  serve para nos conectar a dispostivos na internet sem que a gente tenha que saber o seu respectivo endereço [[IP]].

O DNS utiliza o [[UDP]] para comunicação, para não ficar aguardando conexões TCP. Além disso, o DNS nos devolve o respectivo IP do site que estivermos acessando.

**Ex:**
O site do Google pode ter o IP "54.12.23.444", que se acessado diretamente entraríamos no site; No entanto, decorar os IPs de todos os sites que a gente queira acessar é impossível. Portanto, ao digitar o site "www.google.com", o DNS por sua vez nos devolve o IP.

## Outras funções do DNS:
 - Host aliasing: Basicamente o apontamento de um domínio para o outro;
 - Mail server aliasing: 
 - Load balacing: Balancear a carga entre os servers destino;

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
- Associa um **nome de domínio** a um **endereço IPv4**.  
- Exemplo:  www.exemplo.com → 192.168.1.10

## AAAA Record
- Similar ao **A Record**, mas aponta para um **endereço IPv6**.  
- Exemplo:  www.exemplo.com → 2001:db8::!

## CNAME Record
- Cria um **alias** (apelido) para outro domínio.  
- Muito usado para subdomínios.  
- Exemplo:  blog.exemplo.com → www.exemplo.com

## MX Record
- Define **servidores de e-mail** para o domínio.  
- Inclui prioridade: o servidor com número menor é tentado primeiro.  
- Exemplo:  exemplo.com → mail1.exemplo.com (10) 

## TXT Record
- Armazena **informações de texto** associadas ao domínio.  
- Muito usado para:  
- **SPF** (evitar spam forjado).  
- **DKIM** (assinatura de e-mails).  
- **Verificações de domínio** (Google, Microsoft, etc.).  
- Exemplo:  exemplo.com → "v=spf1 include:_spf.google.com ~all"

## PTR Record
- Associa um **endereço IPv4** a um **nome de domínio** .  
- Exemplo:  192.168.1.10 -> www.google.com


## 📌 Usando comando `host` para parta prática
### Consultar IPv4 e IPv6
```
host www.exemplo.com
```

### Consultar MX Record
```
host -t MX google.com
```

### Consultar TXT Record
```
host -t TXT google.com
```

---
# Como funciona a requisição do DNS?
![[DNS request.png]]

---
## Notas relacionadas:
- [[Packets e Frames]]
- [[TCP]]
- [[IP]]
