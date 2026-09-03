/**
 * ORQUESTRADOR CENTRAL (main.js)
 * Conecta os eventos do DOM, valida formulários e chama as camadas de serviço e visualização.
 */

import { obterServicos, salvarServico, removerServico } from './services/vitrineService.js';
import { renderizarCards, exibirToast } from './views/vitrineView.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastro');
  const container = document.getElementById('vitrineContainer');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const totalServicosBadge = document.getElementById('totalServicosBadge');

  function atualizarVitrine() {
    const todos = obterServicos();
    const categoriaSelecionada = filtroCategoria ? filtroCategoria.value : 'todas';

    const filtrados = categoriaSelecionada === 'todas'
      ? todos
      : todos.filter(item => item.categoria === categoriaSelecionada);

    renderizarCards(filtrados, container);

    if (totalServicosBadge) {
      totalServicosBadge.innerText = `${todos.length} Serviços Cadastrados`;
    }
  }

  // 1. SUBMISSÃO E VALIDAÇÃO DE FORMULÁRIO (Bootstrap 5 Validation)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        exibirToast('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
      }

      const novoServico = {
        nome: document.getElementById('nome').value.trim(),
        categoria: document.getElementById('categoria').value,
        bairro: document.getElementById('bairro').value.trim(),
        precoBase: parseFloat(document.getElementById('precoBase').value) || 0,
        telefone: document.getElementById('telefone').value.trim(),
        descricao: document.getElementById('descricao').value.trim()
      };

      salvarServico(novoServico);
      form.reset();
      form.classList.remove('was-validated');

      // Fecha o modal de cadastro se estiver aberto
      const modalEl = document.getElementById('modalCadastro');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }

      atualizarVitrine();
      exibirToast('Empreendimento cadastrado com sucesso!');
    });
  }

  // 2. EXCLUSÃO COM DELEGAÇÃO DE EVENTOS
  if (container) {
    container.addEventListener('click', (e) => {
      const btnExcluir = e.target.closest('.btn-excluir');
      if (btnExcluir) {
        const id = btnExcluir.getAttribute('data-id');
        if (confirm('Deseja realmente remover este serviço da vitrine comunitária?')) {
          removerServico(id);
          atualizarVitrine();
          exibirToast('Serviço removido com sucesso.', 'warning');
        }
      }
    });
  }

  // 3. FILTRO EM TEMPO REAL
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', atualizarVitrine);
  }

  // Carga inicial
  atualizarVitrine();
});
