---
tags:
  - Kubernetes
  - NotaBibliografica
categoria: service_mesh
ferramenta: linkerd
---
# Criando Certificados para o Linkerd com Helm

Para instalar o [[linkerd]] via [[helm]], você precisa gerar três certificados:
1. Um certificado raiz (CA) para servir como âncora de confiança
2. Um certificado de issuer (emissor) assinado pela CA
3. Uma chave privada para o issuer

## Passo a Passo para Gerar os Certificados

### 1. Instalar a ferramenta `step` (recomendado) ou usar `openssl`

```bash
# Instalar step (opcional, mas facilita o processo)
brew install step  # macOS
# Ou para Linux:
curl -LO https://github.com/smallstep/cli/releases/download/v0.23.4/step_linux_0.23.4_amd64.tar.gz
tar -xvzf step_linux_0.23.4_amd64.tar.gz
sudo cp step_0.23.4/bin/step /usr/local/bin/
```

### 2. Gerar os certificados com `step`

```bash
# Criar diretório para os certificados
mkdir -p linkerd-certs
cd linkerd-certs

# Gerar CA root (válido por 10 anos)
step certificate create root.linkerd.cluster.local ca.crt ca.key \
  --profile root-ca --no-password --insecure \
  --not-after 87600h

# Gerar issuer (válido por 1 ano)
step certificate create identity.linkerd.cluster.local issuer.crt issuer.key \
  --profile intermediate-ca --not-after 8760h --no-password --insecure \
  --ca ca.crt --ca-key ca.key
```

### Alternativa com OpenSSL

Se preferir usar openssl:

```bash
# Gerar CA
openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt \
  -subj "/CN=root.linkerd.cluster.local"

# Gerar issuer
openssl genrsa -out issuer.key 2048
openssl req -new -key issuer.key -out issuer.csr \
  -subj "/CN=identity.linkerd.cluster.local"
openssl x509 -req -days 365 -in issuer.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out issuer.crt
```

## Verificando os certificados

```bash
# Verificar CA
step certificate inspect ca.crt

# Verificar issuer
step certificate inspect issuer.crt
```

## Instalando o Linkerd com Helm

Agora você pode executar o comando Helm que você mencionou:

```bash
helm install linkerd-control-plane \
  -n linkerd --create-namespace \
  --set-file identityTrustAnchorsPEM=ca.crt \
  --set-file identity.issuer.tls.crtPEM=issuer.crt \
  --set-file identity.issuer.tls.keyPEM=issuer.key \
  linkerd-edge/linkerd-control-plane
```

## Observações importantes

1. Guarde os arquivos `ca.key`, `ca.crt`, `issuer.key` e `issuer.crt` em um local seguro
2. Os certificados gerados aqui são para ambientes de teste - para produção, considere usar um PKI empresarial ou serviços como Vault
3. A validade dos certificados:
   - CA: 10 anos (87600h)
   - Issuer: 1 ano (8760h) - você precisará rotacioná-lo anualmente

Precisa de alguma adaptação ou tem mais dúvidas sobre o processo?