/**
 * Serviço de Autenticação com Google Identity Services (OAuth2) & Roster de Estudantes
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import { carregarSessaoGoogle, salvarSessaoGoogle, limparSessaoGoogle } from "./storageService.js";
import { showToast } from "../utils/toast.js";

let usuarioLogado = null;

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Falha ao decodificar token JWT:", e);
    return null;
  }
}

export function removerAcentos(str) {
  return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/**
 * Localiza um estudante na lista oficial da turma usando e-mail, matrícula ou nome completo.
 */
export function localizarEstudanteNoRoster(termoOuEmail, nomeGoogle = '', alunosLista = []) {
  const limpo = String(termoOuEmail || '').toLowerCase().trim();
  const limpoSemAcento = removerAcentos(termoOuEmail);
  const userPrefix = limpo.includes('@') ? limpo.split('@')[0] : '';

  // 1. Busca exata por e-mail ou matrícula
  let match = alunosLista.find(a =>
    (a.email && a.email.toLowerCase().trim() === limpo) ||
    (a.matricula && String(a.matricula).trim() === limpo)
  );
  if (match) return match;

  // 2. Busca por prefixo do e-mail institucional
  if (userPrefix && userPrefix.length >= 3) {
    match = alunosLista.find(a => {
      const pref = (a.email || '').split('@')[0].toLowerCase().trim();
      return pref && pref === userPrefix;
    });
    if (match) return match;
  }

  // 3. Busca por aproximação de nome
  const alvoNome = removerAcentos(nomeGoogle || (!limpo.includes('@') ? limpoSemAcento : ''));
  if (alvoNome && alvoNome.length >= 4) {
    const partesAlvo = alvoNome.split(/\s+/).filter(p => p.length > 2);
    match = alunosLista.find(a => {
      const nomeRoster = removerAcentos(a.nome);
      if (nomeRoster === alvoNome || nomeRoster.includes(alvoNome) || alvoNome.includes(nomeRoster)) return true;
      if (partesAlvo.length >= 2) {
        const primeiro = partesAlvo[0];
        const ultimo = partesAlvo[partesAlvo.length - 1];
        return nomeRoster.startsWith(primeiro) && nomeRoster.includes(ultimo);
      }
      return false;
    });
    if (match) return match;
  }

  return null;
}

export function obterUsuarioLogadoGoogle() {
  if (!usuarioLogado) {
    usuarioLogado = carregarSessaoGoogle();
  }
  return usuarioLogado;
}

export function initGoogleAuth(alunosLista = [], callbackAtualizacao = null) {
  // 1. Restaura sessão salva
  usuarioLogado = carregarSessaoGoogle();
  if (usuarioLogado && !usuarioLogado.alunoId && alunosLista.length > 0) {
    const match = localizarEstudanteNoRoster(usuarioLogado.email || '', usuarioLogado.nome || '', alunosLista);
    if (match) {
      usuarioLogado.alunoId = String(match.id);
      usuarioLogado.matricula = String(match.matricula || '');
      usuarioLogado.nome = match.nome;
      salvarSessaoGoogle(usuarioLogado);
    }
  }

  if (callbackAtualizacao && typeof callbackAtualizacao === 'function') {
    callbackAtualizacao(usuarioLogado);
  }

  // 2. Inicializa GIS se disponível no navegador
  const cfg = (typeof window !== 'undefined' && window.PROGWEB2_CONFIG) ? window.PROGWEB2_CONFIG : null;
  const clientId = (cfg && cfg.googleClientId)
    ? cfg.googleClientId
    : '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com';

  if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => aoReceberCredencial(response, alunosLista, callbackAtualizacao),
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (err) {
      console.warn("Aviso na inicialização do Google Identity Services:", err);
    }
  }
}

function aoReceberCredencial(response, alunosLista, callbackAtualizacao) {
  if (!response || !response.credential) return;

  const payload = parseJwt(response.credential);
  if (!payload || !payload.email) {
    alert("Não foi possível extrair os dados da sua conta Google.");
    return;
  }

  const emailGoogle = payload.email.toLowerCase().trim();
  const nomeGoogle = payload.name || payload.given_name || '';

  let alunoMatch = localizarEstudanteNoRoster(emailGoogle, nomeGoogle, alunosLista);

  usuarioLogado = {
    nome: alunoMatch ? alunoMatch.nome : (nomeGoogle || 'Estudante'),
    email: payload.email,
    picture: payload.picture || '',
    sub: payload.sub,
    alunoId: alunoMatch ? String(alunoMatch.id) : '',
    matricula: alunoMatch ? String(alunoMatch.matricula || '') : '',
    origem: 'google'
  };

  if (!alunoMatch) {
    const matriculaInput = prompt(`Conta Google conectada: ${payload.email}\nDigite sua matrícula do SIGAA ou seu nome completo para vincular ao seu perfil da turma:`);
    if (matriculaInput && matriculaInput.trim()) {
      const buscaManual = localizarEstudanteNoRoster(matriculaInput.trim(), matriculaInput.trim(), alunosLista);
      if (buscaManual) {
        alunoMatch = buscaManual;
        usuarioLogado.alunoId = String(alunoMatch.id);
        usuarioLogado.matricula = String(alunoMatch.matricula || '');
        usuarioLogado.nome = alunoMatch.nome;
      }
    }
  }

  salvarSessaoGoogle(usuarioLogado);

  if (callbackAtualizacao && typeof callbackAtualizacao === 'function') {
    callbackAtualizacao(usuarioLogado);
  }

  showToast(
    "Login Google Realizado!",
    `Bem-vindo(a), ${usuarioLogado.nome.split(' ')[0]}! Identificação ativa para candidaturas, entregas e votação.`,
    "bi bi-google text-primary"
  );
}

export function iniciarLoginGoogle(alunosLista = [], callbackAtualizacao = null) {
  const cfg = (typeof window !== 'undefined' && window.PROGWEB2_CONFIG) ? window.PROGWEB2_CONFIG : null;
  const clientId = (cfg && cfg.googleClientId)
    ? cfg.googleClientId
    : '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com';

  if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => aoReceberCredencial(response, alunosLista, callbackAtualizacao)
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          autenticarManualPrompt(alunosLista, callbackAtualizacao);
        }
      });
      return;
    } catch (e) {
      console.warn("Erro ao invocar prompt Google:", e);
    }
  }

  autenticarManualPrompt(alunosLista, callbackAtualizacao);
}

function autenticarManualPrompt(alunosLista, callbackAtualizacao) {
  const emailInput = prompt("Identificação do Estudante:\nDigite seu e-mail cadastrado no SIGAA, sua matrícula ou seu nome completo:");
  if (emailInput && emailInput.trim()) {
    const alunoMatch = localizarEstudanteNoRoster(emailInput.trim(), emailInput.trim(), alunosLista);
    if (alunoMatch) {
      usuarioLogado = {
        nome: alunoMatch.nome,
        email: alunoMatch.email,
        alunoId: String(alunoMatch.id),
        matricula: String(alunoMatch.matricula || ''),
        origem: 'manual'
      };
      salvarSessaoGoogle(usuarioLogado);
      if (callbackAtualizacao && typeof callbackAtualizacao === 'function') {
        callbackAtualizacao(usuarioLogado);
      }
      showToast("Identificação Concluída!", `Bem-vindo(a), ${alunoMatch.nome.split(' ')[0]}! Suas candidaturas e entregas estão liberadas.`, "bi bi-person-check-fill text-success");
    } else {
      alert(`Não localizamos "${emailInput.trim()}" na lista oficial dos 24 estudantes da turma.`);
    }
  }
}

export function efetuarLogoutGoogle(callbackAtualizacao = null) {
  usuarioLogado = null;
  limparSessaoGoogle();

  if (callbackAtualizacao && typeof callbackAtualizacao === 'function') {
    callbackAtualizacao(null);
  }

  showToast(
    "Sessão Encerrada",
    "Você desconectou sua identificação Google do dashboard.",
    "bi bi-box-arrow-right text-muted"
  );
}
