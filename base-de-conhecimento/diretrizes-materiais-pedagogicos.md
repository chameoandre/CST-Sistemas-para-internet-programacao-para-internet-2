# Diretrizes para Elaboração de Materiais Pedagógicos e Roteiros de Aula

Este documento estabelece as diretrizes pedagógicas e técnicas que devem ser estritamente observadas na produção, revisão e atualização de roteiros práticos, listas de exercícios, slides e códigos de exemplo na Unidade Curricular de Programação para a Internet 2 (IFSC Câmpus Garopaba).

---

## 1. Regra do Código Completo (Zero-Ellipsis / Zero-Placeholder Rule)

Ao disponibilizar tutoriais, passos guiados e trechos de código para que os estudantes digitem ou implementem em seus projetos:

1. **Vedado o Uso de Reticências e Resumos Estruturais:**
   - É terminantemente proibido utilizar `...`, `// restante do código aqui`, ou omitir elementos internos (por exemplo, omitir tags filhas como `#toastMensagem` dentro de `#toastNotificacao`).
   - Todo trecho de código apresentado em um passo deve ser **sintática e estruturalmente completo**.

2. **Correspondência Exata entre DOM e Scripts:**
   - Qualquer `id`, `class` ou atributo referenciado posteriormente no JavaScript (como `document.getElementById('totalServicosBadge')`, `document.getElementById('toastMensagem')`, ou valores esperados em `<option value="...">`) **DEVE OBRIGATORIAMENTE ESTAR PRESENTE** no HTML fornecido ao estudante.
   - Não presumir que o aluno deduzirá a criação de elementos ausentes no roteiro.

3. **Opções Reais em Seletores (`<select>`):**
   - Ao ensinar componentes com listas suspensas (ex: categorias de filtros ou cadastro em modais), todas as opções de teste do modelo devem estar declaradas explicitamente nos passos de HTML correspondentes.

4. **Integridade de Fechamento de Tags e Acessibilidade:**
   - Todos os blocos HTML devem abrir e fechar rigorosamente seus contêineres (`<div>`, `<form>`, `<main>`, `<header>`).
   - Campos de formulário devem conter seus respectivos `<label>` informativos para garantir boas práticas e acessibilidade.

---

## 2. Padrão Arquitetural ES6 Modules

1. **Separação Rígida em Camadas:**
   - **`js/utils/`:** Funções puras de transformação, formatação e sanitização de dados (ex: moeda, telefone, escape de HTML). Não tocam no DOM nem no armazenamento.
   - **`js/services/`:** Camada de persistência e serviços (ex: LocalStorage, APIs externas). Não tocam no DOM nem geram marcação HTML.
   - **`js/views/`:** Camada de apresentação e manipulação de interface. Gera templates, renderiza cards no contêiner e gerencia disparos de notificações (Toasts).
   - **`js/main.js`:** Ponto de entrada modular (`<script type="module" src="js/main.js">`). Orquestra a inicialização, vincula escutadores de eventos (`submit`, `change`, `click` via delegação) e conecta as views aos serviços.

2. **Nomenclatura Consistente:**
   - Utilizar estritamente `camelCase` uniforme em utilitários (ex: `escapeHtml` e `formatarTelefone`).

---

## 3. Tipografia e Diagramação dos Documentos (LaTeX)

1. **Realce de Sintaxe Colorido:**
   - Utilizar sempre os ambientes dedicados `boxCodigoHTML` e `boxCodigoJS` baseados em `tcolorbox` + `listings`.
   - Manter entrelinha simples (`before upper={\singlespacing}`) e suporte a quebra entre páginas (`breakable`) nos blocos de código.

2. **Compilação e Verificação:**
   - Compilador obrigatório: `tectonic`.
   - Todo documento deve ser auditado para garantir ausência de sobreposição ou overflow em relação ao rodapé das páginas.
