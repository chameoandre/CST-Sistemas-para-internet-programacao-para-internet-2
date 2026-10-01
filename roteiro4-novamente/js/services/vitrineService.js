// js/services/vitrineService.js
/**
 * CAMADA DE DADOS & SERVIÇOS (vitrineService.js)
 * Responsável estrita por ler, gravar e manipular itens no LocalStorage.
 * Não toca no DOM nem cria elementos visuais.
 */

const STORAGE_KEY = 'garopaba_vitrine_servicos';

// Dados modelo semente para enriquecer a experiência inicial de aprendizado
export const DADOS_INICIAIS = [
  {
    id: '1',
    nome: 'Maré Alta Artesanatos & Cerâmicas',
    categoria: 'Artesanato',
    bairro: 'Centro Histórico',
    precoBase: 35.00,
    telefone: '48991234567',
    descricao: 'Peças artesanais e utilitárias modeladas à mão com argila local e conchas de Garopaba.'
  },
  {
    id: '2',
    nome: 'Garopaba Web & Design Studio',
    categoria: 'Tecnologia',
    bairro: 'Ferrugem',
    precoBase: 150.00,
    telefone: '48998765432',
    descricao: 'Criação de websites profissionais responsivos, cardápios digitais e suporte para comércio local.'
  },
  {
    id: '3',
    nome: 'Pescado Fresco do Zequinha',
    categoria: 'Alimentação',
    bairro: 'Canto das Canoas',
    precoBase: 42.00,
    telefone: '48984561234',
    descricao: 'Peixes frescos e frutos do mar da pesca artesanal diária entregues com higiene e pontualidade.'
  }
];

/**
 * Função dedicada para carregar os dados modelo iniciais no LocalStorage
 */
export function carregarDadosIniciais() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DADOS_INICIAIS));
  return DADOS_INICIAIS;
}

/**
 * READ: Recupera a lista completa de serviços do LocalStorage.
 * Se o armazenamento estiver vazio, carrega automaticamente os dados modelo iniciais.
 */
export function obterServicos() {
  const dados = localStorage.getItem(STORAGE_KEY);
  if (!dados) {
    return carregarDadosIniciais();
  }
  try {
    return JSON.parse(dados);
  } catch (e) {
    console.error('Erro ao processar dados da vitrine:', e);
    return [];
  }
}

/**
 * CREATE: Salva um novo serviço no LocalStorage gerando ID único e timestamp
 */
export function salvarServico(novoServico) {
  const servicos = obterServicos();
  const servicoCompleto = {
    id: Date.now().toString(),
    dataCadastro: new Date().toISOString(),
    ...novoServico
  };

  servicos.unshift(servicoCompleto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos));
  return servicoCompleto;
}

/**
 * UPDATE: Atualiza os dados de um serviço existente a partir do seu ID
 */
export function atualizarServico(id, dados) {
  const servicos = obterServicos();
  const index = servicos.findIndex(s => s.id === id);

  if (index !== -1) {
    servicos[index] = {
      ...servicos[index],
      ...dados,
      dataEdicao: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos));
    return servicos[index];
  }
  return null;
}

/**
 * DELETE: Remove um serviço do LocalStorage filtrando pelo ID
 */
export function removerServico(id) {
  const servicos = obterServicos();
  const filtrados = servicos.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
  return filtrados;
}
