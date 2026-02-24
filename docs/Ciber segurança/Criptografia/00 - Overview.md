Criptografia é o propósito de manter a comunicação segura da presença de adversários. Este termo inclui  confidencialidade, integridade e autenticidade dos dados. Nos dias de hoje a criptografia é usada diariamente.

Alguns exemplos de uso:
- Ao fazer login em algum site, as credenciais são encriptadas e enviadas ao servidor destino, portanto ninguém pode recupera-las para bisbilhotar a conexão.
- Quando conectamos em um servidor via [SSH](../../Redes/05 - Segurança/SSH.md), uma conexão é estabelecidade de forma encriptada em um "túnel", então ninguém pode espiar a conexão.
- Quando baixamos um arquivo, como verificamos se foi baixado corretamente? A criptografia provê a solução com funções hash para confirmar se o arquivo baixado é idêntico ao original.

Raramente a criptografia precisa de interação direta, mas as soluções e implicações dela estão em todo lugar do mundo digital.

---
## Prática no mundo real
Considerando a transação de um pagamento de cartão de crédito, a empresa que lidar com este processo precisa seguir e cumprir o "Payment Card Industry Data Security Standard (PCI DSS)".

O PCI DSS força a empresa fazer um mínimo de controle de segurança para guardar, processar e transmitir dados relacionados a cartão de crédito. Ou seja, **criptografia**.