/**
 * Feedback visual e notificações flutuantes (Bootstrap Toast)
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

let toastTimeout = null;

export function showToast(titulo, mensagem, iconeClass = "fa-solid fa-circle-check text-success") {
  const toast = document.getElementById('appToast');
  const tTitulo = document.getElementById('toastTitle');
  const tMsg = document.getElementById('toastMessage');
  const tIcon = document.getElementById('toastIcon');

  if (!toast) return;

  if (tTitulo) tTitulo.innerText = titulo;
  if (tMsg) tMsg.innerText = mensagem;
  if (tIcon) tIcon.className = iconeClass;

  toast.style.transform = 'translateY(0)';

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.transform = 'translateY(120%)';
  }, 3500);
}
