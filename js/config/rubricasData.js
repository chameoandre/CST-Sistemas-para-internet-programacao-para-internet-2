/**
 * Matrizes de Avaliação Formativa por Rubricas Contextuais
 * Instrumentos A2 (SNCT), A3 (Vitrine Full-stack) e A4 (Roteiros Práticos)
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */
import { DEMANDAS_INICIAIS } from "./constants.js";

export const MATRIZES_RUBRICA = {
      // 1. INSTRUMENTO A2: MINICURSO & OFICINAS DA SNCT (Curricularização da Extensão Universitária)
      A2_SNCT: {
        id: "A2_SNCT",
        rotulo: "Rubrica de Extensão & Minicurso SNCT (Instrumento A2 • 20%)",
        badgeClasse: "bg-primary-subtle text-primary border",
        icone: "bi-mortarboard-fill",
        dimensoes: [
          {
            id: "dim0",
            titulo: "1. Planejamento Instrucional, Transposição Didática & Linguagem",
            descricao: "Estruturação clara da oficina nos 4 blocos de 120 min, linguagem acessível à comunidade sem tecnicismos opacos, checkpoints bem delineados e ritmo pedagógico.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Planejamento ausente ou confuso; linguagem inacessível para iniciantes e blocos desordenados." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Transposição parcial; termos técnicos não explicados e distribuição de tempo mal dimensionada." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Boa transposição didática; linguagem clara, 4 blocos bem distribuídos e objetivos alcançáveis." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Didática impecável, cativante, empática, com checkpoints visíveis e acolhimento exemplar ao participante." }
            ]
          },
          {
            id: "dim1",
            titulo: "2. Rigor Técnico do Entregável da Frente (Roteiro / Kit / Slides / Logística)",
            descricao: "Conformidade técnica estrita do material da frente: Micro-Roteiro LaTeX compilado de até 4 págs. sem reticências (≤103 cols); Starter Kit funcional e testado offline; Slides de 8 telas legíveis; ou Pesquisa Moodle + Checklist de bancada.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Entregável quebrado, incompleto, com erros de compilação ou dependências externas não testadas." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Material parcialmente funcional, mas com omissões no código, quebras de linha ou passos faltando." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Material funcional e completo, seguindo as diretrizes do Roteiro Operacional da frente." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Excelência técnica, zero reticências, código 100% testado no lab e plano de contingência pronto." }
            ]
          },
          {
            id: "dim2",
            titulo: "3. Estruturação, Acessibilidade & Recursos na Sala do Moodle IFSC",
            descricao: "Organização das 5 seções oficiais da sala do curso no Moodle (Curso 1 id=2663 / Curso 2 id=2664), publicação dos anexos (.zip, PDFs, links de slides), autoinscrição (SNCT2026) e contingência offline.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Sala do Moodle desorganizada ou vazia, sem os recursos exigidos da frente." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Seções criadas no Moodle, mas com links quebrados ou falta de arquivos obrigatórios." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "As 5 seções estruturadas, entregáveis anexados corretamente e autoinscrição configurada." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Sala do Moodle impecável, intuitiva, com boas-vindas, plano B e acessibilidade comprovada." }
            ]
          },
          {
            id: "dim3",
            titulo: "4. Trabalho em Equipe, Revisão Cruzada & Preparação para a Oficina",
            descricao: "Engajamento dos membros da frente, cumprimento dos prazos dos marcos, validação cruzada entre frentes do mesmo curso, teste nas máquinas do laboratório e prontidão para a ministração.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Ausência de comunicação na equipe, descumprimento de prazos e material não testado." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Participação desequilibrada; teste tardio e revisão cruzada superficial entre as frentes." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Boa cooperação na equipe, prazos cumpridos e revisão realizada com outra frente do curso." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Engajamento exemplar, ensaio cronometrado de bancada validado e sinergia total na condução." }
            ]
          }
        ]
      },

      // 2. INSTRUMENTO A4: ROTEIROS PRÁTICOS SEMANAIS DE LABORATÓRIO (25%)
      A4_ROTEIROS: {
        id: "A4_ROTEIROS",
        rotulo: "Rubrica Técnica de Roteiros Práticos (Instrumento A4 • 25%)",
        badgeClasse: "bg-secondary-subtle text-dark border",
        icone: "bi-code-square",
        dimensoes: [
          {
            id: "dim0",
            titulo: "1. Arquitetura Modular ES6 & Organização",
            descricao: "Estruturação de pastas, desacoplamento em módulos ES6, imports/exports limpos e qualidade do código.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Código monolítico único, escopo global desordenado." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Módulos parciais com dependências circulares." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Estrutura modular limpa em camadas (dados/serviços/ui)." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Arquitetura impecável, modular, manutenível e extensível." }
            ]
          },
          {
            id: "dim1",
            titulo: "2. Manipulação do DOM, Forms & Reatividade",
            descricao: "Reatividade a eventos, sanitização de inputs, proteção defensiva contra NaN e formatação monetária.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Sem validação de formulários, erros de cálculo (NaN)." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Manipulação funcional mas com cálculos frágeis." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Eventos reativos (change/input) e parsing defensivo." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Reatividade fluida, validação robusta e formatação Intl." }
            ]
          },
          {
            id: "dim2",
            titulo: "3. Assincronismo, Fetch API & Microback-end",
            descricao: "Consumo de dados via async/await, conversão json(), tratamento de status HTTP (4xx/5xx) e try/catch.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Sem assincronismo ou falhas sistemáticas não tratadas." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Fetch simples sem try/catch ou sem checar response.ok." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "async/await correto, conversão json() e try/catch seguro." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Integração assíncrona exemplar com fallbacks e tratamento visual." }
            ]
          },
          {
            id: "dim3",
            titulo: "4. UX, Feedback Visual & Deploy GitHub Pages",
            descricao: "Responsividade mobile-first, modais/toasts, feedback de carregamento (spinners) e deploy ativo no Pages.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Layout quebrado, sem feedback visual, sem deploy público." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Responsivo básico com links/assets quebrados no Pages." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Bootstrap 5 responsivo, feedback visual e deploy live." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Design refinado, acessível, feedback fluido e deploy 100% perfeito." }
            ]
          }
        ]
      },

      // 3. INSTRUMENTO A3: PROJETO PRÁTICO INTEGRADOR VITRINE FLASK & SQLITE (35%)
      A3_PROJETO: {
        id: "A3_PROJETO",
        rotulo: "Rubrica do Projeto Full-Stack Vitrine Flask (Instrumento A3 • 35%)",
        badgeClasse: "bg-success-subtle text-success border",
        icone: "bi-layers-fill",
        dimensoes: [
          {
            id: "dim0",
            titulo: "1. Backend RESTful Python Flask & Persistência SQLite",
            descricao: "Rotas GET/POST RESTful, CORS habilitado, conexão segura ao banco SQLite (vitrine.db), sanitização contra SQL Injection e tratamento de exceções.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Backend com falhas que impedem execução, rotas sem retorno JSON ou SQL inseguro." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Rotas básicas funcionais mas sem tratamento de erros HTTP ou CORS mal configurado." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "API Flask RESTful estável, persistência SQLite funcional e CORS devidamente tratado." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "API profissional, modular, com validação de payload, códigos HTTP semânticos e banco otimizado." }
            ]
          },
          {
            id: "dim1",
            titulo: "2. Frontend Modular ES6 & Consumo Assíncrono Fetch API",
            descricao: "Desacoplamento em módulos JS, consumo assíncrono com async/await, renderização dinâmica de cards/tabelas e feedback de carregamento (spinners).",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Código sem modularização, requisições síncronas ou travamento da UI." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Fetch simples funcional, mas sem tratamento visual de loading ou erro." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Módulos limpos, Fetch com try/catch, spinners de loading e tratamento de status 4xx/5xx." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Integração assíncrona exemplar, reatividade instantânea e tratamento de edge cases." }
            ]
          },
          {
            id: "dim2",
            titulo: "3. Contingência Offline Resiliente (Fallback LocalStorage)",
            descricao: "Comportamento resiliente transparente: quando o backend Flask estiver inacessível, a aplicação chaveia para persistência offline sem quebrar a experiência do usuário.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Aplicação quebra por completo caso o backend esteja desligado." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Detecção de falha no backend, mas sem persistência offline funcional." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Fallback offline para LocalStorage funcionando com aviso visual na tela." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Resiliência impecável, sincronização transparente de estado e UX offline exemplar." }
            ]
          },
          {
            id: "dim3",
            titulo: "4. UX/UI Responsiva, Boas Práticas & Deploy",
            descricao: "Design responsivo Bootstrap 5, formulários acessíveis com validação, modais/toasts, documentação de execução no README e deploy.",
            niveis: [
              { valor: 0.5, classe: "insuficiente", rotulo: "Insuficiente (0,5 pt)", desc: "Layout quebrado em dispositivos móveis, sem README e sem deploy." },
              { valor: 1.2, classe: "desenvolvimento", rotulo: "Em Desenv. (1,2 pt)", desc: "Layout responsivo básico com instruções parciais no README." },
              { valor: 2.0, classe: "conforme", rotulo: "Conforme (2,0 pt)", desc: "Boa responsividade, componentes Bootstrap 5, README com passos de execução." },
              { valor: 2.5, classe: "excelente", rotulo: "Excelente (2,5 pt)", desc: "Acabamento visual refinado, acessibilidade WCAG, deploy público e documentação completa." }
            ]
          }
        ]
      }
    };

    // Aliases e Seletores de Modelo de Rubrica por Demanda
export const DIMENSOES_RUBRICA = MATRIZES_RUBRICA.A4_ROTEIROS.dimensoes;

export function obterModeloRubricaParaDemanda(demandaId, listaDemandas = null) {
  let lista = Array.isArray(listaDemandas) ? listaDemandas : null;
  if (!lista) {
    if (typeof demandasApp !== 'undefined' && Array.isArray(demandasApp)) {
      lista = demandasApp;
    } else if (typeof window !== 'undefined' && Array.isArray(window.demandasApp)) {
      lista = window.demandasApp;
    } else {
      lista = [];
    }
  }

  const d = lista.find(item => item.id === demandaId) ||
            DEMANDAS_INICIAIS.find(item => item.id === demandaId);
  if (!d) {
    if (demandaId && (String(demandaId).startsWith('DEM-SNCT') || String(demandaId) === 'DEM-02')) {
      return MATRIZES_RUBRICA.A2_SNCT;
    }
    return MATRIZES_RUBRICA.A4_ROTEIROS;
  }
  
  const idUpper = String(d.id || '').toUpperCase();
  const instUpper = String(d.instrumento || '').toUpperCase();

  if (idUpper.startsWith('DEM-SNCT') || idUpper === 'DEM-02' || instUpper.includes('A2') || instUpper.includes('SNCT') || instUpper.includes('EXTENSÃO')) {
    return MATRIZES_RUBRICA.A2_SNCT;
  }
  if (idUpper === 'DEM-03' || instUpper.includes('A3') || instUpper.includes('FLASK') || instUpper.includes('VITRINE')) {
    return MATRIZES_RUBRICA.A3_PROJETO;
  }
  return MATRIZES_RUBRICA.A4_ROTEIROS;
}

export function obterDimensoesRubricaParaDemanda(demandaId, listaDemandas = null) {
  const modelo = obterModeloRubricaParaDemanda(demandaId, listaDemandas);
  return modelo.dimensoes;
}
