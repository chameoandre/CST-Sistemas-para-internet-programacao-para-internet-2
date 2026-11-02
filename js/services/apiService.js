/**
 * Cliente de Comunicação com a API do Google Apps Script (Backend de Extensão e Demandas)
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import { showToast } from "../utils/toast.js";

/**
 * Executa uma chamada POST para o endpoint unificado do Google Apps Script.
 * Utiliza Content-Type text/plain para contornar restrições de CORS e redirecionamento 302.
 */
export async function chamarApiAppsScript(acao, payload = {}) {
  const cfg = (typeof window !== 'undefined' && window.PROGWEB2_CONFIG) ? window.PROGWEB2_CONFIG : null;
  if (!cfg || !cfg.apiUrl || !cfg.apiUrl.trim()) {
    throw new Error('URL do Google Apps Script não configurada em progweb2-config.js.');
  }

  const apiUrl = cfg.apiUrl.trim();
  const extraDemanda = (payload && payload.demanda && typeof payload.demanda === 'object') ? payload.demanda : {};
  const bodyStr = JSON.stringify({ acao, ...extraDemanda, ...payload });

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: bodyStr
    });

    const json = await resp.json();
    if (!json || json.ok === false) {
      throw new Error((json && json.erro) || 'Falha ao processar ação na planilha.');
    }
    return json;
  } catch (postErr) {
    // Fallback para navegadores com restrição estrita de 302 redirect em POST (ex.: Safari ITP / Brave)
    if (postErr && postErr.name === 'TypeError') {
      try {
        const urlGet = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}payload=${encodeURIComponent(bodyStr)}&_t=${Date.now()}`;
        const respGet = await fetch(urlGet, { method: 'GET', mode: 'cors', cache: 'no-store' });
        const jsonGet = await respGet.json();
        if (jsonGet && jsonGet.ok !== false && !Array.isArray(jsonGet.votos)) {
          return jsonGet;
        }
      } catch (_) {}

      try {
        await fetch(apiUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: bodyStr
        });
        return { ok: true, fallbackNoCors: true };
      } catch (_) {}
    }
    throw postErr;
  }
}

/**
 * Dispara e-mail de devolutiva com template HTML para os integrantes de uma equipe.
 */
export async function notificarEquipeEmail({ demandaId, equipeNome, avaliacao, emails, instrumento = 'A2' }) {
  showToast("Disparando E-mail...", `Enviando devolutiva em HTML via Planilha para ${equipeNome}...`, "fa-solid fa-spinner fa-spin text-primary");
  try {
    const res = await chamarApiAppsScript('salvar_avaliacao', {
      avaliacao: avaliacao || {
        demandaId,
        equipe: equipeNome,
        instrumento,
        nota: 10.0,
        feedback: 'Avaliação formativa registrada no painel.'
      },
      notificarEmail: true,
      destinatariosEmails: emails
    });

    showToast(
      "Devolutiva Enviada por E-mail!",
      `Notificação HTML enviada automaticamente pela planilha para ${res.totalEnviados || (emails ? emails.length : 1)} integrante(s) de ${equipeNome}.`,
      "fa-solid fa-paper-plane text-success"
    );
    return res;
  } catch (err) {
    console.warn("Erro ao enviar devolutiva via Apps Script:", err);
    showToast("Aviso de Envio", `Não foi possível enviar via planilha (${err.message || err}).`, "fa-solid fa-triangle-exclamation text-warning");
    throw err;
  }
}

