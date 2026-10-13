// ====================================================================
// MINI-EXEMPLO 2: Microservidor Flask & Consumo Cross-Origin (CORS)
// ====================================================================

// 1. Função assíncrona nomeada que consulta a API do Flask
async function consultarStatusApi(resultadoStatus) {
  try {
    const resposta = await fetch('http://127.0.0.1:5000/api/status');
    const dados = await resposta.json();

    resultadoStatus.className = 'alert alert-success mb-0';
    resultadoStatus.innerHTML = `
      <strong>Status:</strong> ${dados.status} <br>
      <strong>Servidor:</strong> ${dados.servidor} <br>
      <strong>Origem:</strong> ${dados.cidade}
    `;
  } catch (erro) {
    resultadoStatus.className = 'alert alert-danger mb-0';
    resultadoStatus.innerHTML = `
      <strong>Erro de Conexão:</strong> Não foi possível acessar a API.<br>
      <small>Verifique se o server.py está rodando ou se houve bloqueio de CORS.</small>
    `;
  }
}

// 2. Controle seguro de carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  const btnConectar = document.getElementById('btnConectar');
  const resultadoStatus = document.getElementById('resultadoStatus');

  btnConectar.addEventListener('click', () => consultarStatusApi(resultadoStatus));
});
