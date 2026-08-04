/**
 * Programação para a Internet II — IFSC Câmpus Garopaba
 * Exercício Prático de Retomada (Bootstrap 5 + jQuery + Fetch API / $.getJSON)
 */

$(document).ready(function () {
  const STORAGE_KEY = 'ifsc_pi2_clientes';

  // 1. Estado Local (Carregar clientes salvos do LocalStorage)
  let clientes = carregarStorage();
  renderizarTabela(clientes);

  // =========================================================================
  // 2. CONSULTA DE CEP (ViaCEP API): jQuery + Fetch API Destrinchado
  // =========================================================================
  
  // Evento quando o usuário sai do campo de CEP (blur) ou clica no botão de busca
  $('#cep, #btn-buscar-cep').on('blur click', function (e) {
    if (e.type === 'click' && e.target.id !== 'btn-buscar-cep') return;

    const cep = $('#cep').val().replace(/\D/g, '');

    if (cep.length !== 8) {
      if (cep.length > 0) {
        exibirStatus('CEP inválido! Digite exatamente 8 números.', 'danger');
      }
      return;
    }

    exibirStatus('Consultando CEP na API ViaCEP...', 'info');

    // OPCIONAL 1: Usando jQuery $.getJSON (Simplificado para iniciantes)
    $.getJSON(`https://viacep.com.br/ws/${cep}/json/`)
      .done(function (dados) {
        if (dados.erro) {
          exibirStatus('CEP não encontrado na base do ViaCEP.', 'warning');
          limparCamposEndereco();
        } else {
          // Preenchimento rápido via jQuery
          $('#logradouro').val(dados.logradouro || '');
          $('#bairro').val(dados.bairro || '');
          $('#cidade').val(dados.localidade || '');
          $('#uf').val(dados.uf || '');

          exibirStatus('Endereço encontrado e preenchido automaticamente!', 'success');
        }
      })
      .fail(function () {
        exibirStatus('Erro de conexão ao buscar o CEP na API.', 'danger');
      });
  });

  // Formatador dinâmico de CEP no input (88495-000)
  $('#cep').on('input', function () {
    let val = $(this).val().replace(/\D/g, '');
    if (val.length > 5) {
      val = val.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    $(this).val(val);
  });

  // =========================================================================
  // 3. CADASTRO DE CLIENTE & PERSISTÊNCIA NO LOCALSTORAGE
  // =========================================================================
  $('#form-cliente').on('submit', function (e) {
    e.preventDefault();

    const nome = $('#nome').val().trim();
    const email = $('#email').val().trim();
    const cep = $('#cep').val().trim();
    const logradouro = $('#logradouro').val().trim();
    const bairro = $('#bairro').val().trim();
    const cidade = $('#cidade').val().trim();
    const uf = $('#uf').val().trim().toUpperCase();

    if (!nome || !email || !cep) {
      exibirStatus('Preencha todos os campos obrigatórios (*).', 'danger');
      return;
    }

    const novoCliente = {
      id: Date.now(),
      nome: nome,
      email: email,
      cep: cep,
      logradouro: logradouro,
      bairro: bairro,
      cidade: cidade,
      uf: uf
    };

    // Adiciona ao array e persiste
    clientes.push(novoCliente);
    salvarStorage(clientes);
    renderizarTabela(clientes);

    // Limpa o formulário via jQuery
    this.reset();
    exibirStatus(`Cliente "${nome}" cadastrado com sucesso!`, 'success');
  });

  // Botão Limpar Todos
  $('#btn-limpar-todos').on('click', function () {
    if (clientes.length === 0) return;

    if (confirm('Deseja realmente apagar todos os clientes?')) {
      clientes = [];
      salvarStorage(clientes);
      renderizarTabela(clientes);
      exibirStatus('Todos os registros foram removidos.', 'info');
    }
  });

  // Desafio Extra: Filtro por nome em tempo real usando jQuery
  $('#filtro-nome').on('input', function () {
    const termo = $(this).val().toLowerCase();
    const clientesFiltrados = clientes.filter(c => c.nome.toLowerCase().includes(termo));
    renderizarTabela(clientesFiltrados);
  });

  // Exclusão Individual via deleção delegada no jQuery
  $('#tabela-body').on('click', '.btn-delete-item', function () {
    const id = $(this).data('id');
    clientes = clientes.filter(c => c.id !== id);
    salvarStorage(clientes);
    renderizarTabela(clientes);
    exibirStatus('Cliente removido.', 'warning');
  });

  // =========================================================================
  // 4. FUNÇÕES AUXILIARES DE RENDERIZAÇÃO E STORAGE
  // =========================================================================
  function renderizarTabela(lista) {
    const $tbody = $('#tabela-body');
    $tbody.empty();

    if (lista.length === 0) {
      $('#empty-state').removeClass('d-none');
      return;
    }

    $('#empty-state').addClass('d-none');

    lista.forEach(function (c, index) {
      const trHtml = `
        <tr>
          <td><strong>${index + 1}</strong></td>
          <td class="fw-semibold">${escapeHtml(c.nome)}</td>
          <td>${escapeHtml(c.email)}</td>
          <td><span class="badge bg-secondary font-monospace">${escapeHtml(c.cep)}</span></td>
          <td>${escapeHtml(c.cidade)} / ${escapeHtml(c.uf)}</td>
          <td class="text-center">
            <button class="btn btn-outline-danger btn-sm btn-delete-item" data-id="${c.id}">
              <i class="bi bi-trash"></i> Excluir
            </button>
          </td>
        </tr>
      `;
      $tbody.append(trHtml);
    });
  }

  function carregarStorage() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  function salvarStorage(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  function exibirStatus(msg, tipo) {
    const $alert = $('#mensagem-status');
    $alert
      .removeClass('d-none alert-success alert-danger alert-warning alert-info')
      .addClass(`alert-${tipo}`)
      .html(`<i class="bi bi-info-circle-fill me-2"></i> ${msg}`);

    setTimeout(function () {
      $alert.addClass('d-none');
    }, 4000);
  }

  function limparCamposEndereco() {
    $('#logradouro, #bairro, #cidade, #uf').val('');
  }

  function escapeHtml(str) {
    return $('<div>').text(str).html();
  }
});
