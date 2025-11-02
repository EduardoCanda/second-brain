O plaintext são dados legíveis. Os dados podem ser um simples "olá", uma foto de gato, dados de cartão de crédito ou registros médicos.

Da perspectiva de criptografia, todos esses "plaintext" estão aguardando para serem criptografados.

## Como funciona?
O plaintext (texto simples) é passado através da função de criptografia, juntamente com uma chave adequada; a função de criptografia retorna um texto cifrado. A função de criptografia faz parte da cifra; uma cifra é um algoritmo para converter um texto simples em um texto cifrado e vice-versa.

![[encrypt plaintext.png]]

Para recuperar o plaintext, devemos passar o texto cifrado junto com a chave adequada através da função de descriptografia, que nos daria o texto simples original

![[decrypt plaintext.png]]

---
## Resumo

- **Plaintext** são os dados originais, antes de serem criptogrados. Pode ser uma foto, documento, arquivo multimedia ou qualquer dado binário.

- **Ciphertext** é o plaintext criptografado. Uma versão inelegível, não conseguimos obter não nenhuma informação sobre o plaintext original, excepto pelo seu tamanho aproximado.

- **Cipher** é o algoritmo ou método utilizado para converter o plaintext em ciphertext e vice versa. Normalmente é desenvolvido usando fórmulas matemáticas.

- **Key** é um texto de bits que o cipher usa para criptografar e descriptografar os dados. No geral o cipher usado é de conhecimento público. No entanto a chave precisa se mantida em segredo. Com exceção da chave pública na criptografia assimétrica.

- **Encryption** é o processo de transformar o plaintext em ciphertext, usando cipher e a key.

- **Decryption** é o processo reverso, convertendo o ciphertext para o plaintext, usando cipher a chave novamente.
