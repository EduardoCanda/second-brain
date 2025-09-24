---
tags:
  - Linux
  - Segurança
  - NotaBibliografica
ferramenta: cli
---
O comando **`passwd`** em sistemas Unix/Linux é usado para **alterar senhas de usuários**. Ele permite que usuários comuns mudem suas próprias senhas, enquanto o **root** (superusuário) pode modificar a senha de qualquer conta no sistema.  

---

### **Principais Funções do `passwd`**  

1. **Alterar a própria senha** (usuário comum):  
   ```bash
   passwd
   ```
   - O sistema pedirá a **senha atual** e depois a **nova senha** (com confirmação).  

2. **Alterar a senha de outro usuário** (apenas root):  
   ```bash
   sudo passwd nome_do_usuario
   ```
   - Substitua `nome_do_usuario` pelo login do usuário.  

3. **Bloquear/Desbloquear uma conta**:  
   - **Bloquear**:  
     ```bash
     sudo passwd -l nome_do_usuario
     ```
     → A conta não poderá mais ser usada até ser desbloqueada.  
   - **Desbloquear**:  
     ```bash
     sudo passwd -u nome_do_usuario
     ```

4. **Forçar a troca de senha no próximo login**:  
   ```bash
   sudo passwd -e nome_do_usuario
   ```
   → Útil para administradores que criam contas temporárias.  

5. **Definir expiração de senha**:  
   ```bash
   sudo passwd -x 30 nome_do_usuario
   ```
   → Define que a senha expira em **30 dias**.  

6. **Remover a senha de uma conta (deixá-la sem senha - NÃO RECOMENDADO)**:  
   ```bash
   sudo passwd -d nome_do_usuario
   ```
   → A conta ficará acessível sem senha (risco de segurança!).  

---

### **Onde as senhas são armazenadas?**  
- No arquivo **`/etc/shadow`** (criptografadas).  
- Somente **root** tem acesso a esse arquivo por questões de segurança.  

---

### **Exemplo de Uso**  
1. **Usuário comum trocando sua senha**:  
   ```bash
   passwd
   ```
   ```
   Current password: [senha atual]  
   New password: [nova senha]  
   Retype new password: [confirmação]  
   ```

2. **Administrador alterando a senha de outro usuário**:  
   ```bash
   sudo passwd maria
   ```
   ```
   New password: [nova senha]  
   Retype new password: [confirmação]  
   ```

---

### **Dicas Importantes**  
✅ Use senhas **fortes** (mínimo 8 caracteres, misture letras, números e símbolos).  
🚫 Evite `passwd -d` (deixar conta sem senha é um risco grave!).  
🔒 Se esquecer a senha do **root**, será necessário **modo de recuperação** ou **live CD**.  

É um comando essencial para **gerenciamento de contas e segurança**! 🔐