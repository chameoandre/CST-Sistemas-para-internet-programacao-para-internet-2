# Roteiro Prático 04 — Vitrine Comunitária de Empreendedores Locais

**Unidade Curricular:** Programação para a Internet 2 (ProgWeb 2 / PIT II)  
**Curso:** Curso Superior de Tecnologia em Sistemas para a Internet  
**Instituição:** Instituto Federal de Santa Catarina (Câmpus Garopaba)  
**Docente:** Prof. André Moraes  

---

## 🎯 Objetivos de Aprendizagem

- [x] Aplicação prática do padrão **ES6 Modules** no navegador (`<script type="module" src="js/main.js">`, `import` e `export`).
- [x] Separação estrita em camadas de software no frontend:
  - `js/services/`: Manipulação e persistência no `localStorage` sem acoplamento visual.
  - `js/views/`: Renderização dinâmica de cards e Toasts do Bootstrap 5 via template literals.
  - `js/utils/`: Funções utilitárias puras (moeda em Real `R$`, formatação de telefone/WhatsApp e sanitização `escapeHtml`).
  - `js/main.js`: Orquestrador de eventos e ciclo de vida da aplicação.
- [x] Validação visual no cliente com as classes nativas do Bootstrap 5 (`.is-valid`, `.is-invalid`, `.invalid-feedback`, `was-validated`).
- [x] Notificações flutuantes assíncronas (**Bootstrap Toasts**) para feedback de operações ao usuário.
- [x] Filtro reativo instantâneo por categoria sem recarregamento de página.

---

## 🚀 Como Executar Localmente

Como a aplicação utiliza módulos nativos do ES6 (`import`/`export`), os navegadores modernos exigem que os arquivos sejam servidos via protocolo HTTP/HTTPS (e não pelo protocolo local `file://`), devido a políticas de segurança CORS do navegador.

Você pode rodar localmente usando qualquer servidor HTTP simples:

```bash
# Opção 1: Usando Python 3
python3 -m http.server 8000

# Opção 2: Usando a extensão Live Server do VS Code
# Basta clicar em "Go Live" no canto inferior direito
```

Acesse em seguida: `http://localhost:8000/roteiro-4/exercicio-roteiro4/`
