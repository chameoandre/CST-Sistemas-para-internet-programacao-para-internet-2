/**
 * Ponto de entrada modular do frontend (ES6 Modules)
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

import * as Constants from "./config/constants.js";
import * as Rubricas from "./config/rubricasData.js";
import * as Formatters from "./utils/formatters.js";
import * as Toast from "./utils/toast.js";
import * as StorageService from "./services/storageService.js";
import * as ApiService from "./services/apiService.js";
import * as AuthService from "./services/authService.js";

// Exportação consolidada no namespace global para suporte à transição suave por fases:
window.ProgWeb2 = {
  Constants,
  Rubricas,
  Formatters,
  Toast,
  StorageService,
  ApiService,
  AuthService
};

console.info("⚡ [ProgWeb 2] Camada de Serviços & APIs carregada com sucesso:", Object.keys(window.ProgWeb2));
