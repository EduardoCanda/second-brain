O Terraform é a principal ferramenta do mercado para IaC. Ele muda a forma como pensamos.

Ao invés de dizer **como fazer** (Imperativo: _crie a rede X, depois crie a máquina Y, depois associe A com B_), nós dizemos o **estado final desejado** (Declarativo: _eu quero 10 servidores conectados a um banco C_).

O Terraform lê isso, calcula o que falta criar/apagar na nuvem, e executa.

### O Coração do Terraform: O Estado (`tfstate`)

A mágica acontece porque o Terraform guarda um arquivo de "memória" chamado de Estado (`terraform.tfstate`).

Ele sabe exatamente o que ele criou. Se um programador for lá no painel da AWS por conta própria e deletar uma regra de segurança (Firewall/Security Group), na próxima rodada do Terraform ele "chora" avisando: _"Opa, a realidade (AWS) está diferente do meu código (Git). Vou recriar a regra."_

Isso traz **Previsibilidade**. Você só mexe no código. Nunca mais direto no servidor.

### De Servidores de Estimação a Gado Virtual (Pets vs Cattle)

- **Servidor Pet (Estimação):** Aquele servidor velho, cheio de configuração manual. Se ele ficar doente (quebrar), você passa a madrugada dando remédio (instalando pacote, apagando cache). A empresa depende dele.
- **Servidor Cattle (Gado de corte):** Aquele servidor feito via Terraform. Se ele ficar doente, você não cura. Você dá um "tiro" nele (destrói) e o Terraform sobe um novinho, limpo e idêntico em 3 minutos.