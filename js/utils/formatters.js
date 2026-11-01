/**
 * Funções utilitárias puras de escape, formatação e status temporal
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

export function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

export function formatarData(dataStr) {
      if (!dataStr) return '-';
      const partes = dataStr.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataStr;
    }

export function calcularStatusPrazo(prazoStr, concluida, horaPrazo) {
      if (concluida) {
        return {
          classe: 'badge-pill-green',
          texto: '<i class="fa-solid fa-circle-check"></i> Concluída',
          urgente: false
        };
      }
      if (!prazoStr) {
        return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataPrazo = new Date(`${prazoStr}T${horaPrazo || '23:59'}:59`);
      const diffMs = dataPrazo - hoje;
      const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (dataPrazo < new Date() && diffDias >= 0) {
        return {
          classe: 'badge-pill-red',
          texto: '<i class="fa-solid fa-lock"></i> Prazo encerrado',
          urgente: true
        };
      }
      if (diffDias < 0) {
        const diasAtras = Math.abs(diffDias);
        return {
          classe: 'badge-pill-red',
          texto: `<i class="fa-solid fa-triangle-exclamation"></i> Encerrada há ${diasAtras}d`,
          urgente: true
        };
      } else if (diffDias === 0) {
        return {
          classe: 'badge-pill-red',
          texto: '<i class="fa-solid fa-clock"></i> Entrega Hoje!',
          urgente: true
        };
      } else if (diffDias === 1) {
        return {
          classe: 'badge-pill-amber',
          texto: '<i class="fa-solid fa-hourglass-start"></i> Entrega Amanhã',
          urgente: true
        };
      } else if (diffDias <= 5) {
        return {
          classe: 'badge-pill-amber',
          texto: `<i class="fa-solid fa-hourglass-half"></i> Faltam ${diffDias} dias`,
          urgente: false
        };
      } else {
        return {
          classe: 'badge-pill-blue',
          texto: `<i class="fa-solid fa-calendar-check"></i> Faltam ${diffDias} dias`,
          urgente: false
        };
      }
    }
