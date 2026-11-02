/**
 * Serviço de Persistência Local (LocalStorage) e Gerenciamento de Estado
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import {
  STORAGE_KEY_DEMANDAS,
  STORAGE_KEY_AVALIACOES,
  STORAGE_KEY_ALUNOS,
  STORAGE_KEY_OFICINAS_VOTACAO,
  STORAGE_KEY_VOTOS_OFICINAS,
  STORAGE_KEY_ULTIMO_VOTANTE,
  STORAGE_KEY_GOOGLE_SESSION,
  STORAGE_KEY_DEMANDAS_SNCT,
  DEMANDAS_INICIAIS,
  ESTUDANTES_PADRAO,
  OFICINAS_PADRAO_SNCT,
  DEMANDAS_PADRAO_SNCT
} from "../config/constants.js";
import { normalizarPrazo } from "../utils/formatters.js";

// --- DEMANDAS GERAIS & CHECKPOINTS ---

export function carregarDemandas() {
  try {
    const dSalvas = localStorage.getItem(STORAGE_KEY_DEMANDAS);
    if (!dSalvas) return JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));

    const parsed = JSON.parse(dSalvas);
    // Migração: se tiver formato legado, restaura conjunto com pesos oficiais
    if (parsed.length < 4 || (parsed[0].titulo && parsed[0].titulo.includes("Roteiro 04"))) {
      salvarDemandas(DEMANDAS_INICIAIS);
      return JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));
    }

    // Garante as demandas da SNCT integradas
    let lista = parsed.filter(d => d.id !== 'DEM-SNCT-02');
    ['DEM-SNCT-C2', 'DEM-SNCT-C1', 'DEM-SNCT-01'].forEach(idNovo => {
      if (!lista.some(d => d.id === idNovo)) {
        const padrao = DEMANDAS_INICIAIS.find(d => d.id === idNovo);
        if (padrao) lista.unshift(JSON.parse(JSON.stringify(padrao)));
      }
    });

    // Saneamento e autocorreção de links das salas do Moodle e prazos
    let precisaSalvar = false;
    lista.forEach(d => {
      // Normalização de prazo para evitar NaN em datas
      if (d.prazo) {
        const norm = normalizarPrazo(d.prazo);
        if (norm && norm !== d.prazo) {
          d.prazo = norm;
          precisaSalvar = true;
        }
      }
      if (!d.horaPrazo) {
        d.horaPrazo = "23:59";
      }

      // Demanda Curso 1: sala oficial no Moodle (id=2663)
      if (d.id === 'DEM-SNCT-C1') {
        const linkEsperado = 'https://moodle.ifsc.edu.br/course/view.php?id=2663';
        if (!d.linkApoio || d.linkApoio !== linkEsperado || d.linkApoio.includes('main.pdf')) {
          d.linkApoio = linkEsperado;
          precisaSalvar = true;
        }
        if (!d.prazo || d.prazo === '2026-10-30' || String(d.prazo).includes('NaN')) {
          d.prazo = '2026-11-07';
          precisaSalvar = true;
        }
        if (d.titulo && d.titulo.includes('Exclusiva Curso 1')) {
          d.titulo = 'Etapa 2 (Curso 1 — Meu Primeiro Site no Ar): 1ª Versão na Sala do Moodle (id=2663)';
          precisaSalvar = true;
        }
        d.fixadaMural = true;
      }

      // Demanda Curso 2: sala oficial no Moodle (id=2664)
      if (d.id === 'DEM-SNCT-C2') {
        const linkEsperado = 'https://moodle.ifsc.edu.br/course/view.php?id=2664';
        if (!d.linkApoio || d.linkApoio !== linkEsperado || d.linkApoio.includes('main.pdf')) {
          d.linkApoio = linkEsperado;
          precisaSalvar = true;
        }
        if (!d.prazo || d.prazo === '2026-10-30' || String(d.prazo).includes('NaN')) {
          d.prazo = '2026-11-07';
          precisaSalvar = true;
        }
        if (d.titulo && d.titulo.includes('Exclusiva Curso 2')) {
          d.titulo = 'Etapa 2 (Curso 2 — Painel Verde Garopaba): 1ª Versão na Sala do Moodle (id=2664)';
          precisaSalvar = true;
        }
        d.fixadaMural = true;
      }
    });

    const dem01 = lista.find(d => d.id === 'DEM-SNCT-01');
    if (dem01 && !dem01.fixadaMural) {
      dem01.fixadaMural = true;
      precisaSalvar = true;
    }

    if (precisaSalvar) {
      salvarDemandas(lista);
    }

    return lista;
  } catch (e) {
    console.error("Erro ao carregar demandas:", e);
    return JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));
  }
}

export function salvarDemandas(demandas) {
  try {
    localStorage.setItem(STORAGE_KEY_DEMANDAS, JSON.stringify(demandas));
  } catch (e) {
    console.error("Erro ao salvar demandas no localStorage:", e);
  }
}

// --- AVALIAÇÕES FORMATIVAS POR RUBRICA ---

export function carregarAvaliacoes() {
  try {
    const aSalvas = localStorage.getItem(STORAGE_KEY_AVALIACOES);
    return aSalvas ? JSON.parse(aSalvas) : [];
  } catch (e) {
    console.error("Erro ao carregar avaliações:", e);
    return [];
  }
}

export function salvarAvaliacoes(avaliacoes) {
  try {
    localStorage.setItem(STORAGE_KEY_AVALIACOES, JSON.stringify(avaliacoes));
  } catch (e) {
    console.error("Erro ao salvar avaliações no localStorage:", e);
  }
}

// --- ESTUDANTES & ROSTER OFICIAL ---

export function carregarAlunos() {
  try {
    const alSalvos = localStorage.getItem(STORAGE_KEY_ALUNOS);
    if (!alSalvos) return JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));

    const parsed = JSON.parse(alSalvos);
    if (parsed.length === 12 || (parsed.length > 0 && parsed[0].nome === "Lucas Silva")) {
      salvarAlunos(ESTUDANTES_PADRAO);
      return JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));
    }
    return parsed;
  } catch (e) {
    console.error("Erro ao carregar estudantes:", e);
    return JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));
  }
}

export function salvarAlunos(alunos) {
  try {
    localStorage.setItem(STORAGE_KEY_ALUNOS, JSON.stringify(alunos));
  } catch (e) {
    console.error("Erro ao salvar estudantes no localStorage:", e);
  }
}

// --- FRENTES CIRÚRGICAS DA SNCT (24 VAGAS) ---

export function carregarDemandasSNCT() {
  try {
    const salvas = localStorage.getItem(STORAGE_KEY_DEMANDAS_SNCT);
    if (salvas) {
      const parsed = JSON.parse(salvas);
      if (Array.isArray(parsed) && parsed.length >= 8) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Erro ao ler frentes da SNCT no localStorage:", e);
  }
  return JSON.parse(JSON.stringify(DEMANDAS_PADRAO_SNCT));
}

export function salvarDemandasSNCT(demandasSNCT) {
  try {
    localStorage.setItem(STORAGE_KEY_DEMANDAS_SNCT, JSON.stringify(demandasSNCT));
  } catch (e) {
    console.error("Erro ao salvar frentes da SNCT no localStorage:", e);
  }
}

// --- OFICINAS & VOTAÇÃO DA SNCT ---

export function carregarOficinasVotacao() {
  try {
    const ofSalvas = localStorage.getItem(STORAGE_KEY_OFICINAS_VOTACAO);
    return ofSalvas ? JSON.parse(ofSalvas) : JSON.parse(JSON.stringify(OFICINAS_PADRAO_SNCT));
  } catch (e) {
    console.error("Erro ao carregar opções de oficinas:", e);
    return JSON.parse(JSON.stringify(OFICINAS_PADRAO_SNCT));
  }
}

export function salvarOficinasVotacao(oficinas) {
  try {
    localStorage.setItem(STORAGE_KEY_OFICINAS_VOTACAO, JSON.stringify(oficinas));
  } catch (e) {
    console.error("Erro ao salvar oficinas no localStorage:", e);
  }
}

export function carregarVotosOficinas() {
  try {
    const vtSalvos = localStorage.getItem(STORAGE_KEY_VOTOS_OFICINAS);
    return vtSalvos ? JSON.parse(vtSalvos) : [];
  } catch (e) {
    console.error("Erro ao carregar votos das oficinas:", e);
    return [];
  }
}

export function salvarVotosOficinas(votos) {
  try {
    localStorage.setItem(STORAGE_KEY_VOTOS_OFICINAS, JSON.stringify(votos));
  } catch (e) {
    console.error("Erro ao salvar votos no localStorage:", e);
  }
}

// --- SESSÃO GOOGLE IDENTITY & ÚLTIMO VOTANTE ---

export function carregarSessaoGoogle() {
  try {
    const sessao = localStorage.getItem(STORAGE_KEY_GOOGLE_SESSION);
    return sessao ? JSON.parse(sessao) : null;
  } catch (e) {
    console.warn("Erro ao ler sessão Google:", e);
    return null;
  }
}

export function salvarSessaoGoogle(usuario) {
  try {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY_GOOGLE_SESSION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY_GOOGLE_SESSION);
    }
  } catch (e) {
    console.error("Erro ao salvar sessão Google:", e);
  }
}

export function limparSessaoGoogle() {
  try {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_SESSION);
    localStorage.removeItem(STORAGE_KEY_ULTIMO_VOTANTE);
  } catch (e) {}
}

export function carregarUltimoVotante() {
  try {
    return localStorage.getItem(STORAGE_KEY_ULTIMO_VOTANTE) || '';
  } catch (e) {
    return '';
  }
}

export function salvarUltimoVotante(alunoId) {
  try {
    localStorage.setItem(STORAGE_KEY_ULTIMO_VOTANTE, String(alunoId || ''));
  } catch (e) {}
}

// --- BACKUP E RESTAURAÇÃO DE DADOS ---

export function exportarBackupJSON(dadosCompletos) {
  const payload = {
    progweb2_version: "2026-2",
    dataExportacao: new Date().toISOString(),
    ...dadosCompletos
  };
  return JSON.stringify(payload, null, 2);
}

