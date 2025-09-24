---
tags:
  - Fundamentos
  - SRE
  - NotaPermanente
---
Pensar SRE(Site Reability Engineering) é pensar em performance, escalabilidade, arquitetura, engenharia e segurança da informação, é uma área de encapsula uma série de outras áreas e a sua composição composto por uma série de boas práticas é fundamental para o ambiente de tecnologia.

Um ponto importante a se ponderar no SRE é seus pilares, e aqui estão todos eles [[tres-pilares-sre]], com isso é possível coletar e montar uma série de alertas, dashboards entre outras formas de monitoramento contínuo, porém somente entender eles não será de total utilidade, precisando de complementos como [[percentils]] entre outras boas práticas como [[monitoramento-proativo-reativo]].

Uma dos principais temas a serem estudados são os [[golden-signals]] do SRE, eles irão guiar sua jornada em atividades de gestão de crise, e com eles será possível elaborar muitos [[sli-slo-sla]] para manter um nível de serviço alinhados com o time de negócios, além de auxiliar na definição de [[slo-servico-critico]].

Em muitos casos os monitoramentos proativo pode ajudar previnir possíveis problemas no sistema, por exemplo uma alta abrupta no trafego de 50%, alertando a equipe SRE que houve um cenário não previsto, ou até executando alguma ação preditiva, além de auxiliar em um possível [[post-mortem|post mortem]].

È importante ressaltar que esse contexto pode abordar diversas problematicas inclusas ao usar tecnologia [[AWS|Cloud]], então é extremamte importante mensurar toda infra-estrutura e serviços que serão monitorados e abordar também toda complexidade inclusa com esse cenário.