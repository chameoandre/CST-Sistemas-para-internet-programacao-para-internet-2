import { formatarMoeda, formatarTelefone, escapeHtml }
from '../utils/formatters.js';


// Mapeamento de cores para categorias (incluir no roteiro)
const CORES_CATEGORIA = {
'Alimentação': 'success',
'Tecnologia': 'info',
'Artesanato': 'warning',
'Serviços Gerais': 'primary',
'Turismo': 'secondary'
};


// Função para criar o HTML de um card de serviço. Ele é responsável por 
// gerar a estrutura visual de cada serviço na vitrine, incluindo informações como 
// categoria, preço, nome, bairro, descrição e telefone. Além disso, ele adiciona botões para editar e excluir o serviço.

export function criarCardHtml(s) {
    const corBadge = CORES_CATEGORIA[s.categoria] || 'primary';
    const telNumeros = (s.telefone || '').replace(/\D/g,'');


    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm border-0 vitrine-card rounded-4 overflow-hidden">
                <div class="card-body p-4 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-${corBadge} px-3 py-2 rounded-pill font-outfit">
                            <i class="bi bi-tag-fill me-1"></i>${escapeHtml(s.categoria)}
                        </span>
                        <span class="fw-bold text-success font-outfit fs-5">
                            ${formatarMoeda(s.precoBase)}
                        </span>
                    </div>
                    <h5 class="card-title fw-bold text-dark mt-2 mb-1">${escapeHtml(s.nome)}</h5>
                    <h6 class="text-muted small mb-3">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHtml(s.bairro)}
                    </h6>
                    <p class="card-text text-secondary small flex-grow-1" style="line-height: 1.5;">
                        ${escapeHtml(s.descricao)}
                    </p>
                    <hr class="my-3 text-muted opacity-25">

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <a href="https://wa.me/55${telNumeros}" target="_blank" class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold">
                        <i class="bi bi-whatsapp me-1"></i>${formatarTelefone(s.telefone)}
                        </a>

}
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary btn-editar rounded-pill px-2"data-id="${s.id}" title="Editar serviço">
                            <i class="bi bi-pencil-square"></i>
                        </button>

                        <button class="btn btn-sm btn-outline-danger btn-excluir rounded-pill px-2" data-id="${s.id}" title="Remover da vitrine">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

}



// Renderização dinâmica dos cards e tratamento de estado vazio
export function renderizarCards(servicos, containerElement) {
    if (!servicos || servicos.length === 0) {
        containerElement.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="p-4 rounded-4 bg-light border">
                    <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                    <h5 class="fw-bold text-secondary mb-1">Nenhum serviço cadastrado nesta categoria</h5>
                    <p class="text-muted small mb-0">Cadastre um novo serviço ou altere o filtro acima.</p>
                </div>
            </div>
        `;
        return;
    }
    // Renderiza os cards de serviços na vitrine para 
    // que o usuário possa visualizar e interagir com eles.
    containerElement.innerHTML = servicos.map(criarCardHtml).join('');
}



// Notificações flutuantes assíncronas (Toasts) com auto-fechamento
export function exibirToast(mensagem, tipo = 'success') {
    const toastEl = document.getElementById('toastNotificacao');
    const toastMsg = document.getElementById('toastMensagem');
    const toastTitulo = document.getElementById('toastTitulo');

    // Exibe uma notificação flutuante (toast) na tela com a mensagem e o tipo especificados. 
    // O tipo pode ser 'success' para sucesso ou 'warning' para aviso. A notificação é exibida por 
    // um curto período de tempo e desaparece automaticamente.
    if (toastEl && toastMsg) {
        toastMsg.innerText = mensagem;
        if (toastTitulo) {
            toastTitulo.innerText = tipo === 'success' ? 'Sucesso!' : 'Aviso';
        }
        
        // Atualiza a classe do toast para refletir o tipo de notificação (sucesso ou aviso) e 
        // cria uma instância do toast usando o Bootstrap. Em seguida, exibe o toast na tela.
        toastEl.className = `toast align-items-center text-bg-${tipo} border-0 shadow-lg`
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 });
        toast.show();
    }
}


