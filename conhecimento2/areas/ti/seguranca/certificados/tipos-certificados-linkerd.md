---
tags:
  - Fundamentos
  - Segurança
  - NotaPermanente
categoria: criptografia
---
Quando vamos configurar o [[autoridade-certificadora-raiz|CA Root]], [[certificado-digital|Certificado]] do Issuer e Chave Privada precisamos prestar muita atenção em alguns detalhes que serão listados abaixo:

* O linkerd não aceita chaves RSA(Tanto 2048 quanto 4096) somente chaves com a criptografia ecdsa-with-SHA256 em diante.
* O Certificado do Issuer deve ter do tipo intermediário(não pode gerar novas CA's) para mais informações acesse [[constraints-certificados#**A) `basicConstraints` (Restrições Básicas)**|aqui]].
	* basicConstraints = critical,CA:TRUE,pathlen:0
* O Certificado do Issuer deve ser um CA, pois ele irá assinar diversos certificados para o data plane.
* O Certificado deve ter restrições de escrita:
	* keyUsage = critical,keyCertSign,cRLSign 