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
