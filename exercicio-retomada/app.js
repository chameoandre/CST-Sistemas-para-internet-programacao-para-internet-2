/**
 * Programação para a Internet 2 (ProgWeb 2) — IFSC Câmpus Garopaba
 * Exercício Prático de Retomada (Aula 01: Bootstrap 5 + jQuery + LocalStorage)
 */

$(document).ready(function () {
  const STORAGE_KEY = 'progweb2_clientes';

  // 1. Estado Local (Carregar clientes do LocalStorage - Exemplo 8)
  let clientes = carregarStorage();
  renderizarTabela(clientes);

  // =========================================================================
  // EXEMPLO 5 (Recursos Funcionais): Leitura de Inputs com $('#id').val()
  // EXEMPLO 7 (Recursos Dinâmicos): Escuta de Eventos com .on('submit')
  // =========================================================================
  $('#form-cliente').on('submit', function (e) {
    e.preventDefault();

    // Lendo valores dos inputs usando jQuery (Exemplo 5)
    const nome = $('#nome').val().trim();
    const email = $('#email').val().trim();
    const cidade = $('#cidade').val().trim();

    if (!nome || !email || !cidade) {
      // Exemplo 6: Recursos Estéticos (Efeitos e Alertas)
      exibirStatus('Por favor, preencha todos os campos obrigatórios (*).', 'danger');
      return;
    }

    const novoCliente = {
      id: Date.now(),
      nome: nome,
      email: email,
      cidade: cidade
    };

    // Adiciona e persiste no LocalStorage (Exemplo 8)
    clientes.push(novoCliente);
    salvarStorage(clientes);
    renderizarTabela(clientes);

    // Limpa o formulário
    this.reset();
    
    // Exemplo 6: Exibição visual com animação
    exibirStatus(`Cliente "${nome}" cadastrado com sucesso!`, 'success');
  });

  // =========================================================================
  // EXEMPLO 6 (Recursos Estéticos): Animações e Manipulação de Classes
  // =========================================================================
  function exibirStatus(msg, tipo) {
    const $alert = $('#mensagem-status');
    $alert
      .removeClass('d-none alert-success alert-danger alert-warning alert-info')
      .addClass(`alert-${tipo}`)
      .html(`<i class="bi bi-info-circle-fill me-2"></i> ${msg}`)
      .hide()
      .fadeIn(300); // Efeito suave de aparecer (Exemplo 6)

    setTimeout(function () {
      $alert.fadeOut(400, function () {
        $alert.addClass('d-none');
      });
    }, 3500);
  }

  // =========================================================================
  // EXEMPLO 7 (Recursos Dinâmicos): Inserção Dinâmica e Remoção no DOM
  // =========================================================================
  function renderizarTabela(lista) {
    const $tbody = $('#tabela-body');
    $tbody.empty(); // Limpa as linhas atuais

    if (lista.length === 0) {
      $('#empty-state').removeClass('d-none');
      return;
    }

    $('#empty-state').addClass('d-none');

    // Inserção dinâmica com .append() (Exemplo 7)
    lista.forEach(function (c, index) {
      const trHtml = `
        <tr>
          <td><strong>${index + 1}</strong></td>
          <td class="fw-semibold">${escapeHtml(c.nome)}</td>
          <td>${escapeHtml(c.email)}</td>
          <td>${escapeHtml(c.cidade)}</td>
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

  // Deleção delegada de item individual no DOM (Exemplo 7)
  $('#tabela-body').on('click', '.btn-delete-item', function () {
    const id = $(this).data('id');
    clientes = clientes.filter(c => c.id !== id);
    salvarStorage(clientes);
    renderizarTabela(clientes);
    exibirStatus('Cliente removido com sucesso.', 'warning');
  });

  // Limpar todos os registros
  $('#btn-limpar-todos').on('click', function () {
    if (clientes.length === 0) return;

    if (confirm('Deseja apagar todos os clientes cadastrados?')) {
      clientes = [];
      salvarStorage(clientes);
      renderizarTabela(clientes);
      exibirStatus('Todos os registros foram removidos.', 'info');
    }
  });

  // Filtro por nome em tempo real (Exemplo 7 - Evento input)
  $('#filtro-nome').on('input', function () {
    const termo = $(this).val().toLowerCase();
    const filtrados = clientes.filter(c => c.nome.toLowerCase().includes(termo));
    renderizarTabela(filtrados);
  });

  // =========================================================================
  // EXEMPLO 8 (Persistência): Gravando e Lendo do LocalStorage
  // =========================================================================
  function carregarStorage() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  function salvarStorage(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  function escapeHtml(str) {
    return $('<div>').text(str).html();
  }
});
