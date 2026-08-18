/**
 * ProgWeb 2 — Exemplo 11: Cadastro de Clientes com LocalStorage
 * Manipulação Dinâmica do DOM (jQuery) e Persistência no Navegador
 */

$(document).ready(function() {

  // 1. Carregar lista de clientes do LocalStorage de forma segura
  let clientes = [];
  try {
    const dadosSalvos = localStorage.getItem('lista_clientes_progweb2');
    if (dadosSalvos) {
      clientes = JSON.parse(dadosSalvos);
    }
  } catch (e) {
    console.error('Erro ao ler do LocalStorage:', e);
    clientes = [];
  }

  // 2. Função auxiliar para escapar caracteres HTML e prevenir XSS
  function escapeHtml(texto) {
    return $('<div>').text(texto || '').html();
  }

  // 3. Função para renderizar a tabela HTML com base no array clientes
  function renderTabela() {
    const $corpo = $('#tabela-corpo');
    $corpo.empty();

    if (!clientes || clientes.length === 0) {
      $corpo.append(`
        <tr id="linha-vazia">
          <td colspan="3" class="text-center text-secondary py-3">
            <i class="bi bi-inbox me-1"></i> Nenhum cliente cadastrado no LocalStorage.
          </td>
        </tr>
      `);
      return;
    }

    clientes.forEach(function(cliente, index) {
      const tr = `
        <tr>
          <td><i class="bi bi-person-fill me-1 text-primary"></i> ${escapeHtml(cliente.nome)}</td>
          <td><i class="bi bi-envelope-fill me-1 text-secondary"></i> ${escapeHtml(cliente.email)}</td>
          <td class="text-center">
            <button type="button" class="btn btn-danger btn-sm btn-excluir" data-index="${index}">
              <i class="bi bi-trash-fill me-1"></i> Remover
            </button>
          </td>
        </tr>
      `;
      $corpo.append(tr);
    });
  }

  // Renderizar a tabela no carregamento inicial da página (F5)
  renderTabela();

  // 4. Captura do formulário de cadastro (#form-cadastro)
  $('#form-cadastro').on('submit', function(e) {
    e.preventDefault();

    const nome = $('#input-nome').val().trim();
    const email = $('#input-email').val().trim();

    if (!nome || !email) {
      alert('Por favor, preencha o Nome e o E-mail antes de cadastrar!');
      return;
    }

    // Adiciona o novo objeto no array
    clientes.push({ nome: nome, email: email });

    // Salva o array atualizado no LocalStorage em formato JSON
    localStorage.setItem('lista_clientes_progweb2', JSON.stringify(clientes));

    // Atualiza a interface
    renderTabela();

    // Limpa os campos do formulário
    $('#form-cadastro')[0].reset();
    $('#input-nome').focus();

    // Exibe feedback de sucesso
    $('#caixa-mensagem')
      .removeClass('d-none alert-danger alert-info')
      .addClass('alert-success')
      .html(`🎉 <strong>Sucesso!</strong> Cliente <u>${escapeHtml(nome)}</u> salvo no LocalStorage.`)
      .hide()
      .slideDown(300);
  });

  // 5. Remoção de cliente ao clicar no botão Excluir
  $('#tabela-corpo').on('click', '.btn-excluir', function() {
    const index = parseInt($(this).attr('data-index'), 10);
    
    if (!isNaN(index) && index >= 0 && index < clientes.length) {
      const clienteRemovido = clientes[index];
      clientes.splice(index, 1);
      
      // Atualiza o LocalStorage
      localStorage.setItem('lista_clientes_progweb2', JSON.stringify(clientes));
      
      // Redesenha a tabela
      renderTabela();

      // Exibe feedback de remoção
      $('#caixa-mensagem')
        .removeClass('d-none alert-success alert-info')
        .addClass('alert-danger')
        .html(`🗑️ Cliente <u>${escapeHtml(clienteRemovido.nome)}</u> removido.`)
        .hide()
        .slideDown(300);
    }
  });

  // 6. Botão para limpar todo o LocalStorage
  $('#btn-limpar-storage').on('click', function() {
    if (confirm('Tem certeza que deseja apagar todos os clientes salvos no LocalStorage?')) {
      clientes = [];
      localStorage.removeItem('lista_clientes_progweb2');
      renderTabela();
      $('#caixa-mensagem')
        .removeClass('d-none alert-success alert-danger')
        .addClass('alert-info')
        .html('🧹 LocalStorage limpo com sucesso.')
        .hide()
        .slideDown(300);
    }
  });

});
