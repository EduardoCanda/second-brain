---
tags:
  - Fundamentos
  - Cloud
  - NotaPermanente
cloud_provider: aws
---
A AWS é um cloud provider americano que espalhado pelo mundo inteiro, ela oferece uma gama de serviços que podem ser distribuídos por diversos data centers a escolha do cliente e existe uma organização global que divida essa infraestrutura.

# Região

È uma representação ampla de onde os servidores da AWS estão segmentados, ela representa um agrupamento de data centers e estes podem ser representados por um termo conhecido como zona de disponibilidade.

#  Zona de Disponibilidade

Essas zonas representam data centers dentro de uma Região, elas possuem links entre si e geralmente estão proximas em um raio de 100KM uma da outra.

# Zonas Locais

Essas zonas são micro data centers próximos do usuário com conexões em zonas de disponibilidade, seu caso de uso são específicamente para aplicações que precisam de altas performance e baixa latencia.

# AWS Wavelength

È um serviço da Amazon que se instala dentro de provedores de internet movel, nesse caso a Amazon insere sua infra-estrutura física em data centers de provedores e com isso é possível que haja uma velocidade extrema.

# AWS Outposts

Nesse ultimo caso a Amazon pode instalar sua infraestrutura em estruturas on Premise por exemplo, configurando assim uma conexão direta entre a Cloud Pública e o datacenter On Premise por exemplo.