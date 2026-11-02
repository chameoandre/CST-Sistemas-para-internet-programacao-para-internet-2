/**
 * Camada de Visualização: Navegação entre Abas, Tema e Destaques
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

export function showTab(tabId, shouldScroll = true) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Ativa o botão da aba correspondente
  const btn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
  if (btn) {
    btn.classList.add('active');
  }

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Dispara evento de redimensionamento para ajustar tabelas e containers
  window.dispatchEvent(new Event('resize'));
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem('progweb2_theme', newTheme);
  } catch (e) {}

  const icon = document.getElementById('themeToggleIcon');
  if (icon) {
    icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

export function alternarDestaqueCard(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const jaDestaque = card.classList.contains('foco-destaque-ativo');
  document.querySelectorAll('.roteiro-card').forEach(c => c.classList.remove('foco-destaque-ativo'));

  if (!jaDestaque) {
    card.classList.add('foco-destaque-ativo');
    try {
      localStorage.setItem('progweb2_card_destaque', cardId);
    } catch (e) {}
  } else {
    try {
      localStorage.removeItem('progweb2_card_destaque');
    } catch (e) {}
  }
}

export function limparDestaqueCards() {
  document.querySelectorAll('.roteiro-card').forEach(c => c.classList.remove('foco-destaque-ativo'));
  try {
    localStorage.removeItem('progweb2_card_destaque');
  } catch (e) {}
}
