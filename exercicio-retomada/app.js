/**
 * Programação para a Internet II — IFSC Câmpus Garopaba
 * Exercício Prático de Retomada (DOM + Async/Await + Fetch API + LocalStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const formCliente = document.getElementById('form-cliente');
  const inputNome = document.getElementById('nome');
  const inputEmail = document.getElementById('email');
  const inputCep = document.getElementById('cep');
  const inputLogradouro = document.getElementById('logradouro');
  const inputBairro = document.getElementById('bairro');
  const inputCidade = document.getElementById('cidade');
  const inputUf = document.getElementById('uf');
  const cepSpinner = document.getElementById('cep-spinner');
  const statusBox = document.getElementById('mensagem-status');
  const tabelaBody = document.getElementById('tabela-body');
  const emptyState = document.getElementById('empty-state');
  const btnLimparTodos = document.getElementById('btn-limpar-todos');

  // Chave do LocalStorage
  const STORAGE_KEY = 'ifsc_pi2_clientes';

  // Estado Local da Aplicação
  let clientes = carregarClientesDoStorage();

  // Inicialização
  renderizarTabela();

  // =========================================================================
  // 1. EVENTO: Busca Assíncrona de CEP (ViaCEP API)
  // =========================================================================
  inputCep.addEventListener('blur', async () => {
    const cepLimpo = inputCep.value.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      if (cepLimpo.length > 0) {
        exibirMensagem('CEP inválido! Digite 8 números.', 'error');
      }
      return;
    }

    exibirSpinner(true);
    limparMensagem();

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error('Falha na requisição ao serviço ViaCEP.');
      }

      const dados = await response.json();

      if (dados.erro) {
        exibirMensagem('CEP não encontrado na base de dados.', 'error');
        limparCamposEndereco();
      } else {
        inputLogradouro.value = dados.logradouro || '';
        inputBairro.value = dados.bairro || '';
        inputCidade.value = dados.localidade || '';
        inputUf.value = dados.uf || '';
        exibirMensagem('Endereço encontrado com sucesso!', 'success');
      }

    } catch (error) {
      console.error('Erro na busca do CEP:', error);
      exibirMensagem('Erro de conexão ao buscar o CEP. Tente novamente.', 'error');
    } finally {
      exibirSpinner(false);
    }
  });

  // Formatador dinâmico de CEP (88495-000)
  inputCep.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
  });

  // =========================================================================
  // 2. EVENTO: Cadastro de Cliente no Form
  // =========================================================================
  formCliente.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const cep = inputCep.value.trim();
    const logradouro = inputLogradouro.value.trim();
    const bairro = inputBairro.value.trim();
    const cidade = inputCidade.value.trim();
    const uf = inputUf.value.trim().toUpperCase();

    if (!nome || !email || !cep) {
      exibirMensagem('Por favor, preencha os campos obrigatórios (*).', 'error');
      return;
    }

    const novoCliente = {
      id: Date.now(),
      nome,
      email,
      cep,
      logradouro,
      bairro,
      cidade,
      uf,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    // Adiciona e persiste
    clientes.push(novoCliente);
    salvarNoStorage();
    renderizarTabela();

    // Reset do form
    formCliente.reset();
    exibirMensagem(`Cliente "${nome}" cadastrado com sucesso!`, 'success');
  });

  // Limpar Todos os Clientes
  btnLimparTodos.addEventListener('click', () => {
    if (clientes.length === 0) return;

    if (confirm('Tem certeza de que deseja apagar TODOS os clientes cadastrados?')) {
      clientes = [];
      salvarNoStorage();
      renderizarTabela();
      exibirMensagem('Todos os clientes foram removidos.', 'success');
    }
  });

  // =========================================================================
  // 3. FUNÇÕES AUXILIARES DE RENDERIZAÇÃO E STORAGE
  // =========================================================================
  function renderizarTabela() {
    tabelaBody.innerHTML = '';

    if (clientes.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    clientes.forEach((cliente, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><strong>${index + 1}</strong></td>
        <td>${escapeHtml(cliente.nome)}</td>
        <td>${escapeHtml(cliente.email)}</td>
        <td><code>${escapeHtml(cliente.cep)}</code></td>
        <td>${escapeHtml(cliente.cidade)} / ${escapeHtml(cliente.uf)}</td>
        <td>
          <button class="btn-delete" data-id="${cliente.id}">❌ Excluir</button>
        </td>
      `;

      // Evento de deleção por ID
      tr.querySelector('.btn-delete').addEventListener('click', () => {
        excluirCliente(cliente.id);
      });

      tabelaBody.appendChild(tr);
    });
  }

  function excluirCliente(id) {
    clientes = clientes.filter(c => c.id !== id);
    salvarNoStorage();
    renderizarTabela();
    exibirMensagem('Cliente excluído com sucesso.', 'success');
  }

  function carregarClientesDoStorage() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  function salvarNoStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
  }

  function exibirSpinner(visivel) {
    if (visivel) {
      cepSpinner.classList.remove('hidden');
    } else {
      cepSpinner.classList.add('hidden');
    }
  }

  function exibirMensagem(texto, tipo) {
    statusBox.textContent = texto;
    statusBox.className = `status-box ${tipo}`;
    statusBox.classList.remove('hidden');

    setTimeout(() => {
      limparMensagem();
    }, 4000);
  }

  function limparMensagem() {
    statusBox.classList.add('hidden');
  }

  function limparCamposEndereco() {
    inputLogradouro.value = '';
    inputBairro.value = '';
    inputCidade.value = '';
    inputUf.value = '';
  }

  function escapeHtml(texto) {
    if (!texto) return '';
    return texto
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
