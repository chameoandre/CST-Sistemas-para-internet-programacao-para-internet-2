/**
 * Configuração da Integração ProgWeb 2 (IFSC Garopaba)
 * 
 * - googleClientId: ID do cliente OAuth Google (Google Identity Services)
 * - apiUrl: URL do Web App publicado no Google Apps Script (terminando em /exec)
 * - modoOfflineFallback: garante funcionamento contínuo via localStorage mesmo sem internet ou sem URL da API
 */
window.PROGWEB2_CONFIG = {
  // Cole aqui a URL do seu Web App Apps Script após implantar (passo 4 do README-IMPLANTACAO.md):
  // Exemplo: 'https://script.google.com/macros/s/AKfycb.../exec'
  apiUrl: '',

  // Client ID do Google OAuth 2.0 pré-autorizado para chameoandre.github.io e localhost
  googleClientId: '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com',

  // Mantém funcionamento total em localStorage caso o backend ainda não tenha sido conectado
  modoOfflineFallback: true,

  // Intervalo de sincronização periódica dos votos da SNCT (milissegundos)
  syncIntervalMs: 60000
};
