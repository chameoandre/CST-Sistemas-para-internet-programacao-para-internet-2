/**
 * Camada de Visualização: Avaliação Formativa por Rubricas Contextuais
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import { escapeHtml } from "../utils/formatters.js";
import { obterModeloRubricaParaDemanda, obterDimensoesRubricaParaDemanda } from "../config/rubricasData.js";

export function gerarTextoDevolutiva(demandaId, equipeNome, demandas = [], avaliacoes = [], alunos = []) {
  const dem = demandas.find(d => d.id === demandaId) || { id: demandaId, titulo: demandaId, instrumento: 'A2' };
  const aval = avaliacoes.find(a => a.demandaId === demandaId && a.equipe === equipeNome);
  const alunosDaEquipe = alunos.filter(a => a.ativo && a.equipe === equipeNome).map(a => a.nome).join(', ');

  const notaStr = aval ? (aval.nota || 0).toFixed(1) : "—";
  const conceitoStr = aval ? aval.conceito : "Pendente";
  const dims = aval ? (aval.dimensoes || {}) : {};
  const feedback = aval && aval.feedback ? aval.feedback : "Trabalho avaliado em conformidade com os critérios do roteiro.";
  const linkRepo = aval && aval.linkRepo ? aval.linkRepo : "https://github.com/";

  const modelo = obterModeloRubricaParaDemanda(demandaId, demandas);
  const detalhamentoDimensoes = modelo.dimensoes.map((dim, idx) => {
    const val = dims[`dim${idx}`] !== undefined ? dims[`dim${idx}`] : (dims[dim.id] !== undefined ? dims[dim.id] : 0);
    return `${dim.titulo}: ${val.toFixed(1)} / 2.5 pts`;
  }).join('\n');

  return `Prezado(a) estudante,

Sua equipe (${equipeNome}) recebeu uma devolutiva de avaliação formativa por rubricas na disciplina de Programação para a Internet 2 (ProgWeb 2 - CST em Sistemas para a Internet / IFSC Câmpus Garopaba).

==================================================
DEMANDA / CHECKPOINT AVALIADO:
• Código: ${dem.id}
• Título: ${dem.titulo}
• Instrumento Avaliativo: ${dem.instrumento || 'A2'}
• Matriz de Rubrica: ${modelo.rotulo}
• Integrantes: ${alunosDaEquipe || 'Equipe'}

PONTUAÇÃO CONSOLIDADA:
• Nota da Rubrica: ${notaStr} / 10.0 (${conceitoStr})

DETALHAMENTO POR DIMENSÃO:
${detalhamentoDimensoes}

PARECER FORMATIVO DO PROFESSOR:
"${feedback}"

LINK DE COMPROVAÇÃO / REPOSITÓRIO:
${linkRepo}
==================================================

Em caso de dúvidas conceituais ou recomendações de refatoração, procure o professor em horário de laboratório ou atendimento aos estudantes.

Atenciosamente,
Prof. André Moraes — IFSC Câmpus Garopaba`;
}

export function renderizarDimensoesNoModalRubrica(demandaId, estadoRubrica = { dim0: 2.5, dim1: 2.5, dim2: 2.5, dim3: 2.5 }, demandas = []) {
  const container = document.getElementById('containerDimensoesRubrica');
  if (!container) return;

  const modelo = obterModeloRubricaParaDemanda(demandaId, demandas);

  const badgeModelo = document.getElementById('modalRubricaBadgeModelo');
  if (badgeModelo) {
    badgeModelo.className = `badge ${modelo.badgeClasse} fs-label`;
    badgeModelo.innerHTML = `<i class="bi ${modelo.icone} me-1"></i> ${escapeHtml(modelo.rotulo)}`;
  }

  container.innerHTML = modelo.dimensoes.map((dim, dimIdx) => {
    const valAtual = estadoRubrica[`dim${dimIdx}`] !== undefined ? estadoRubrica[`dim${dimIdx}`] : 2.5;

    const niveisHtml = dim.niveis.map(niv => {
      const isSelected = Math.abs(niv.valor - valAtual) < 0.05;
      const selectedClass = isSelected ? `selected ${niv.classe}` : '';
      return `
        <div class="rubrica-level-btn ${selectedClass}" onclick="selecionarNivelRubrica(${dimIdx}, ${niv.valor}, this)">
          <div class="fw-bold fs-caption">${niv.rotulo}</div>
          <div class="level-desc text-muted fs-label" style="line-height: 1.25;">${niv.desc}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="rubrica-dim-card">
        <div class="rubrica-dim-header">
          <h4 class="rubrica-dim-title fs-small fw-bold">${dim.titulo}</h4>
          <span class="badge font-code fs-label" id="badgeDim${dimIdx}" style="background: var(--bg-card); color: var(--accent-blue); border: 1px solid var(--border-color);">
            ${valAtual.toFixed(1)} / 2.5 pts
          </span>
        </div>
        <p class="text-muted fs-caption mb-2">${dim.descricao}</p>
        <div class="rubrica-levels-grid">
          ${niveisHtml}
        </div>
      </div>
    `;
  }).join('');

  recalcularRubrica(estadoRubrica);
}

export function recalcularRubrica(estadoRubrica = {}) {
  const soma = Object.values(estadoRubrica).reduce((acc, curr) => acc + curr, 0);
  const totalEl = document.getElementById('rubricaNotaTotal');
  const badgeEl = document.getElementById('rubricaConceitoBadge');

  if (totalEl) totalEl.innerText = soma.toFixed(1);

  if (badgeEl) {
    if (soma >= 9.0) {
      badgeEl.className = 'badge-pill badge-pill-green';
      badgeEl.innerText = 'Excelente (A)';
    } else if (soma >= 7.0) {
      badgeEl.className = 'badge-pill badge-pill-blue';
      badgeEl.innerText = 'Bom / Conforme (B)';
    } else if (soma >= 5.0) {
      badgeEl.className = 'badge-pill badge-pill-amber';
      badgeEl.innerText = 'Em Desenvolvimento (C)';
    } else {
      badgeEl.className = 'badge-pill badge-pill-red';
      badgeEl.innerText = 'Insuficiente (D)';
    }
  }

  return soma;
}
