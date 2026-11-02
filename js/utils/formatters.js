/**
 * Funções utilitárias puras de escape, formatação e status temporal
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normaliza qualquer formato de data (ISO com T, PT-BR DD/MM/AAAA, Date objeto)
 * para o formato padrão interoperável YYYY-MM-DD.
 */
export function normalizarPrazo(prazo) {
  if (!prazo) return '';
  if (prazo instanceof Date) {
    if (isNaN(prazo.getTime())) return '';
    return prazo.toISOString().slice(0, 10);
  }
  const str = String(prazo).trim();
  if (!str || str === 'undefined' || str === 'null' || str === 'NaN') return '';

  // Se vier com horário ISO (ex.: 2026-11-07T03:00:00.000Z ou 2026-11-07 23:59)
  if (str.includes('T')) {
    const parteData = str.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(parteData)) return parteData;
  }
  if (str.includes(' ')) {
    const parteData = str.split(' ')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(parteData)) return parteData;
    const matchPtBrEspaco = parteData.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (matchPtBrEspaco) {
      return `${matchPtBrEspaco[3]}-${matchPtBrEspaco[2].padStart(2, '0')}-${matchPtBrEspaco[1].padStart(2, '0')}`;
    }
  }

  // Se já estiver em YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Se estiver em formato brasileiro DD/MM/AAAA
  const matchPtBr = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (matchPtBr) {
    const dia = matchPtBr[1].padStart(2, '0');
    const mes = matchPtBr[2].padStart(2, '0');
    const ano = matchPtBr[3];
    return `${ano}-${mes}-${dia}`;
  }

  // Tenta converter via construtor Date
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }
  return '';
}

export function formatarData(dataStr) {
  const norm = normalizarPrazo(dataStr);
  if (!norm) return '-';
  const partes = norm.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataStr;
}

export function calcularStatusPrazo(prazoStr, concluida, horaPrazo) {
  if (concluida) {
    return {
      classe: 'badge-pill-green',
      texto: '<i class="fa-solid fa-circle-check"></i> Concluída',
      urgente: false
    };
  }

  const prazoNormalizado = normalizarPrazo(prazoStr);
  if (!prazoNormalizado) {
    return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataPrazo = new Date(`${prazoNormalizado}T${horaPrazo || '23:59'}:59`);

  // Se a data for inválida, nunca exibe NaN
  if (isNaN(dataPrazo.getTime())) {
    return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
  }

  const diffMs = dataPrazo - hoje;
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (isNaN(diffDias)) {
    return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
  }

  if (dataPrazo < new Date() && diffDias >= 0) {
    return {
      classe: 'badge-pill-red',
      texto: '<i class="fa-solid fa-lock"></i> Prazo encerrado',
      urgente: true
    };
  }
  if (diffDias < 0) {
    const diasAtras = Math.abs(diffDias);
    return {
      classe: 'badge-pill-red',
      texto: `<i class="fa-solid fa-triangle-exclamation"></i> Encerrada há ${diasAtras}d`,
      urgente: true
    };
  } else if (diffDias === 0) {
    return {
      classe: 'badge-pill-red',
      texto: '<i class="fa-solid fa-clock"></i> Entrega Hoje!',
      urgente: true
    };
  } else if (diffDias === 1) {
    return {
      classe: 'badge-pill-amber',
      texto: '<i class="fa-solid fa-hourglass-start"></i> Entrega Amanhã',
      urgente: true
    };
  } else if (diffDias <= 5) {
    return {
      classe: 'badge-pill-amber',
      texto: `<i class="fa-solid fa-hourglass-half"></i> Faltam ${diffDias} dias`,
      urgente: false
    };
  } else {
    return {
      classe: 'badge-pill-blue',
      texto: `<i class="fa-solid fa-calendar-check"></i> Faltam ${diffDias} dias`,
      urgente: false
    };
  }
}

/**
 * Constrói o botão de recurso de apoio adaptado contextualmente (Moodle, PDF, GitHub ou genérico)
 */
export function gerarBotaoRecursoDemanda(d) {
  let link = (d.linkApoio || '').trim();

  // Garante que demandas do Curso 1 e Curso 2 sempre tenham o link oficial das respectivas salas no Moodle
  if (d.id === 'DEM-SNCT-C1' && (!link || link.includes('main.pdf'))) {
    link = 'https://moodle.ifsc.edu.br/course/view.php?id=2663';
  } else if (d.id === 'DEM-SNCT-C2' && (!link || link.includes('main.pdf'))) {
    link = 'https://moodle.ifsc.edu.br/course/view.php?id=2664';
  }

  if (!link) return '';

  const linkEsc = escapeHtml(link);

  if (d.id === 'DEM-SNCT-C1' || link.includes('id=2663')) {
    return `
      <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
         class="btn btn-sm btn-outline-primary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
         title="Abrir Sala Oficial do Curso 1 no Moodle IFSC (id=2663)">
        <i class="bi bi-mortarboard-fill"></i> Sala Curso 1 no Moodle <i class="bi bi-box-arrow-up-right"></i>
      </a>
    `;
  }

  if (d.id === 'DEM-SNCT-C2' || link.includes('id=2664')) {
    return `
      <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
         class="btn btn-sm btn-outline-success py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
         title="Abrir Sala Oficial do Curso 2 no Moodle IFSC (id=2664)">
        <i class="bi bi-mortarboard-fill"></i> Sala Curso 2 no Moodle <i class="bi bi-box-arrow-up-right"></i>
      </a>
    `;
  }

  if (link.includes('moodle.ifsc.edu.br')) {
    return `
      <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
         class="btn btn-sm btn-outline-primary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
         title="Abrir Sala no Moodle IFSC">
        <i class="bi bi-mortarboard-fill"></i> Abrir Sala no Moodle <i class="bi bi-box-arrow-up-right"></i>
      </a>
    `;
  }

  if (link.toLowerCase().endsWith('.pdf') || link.includes('.pdf?')) {
    return `
      <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
         class="btn btn-sm btn-outline-secondary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
         title="Abrir Documento ou Roteiro em PDF">
        <i class="bi bi-file-earmark-pdf"></i> Abrir Roteiro PDF <i class="bi bi-box-arrow-up-right"></i>
      </a>
    `;
  }

  if (link.includes('github.com')) {
    return `
      <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
         class="btn btn-sm btn-outline-dark py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
         title="Abrir Repositório no GitHub">
        <i class="bi bi-github"></i> Abrir no GitHub <i class="bi bi-box-arrow-up-right"></i>
      </a>
    `;
  }

  return `
    <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
       class="btn btn-sm btn-outline-primary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
       title="Abrir recurso ou sala de apoio">
      <i class="bi bi-box-arrow-up-right"></i> Abrir Recurso
    </a>
  `;
}
