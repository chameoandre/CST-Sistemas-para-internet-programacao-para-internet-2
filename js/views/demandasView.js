/**
 * Camada de Visualização: Central de Demandas, Checkpoints e Filtros
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import { escapeHtml, calcularStatusPrazo } from "../utils/formatters.js";

export function obterMetadadosVisuaisDemanda(d) {
  const id = String(d.id || '').toUpperCase();
  if (id === 'DEM-SNCT-01') {
    return {
      etapaBadge: 'ETAPA 1 · CANDIDATURA',
      badgeCor: 'bg-success-subtle text-success border border-success-subtle',
      icone: 'bi-people-fill',
      corIcone: '#059669',
      bgIcone: 'rgba(5, 150, 105, 0.12)'
    };
  }
  if (id === 'DEM-SNCT-C1') {
    return {
      etapaBadge: 'ETAPA 2 · CURSO 1 (MOODLE)',
      badgeCor: 'bg-info-subtle text-dark border border-info-subtle',
      icone: 'bi-mortarboard-fill',
      corIcone: 'var(--accent-blue)',
      bgIcone: 'rgba(2, 132, 199, 0.12)'
    };
  }
  if (id === 'DEM-SNCT-C2') {
    return {
      etapaBadge: 'ETAPA 2 · CURSO 2 (MOODLE)',
      badgeCor: 'bg-success-subtle text-success border border-success-subtle',
      icone: 'bi-mortarboard-fill',
      corIcone: '#059669',
      bgIcone: 'rgba(5, 150, 105, 0.12)'
    };
  }
  if (id === 'DEM-SNCT-E3') {
    return {
      etapaBadge: 'ETAPA 3 · REVISÃO EM PAR',
      badgeCor: 'bg-primary-subtle text-primary border border-primary-subtle',
      icone: 'bi-check2-all',
      corIcone: 'var(--accent-blue)',
      bgIcone: 'rgba(2, 132, 199, 0.12)'
    };
  }
  if (id === 'DEM-SNCT-E4') {
    return {
      etapaBadge: 'ETAPA 4 · ENSAIO 120M',
      badgeCor: 'bg-secondary-subtle text-dark border',
      icone: 'bi-stopwatch-fill',
      corIcone: 'var(--accent-purple)',
      bgIcone: 'rgba(147, 51, 234, 0.12)'
    };
  }
  if (id === 'DEM-SNCT-E5') {
    return {
      etapaBadge: 'ETAPA 5 · OFICINAS SNCT',
      badgeCor: 'bg-danger-subtle text-danger border border-danger-subtle',
      icone: 'bi-rocket-takeoff-fill',
      corIcone: '#e11d48',
      bgIcone: 'rgba(225, 29, 72, 0.12)'
    };
  }
  if (id === 'DEM-02') {
    return {
      etapaBadge: 'CONSOLIDAÇÃO A2 · EXTENSÃO',
      badgeCor: 'bg-primary-subtle text-primary border',
      icone: 'bi-award-fill',
      corIcone: 'var(--accent-blue)',
      bgIcone: 'rgba(2, 132, 199, 0.12)'
    };
  }
  if (id === 'DEM-03') {
    return {
      etapaBadge: 'PROJETO A3 · VITRINE FLASK',
      badgeCor: 'bg-success-subtle text-success border',
      icone: 'bi-layers-fill',
      corIcone: '#059669',
      bgIcone: 'rgba(5, 150, 105, 0.12)'
    };
  }
  if (id === 'DEM-01') {
    return {
      etapaBadge: 'AVALIAÇÃO A1 · TEÓRICA',
      badgeCor: 'bg-warning-subtle text-warning border',
      icone: 'bi-journal-bookmark-fill',
      corIcone: 'var(--accent-amber)',
      bgIcone: 'rgba(217, 119, 6, 0.12)'
    };
  }
  return {
    etapaBadge: 'ROTEIROS A4 · LABORATÓRIO',
    badgeCor: 'bg-secondary-subtle text-secondary border',
    icone: 'bi-code-square',
    corIcone: '#64748b',
    bgIcone: 'rgba(100, 116, 139, 0.12)'
  };
}

export function atualizarContadoresDemandas(demandas = [], avaliacoes = []) {
  const statTotal = document.getElementById('statTotalDemandas');
  const statAtivas = document.getElementById('statDemandasAtivas');
  const statConcluidas = document.getElementById('statDemandasConcluidas');
  const statAvaliacoes = document.getElementById('statAvaliacoesRegistradas');

  const ativas = demandas.filter(d => !d.concluida).length;
  const concluidas = demandas.filter(d => d.concluida).length;

  if (statTotal) statTotal.textContent = demandas.length;
  if (statAtivas) statAtivas.textContent = ativas;
  if (statConcluidas) statConcluidas.textContent = concluidas;
  if (statAvaliacoes) statAvaliacoes.textContent = avaliacoes.length;
}

export function renderizarTabelaChecklistFrentesDemanda(demandaId, cursoId, demandasSnct = []) {
  if (demandaId !== 'DEM-SNCT-C1' && demandaId !== 'DEM-SNCT-C2') return '';

  const cId = cursoId || (demandaId === 'DEM-SNCT-C1' ? 1 : 2);
  const frentes = (demandasSnct || []).filter(f => f.cursoId === cId);

  const dadosFrentesInfo = cId === 1 ? [
    {
      id: 'c1-frente-didatica',
      nome: 'Frente 1: Didática & Roteiro',
      icone: 'bi-journal-check',
      corIcone: '#0284c7',
      secaoMoodle: 'Seção Geral (0) e 1 a 4',
      entregavel: 'Rascunho do Micro-Roteiro em PDF (4 págs. LaTeX) + 5 Seções da sala organizadas',
      badgeArquivo: 'micro-roteiro-c1.pdf'
    },
    {
      id: 'c1-frente-starterkit',
      nome: 'Frente 2: Starter Kit Código',
      icone: 'bi-code-slash',
      corIcone: '#059669',
      secaoMoodle: 'Seção 1 (Código Inicial)',
      entregavel: 'Repositório template no GitHub + upload do pacote starter-kit-snct.zip na Seção 1',
      badgeArquivo: 'starter-kit-snct.zip'
    },
    {
      id: 'c1-frente-slides',
      nome: 'Frente 3: Slides 8 Telas',
      icone: 'bi-easel2',
      corIcone: '#d97706',
      secaoMoodle: 'Seção 0 (Apresentação)',
      entregavel: 'Apresentação no GitHub Pages + Link e PDF de contingência vinculados na Seção 0',
      badgeArquivo: 'slides-8-telas'
    },
    {
      id: 'c1-frente-monitoria',
      nome: 'Frente 4: Monitoria & Apoio',
      icone: 'bi-people',
      corIcone: '#9333ea',
      secaoMoodle: 'Seção 4 (Avaliação)',
      entregavel: 'Chave SNCT2026 testada + Pesquisa de Satisfação (3 perguntas) criada na Seção 4',
      badgeArquivo: 'chave-SNCT2026'
    }
  ] : [
    {
      id: 'c2-frente-didatica',
      nome: 'Frente 1: Didática & Roteiro',
      icone: 'bi-journal-check',
      corIcone: '#0284c7',
      secaoMoodle: 'Seção Geral (0) e 1 a 4',
      entregavel: 'Rascunho do Micro-Roteiro Painel Verde (4 págs. LaTeX) + 5 Seções da sala',
      badgeArquivo: 'micro-roteiro-c2.pdf'
    },
    {
      id: 'c2-frente-starterkit',
      nome: 'Frente 2: Starter Kit Código',
      icone: 'bi-code-slash',
      corIcone: '#059669',
      secaoMoodle: 'Seção 1 (Código Inicial)',
      entregavel: 'Repositório template no GitHub + pacote starter-kit-painel-verde.zip na Seção 1',
      badgeArquivo: 'starter-kit-painel-verde.zip'
    },
    {
      id: 'c2-frente-slides',
      nome: 'Frente 3: Slides 8 Telas',
      icone: 'bi-easel2',
      corIcone: '#d97706',
      secaoMoodle: 'Seção 0 (Apresentação)',
      entregavel: 'Apresentação no GitHub Pages + Link e PDF de contingência vinculados na Seção 0',
      badgeArquivo: 'slides-8-telas'
    },
    {
      id: 'c2-frente-monitoria',
      nome: 'Frente 4: Monitoria & Apoio',
      icone: 'bi-people',
      corIcone: '#9333ea',
      secaoMoodle: 'Seção 4 (Avaliação)',
      entregavel: 'Chave SNCT2026 testada + Pesquisa de Satisfação (3 perguntas) criada na Seção 4',
      badgeArquivo: 'chave-SNCT2026'
    }
  ];

  const moodleUrl = cId === 1 ? 'https://moodle.ifsc.edu.br/course/view.php?id=2663' : 'https://moodle.ifsc.edu.br/course/view.php?id=2664';

  const linhasHtml = dadosFrentesInfo.map(fInfo => {
    const fReal = frentes.find(f => f.id === fInfo.id);
    const membros = (fReal && Array.isArray(fReal.membros)) ? fReal.membros : [];
    const membroComLink = membros.find(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
    const linkEntrega = membroComLink ? membroComLink.linkEntrega.trim() : '';
    const entregue = Boolean(linkEntrega);

    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <span class="fs-6" style="color: ${fInfo.corIcone};"><i class="bi ${fInfo.icone}"></i></span>
            <div>
              <div class="fw-bold text-heading">${escapeHtml(fInfo.nome)}</div>
              <div class="text-muted fs-label">
                ${membros.length > 0 ? `${membros.length} estudante(s) escalado(s)` : 'Aguardando trio'}
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge bg-light text-dark border font-mono">
            <i class="bi bi-folder2-open me-1 text-primary"></i>${escapeHtml(fInfo.secaoMoodle)}
          </span>
        </td>
        <td>
          <div class="text-secondary mb-1">${escapeHtml(fInfo.entregavel)}</div>
          <span class="badge bg-secondary-subtle text-secondary font-code fs-label">
            ${escapeHtml(fInfo.badgeArquivo)}
          </span>
        </td>
        <td class="text-center">
          ${entregue ? `
            <div class="d-inline-flex flex-column align-items-center gap-1">
              <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                <i class="bi bi-check-circle-fill me-1"></i> Entregue
              </span>
              <a href="${escapeHtml(linkEntrega)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-link p-0 fs-label text-success fw-bold" title="Abrir link de entrega da frente">
                <i class="bi bi-box-arrow-up-right me-1"></i>Ver Link
              </a>
            </div>
          ` : `
            <span class="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1">
              <i class="bi bi-hourglass-split me-1 text-warning"></i> Pendente
            </span>
          `}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="mb-3 p-2 rounded" style="background: var(--bg-card); border: 1px solid var(--border-color);">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2 px-1">
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-primary-subtle text-primary border border-primary-subtle font-outfit">
            <i class="fa-solid fa-list-check me-1"></i> CHECKLIST OPERACIONAL POR FRENTE (SALA MOODLE ID=${cId === 1 ? '2663' : '2664'})
          </span>
          <span class="fs-caption text-muted">Cada trio executa e publica seu entregável na seção indicada:</span>
        </div>
        <a href="${moodleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary py-0 px-2 fs-label fw-bold d-inline-flex align-items-center gap-1">
          <i class="bi bi-mortarboard-fill"></i> Acessar Sala Curso ${cId} no Moodle <i class="bi bi-box-arrow-up-right ms-1"></i>
        </a>
      </div>

      <div class="table-responsive">
        <table class="table table-sm align-middle mb-0 fs-caption">
          <thead style="background: var(--bg-card-hover);">
            <tr class="text-muted fs-label">
              <th style="width: 26%;">Frente de Trabalho</th>
              <th style="width: 22%;">Local na Sala Moodle</th>
              <th style="width: 38%;">Entregável Obrigatório (Até 07/11 às 23:59)</th>
              <th style="width: 14%; text-align: center;">Checkpoint</th>
            </tr>
          </thead>
          <tbody>
            ${linhasHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
