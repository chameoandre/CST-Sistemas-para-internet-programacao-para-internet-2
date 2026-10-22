# 🚀 Guia de Implantação: Backend Google Apps Script (ProgWeb 2)

Este guia ensina a implantar o backend serverless do **ProgWeb 2** usando o **Google Apps Script** conectado ao **Google Drive** institucional ou pessoal.

Com esta integração, o dashboard ganha:
- 🗳️ **Votação Auditada da SNCT**: Votos registrados em tempo real em planilha do Google Sheets, impedindo votos duplicados por e-mail/matrícula.
- 📋 **Opções Dinâmicas**: Docente pode adicionar novas oficinas que aparecem instantaneamente para toda a turma.
- 🔐 **Login Seguro com Google**: Autenticação oficial de estudantes via Google Identity Services (`@aluno.ifsc.edu.br` ou e-mail cadastrado no SIGAA).
- ✉️ **Disparo Automático de E-mails**: Notificações automáticas via `GmailApp` quando avaliações/rubricas forem lançadas.
- 💾 **Resiliência Offline-First**: O dashboard continua funcionando perfeitamente via `localStorage` mesmo se estiver offline ou antes de configurar a URL da API.

---

## 📋 Pré-requisitos
- Conta Google institucional (`@ifsc.edu.br`) ou pessoal.
- Acesso ao [Google Apps Script](https://script.google.com).

---

## 🛠️ Passo a Passo de Implantação

### 1. Criar o Projeto no Google Apps Script
1. Acesse: **[script.google.com](https://script.google.com)**.
2. Clique no botão **+ Novo projeto** (canto superior esquerdo).
3. Renomeie o projeto (no topo, onde diz *Projeto sem título*) para:
   ```text
   ProgWeb2 - Backend IFSC Garopaba
   ```

### 2. Colar o Código do Backend
1. No editor de código aberto (`Código.gs` ou `Code.gs`), apague qualquer conteúdo padrão.
2. Abra o arquivo [`apps-script/Code.gs`](Code.gs) deste repositório, copie todo o seu conteúdo e cole no editor do Apps Script.
3. Clique no ícone de disquete 💾 (**Salvar projeto** ou `Ctrl+S` / `Cmd+S`).

### 3. Executar a Instalação Inicial (`instalar`)
1. No menu superior do Apps Script, selecione a função **`instalar`** no dropdown ao lado do botão *Executar*.
2. Clique em **Executar**.
3. Uma janela pop-up do Google solicitará autorização:
   - Clique em **Revisar permissões**.
   - Escolha sua conta Google.
   - Se surgir a tela *"O Google não verificou este app"*, clique em **Avançado** (canto inferior) e depois em **Acessar ProgWeb2 - Backend IFSC Garopaba (não seguro)**.
   - Clique em **Permitir**.
4. Aguarde a execução terminar no *Registro de execução*.
5. **Pronto!** Uma nova planilha chamada `ProgWeb2 — Votação SNCT, Demandas & Avaliações (IFSC Garopaba)` foi criada automaticamente na raiz do seu Google Drive com todas as abas (`Votos_SNCT`, `Oficinas_Opcoes`, `Demandas`, `Avaliacoes`, `Estudantes`, `Candidaturas_SNCT`) e os 24 estudantes da turma já cadastrados!

### 4. Implantar como Aplicativo da Web (Web App)
1. No canto superior direito da página do Apps Script, clique no botão azul **Implantar** > **Nova implantação** (ou **Gerenciar implantações** > lápis ✏️ > **Nova versão** caso já tenha uma implantação ativa).
2. Clique no ícone de engrenagem ⚙️ (*Selecionar tipo*) e escolha **Aplicativo da Web**.
3. Preencha as opções exatamente como abaixo:
   - **Descrição**: `Produção v2 - Votação SNCT, Avaliações e Candidaturas em Tempo Real`
   - **Executar como**: **Eu (seu-email@...)**
   - **Quem pode acessar**: **Qualquer pessoa** *(necessário para que os navegadores dos estudantes consigam enviar o voto e a candidatura via fetch)*
4. Clique em **Implantar**.
5. Copie a **URL do aplicativo da Web** gerada (algo parecido com `https://script.google.com/macros/s/AKfycb.../exec`).

### 5. Ativar a URL no Dashboard
1. Abra o arquivo local [`progweb2-config.js`](../progweb2-config.js) no seu editor de código.
2. Cole a URL copiada no campo `apiUrl`:
   ```javascript
   window.PROGWEB2_CONFIG = {
     apiUrl: 'https://script.google.com/macros/s/AKfycb.../exec',
     googleClientId: '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com',
     modoOfflineFallback: true,
     syncIntervalMs: 60000
   };
   ```
3. Salve o arquivo e envie o commit para o GitHub:
   ```bash
   git add progweb2-config.js
   git commit -m "Conecta dashboard ao Web App do Google Apps Script"
   git push origin main
   ```

---

## 🔒 Segurança e Privacidade
- **Identificação com Google Sign-In**: O dashboard utiliza o Google Identity Services da turma. O ID do token JWT é validado e extrai o e-mail verificado do estudante.
- **Voto Único por Estudante**: O backend registra a matrícula e e-mail na aba `Votos_SNCT`. Se o mesmo estudante tentar votar novamente, o voto anterior é atualizado com a nova escolha, garantindo 1 voto válido por estudante.
- **Painel Docente**: Apenas e-mails listados em `CONFIG.DOCENTES` têm permissão para resetar a votação ou disparar e-mails em massa para a turma.
