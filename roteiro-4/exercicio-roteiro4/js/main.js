/**
 * ORQUESTRADOR CENTRAL (main.js)
 * Conecta os eventos do DOM, valida formulários e orquestra o CRUD completo (Create, Read, Update, Delete).
 */

import {
  obterServicos,
  salvarServico,
  atualizarServico,
  removerServico
} from './services/vitrineService.js';
import { renderizarCards, exibirToast } from './views/vitrineView.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formCadastro');
  const container = document.getElementById('vitrineContainer');
  const filtroCategoria = document.getElementById('filtroCategoria');
  const totalServicosBadge = document.getElementById('totalServicosBadge');
  const modalEl = document.getElementById('modalCadastro');
  const modalTitulo = document.getElementById('modalCadastroLabel');
  const btnSalvarTexto = document.getElementById('btnSalvarTexto');
  const servicoIdInput = document.getElementById('servicoId');

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

  function resetarFormulario() {
    if (form) {
      form.reset();
      form.classList.remove('was-validated');
    }
    if (servicoIdInput) servicoIdInput.value = '';
    if (modalTitulo) {
      modalTitulo.innerHTML = '<i class="bi bi-shop text-success me-2"></i>Cadastrar Serviço na Vitrine';
    }
    if (btnSalvarTexto) {
      btnSalvarTexto.innerText = 'Salvar na Vitrine';
    }
  }

  // 1. SUBMISSÃO DO FORMULÁRIO (CREATE & UPDATE COM VALIDAÇÃO BOOTSTRAP 5)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        exibirToast('Por favor, preencha todos os campos obrigatórios.', 'danger');
        return;
      }

      const idAtual = servicoIdInput ? servicoIdInput.value : '';
      const dadosServico = {
        nome: document.getElementById('nome').value.trim(),
        categoria: document.getElementById('categoria').value,
        bairro: document.getElementById('bairro').value.trim(),
        precoBase: parseFloat(document.getElementById('precoBase').value) || 0,
        telefone: document.getElementById('telefone').value.trim(),
        descricao: document.getElementById('descricao').value.trim()
      };

      if (idAtual) {
        // UPDATE (Atualização de item existente)
        atualizarServico(idAtual, dadosServico);
        exibirToast('Serviço atualizado com sucesso!');
      } else {
        // CREATE (Novo cadastro)
        salvarServico(dadosServico);
        exibirToast('Empreendimento cadastrado com sucesso!');
      }

      // Fecha o modal e limpa o formulário
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
      }
      resetarFormulario();
      atualizarVitrine();
    });
  }

  // Reseta campos ao fechar ou reabrir o modal para novo cadastro
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', resetarFormulario);
  }

  // 2. DELEGAÇÃO DE EVENTOS: EDIÇÃO (UPDATE) E EXCLUSÃO (DELETE)
  if (container) {
    container.addEventListener('click', (e) => {
      // Operação UPDATE: Carregar dados no modal para edição
      const btnEditar = e.target.closest('.btn-editar');
      if (btnEditar) {
        const id = btnEditar.getAttribute('data-id');
        const servico = obterServicos().find(s => s.id === id);

        if (servico) {
          if (servicoIdInput) servicoIdInput.value = servico.id;
          document.getElementById('nome').value = servico.nome;
          document.getElementById('categoria').value = servico.categoria;
          document.getElementById('bairro').value = servico.bairro;
          document.getElementById('precoBase').value = servico.precoBase;
          document.getElementById('telefone').value = servico.telefone;
          document.getElementById('descricao').value = servico.descricao;

          if (modalTitulo) {
            modalTitulo.innerHTML = '<i class="bi bi-pencil-square text-primary me-2"></i>Editar Serviço da Vitrine';
          }
          if (btnSalvarTexto) {
            btnSalvarTexto.innerText = 'Atualizar Dados';
          }

          if (modalEl) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
            modalInstance.show();
          }
        }
        return;
      }

      // Operação DELETE: Remover serviço
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

  // 3. READ & FILTRO EM TEMPO REAL
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', atualizarVitrine);
  }

  // Carga inicial dos dados
  atualizarVitrine();
});
