/**
 * Ponto de entrada modular do frontend (ES6 Modules)
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import * as Constants from "./config/constants.js";
import * as Rubricas from "./config/rubricasData.js";
import * as Formatters from "./utils/formatters.js";
import { showToast } from "./utils/toast.js";

// Compatibilidade transitória durante a migração por fases:
// Expõe módulos no namespace global window.ProgWeb2
window.ProgWeb2 = {
  Constants,
  Rubricas,
  Formatters,
  showToast
};

console.info("⚡ [ProgWeb 2] Arquitetura Modular ES6 ativa:", Object.keys(window.ProgWeb2));
