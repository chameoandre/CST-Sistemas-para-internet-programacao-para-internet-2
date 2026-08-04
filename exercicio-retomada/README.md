# Exercício Prático de Retomada — Programação para a Internet 2 (ProgWeb 2)
**Curso Superior de Tecnologia em Sistemas para a Internet**  
**IFSC — Câmpus Garopaba**  
**Docente:** Prof. André Moraes

---

## 📌 Objetivos da Atividade
Esta atividade tem como objetivo realizar uma transição prática e didática entre os conceitos trabalhados em **ProgWeb 1** e os novos recursos de **ProgWeb 2** (alinhado ao PPC de 120h do curso):

1. **Estilização Ágil com Bootstrap 5:** Aplicação de classes prontas (`form-control`, `btn`, `card`, `table`) para transformar a interface estática rapidamente;
2. **Manipulação do DOM com jQuery:** Seleção fácil de elementos (`$('#id')`), escuta de eventos e atualização dinâmica da página;
3. **Comunicação Assíncrona & APIs REST:** Consulta automática ao serviço do **ViaCEP** (`https://viacep.com.br/ws/{cep}/json/`) via `$.getJSON()`;
4. **Gerenciamento de Estado no Cliente:** Persistência no `localStorage` utilizando `JSON.stringify()` e `JSON.parse()`.

---

## 🚀 Como Executar o Projeto

1. Abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Edge, Firefox, Safari);
2. Ou utilize a extensão **Live Server** no VS Code para rodar a aplicação localmente (`http://127.0.0.1:5500`).

---

## 🧪 Passos do Exercício Diagnóstico

- [ ] **Passo 1 (Estilização com Bootstrap 5):** Observar como o `index.html` utiliza o grid do Bootstrap (`row`, `col-md-5`) e classes de utilidades visuais.
- [ ] **Passo 2 (Manipulação do DOM via jQuery):** Digitar o CEP `88495-000` (ou qualquer CEP de 8 dígitos) e verificar a captura do evento `blur` e autocompletar do endereço via jQuery / ViaCEP.
- [ ] **Passo 3 (Cadastro & Tabela Dinâmica):** Cadastrar 2 ou 3 clientes no formulário e observar as linhas sendo inseridas na tabela formatada.
- [ ] **Passo 4 (Persistência no LocalStorage):** Recarregar a página (`F5`) e comprovar que os clientes permanecem salvos no navegador.
- [ ] **Passo 5 (Desafio Extra de Filtro):** Digitar no campo de busca acima da tabela para filtrar os clientes por nome em tempo real usando o evento `input` do jQuery!
