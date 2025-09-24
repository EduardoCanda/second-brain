---
tags:
  - Kubernetes
  - NotaPermanente
  - SRE
  - todo
categoria: metricas
ferramenta: prometheus-operator
---
<span style="color:yellow">
Não misturar conceitos de grafana, isso tem atrapalhado o aprendizado, focar no prometheus!!!, SERVIDOR, SERVIDOR!!! Formas de gerenciar e operar
</span> 

- [x] Estabilizar chart kube-prometheus-stack, entendendo como os campos funcionam porém declarando somente o necessário!, será necessário implementar uma forma de consultar rápidamente os valores e suas responsabilidades. ✅ 2025-08-30
> Depois de muito explorar o chart descobri uma maneira eficiente de gerenciar ele e tornalo mais "visivel", criei um diretório para ter referencia dos valores, porém para uma compreensão mais ampla irei criar uma documentação do [[instalacao-prometheus-kube-stack|helm chart]]
- [x] Entender como funciona o processo de retenção ✅ 2025-08-26
- [x] Entender detalhadamente como funciona o statefulset criado pelo CRD Prometheus ✅ 2025-08-25
- [x] Entender como funciona [[servicemonitor-crd|CRD Service Monitor]] ✅ 2025-08-24

> Esse sem dúvidas é o CRD Mais útil dentro os aqui citados, ele tem uma ampla diversidade de variedades de alto nível(se comparado ao PodMonitor), porém pensando em cluster Kubernetes ele servirá para 99% dos casos, (algumas excessões utiliza-se o pod monitor, e algumas mega excessões utilliza-se o ScrapeConfig)

- [x] Entender como funciona [[scrape-config-crd|ScrapeConfig CRD]] ✅ 2025-08-24

> Esse CRD é útil para configurações manuais de scaping, por exemplo, integrar com alvos fora do cluster kubernetes. Isso pode ser útill em alguns casos, como monitorar serviços externos importantes que estão fora do nosso controle.

- [x] Entender como funciona [[podmonitor-crd|CRD Pod Monitor]] ✅ 2025-08-24

> Esse CRD é útil para gerenciar configurações diretamente associadas a pods, pois em alguns casos não é possível ter um service escutando pods, sendo necessária a intervenção diretamente nos pods.
> 
- [x] Entender como funciona [[prometheus-crd|CRD Prometheus]] ✅ 2025-08-24

> Esse CRD é o principal por se tratar do responsável por criar a instância do prometheus e gerenciar todos os outros CRD(por exemplo configuracoes de serviceMonitorSelector e serviceMonitorNamespaceSelector, podMonitorSelector, podMonitorNamespaceSelector), por ele é possível configurar a quantidade de memória que será utilizada pela instancia do prometheus, tempo de retenção das metricas, configuração do serviço, configuração do httproute, entre outras configurações.

- [x] Entender como expor externamente o prometheus(Por mais que não seja recomendado) ✅ 2025-08-16

> Foi realizada a exposição via [[gateway-api]], criando um [[httproute]] e associando o mesmo a um [[listener]]

- [x] Configurar [[certificado-digital]] ([[protocolo-tls|TLS]]) para o servidor [[prometheus]], onde o [[grafana]] precisara do público para receber dados(verificar ganhos em performance) ✅ 2025-08-22

> Esse mecanismo não é necessário objetivamente falando, isso ocorre por conta que é possível expor externamente o prometheus via Gateway api(isso foi feito), e caso seja necessário uma cifragem na comunicação interna do cluster o mais indicado sem dúvidas é utilizar um service mesh como [[Linkerd]], de uma forma muito mais produtiva e simplificada.

- [x] Criar um repositório separado para o gateway criado para expor o prometheus ✅ 2025-08-22

> Gateway criado com sucesso, uma melhoria no ponto de vista operacional é criar um gateway por domínio, isso pode facilitar muito em relação aos [[boas-praticas-gateway|boas práticas sugeridas]].

