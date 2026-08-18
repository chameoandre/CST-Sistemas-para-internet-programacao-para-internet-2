# Roteiro Prático 03 — Calculadora de Pedidos de Lanchonete (ProgWeb 2)

**Unidade Curricular:** Programação para a Internet 2 (ProgWeb 2)  
**Curso:** CST em Sistemas para a Internet — IFSC Câmpus Garopaba  
**Professor:** André Moraes  
**Formato:** Atividade Prática Autônoma Guiada (Período de Atestado / 2 Semanas)

---

## 🎯 Objetivo da Atividade

Desenvolver uma aplicação web interativa em **Bootstrap 5** e **jQuery** que funcione como uma **Calculadora de Pedidos & Carrinho de Compras de Lanchonete**.

A aplicação consolida os conhecimentos de:
1. **Design Responsivo com Bootstrap 5** (Cards, Grids, Form Switches, Input Groups, Badges e Tabelas);
2. **Manipulação Dinâmica com jQuery** (Seletores `$()`, métodos `.val()`, `.text()`, `.each()`, `.prop()`);
3. **Escutadores de Eventos em Tempo Real** (`.on('change')`, `.on('input')`, `.on('click')`);
4. **Cálculos Numéricos no Cliente** (`parseFloat()`, `parseInt()`, soma de checkboxes e cálculo de descontos);
5. **Formatação de Moeda Brasileira** (`R$ X,XX` com `.toFixed(2).replace('.', ',')`);
6. **Persistência com Web Storage API** (`localStorage.setItem` e `localStorage.getItem` com `JSON.stringify` e `JSON.parse`).

---

## 📂 Estrutura de Arquivos

```text
exercicio-roteiro3/
├── index.html     # Layout HTML5 + Bootstrap 5 + jQuery CDN
├── app.js         # Lógica de cálculo, eventos em tempo real e LocalStorage
└── README.md      # Este guia de orientação
```

---

## 🚀 Passo a Passo de Implementação

### Passo 1: Estrutura HTML e CDNs
- Crie o arquivo `index.html` com a estrutura base HTML5.
- Inclua o CSS do Bootstrap 5 (`bootstrap.min.css`) e os ícones (`bootstrap-icons.min.css`) no `<head>`.
- Inclua o script da CDN do jQuery 3.7.1 (`jquery-3.7.1.min.js`) e a chamada para o seu `app.js` antes do fechamento do `</body>`.

### Passo 2: Construção do Formulário de Pedido
- Crie o menu `<select id="select-lanche">` com as opções de lanches e seus respectivos preços nos atributos `value`.
- Crie a seção de adicionais opcionais usando `form-switch` ou `checkbox` (`.check-adicional`), definindo os preços nos atributos `value`.
- Crie os campos de quantidade (`#input-qtd`) com botões de incremento (`+`) e decremento (`-`).
- Adicione a seleção de taxa de entrega e o campo para o cupom de desconto (`IFSC10`).

### Passo 3: Painel do Resumo Financeiro
- Monte o card de resumo exibindo:
  - Lanche Unitário
  - Soma dos Adicionais
  - Subtotal (x Quantidade)
  - Taxa de Entrega
  - Desconto Concedido
  - **Valor Total a Pagar em Destaque (Total Geral)**

### Passo 4: Escutadores de Evento em Tempo Real no `app.js`
- Em vez de calcular apenas quando o usuário clica em um botão, utilize os eventos `.on('change')` e `.on('input')` para que a tela seja recalculada instantaneamente a cada clique ou digitação!

### Passo 5: Persistência no LocalStorage
- Permita salvar o rascunho do pedido no `localStorage`.
- Ao pressionar `F5` (recarregar a página), a aplicação deve ler o `localStorage` e restaurar automaticamente os campos selecionados pelo usuário.

---

## 📬 Entregável e Avaliação

- Publique o repositório no seu GitHub pessoal.
- Habilite o **GitHub Pages** nas configurações do repositório para disponibilizar a aplicação online.
- Envie o link do repositório e do site publicado via plataforma acadêmica/Moodle.
