---
tags:
  - Kubernetes
  - NotaPermanente
  - todo
ferramenta: gatewayapi
---
- [x] Entender como funciona o controlador do [[exemplo-ngf|Gateway API(NGINX)]] ✅ 2025-08-19

> Aqui existe espaço para o aprendizado uma vez que existe uma gama de possibilidades a serem implementadas, necessário aprofundamento!

- [x] Implementar Listeners com Dominios alternativos ✅ 2025-08-19
- [x] Adicionar [[protocolo-dns|DNS]] dinamicos para utilizar nos listeners ✅ 2025-08-19

> Para complementar foi necessário adicionar um host no arquivo /etc/hosts do linux, porém em um cenário real isso não é necessário.
	
- [x] Implementar solução para resolver problema de [[certificado-digital|tls]] devido ao alias utilizado no helm chart ✅ 2025-08-19

> A solução foi implementada removendo o alias do chart, ao inspecionar o certificado, ficou constatado que ele foi gerado com o nome do serviço contendo um prefixo equivalente ao alias do chart, porém o serviço não tinha esse prefixo, ocasionando erro ao gerar o controller no data plane do service.

> Parte de solução foi excluir os certificados gerados com o prefixo para quando a instalação do helm chart for iniciada, gerar novos certificados no namespace(uma vez que ela verifica se já existe e não gera)

> Para identificar o problema foi necessário obter os logs do controller gerado pelo fabric, e nesses logs tinha o erro.
	
- [x] Implementar solução para httproute referenciar listener com hostname correto, via ✅ 2025-08-19
- [x] Implementar solução para coletar metrics do nginx ✅ 2025-08-22

> Foi implementado a coleta de metrica utilizando [[servicemonitor-crd|Service Monitor]], para isso foi necessário entender como um service monitor é considerado válido(serviceMonitorSelector)

- [x] Integrar gateway a internet via registro.br ✅ 2025-08-23
> Foi necessária a criação de um registro público, isso me custou 40 reais por ano, e houve um trabalho adicional por conta do tempo necessário para criação
- [x] Integrar TLS com certificado público referenciando o dns criado no registro.br ✅ 2025-08-23
> Essa configuração foi um achado!, consegui realizar toda configuração de forma 100% gratuíta utilizando a ferramenta lets encrypt.
- [x] Validar de computador no DMZ deixa todas portas exportadas ✅ 2025-08-24

> Validado e é necessário port-forward para efetivamente haver exposição na internet.

- [x] Detalhar httproutes e funcionalidades correlatas, por exemplo hostnames! ✅ 2025-08-30
> Foi criadas httproutes para o argocd, prometheus e grafana!