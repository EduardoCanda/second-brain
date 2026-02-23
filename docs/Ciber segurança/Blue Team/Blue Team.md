O **Blue Team** é a equipe de **defesa** em segurança cibernética.  
Seu objetivo é **proteger os sistemas, redes e dados** de uma organização contra ataques.

Principais atividades:
- **Monitoramento contínuo** – usando SIEM (ex: Splunk, ELK, Wazuh) para detectar eventos suspeitos.
- **Configuração de segurança** – hardening de servidores, firewalls, WAF.
- **Resposta a incidentes** – agir rápido quando um ataque é detectado.
- **Educação de usuários** – treinar a empresa para evitar phishing, senhas fracas, etc.

Pensa neles como os **"guardas e bombeiros digitais"**: protegem e apagam incêndios.

[[SOC – Security Operations Center]]
[[Threat Intelligence (TI)]]
[[Digital Forensics and Incident Response (DFIR)]]
[[Malware Analysis]]

## Como tudo se conecta
Imagine que sua empresa foi vítima de um ransomware:
1. **Blue Team** detecta o ataque via alerta no SIEM.
2. **DFIR** entra em ação, isola máquinas, coleta evidências, descobre a causa.
3. **Threat Intelligence** verifica se o grupo atacante é conhecido, quais domínios/IPs eles usam.
4. **Malware Analysis** estuda o ransomware para descobrir chaves de criptografia ou vetores de ataque.
5. A empresa reforça suas defesas e treina funcionários para evitar novos casos.
