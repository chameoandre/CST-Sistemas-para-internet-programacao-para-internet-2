/**
 * Camada de Visualização: Jornada SNCT, Frentes Cirúrgicas e Minicursos
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import { escapeHtml } from "../utils/formatters.js";
import { showTab } from "./navigationView.js";

export function navegarParaEtapaSNCT(etapaNum) {
  if (etapaNum === 1) {
    showTab('tab-extensao');
    setTimeout(() => {
      const collapse = document.getElementById('collapseQuadroFrentes');
      if (collapse) collapse.open = true;
      const el = document.getElementById('painelNominalCandidaturasSNCT') || document.getElementById('quadroDemandasSNCT');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('snct-step-highlight');
        setTimeout(() => el.classList.remove('snct-step-highlight'), 2200);
      }
    }, 150);
  } else if (etapaNum === 2) {
    showTab('tab-extensao');
    setTimeout(() => {
      const collapse = document.getElementById('collapseQuadroFrentes');
      if (collapse) collapse.open = true;
      const el = document.getElementById('containerFrentesCurso1');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('snct-step-highlight');
        setTimeout(() => el.classList.remove('snct-step-highlight'), 2200);
      }
    }, 150);
  } else {
    showTab('tab-demandas');
    const idMap = { 3: 'DEM-SNCT-E3', 4: 'DEM-SNCT-E4', 5: 'DEM-SNCT-E5' };
    const dId = idMap[etapaNum];
    setTimeout(() => {
      const card = document.getElementById(`demanda-card-${dId}`) || document.querySelector(`.demanda-card[data-demanda-id="${dId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('snct-step-highlight');
        setTimeout(() => card.classList.remove('snct-step-highlight'), 2200);
      }
    }, 150);
  }
}

export function renderizarCardHeroRoteirosSNCT(demandasSnct = [], usuarioLogado = null) {
  let totalVagas = 0;
  let totalOcupadas = 0;
  let totalFrentes = demandasSnct.length;
  let frentesCompletas = 0;
  let frentesComEntrega = 0;
  let minhaFrente = null;

  demandasSnct.forEach(d => {
    const vagasMax = (d.vagasMax || 3);
    totalVagas += vagasMax;
    const membros = Array.isArray(d.membros) ? d.membros : [];
    totalOcupadas += membros.length;
    if (membros.length >= vagasMax) frentesCompletas++;
    if (membros.some(m => m.linkEntrega && m.linkEntrega.trim().length > 0)) frentesComEntrega++;
    if (usuarioLogado && usuarioLogado.alunoId) {
      const achou = membros.find(m => String(m.alunoId) === String(usuarioLogado.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogado.matricula)));
      if (achou) minhaFrente = { frente: d, membro: achou };
    }
  });

  const vagasRestantes = Math.max(0, totalVagas - totalOcupadas);
  const pctVagas = totalVagas > 0 ? Math.round((totalOcupadas / totalVagas) * 100) : 0;

  const contadorEl = document.getElementById('heroSnctContadorVagas');
  const barEl = document.getElementById('heroSnctProgressBar');
  if (contadorEl) contadorEl.textContent = `${totalOcupadas} / ${totalVagas} vagas`;
  if (barEl) barEl.style.width = `${pctVagas}%`;

  const statusBox = document.getElementById('heroSnctStatusUsuario');
  if (statusBox) {
    if (minhaFrente) {
      statusBox.innerHTML = `
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div class="fw-bold text-success fs-caption"><i class="bi bi-patch-check-fill me-1"></i>Sua Frente Atribuída:</div>
            <div class="text-heading fw-semibold fs-body-sm">${escapeHtml(minhaFrente.frente.titulo)}</div>
            <div class="text-muted fs-label">${escapeHtml(minhaFrente.frente.cursoNome)}</div>
          </div>
          ${minhaFrente.membro.linkEntrega ? `
            <a href="${escapeHtml(minhaFrente.membro.linkEntrega)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-success py-1 px-2 fs-caption">
              <i class="bi bi-box-arrow-up-right me-1"></i>Entregável Ativo
            </a>
          ` : `
            <span class="badge bg-warning-subtle text-warning border fs-label">Pendente Link de Entrega</span>
          `}
        </div>
      `;
    } else {
      statusBox.innerHTML = `
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="text-muted fs-caption">
            <i class="bi bi-info-circle me-1"></i>Conecte-se com sua conta Google institucional para conferir sua frente atribuída.
          </div>
        </div>
      `;
    }
  }
}

export function renderizarQuadroDemandasSNCT(demandasSnct = [], usuarioLogado = null) {
  const containerC1 = document.getElementById('containerFrentesCurso1');
  const containerC2 = document.getElementById('containerFrentesCurso2');
  const spanTotalOcupadas = document.getElementById('spanTotalVagasOcupadas');

  if (!containerC1 || !containerC2) return;

  let totalOcupadas = 0;
  let totalVagas = 0;

  const frentesC1 = demandasSnct.filter(d => d.cursoId === 1);
  const frentesC2 = demandasSnct.filter(d => d.cursoId === 2);

  const renderFrenteCard = (frente) => {
    const membros = Array.isArray(frente.membros) ? frente.membros : [];
    const vagasOcupadas = membros.length;
    const vagasMax = frente.vagasMax || 3;
    totalOcupadas += vagasOcupadas;
    totalVagas += vagasMax;
    const completa = vagasOcupadas >= vagasMax;

    let htmlMembros = '';
    membros.forEach(m => {
      const ehVoce = usuarioLogado && (String(m.alunoId) === String(usuarioLogado.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogado.matricula)));
      htmlMembros += `
        <div class="snct-membro-item">
          <div class="d-flex align-items-center gap-2 overflow-hidden">
            <i class="bi bi-person-fill ${ehVoce ? 'text-success' : 'text-primary'}"></i>
            <div class="overflow-hidden">
              <div class="snct-membro-nome">${escapeHtml(m.nome)} ${ehVoce ? '<span class="badge bg-success-subtle text-success fs-label ms-1">Você</span>' : ''}</div>
              <div class="text-muted" style="font-size: 0.72rem;">Matrícula: ${escapeHtml(m.matricula || 'N/A')}</div>
            </div>
          </div>
          <div class="text-end flex-shrink-0 d-flex align-items-center gap-1">
            ${m.linkEntrega ? `
              <a href="${escapeHtml(m.linkEntrega)}" target="_blank" rel="noopener noreferrer" class="snct-membro-link" title="Abrir entregável da equipe">
                <i class="bi bi-box-arrow-up-right"></i> Link
              </a>
            ` : '<span class="text-muted" style="font-size: 0.72rem;">Pendente link</span>'}
          </div>
        </div>
      `;
    });

    const vagasLivres = Math.max(0, vagasMax - vagasOcupadas);
    for (let i = 0; i < vagasLivres; i++) {
      htmlMembros += `
        <div class="snct-vaga-vazia">
          <i class="bi bi-dash-circle text-muted"></i>
          <span>Vaga Homologada</span>
        </div>
      `;
    }

    return `
      <div class="col-md-6 col-lg-3">
        <div class="snct-frente-card ${completa ? 'frente-completa' : ''} h-100">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
            <div>
              <span class="badge-pill ${frente.corBadge || 'badge-pill-blue'} fs-label mb-1">
                <i class="bi ${frente.icone || 'bi-kanban'} me-1"></i>${escapeHtml(frente.papelRotulo || 'Frente')}
              </span>
              <h6 class="font-outfit fw-bold text-heading fs-small mb-0">${escapeHtml(frente.titulo)}</h6>
            </div>
            <span class="snct-vaga-badge ${completa ? 'snct-vaga-lotada' : 'snct-vaga-disponivel'} flex-shrink-0">
              ${vagasOcupadas}/${vagasMax}
            </span>
          </div>
          <p class="fs-caption text-muted mb-2">${escapeHtml(frente.descricao || '')}</p>
          <div class="snct-membros-lista mb-2">
            ${htmlMembros}
          </div>
          ${frente.roteiroPdf ? `
            <a href="${escapeHtml(frente.roteiroPdf)}" target="_blank" class="btn btn-sm btn-outline-secondary w-100 fs-caption py-1">
              <i class="bi bi-file-earmark-pdf text-danger me-1"></i>Roteiro Operacional PDF
            </a>
          ` : ''}
        </div>
      </div>
    `;
  };

  containerC1.innerHTML = frentesC1.map(renderFrenteCard).join('');
  containerC2.innerHTML = frentesC2.map(renderFrenteCard).join('');

  if (spanTotalOcupadas) spanTotalOcupadas.textContent = totalOcupadas;

  const resumoC1 = document.getElementById('resumoVagasCurso1');
  const resumoC2 = document.getElementById('resumoVagasCurso2');
  if (resumoC1) {
    const ocupadasC1 = frentesC1.reduce((acc, f) => acc + (f.membros ? f.membros.length : 0), 0);
    resumoC1.textContent = `${ocupadasC1} / 12 vagas`;
  }
  if (resumoC2) {
    const ocupadasC2 = frentesC2.reduce((acc, f) => acc + (f.membros ? f.membros.length : 0), 0);
    resumoC2.textContent = `${ocupadasC2} / 12 vagas`;
  }
}
