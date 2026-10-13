// ====================================================================
// MINI-EXEMPLO 3: Envio de Dados com Fetch POST e JSON
// ====================================================================

// 1. Função assíncrona nomeada para processar o envio do formulário
async function cadastrarNovoServico(evento, formCadastro, campoNome, campoPreco, feedbackPost) {
  evento.preventDefault();

  const dadosParaEnvio = {
    nome: campoNome.value.trim(),
    preco: parseFloat(campoPreco.value)
  };

  try {
    const resposta = await fetch('http://127.0.0.1:5000/api/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaEnvio)
    });

    // Validação explícita sem contrações
    if (resposta.ok === false) {
      throw new Error(`O servidor retornou o código de erro: ${resposta.status}`);
    }

    const dadosResposta = await resposta.json();

    feedbackPost.className = 'alert alert-success mb-0';
    feedbackPost.classList.remove('d-none');
    feedbackPost.innerHTML = `
      <strong>${dadosResposta.mensagem}</strong><br>
      <small>ID gerado: #${dadosResposta.registro.id} | Total no servidor: ${dadosResposta.total}</small>
    `;

    formCadastro.reset();

  } catch (erro) {
    feedbackPost.className = 'alert alert-danger mb-0';
    feedbackPost.classList.remove('d-none');
    feedbackPost.innerHTML = `<strong>Falha ao enviar:</strong> ${erro.message}`;
  }
}

// 2. Controle seguro de carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('formCadastro');
  const campoNome = document.getElementById('campoNome');
  const campoPreco = document.getElementById('campoPreco');
  const feedbackPost = document.getElementById('feedbackPost');

  formCadastro.addEventListener('submit', (evento) => {
    cadastrarNovoServico(evento, formCadastro, campoNome, campoPreco, feedbackPost);
  });
});
