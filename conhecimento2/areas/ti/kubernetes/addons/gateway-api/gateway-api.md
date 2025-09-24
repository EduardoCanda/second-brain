---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: router
ferramenta: gatewayapi
---
O **Gateway API** é o “sucessor” do Ingress no ecossistema [[Kubernetes]]: um conjunto de **[[custom-resources|CRDs]] padronizados** para publicar e rotear tráfego L4/L7 ([[protocolo-https|HTTP]], HTTPS, gRPC etc.) com **separação de responsabilidades** entre time de infra ([[gateway-class]]), plataforma ([[Gateway]]) e times de apps ([[httproute|Routes]]). Ele é um projeto oficial do SIG-Network e hoje é amplamente suportado por vários controladores (Envoy, NGINX, Istio, Kong, Traefik, AKO etc.). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/?utm_source=chatgpt.com "Kubernetes Gateway API: Introduction"), [Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))

# Como funciona (modelo mental)

- **GatewayClass**: define a “classe” de gateways gerenciados por um controlador (ex.: Envoy Gateway, NGINX Gateway Fabric). ([Envoy Gateway](https://gateway.envoyproxy.io/docs/tasks/traffic/gatewayapi-support/?utm_source=chatgpt.com "Gateway API Support"))
    
- **Gateway**: instancia pontos de entrada (listeners) com **porta, protocolo, hostname** e **TLS**; controla quem pode anexar rotas via `allowedRoutes`. ([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))
    
- **Routes**: regras de roteamento que se **anexam** ao(s) listener(s) do Gateway via `parentRefs`. As mais usadas: **HTTPRoute** (HTTP/HTTPS) e **GRPCRoute** (gRPC). Para referências **entre namespaces**, usa-se **[[reference-grant|ReferenceGrant]]**. ([docs.okd.io](https://docs.okd.io/latest/rest_api/network_apis/httproute-gateway-networking-k8s-io-v1.html?utm_source=chatgpt.com "HTTPRoute [gateway.networking.k8s.io/v1] - Network APIs ..."), [gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/grpcroute/?utm_source=chatgpt.com "GRPCRoute"))
    

# É estável para produção?

Sim — os recursos **GatewayClass, Gateway, HTTPRoute** estão **GA** desde **v1.0 (2023)**; **GRPCRoute** está **GA** desde **v1.1 (2024)**. Outras rotas (TCP/UDP/TLS) e políticas como **BackendTLSPolicy** existem, mas permanecem em canais _standard/experimental_ conforme o caso. Verifique a _matrix_ do seu controlador. ([Kubernetes](https://kubernetes.io/blog/2023/10/31/gateway-api-ga/?utm_source=chatgpt.com "Gateway API v1.0: GA Release"), [gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/grpcroute/?utm_source=chatgpt.com "GRPCRoute"))

# Principais atributos (cheat-sheet rápido)

**GatewayClass**

- `spec.controllerName`: identifica o controlador que vai reconciliar a classe.
    
- `spec.parametersRef`: (opcional) CRD com _tuning_ específico do controlador. ([Envoy Gateway](https://gateway.envoyproxy.io/docs/tasks/traffic/gatewayapi-support/?utm_source=chatgpt.com "Gateway API Support"))
    

**Gateway**

- `spec.listeners[]`: `name`, `port` (80/443), `protocol` (HTTP/HTTPS), `hostname`, `tls.mode` (**Terminate/Passthrough**) e `tls.certificateRefs` (Secret).
    
- `allowedRoutes`: restringe anexos por **namespace** e **tipo** (ex.: só HTTPRoute do mesmo ns). ([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))
    
- (Opcional) `addresses`: IP/hostname quando suportado pelo provedor.
    

**HTTPRoute / GRPCRoute**

- `parentRefs`: anexa a um `Gateway` e opcionalmente a um `listener` (`sectionName`).
    
- `hostnames`: _virtual hosts_;
    
- `rules[]`:
    
    - `matches`: **path** (`Exact`, `PathPrefix`, e **RegularExpression** com conformidade dependente do controlador), **headers**, **queryParams**, **method**;
        
    - `backendRefs`: serviços/alvos com **weight** (split/canary);
        
    - `filters`: redireciono, reescrita de URL, modificação de cabeçalhos etc.;
        
    - `timeouts`: **GA** desde v1.3 (ex.: `request`, `backendRequest`). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))
        

**TLS fim-a-fim**

- Terminação no Gateway + **re-encriptação** até o _backend_ via **BackendTLSPolicy** (alpha / experimental). ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/tls/?utm_source=chatgpt.com "TLS - Kubernetes Gateway API"))
    

# Exemplo mínimo (YAML)

**1) GatewayClass (Envoy Gateway como exemplo)**

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: eg
spec:
  controllerName: gateway.envoyproxy.io/gatewayclass-controller
```

([Envoy Gateway](https://gateway.envoyproxy.io/docs/tasks/traffic/gatewayapi-support/?utm_source=chatgpt.com "Gateway API Support"))

**2) Gateway com HTTP→HTTPS e TLS**

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: publico
  namespace: web
spec:
  gatewayClassName: eg
  listeners:
    - name: http
      port: 80
      protocol: HTTP
      hostname: exemplo.com
      allowedRoutes:
        namespaces: { from: Same }
    - name: https
      port: 443
      protocol: HTTPS
      hostname: exemplo.com
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: cert-exemplo-com
      allowedRoutes:
        namespaces: { from: Same }
```

([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))

**3) HTTPRoute com redirect, _path match_ e _split_**

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app
  namespace: web
spec:
  parentRefs:
    - name: publico
      sectionName: https
  hostnames: ["exemplo.com"]
  rules:
    # Redirecionar HTTP->HTTPS (anexa ao listener http)
    - matches: [{ path: { type: PathPrefix, value: "/" } }]
      parentRefs: [{ name: publico, sectionName: http }]
      filters:
        - type: RequestRedirect
          requestRedirect:
            scheme: https
            statusCode: 301

    # Roteamento e split de tráfego
    - matches:
        - path: { type: PathPrefix, value: "/api" }
          headers:
            - name: "x-version"
              type: Exact
              value: "v2"
      backendRefs:
        - name: api-v2   # Service
          port: 8080
          weight: 80
        - name: api-v1
          port: 8080
          weight: 20
      timeouts:
        request: 10s
        backendRequest: 2s
```

(Nota: **Regex** em `path` existe, mas a sintaxe/engine é **específica do controlador** — confira a documentação do seu.) ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/reference/spec/?utm_source=chatgpt.com "API Reference"))

**4) Cross-namespace (Service em outro ns)**  
Se sua `HTTPRoute` apontar para um Service em outro namespace, crie um **ReferenceGrant** nesse namespace para autorizar a referência. ([docs.okd.io](https://docs.okd.io/latest/rest_api/network_apis/httproute-gateway-networking-k8s-io-v1.html?utm_source=chatgpt.com "HTTPRoute [gateway.networking.k8s.io/v1] - Network APIs ..."))

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: ReferenceGrant
metadata:
  name: permitir-web
  namespace: backend
spec:
  from:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
      namespace: web
  to:
    - group: ""
      kind: Service
```

# Passo a passo de instalação

1. **Instale os CRDs do Gateway API** (canal _standard_). ([Istio](https://istio.io/latest/docs/tasks/traffic-management/request-timeouts/?utm_source=chatgpt.com "Request Timeouts"))
    
2. **Instale um controlador** (ex.: **Envoy Gateway** ou **NGINX Gateway Fabric**) e consulte a _compatibility matrix_ / _compatibility_ para saber exatamente o que é suportado. ([Envoy Gateway](https://gateway.envoyproxy.io/news/releases/v1.5/?utm_source=chatgpt.com "Announcing Envoy Gateway v1.5"), [docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/?utm_source=chatgpt.com "Gateway API Compatibility | NGINX Documentation"), [blog.nginx.org](https://blog.nginx.org/blog/kubernetes-networking-ingress-controller-to-gateway-api?utm_source=chatgpt.com "Moving from Ingress Controller to the Gateway API"))
    
3. **Crie** um `GatewayClass` → um `Gateway` → as `Routes` (HTTP/GRPC etc.).
    
4. **Opcional**: políticas (timeouts GA; TLS upstream via BackendTLSPolicy – experimental). ([GitHub](https://github.com/kubernetes-sigs/gateway-api/releases?utm_source=chatgpt.com "Releases · kubernetes-sigs/gateway-api"), [gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/backendtlspolicy/?h=backendtlspolicy&utm_source=chatgpt.com "BackendTLSPolicy - Kubernetes Gateway API"))
    

# Boas práticas

- Use `allowedRoutes` + **namespaces** para **multi-tenant** seguro. ([Kubernetes](https://kubernetes.io/docs/concepts/services-networking/gateway/?utm_source=chatgpt.com "Gateway API"))
    
- Prefira **HTTPRoute/GRPCRoute** (GA) em produção; teste TCP/UDP/TLSRoute conforme o suporte do seu controlador. ([Kubernetes](https://kubernetes.io/blog/2023/10/31/gateway-api-ga/?utm_source=chatgpt.com "Gateway API v1.0: GA Release"), [gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/api-types/grpcroute/?utm_source=chatgpt.com "GRPCRoute"))
    
- Para **TLS fim-a-fim**, combine `tls.mode: Terminate` no listener com **BackendTLSPolicy** no Service. ([gateway-api.sigs.k8s.io](https://gateway-api.sigs.k8s.io/guides/tls/?utm_source=chatgpt.com "TLS - Kubernetes Gateway API"))
    
- Cheque o suporte a **Regex** e **filtros** na doc do seu controlador (conformidade _Core/Extended/Implementation-specific_). ([docs.nginx.com](https://docs.nginx.com/nginx-gateway-fabric/overview/gateway-api-compatibility/?utm_source=chatgpt.com "Gateway API Compatibility | NGINX Documentation"))
    

Se quiser, eu adapto esses manifests para seu ambiente (controller escolhido, DNS/TLS, _timeouts_ e _canary_), ou mostro um desenho de responsabilidades (infra ↔ plataforma ↔ app) usando os CRDs do Gateway API.