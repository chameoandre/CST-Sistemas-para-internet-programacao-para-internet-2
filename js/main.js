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
import * as NavigationView from "./views/navigationView.js";
import * as SnctView from "./views/snctView.js";
import * as RubricasView from "./views/rubricasView.js";
import * as DemandasView from "./views/demandasView.js";

// Integração unificada no namespace global:
window.ProgWeb2 = {
  Constants,
  Rubricas,
  Formatters,
  Toast,
  StorageService,
  ApiService,
  AuthService,
  NavigationView,
  SnctView,
  RubricasView,
  DemandasView
};

console.info("⚡ [ProgWeb 2] Camada de Visualização & Views carregada com sucesso:", Object.keys(window.ProgWeb2));
