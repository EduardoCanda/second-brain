---
tags:
  - Kubernetes
  - NotaBibliografica
  - SRE
categoria: metricas
ferramenta: prometheus-operator
---
Em essência: **sim, a principal “mão na roda” do [[instalacao-prometheus-kube-stack|kube-prometheus-stack]] em relação ao [[Grafana]] é entregar tudo pronto** — **datasource do Prometheus já configurado + um pacote grande de dashboards curados** ([[Kubernetes]], [[node-exporter]], kube-state-metrics, etc.), todos **provisionados via sidecar** a partir de [[configmap|ConfigMaps]]. Mas não é só isso: o stack também traz **regras/alertas padrão**, [[servicemonitor-crd|ServiceMonitors]]/[[podmonitor-crd|PodMonitors]] para componentes do cluster e todo o “fio” entre Operator → [[Prometheus]] → [[Alertmanager]] → [[Grafana]] funcionando out-of-the-box.

### O que ele faz de prático para o Grafana

- **Inclui o [[helm-charts|chart]] oficial do Grafana** como dependência (quando `grafana.enabled=true`).
    
- **Provisiona o datasource** apontando para o serviço do Prometheus do próprio stack (sem você ter que descobrir o `svc` manualmente).
    
- **Carrega dezenas de dashboards prontos** como **ConfigMaps** que o **grafana-sidecar** lê e importa automaticamente.
    
- Mantém **versões alinhadas**: quando o stack atualiza exporters/regras, os dashboards “oficiais” já vêm compatíveis.
    

### Vantagens

- “Liga e sai medindo”: ótimo para **onboarding, dev/POC, clusters pequenos**.
    
- Você não perde tempo com wiring (datasource/dashboards/regras).
    
- Dashboards e alertas “de mercado” já validados pela comunidade.
    

### Limitações/Trade-offs

- **Acoplamento de ciclo de vida**: atualizar o stack pode atualizar Grafana e/ou dashboards junto.
    
- **Menos controle fino** sobre plugins, SSO e versionamento do Grafana.
    
- **Blast radius maior**: um único upgrade Helm mexe em várias peças.
    

### Padrão de produção (recomendado)

- **Separar o Grafana** (chart `grafana/grafana`) para ter **ciclo de vida independente** e políticas/SSO/plugins sob seu controle.
    
- **Reaproveitar os dashboards** do stack de forma “as code” no seu Grafana:
    

Opção A — **ConfigMaps + sidecar** (no chart do Grafana):

```yaml
# grafana-values.yaml
dashboardsProvider:
  enabled: true
dashboardsConfigMaps:
  enabled: true
  label: grafana_dashboard
```

Crie ConfigMaps com `grafana_dashboard: "1"` contendo os JSONs dos dashboards (versionados no seu repositório).

Opção B — **Provisionamento via values** do chart do Grafana:

```yaml
dashboards:
  default:
    k8s-nodes:
      json: |
        { ...json do dashboard... }
datasources:
  datasources.yaml:
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        access: proxy
        url: http://<svc-prometheus>.<ns>.svc:9090
        isDefault: true
```

> Resultado: você colhe o melhor dos dois mundos — **autonomia** do Grafana e **conteúdo curado** (dashboards/regra) do ecossistema do stack, porém **versionados por você**.

---

**Resumo:** os dashboards prontos + datasource automático são, sim, a **maior facilidade visível** do kube-prometheus-stack para Grafana — junto do pacote de regras/monitors. Para **prod**, costumo separar Grafana e apenas **importar/provisionar** os dashboards (e ajustar conforme seu naming/labels), mantendo o stack responsável por Operator/Prometheus/Alertmanager/exporters.