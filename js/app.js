/**
 * Aplicação Principal do Dashboard ProgWeb 2 (ES6 Modules)
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

// Exportação no namespace window.ProgWeb2
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

// =========================================================================
    // CONSTANTES, DADOS INICIAIS E ESTRUTURAS DE SUPORTE
    // =========================================================================
    const STORAGE_KEY_DEMANDAS = 'progweb2_demandas_data';
    const STORAGE_KEY_AVALIACOES = 'progweb2_rubricas_avaliacoes';
    const STORAGE_KEY_ALUNOS = 'progweb2_alunos_data';
    const STORAGE_KEY_MODO_DOCENTE = 'progweb2_modo_docente';
    const STORAGE_KEY_OFICINAS_VOTACAO = 'progweb2_oficinas_votacao_v1';
    const STORAGE_KEY_VOTOS_OFICINAS = 'progweb2_votos_oficinas_v1';
    const STORAGE_KEY_ULTIMO_VOTANTE = 'progweb2_ultimo_votante';
    const STORAGE_KEY_GOOGLE_SESSION = 'progweb2_google_session_v1';
    const STORAGE_KEY_DEMANDAS_SNCT = 'progweb2_demandas_snct_v1';
    const STORAGE_KEY_DOCENTE_AUTH = 'progweb2_docente_autenticado_v1';
    const DETALHES_FRENTES_SNCT = Constants.DETALHES_FRENTES_SNCT || {};

    let usuarioLogadoGoogle = null;
    let demandasSnctApp = [];

    const ETAPAS_PADRAO_FRENTE_SNCT = [
      "1. Candidatura & divisão (27/10)",
      "2. Rascunho & sala no Moodle (30/10)",
      "3. Revisão cruzada & ensaio no lab"
    ];

    const DEMANDAS_PADRAO_SNCT = [
      // CURSO 1: Meu Primeiro Site no Ar
      {
        id: "c1-frente-didatica",
        cursoId: 1,
        cursoNome: "Curso 1: Meu Primeiro Site no Ar",
        titulo: "Didática & Micro-Roteiro Cirúrgico",
        icone: "bi-journal-richtext",
        corBadge: "badge-pill-blue",
        roteiroCodigo: "Roteiro SNCT 01",
        roteiroPdf: "snct-frentes/frente-didatica/main.pdf",
        descricao: "Redação do micro-roteiro de até 4 páginas no padrão LaTeX da UC e organização das 5 seções da sala do curso no Moodle institucional (com papel de Professor).",
        entregaveis: ["Micro-Roteiro LaTeX compilado em PDF (4 págs.)", "Sala do Curso 1 estruturada no Moodle IFSC"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },
      {
        id: "c1-frente-starterkit",
        cursoId: 1,
        cursoNome: "Curso 1: Meu Primeiro Site no Ar",
        titulo: "Starter Kit & Código Base GitHub",
        icone: "bi-file-earmark-code",
        corBadge: "badge-pill-blue",
        roteiroCodigo: "Roteiro SNCT 02",
        roteiroPdf: "snct-frentes/frente-starterkit/main.pdf",
        descricao: "Estruturação do repositório template no GitHub (HTML5, CSS com variáveis :root e botão WhatsApp), pacote .zip na Seção 1 do Moodle e pen-drive de Plano B.",
        entregaveis: ["Repositório template GitHub ativo", "Pacote starter-kit-snct.zip publicado no Moodle"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },
      {
        id: "c1-frente-slides",
        cursoId: 1,
        cursoNome: "Curso 1: Meu Primeiro Site no Ar",
        titulo: "Slides-Guia de Projeção (8 Telas)",
        icone: "bi-projector",
        corBadge: "badge-pill-blue",
        roteiroCodigo: "Roteiro SNCT 03",
        roteiroPdf: "snct-frentes/frente-slides/main.pdf",
        descricao: "Apresentação HTML/Bootstrap 5 de 8 telas sincronizadas com o micro-roteiro, publicada no GitHub Pages e vinculada na Seção 0 da sala do Moodle.",
        entregaveis: ["Slides de 8 telas no GitHub Pages", "Link e PDF de contingência na Seção 0 do Moodle"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },
      {
        id: "c1-frente-monitoria",
        cursoId: 1,
        cursoNome: "Curso 1: Meu Primeiro Site no Ar",
        titulo: "Monitoria de Bancada & Logística",
        icone: "bi-people",
        corBadge: "badge-pill-blue",
        roteiroCodigo: "Roteiro SNCT 04",
        roteiroPdf: "snct-frentes/frente-monitoria/main.pdf",
        descricao: "Configuração da chave de inscrição (SNCT2026) e Pesquisa de Satisfação na Seção 4 do Moodle, preparação das máquinas do laboratório, presença e fotos.",
        entregaveis: ["Autoinscrição e Pesquisa de 3 perguntas no Moodle", "Escala de bancada, presença e termos de imagem"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },

      // CURSO 2: Painel Verde Garopaba (Coleta Seletiva & Ecopontos)
      {
        id: "c2-frente-didatica",
        cursoId: 2,
        cursoNome: "Curso 2: Painel Verde Garopaba (Coleta Seletiva & Ecopontos)",
        titulo: "Didática & Micro-Roteiro Cirúrgico",
        icone: "bi-journal-check",
        corBadge: "badge-pill-green",
        roteiroCodigo: "Roteiro SNCT 01",
        roteiroPdf: "snct-frentes/frente-didatica/main.pdf",
        descricao: "Elaboração do roteiro passo a passo de 4 páginas em LaTeX focado no componente interativo e estruturação das 5 seções da sala do Curso 2 no Moodle IFSC.",
        entregaveis: ["Micro-Roteiro LaTeX compilado em PDF (4 págs.)", "Sala do Curso 2 estruturada no Moodle IFSC"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },
      {
        id: "c2-frente-starterkit",
        cursoId: 2,
        cursoNome: "Curso 2: Painel Verde Garopaba (Coleta Seletiva & Ecopontos)",
        titulo: "Starter Kit & Componente Prático",
        icone: "bi-code-slash",
        corBadge: "badge-pill-green",
        roteiroCodigo: "Roteiro SNCT 02",
        roteiroPdf: "snct-frentes/frente-starterkit/main.pdf",
        descricao: "Desenvolvimento do template de código com HTML/CSS prontos e função JavaScript comentada, publicação no GitHub e upload do .zip na Seção 1 do Moodle.",
        entregaveis: ["Repositório GitHub template homologado", "Pacote .zip publicado no Moodle + Plano B"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },
      {
        id: "c2-frente-slides",
        cursoId: 2,
        cursoNome: "Curso 2: Painel Verde Garopaba (Coleta Seletiva & Ecopontos)",
        titulo: "Slides-Guia de Projeção (8 Telas)",
        icone: "bi-easel",
        corBadge: "badge-pill-green",
        roteiroCodigo: "Roteiro SNCT 03",
        roteiroPdf: "snct-frentes/frente-slides/main.pdf",
        descricao: "Apresentação de 8 telas em HTML/Bootstrap 5 destacando cada bloco prático e checkpoints, publicada no GitHub Pages e inserida na sala do Moodle.",
        entregaveis: ["Deck de 8 telas no GitHub Pages", "Link e PDF de contingência na Seção 0 do Moodle"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      },
      {
        id: "c2-frente-monitoria",
        cursoId: 2,
        cursoNome: "Curso 2: Painel Verde Garopaba (Coleta Seletiva & Ecopontos)",
        titulo: "Monitoria de Bancada & Logística",
        icone: "bi-person-badge",
        corBadge: "badge-pill-green",
        roteiroCodigo: "Roteiro SNCT 04",
        roteiroPdf: "snct-frentes/frente-monitoria/main.pdf",
        descricao: "Homologação das máquinas do laboratório, chave de inscrição (SNCT2026) e Pesquisa de Satisfação na Seção 4 do Moodle, organização do ensaio e presença.",
        entregaveis: ["Autoinscrição e Pesquisa de 3 perguntas no Moodle", "Checklist das máquinas, presença e fotos"],
        etapas: [false, false, false],
        vagasMax: 3,
        membros: []
      }
    ];

    const OFICINAS_PADRAO_SNCT = [
      {
        id: "oficina-vitrine",
        titulo: "Vitrine para Empreendedores Locais",
        categoria: "Economia Local & Comércio",
        icone: "bi-shop",
        corBadge: "badge-pill-green",
        descricao: "Oficina prática para comerciantes, feirantes e autônomos locais criarem um catálogo responsivo em Bootstrap 5 com botão de pedidos direto via WhatsApp.",
        publico: "Comerciantes locais, feirantes e pequenos empreendedores de Garopaba.",
        criadaPorDocente: false
      },
      {
        id: "oficina-quiz",
        titulo: "JavaScript: Quiz Interativo",
        categoria: "Vocação em TI & Juventude",
        icone: "bi-controller",
        corBadge: "badge-pill-blue",
        descricao: "Voltada a estudantes de escolas públicas municipais e estaduais, explorando lógica, manipulação do DOM e contagem de pontos dinâmica em tempo real no navegador.",
        publico: "Estudantes do Ensino Fundamental e Médio da rede pública.",
        criadaPorDocente: false
      },
      {
        id: "oficina-verde",
        titulo: "Painel Verde: Coleta Seletiva & Ecopontos",
        categoria: "Sustentabilidade & Meio Ambiente",
        icone: "bi-recycle",
        corBadge: "badge-pill-amber",
        descricao: "Alinhada à vocação ambiental de Garopaba e ao tema da SNCT: criação de página com filtros por resíduos recicláveis (vidro, plástico) e mapa interativo de ecopontos.",
        publico: "Comunidade geral, ambientalistas e associações de bairro.",
        criadaPorDocente: false
      }
    ];

    const EQUIPES_PROGWEB2 = [
      "Equipe 1 — Vitrine Comercial & Negócios Locais",
      "Equipe 2 — Portal PetCare (Adoção Animal)",
      "Equipe 3 — Ecoturismo & Trilhas de Garopaba",
      "Equipe 4 — Monitoramento das Praias",
      "Equipe 5 — Feira Agroecológica Local",
      "Equipe 6 — Acessibilidade em Espaços Públicos"
    ];

    const ESTUDANTES_PADRAO = [
      { id: "1", matricula: "202510706080", nome: "Antonio Duarte de Avila Neto", equipe: "Sem equipe definida", email: "antonioduarte1991@hotmail.com", ativo: true },
      { id: "2", matricula: "202510704356", nome: "Arthur Bressan Silva", equipe: "Sem equipe definida", email: "arthurbressan789@gmail.com", ativo: true },
      { id: "3", matricula: "202510704359", nome: "Bernardo Luz da Silva", equipe: "Sem equipe definida", email: "bernardinholuz@gmail.com", ativo: true },
      { id: "4", matricula: "202510704126", nome: "Caio Siega Larroque", equipe: "Sem equipe definida", email: "caio1611sl@gmail.com", ativo: true },
      { id: "5", matricula: "202510704365", nome: "Felipe Machado da Silveira", equipe: "Sem equipe definida", email: "felipems3004@gmail.com", ativo: true },
      { id: "6", matricula: "202510704131", nome: "Gustavo Freitas Lima", equipe: "Sem equipe definida", email: "sinarasurfvilla@hotmail.com", ativo: true },
      { id: "7", matricula: "202510705413", nome: "Henrique de Souza Figueredo", equipe: "Sem equipe definida", email: "figueredosouzahenrique@gmail.com", ativo: true },
      { id: "8", matricula: "202510706851", nome: "Henrique Marcondes de Medeiros", equipe: "Sem equipe definida", email: "henrique.marcondes@outlook.com", ativo: true },
      { id: "9", matricula: "202510704132", nome: "Igor Goncalves Pinheiro", equipe: "Sem equipe definida", email: "igorgoncalvesp20@gmail.com", ativo: true },
      { id: "10", matricula: "202510704367", nome: "Igor Strauch Perrot", equipe: "Sem equipe definida", email: "igorperrot006@gmail.com", ativo: true },
      { id: "11", matricula: "202510704139", nome: "Jhulia Vitoria Adao dos Santos", equipe: "Sem equipe definida", email: "jhuliavitoria226@gmail.com", ativo: true },
      { id: "12", matricula: "202510704146", nome: "Julia Melo Fonseca", equipe: "Sem equipe definida", email: "mfjulia07@gmail.com", ativo: true },
      { id: "13", matricula: "202510704369", nome: "Kauan Souza de Oliveira", equipe: "Sem equipe definida", email: "kauansouzadeoliveira12@gmail.com", ativo: true },
      { id: "14", matricula: "202510705417", nome: "Luana Lazzarin Toebe", equipe: "Sem equipe definida", email: "luanalazzarinrodrigues@gmail.com", ativo: true },
      { id: "15", matricula: "202510706157", nome: "Marina Carmen Cornelius", equipe: "Sem equipe definida", email: "marina.c.cornelius@gmail.com", ativo: true },
      { id: "16", matricula: "202510704351", nome: "Pietro Caetano Fleith", equipe: "Sem equipe definida", email: "ceco1995@gmail.com", ativo: true },
      { id: "17", matricula: "202510704374", nome: "Rafael Bittencourt Fenianos", equipe: "Sem equipe definida", email: "fenianosrafael@gmail.com", ativo: true },
      { id: "18", matricula: "202510704352", nome: "Renan Gomes Pinto", equipe: "Sem equipe definida", email: "rgomespinto19@gmail.com", ativo: true },
      { id: "19", matricula: "202523204395", nome: "Sabrina Moro Villela Pacheco", equipe: "Sem equipe definida", email: "sabrinap@ifsc.edu.br", ativo: true },
      { id: "20", matricula: "202510706162", nome: "Samuel da Silveira Dick", equipe: "Sem equipe definida", email: "samuka.silveira@gmail.com", ativo: true },
      { id: "21", matricula: "202510704353", nome: "Valentim Aita do Nascimento", equipe: "Sem equipe definida", email: "valentim.2018307217@aluno.iffar.edu.br", ativo: true },
      { id: "22", matricula: "202510704379", nome: "Victor Fioravante Xavier", equipe: "Sem equipe definida", email: "victor.f2006@aluno.ifsc.edu.br", ativo: true },
      { id: "23", matricula: "202510704380", nome: "Victor Sirigu Hasegawa", equipe: "Sem equipe definida", email: "victor.sirigu@gmail.com", ativo: true },
      { id: "24", matricula: "202510704355", nome: "Yan Martins Ody", equipe: "Sem equipe definida", email: "yanescoteiro@gmail.com", ativo: true }
    ];

    const DEMANDAS_INICIAIS = [
      {
        id: "DEM-SNCT-01",
        titulo: "Etapa 1 SNCT (Concluída): Candidatura nas Frentes & Divisão de Papéis",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso na SNCT • 20%)",
        destinatario: "Todos",
        tipoAtribuicao: "turma",
        equipesAlvo: [],
        alunosAlvo: [],
        prazo: "2026-10-27",
        horaPrazo: "23:59",
        pontos: 10.0,
        concluida: true,
        descricao: "Fase de candidatura encerrada. As frentes de trabalho dos Cursos 1 e 2 estão consolidadas e ativas com os estudantes engajados para a produção instrucional e técnica das oficinas práticas.",
        criterios: [
          "Candidatura registrada no Quadro de Frentes da SNCT",
          "Leitura do Roteiro Operacional em PDF da respectiva frente (SNCT 01 a SNCT 04)",
          "Divisão clara das responsabilidades entre o trio/dupla de cada frente ativa"
        ]
      },
      {
        id: "DEM-SNCT-C1",
        titulo: "Etapa 2 (Curso 1 — Meu Primeiro Site no Ar): 1ª Versão na Sala do Moodle (id=2663)",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso 1 SNCT • 20%)",
        destinatario: "Equipes do Curso 1 SNCT (Meu Primeiro Site no Ar)",
        tipoAtribuicao: "turma",
        cursoSnctAlvo: 1,
        fixadaMural: true,
        linkApoio: "https://moodle.ifsc.edu.br/course/view.php?id=2663",
        equipesAlvo: [],
        alunosAlvo: [],
        prazo: "2026-11-07",
        horaPrazo: "23:59",
        pontos: 10.0,
        concluida: false,
        descricao: "Ação dos estudantes escalados nas frentes do CURSO 1 (Meu Primeiro Site no Ar): produzir a primeira versão do entregável da sua frente e publicar na Sala Oficial do Curso 1 no Moodle IFSC (id=2663) com perfil de Professor.",
        criterios: [
          "Didática: sala organizada nas 5 seções e rascunho do micro-roteiro em LaTeX (4 págs.)",
          "Starter Kit: repositório template no GitHub e pacote starter-kit-snct.zip na Seção 1 do Moodle",
          "Slides: 8 telas sincronizadas publicadas no GitHub Pages com link na Seção 0 do Moodle",
          "Monitoria: autoinscrição (chave SNCT2026), acesso testado e Pesquisa de Satisfação na Seção 4",
          "Informar o link de entrega no card da sua frente no mural da SNCT"
        ]
      },
      {
        id: "DEM-SNCT-C2",
        titulo: "Etapa 2 (Curso 2 — Painel Verde Garopaba): 1ª Versão na Sala do Moodle (id=2664)",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso 2 SNCT • 20%)",
        destinatario: "Equipes do Curso 2 SNCT (Painel Verde: Coleta & Ecopontos)",
        tipoAtribuicao: "turma",
        cursoSnctAlvo: 2,
        fixadaMural: true,
        linkApoio: "https://moodle.ifsc.edu.br/course/view.php?id=2664",
        equipesAlvo: [],
        alunosAlvo: [],
        prazo: "2026-11-07",
        horaPrazo: "23:59",
        pontos: 10.0,
        concluida: false,
        descricao: "Ação dos estudantes escalados nas frentes do CURSO 2 (Painel Verde Garopaba): produzir o entregável da sua frente e publicar na Sala Oficial do Curso 2 no Moodle IFSC (id=2664) com perfil de Professor.",
        criterios: [
          "Didática: sala do Curso 2 organizada nas 5 seções e rascunho do micro-roteiro Painel Verde (4 págs.)",
          "Starter Kit: repositório template no GitHub e starter-kit-painel-verde.zip na Seção 1 do Moodle",
          "Slides: 8 telas sincronizadas publicadas no GitHub Pages com link na Seção 0 do Moodle",
          "Monitoria: autoinscrição (chave SNCT2026), acesso testado e Pesquisa de Satisfação na Seção 4",
          "Informar o link de entrega no card da sua frente no mural da SNCT"
        ]
      },
      {
        id: "DEM-SNCT-E3",
        titulo: "Etapa 3 SNCT: Material Completo & Revisão Cruzada em Par",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso na SNCT • 20%)",
        destinatario: "Todas as Frentes SNCT",
        tipoAtribuicao: "turma",
        equipesAlvo: [],
        alunosAlvo: [],
        prazo: "2026-11-14",
        horaPrazo: "23:59",
        pontos: 10.0,
        concluida: false,
        descricao: "Cada frente finaliza seu entregável e realiza revisão em par com outra frente do mesmo curso: a Didática confere o código do Kit e a numeração dos Slides; o Starter Kit congela o código e testa offline no lab; a Monitoria valida a infraestrutura.",
        criterios: [
          "Didática: micro-roteiro completo de até 4 págs. no padrão LaTeX da UC com código idêntico ao Starter Kit",
          "Starter Kit: repositório congelado, testado no laboratório e 2 pen-drives de Plano B prontos",
          "Slides: deck de 8 telas responsivas casadas passo a passo com o micro-roteiro e PDF exportado",
          "Monitoria: escala de bancada, termos de autorização de imagem impressos e divulgação ativa",
          "Registro das correções realizadas em revisão cruzada informado no painel"
        ]
      },
      {
        id: "DEM-SNCT-E4",
        titulo: "Etapa 4 SNCT: Teste da Aula & Ensaio Geral no Laboratório (Semana 3)",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso na SNCT • 20%)",
        destinatario: "Todas as Frentes SNCT",
        tipoAtribuicao: "turma",
        equipesAlvo: [],
        alunosAlvo: [],
        prazo: "2026-11-21",
        horaPrazo: "23:59",
        pontos: 10.0,
        concluida: false,
        descricao: "Semana 3 de preparação: teste prático completo da aula no laboratório de informática (120 min). As equipes simulam a condução do minicurso para os colegas e verificam se todos os materiais, cronômetro e laboratórios estão adequados para ministrar.",
        criterios: [
          "Ensaio cronometrado de 120 minutos executado nas bancadas do laboratório de informática",
          "Validação do tempo de cada bloco (Bloco 1: 20m, Bloco 2: 35m, Bloco 3: 25m, Bloco 4: 15m, Fechamento: 10m)",
          "Registro de observações e correções publicadas na sala do Moodle"
        ]
      },
      {
        id: "DEM-SNCT-E5",
        titulo: "Etapa 5 SNCT: Ministração dos Dois Cursos na SNCT (Dia 26/11)",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso na SNCT • 20%)",
        destinatario: "Todas as Frentes SNCT",
        tipoAtribuicao: "turma",
        equipesAlvo: [],
        alunosAlvo: [],
        prazo: "2026-11-26",
        horaPrazo: "23:59",
        pontos: 10.0,
        concluida: false,
        descricao: "Ministração presencial dos dois minicursos (Meu Primeiro Site no Ar e Painel Verde Garopaba) na quinta-feira, 26/11, durante a Semana Nacional de Ciência e Tecnologia (período de 25/11 a 27/11) no IFSC Câmpus Garopaba.",
        criterios: [
          "Presença e atuação ativa dos membros da frente durante todo o período da oficina",
          "Acolhimento da comunidade externa, orientação de bancada e suporte técnico paciente",
          "Coleta de lista de presença assinada e aplicação da Pesquisa de Satisfação no Moodle",
          "Registro fotográfico da oficina com termos de autorização de imagem coletados"
        ]
      },
      {
        id: "DEM-01",
        titulo: "Avaliação Teórica: Fundamentos Web, ES6 Modules, Fetch API & REST",
        instrumento: "A1",
        instrumentoNome: "A1 (Avaliação Teórica • 20%)",
        destinatario: "Todos",
        prazo: "2026-11-10",
        pontos: 10.0,
        concluida: false,
        descricao: "Avaliação conceitual e analítica abordando modularização ES6, ciclo de vida assíncrono (Promises/async/await), requisições HTTP REST com Fetch API, políticas de CORS e arquiteturas web desacopladas.",
        criterios: [
          "Domínio conceitual de modularização ES6 (import/export e escopos)",
          "Compreensão do ciclo de requisições assíncronas com Fetch API e tratamento defensivo (try/catch)",
          "Diferenciação arquitetural entre monólito SSR e API RESTful desacoplada",
          "Conceituação de CORS, cabeçalhos HTTP e persistência relacional"
        ]
      },
      {
        id: "DEM-02",
        titulo: "Curso Ministrado na SNCT: Minicurso/Oficina Prática de Extensão Universitária",
        instrumento: "A2",
        instrumentoNome: "A2 (Curso na SNCT • 20%)",
        destinatario: "Todos",
        prazo: "2026-12-04",
        pontos: 10.0,
        concluida: false,
        descricao: "Consolidação dos resultados da curricularização da extensão universitária (40 horas): planejamento, organização pedagógica, ministração e relatório reflexivo com as evidências coletadas na SNCT 2026.",
        criterios: [
          "Plano de oficina estruturado e alinhado a uma das temáticas extensionistas",
          "Material didático e roteiro de apoio acessível para os participantes externos",
          "Condução presencial da oficina na SNCT com engajamento do público",
          "Relatório reflexivo com evidências da monitoria (presenças, gráficos da pesquisa e fotos)"
        ]
      },
      {
        id: "DEM-03",
        titulo: "Implementação de Site com Fetch API e Backend Flask (Vitrine Comunitária)",
        instrumento: "A3",
        instrumentoNome: "A3 (Vitrine Comunitária Flask • 35%)",
        destinatario: "Todos",
        prazo: "2026-12-08",
        pontos: 10.0,
        concluida: false,
        descricao: "Desenvolvimento e deploy da aplicação web full-stack desacoplada no estilo Vitrine Comunitária, consumindo backend em Python Flask com banco relacional SQLite e modo de contingência offline (fallback com LocalStorage).",
        criterios: [
          "Frontend modular com Fetch API assíncrona, spinners de loading e badges dinâmicos",
          "Backend RESTful em Python Flask com CORS habilitado e rotas GET/POST",
          "Persistência relacional em arquivo SQLite (vitrine.db) com sanitização de consultas",
          "Padrão profissional de contingência resiliente (fallback transparente offline)"
        ]
      },
      {
        id: "DEM-04",
        titulo: "Demais Entregas & Roteiros Práticos de Laboratório (Agrupadas)",
        instrumento: "A4",
        instrumentoNome: "A4 (Demais Entregas • 25%)",
        destinatario: "Todos",
        prazo: "2026-12-15",
        pontos: 10.0,
        concluida: false,
        descricao: "Consolidação e avaliação contínua dos roteiros práticos semanais desenvolvidos em laboratório de informática (Roteiros 1 a 8: Módulos ES6, Fetch API, LocalStorage, CRUDs, Componentes Bootstrap e SPA), pontualidade e engajamento nas entregas no GitHub.",
        criterios: [
          "Entrega pontual dos repositórios e branches com os roteiros práticos semanais",
          "Execução correta dos passos de laboratório e boas práticas de codificação",
          "Presença ativa, participação nas discussões técnicas e resolução de exercícios",
          "Publicação dos experimentos no GitHub Pages com README explicativo"
        ]
      }
    ];

    // =========================================================================
    // MATRIZES DE RUBRICAS FORMATIVAS CONTEXTUAIS (POR INSTRUMENTO / ATIVIDADE)
    // =========================================================================
    const MATRIZES_RUBRICA = {
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
    const DIMENSOES_RUBRICA = MATRIZES_RUBRICA.A4_ROTEIROS.dimensoes;

    function obterModeloRubricaParaDemanda(demandaId) {
      const d = (Array.isArray(demandasApp) ? demandasApp : []).find(item => item.id === demandaId) ||
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

    function obterDimensoesRubricaParaDemanda(demandaId) {
      const modelo = obterModeloRubricaParaDemanda(demandaId);
      return modelo.dimensoes;
    }

    // Estado da Aplicação
    let demandasApp = [];
    let avaliacoesApp = [];
    let alunosApp = [];
    let filtroAtualDemandas = 'todas';
    let subabaNotasAtual = 'entregas';
    let estadoRubricaAtual = { dim0: 2.5, dim1: 2.5, dim2: 2.5, dim3: 2.5 };
    let oficinasVotacaoApp = [];
    let votosOficinasApp = [];
    let alunoVotanteAtualId = '';

    // =========================================================================
    // INICIALIZAÇÃO E PERSISTÊNCIA (LOCALSTORAGE)
    // =========================================================================
    function carregarDados() {
      try {
        const dSalvas = localStorage.getItem(STORAGE_KEY_DEMANDAS);
        if (dSalvas) {
          const parsed = JSON.parse(dSalvas);
          // Migração: se tiver menos de 4 demandas ou pesos anteriores, atualiza para o conjunto oficial com A4
          if (parsed.length < 4 || (parsed[0].titulo && parsed[0].titulo.includes("Roteiro 04")) || (parsed[0].instrumentoNome && parsed[0].instrumentoNome.includes("25%"))) {
            demandasApp = JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));
            localStorage.setItem(STORAGE_KEY_DEMANDAS, JSON.stringify(demandasApp));
          } else {
            demandasApp = parsed;
            // Substitui DEM-SNCT-02 genérica pelas duas demandas separadas (DEM-SNCT-C1 e DEM-SNCT-C2)
            demandasApp = demandasApp.filter(d => d.id !== 'DEM-SNCT-02');
            ['DEM-SNCT-C2', 'DEM-SNCT-C1', 'DEM-SNCT-01'].forEach(idNovo => {
              if (!demandasApp.some(d => d.id === idNovo)) {
                const padrao = DEMANDAS_INICIAIS.find(d => d.id === idNovo);
                if (padrao) demandasApp.unshift(JSON.parse(JSON.stringify(padrao)));
              }
            });

            // Saneamento mandatória de prazos e salas oficiais do Moodle
            demandasApp.forEach(d => {
              if (d.prazo) {
                const norm = normalizarPrazo(d.prazo);
                if (norm) d.prazo = norm;
              }
              if (!d.horaPrazo) d.horaPrazo = "23:59";

              if (d.id === 'DEM-SNCT-C1') {
                d.linkApoio = 'https://moodle.ifsc.edu.br/course/view.php?id=2663';
                if (!d.prazo || d.prazo === '2026-10-30' || String(d.prazo).includes('NaN')) {
                  d.prazo = '2026-11-07';
                }
                if (d.titulo && d.titulo.includes('Exclusiva Curso 1')) {
                  d.titulo = 'Etapa 2 (Curso 1 — Meu Primeiro Site no Ar): 1ª Versão na Sala do Moodle (id=2663)';
                }
                d.fixadaMural = true;
              }
              if (d.id === 'DEM-SNCT-C2') {
                d.linkApoio = 'https://moodle.ifsc.edu.br/course/view.php?id=2664';
                if (!d.prazo || d.prazo === '2026-10-30' || String(d.prazo).includes('NaN')) {
                  d.prazo = '2026-11-07';
                }
                if (d.titulo && d.titulo.includes('Exclusiva Curso 2')) {
                  d.titulo = 'Etapa 2 (Curso 2 — Painel Verde Garopaba): 1ª Versão na Sala do Moodle (id=2664)';
                }
                d.fixadaMural = true;
              }
              if (d.id === 'DEM-SNCT-E4') {
                d.titulo = 'Etapa 4 SNCT: Teste da Aula & Ensaio Geral no Laboratório (Semana 3)';
              }
              if (d.id === 'DEM-SNCT-E5') {
                d.prazo = '2026-11-26';
                d.titulo = 'Etapa 5 SNCT: Ministração dos Dois Cursos na SNCT (Dia 26/11)';
              }
            });

            const dem01 = demandasApp.find(d => d.id === 'DEM-SNCT-01');
            if (dem01) dem01.fixadaMural = true;
            localStorage.setItem(STORAGE_KEY_DEMANDAS, JSON.stringify(demandasApp));
          }
        } else {
          demandasApp = JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));
        }
      } catch (e) {
        console.error("Erro ao carregar demandas:", e);
        demandasApp = JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));
      }

      try {
        const aSalvas = localStorage.getItem(STORAGE_KEY_AVALIACOES);
        avaliacoesApp = aSalvas ? JSON.parse(aSalvas) : [];
      } catch (e) {
        console.error("Erro ao carregar avaliações:", e);
        avaliacoesApp = [];
      }

      try {
        const alSalvos = localStorage.getItem(STORAGE_KEY_ALUNOS);
        if (alSalvos) {
          const parsed = JSON.parse(alSalvos);
          // Migração: se for o mock antigo (12 alunos ou Lucas Silva), atualiza para a lista real da turma
          if (parsed.length === 12 || (parsed.length > 0 && parsed[0].nome === "Lucas Silva")) {
            alunosApp = JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));
            localStorage.setItem(STORAGE_KEY_ALUNOS, JSON.stringify(alunosApp));
          } else {
            alunosApp = parsed;
          }
        } else {
          alunosApp = JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));
        }
      } catch (e) {
        console.error("Erro ao carregar alunos:", e);
        alunosApp = JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));
      }

      try {
        const ofSalvas = localStorage.getItem(STORAGE_KEY_OFICINAS_VOTACAO);
        oficinasVotacaoApp = ofSalvas ? JSON.parse(ofSalvas) : JSON.parse(JSON.stringify(OFICINAS_PADRAO_SNCT));
      } catch (e) {
        console.error("Erro ao carregar oficinas de votação:", e);
        oficinasVotacaoApp = JSON.parse(JSON.stringify(OFICINAS_PADRAO_SNCT));
      }

      try {
        const vtSalvos = localStorage.getItem(STORAGE_KEY_VOTOS_OFICINAS);
        votosOficinasApp = vtSalvos ? JSON.parse(vtSalvos) : [];
      } catch (e) {
        console.error("Erro ao carregar votos:", e);
        votosOficinasApp = [];
      }

      try {
        alunoVotanteAtualId = localStorage.getItem(STORAGE_KEY_ULTIMO_VOTANTE) || '';
      } catch (e) {
        alunoVotanteAtualId = '';
      }
    }

    function salvarDadosDemandas() {
      localStorage.setItem(STORAGE_KEY_DEMANDAS, JSON.stringify(demandasApp));
    }

    function salvarDadosAvaliacoes() {
      localStorage.setItem(STORAGE_KEY_AVALIACOES, JSON.stringify(avaliacoesApp));
    }

    function salvarDadosAlunos() {
      localStorage.setItem(STORAGE_KEY_ALUNOS, JSON.stringify(alunosApp));
      popularSelectEstudantesVotacao();
    }

    function salvarOficinasVotacao() {
      localStorage.setItem(STORAGE_KEY_OFICINAS_VOTACAO, JSON.stringify(oficinasVotacaoApp));
    }

    function salvarVotosOficinas() {
      localStorage.setItem(STORAGE_KEY_VOTOS_OFICINAS, JSON.stringify(votosOficinasApp));
    }

    // =========================================================================
    // NAVEGAÇÃO ENTRE SUB-ABAS DE NOTAS (ESTILO PI 1 & PI 2)
    // =========================================================================
    function trocarSubAbaNotas(subaba, btn) {
      subabaNotasAtual = subaba;
      document.querySelectorAll('.notas-subtab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.subtab-pane').forEach(p => p.classList.remove('active'));

      if (btn) {
        btn.classList.add('active');
      } else {
        const matchingBtn = Array.from(document.querySelectorAll('.notas-subtab-btn')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(subaba));
        if (matchingBtn) matchingBtn.classList.add('active');
      }

      const pane = document.getElementById(`subtab-${subaba}`);
      if (pane) pane.classList.add('active');

      if (subaba === 'entregas') {
        renderizarTabelaRubricas();
      } else if (subaba === 'alunos') {
        renderizarTabelaAlunos();
      } else if (subaba === 'fechamento') {
        renderizarTabelaFechamento();
      }
    }

    // =========================================================================
    // CONTROLE DE ACESSO DOCENTE & VISÃO TRANSPARENTE DAS FRENTES
    // =========================================================================
    function ehProfessor(usuarioOuEmail) {
      if (!usuarioOuEmail) return false;
      const email = (typeof usuarioOuEmail === 'string' ? usuarioOuEmail : (usuarioOuEmail.email || '')).toLowerCase().trim();
      return email === 'chameoandre@gmail.com' ||
             email === 'andre.moraes@ifsc.edu.br' ||
             email.includes('chameoandre') ||
             email.startsWith('andre.moraes');
    }

    function ehModoDocenteAutorizado() {
      if (usuarioLogadoGoogle && ehProfessor(usuarioLogadoGoogle)) {
        return true;
      }
      return localStorage.getItem(STORAGE_KEY_DOCENTE_AUTH) === 'true';
    }

    function atualizarUIModoDocente(ativo) {
      const textEl = document.getElementById('modoDocenteText');
      const btnEl = document.getElementById('btnModoDocente');
      const btnAbaEl = document.getElementById('btnDesbloquearDocenteAba');
      const txtBtnAbaEl = document.getElementById('txtBtnDesbloquearDocenteAba');
      const tabBtnTitulo = document.getElementById('tabBtnDocenteTitulo');

      if (textEl) {
        textEl.innerText = ativo ? 'Modo Docente (Ativo)' : 'Acesso Docente';
      }
      if (tabBtnTitulo) {
        tabBtnTitulo.innerHTML = ativo ? '8. Painel de Frentes &amp; Área Docente' : '8. Painel de Frentes &amp; Gestão SNCT';
      }
      if (btnEl) {
        if (ativo) {
          btnEl.style.borderColor = 'var(--accent-amber)';
          btnEl.style.color = 'var(--accent-amber)';
          btnEl.style.background = 'rgba(217, 119, 6, 0.12)';
          btnEl.title = 'Modo Docente administrativo ativo. Clique para alternar para visão de estudante.';
        } else {
          btnEl.style.borderColor = 'var(--border-color)';
          btnEl.style.color = 'var(--text-muted)';
          btnEl.style.background = 'transparent';
          btnEl.title = 'Acesso restrito ao Professor André Moraes';
        }
      }
      if (btnAbaEl) {
        if (ativo) {
          btnAbaEl.innerHTML = '<i class="fa-solid fa-chalkboard-user text-warning me-1"></i> Modo Docente Ativo (Alternar)';
          btnAbaEl.className = 'btn-action btn-outline-action text-warning border-warning';
        } else {
          btnAbaEl.innerHTML = '<i class="fa-solid fa-lock me-1"></i> Desbloquear Acesso Docente';
          btnAbaEl.className = 'btn-action btn-outline-action';
        }
      }
    }

    function initModoDocente() {
      const autorizado = ehModoDocenteAutorizado();
      const salvo = localStorage.getItem(STORAGE_KEY_MODO_DOCENTE);
      // Padrão de segurança: visitantes e estudantes entram SEMPRE em modo estudante (false)
      const ativo = autorizado && salvo === 'true';
      if (ativo) {
        document.body.classList.add('modo-docente-ativo');
      } else {
        document.body.classList.remove('modo-docente-ativo');
      }
      atualizarUIModoDocente(ativo);
    }

    function solicitarAcessoDocente() {
      const jaAtivo = document.body.classList.contains('modo-docente-ativo');
      if (jaAtivo) {
        const querSair = confirm("Você está no Modo Docente Administrativo.\nDeseja alternar para a Visão de Leitura do Estudante?");
        if (querSair) {
          document.body.classList.remove('modo-docente-ativo');
          localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'false');
          localStorage.removeItem(STORAGE_KEY_DOCENTE_AUTH);
          atualizarUIModoDocente(false);
          renderizarAreaDocente();
          renderizarCardMinhaFrenteEstudante();
          showToast("Visão do Estudante Ativada", "Visualização configurada no modo de consulta do estudante.", "fa-solid fa-user-graduate text-primary");
        }
        return;
      }

      // 1. Usuário logado com conta Google docente
      if (usuarioLogadoGoogle && ehProfessor(usuarioLogadoGoogle)) {
        document.body.classList.add('modo-docente-ativo');
        localStorage.setItem(STORAGE_KEY_DOCENTE_AUTH, 'true');
        localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'true');
        atualizarUIModoDocente(true);
        renderizarAreaDocente();
        renderizarCardMinhaFrenteEstudante();
        showToast("Modo Docente Ativado", "Olá, Prof. André Moraes! Controles administrativos liberados.", "fa-solid fa-chalkboard-user text-warning");
        showTab('tab-docente');
        return;
      }

      // 2. Estudante identificado tentando acionar modo docente
      if (usuarioLogadoGoogle && usuarioLogadoGoogle.alunoId) {
        alert(`Acesso Administrativo Restrito:\nVocê está autenticado como estudante (${usuarioLogadoGoogle.nome}).\n\nO painel administrativo completo de criação/edição de demandas, envio de comunicados em massa e cobranças é restrito ao professor André Moraes.\n\nVocê pode consultar a distribuição de todas as frentes nesta aba.`);
        return;
      }

      // 3. Visitante ou professor sem login Google: solicitar chave de acesso
      const chave = prompt("Área Administrativa Docente (Prof. André Moraes)\nDigite a chave de acesso docente ou autentique-se com sua conta Google de professor:");
      if (chave === null) return;

      const chaveLimpa = chave.trim().toLowerCase();
      if (chaveLimpa === 'ifsc2026' || chaveLimpa === 'docente2026' || chaveLimpa === 'chameoandre@gmail.com' || chaveLimpa === 'andre.moraes@ifsc.edu.br') {
        document.body.classList.add('modo-docente-ativo');
        localStorage.setItem(STORAGE_KEY_DOCENTE_AUTH, 'true');
        localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'true');
        atualizarUIModoDocente(true);
        renderizarAreaDocente();
        renderizarCardMinhaFrenteEstudante();
        showToast("Modo Docente Liberado", "Chave administrativa validada com sucesso!", "fa-solid fa-chalkboard-user text-warning");
        showTab('tab-docente');
      } else {
        alert("Chave de acesso incorreta. O painel administrativo completo é restrito ao professor da disciplina.");
      }
    }

    function toggleModoDocente() {
      solicitarAcessoDocente();
    }

    function abrirPainelFrentesGestao() {
      showTab('tab-docente');
    }

    function abrirAreaDocenteDireto() {
      abrirPainelFrentesGestao();
    }

    // =========================================================================
    // E-MAILS E NOTIFICAÇÕES (ESTILO PI 1 & PI 2)
    // =========================================================================
    function obterEmailsEquipe(equipeNome) {
      return alunosApp
        .filter(a => a.ativo && a.equipe === equipeNome && a.email)
        .map(a => a.email.trim());
    }

    function gerarTextoDevolutiva(demandaId, equipeNome) {
      const dem = demandasApp.find(d => d.id === demandaId) || { id: demandaId, titulo: demandaId, instrumento: 'A2' };
      const aval = avaliacoesApp.find(a => a.demandaId === demandaId && a.equipe === equipeNome);
      const alunosDaEquipe = alunosApp.filter(a => a.ativo && a.equipe === equipeNome).map(a => a.nome).join(', ');

      const notaStr = aval ? (aval.nota || 0).toFixed(1) : "—";
      const conceitoStr = aval ? aval.conceito : "Pendente";
      const dims = aval ? (aval.dimensoes || {}) : {};
      const feedback = aval && aval.feedback ? aval.feedback : "Trabalho avaliado em conformidade com os critérios do roteiro.";
      const linkRepo = aval && aval.linkRepo ? aval.linkRepo : "https://github.com/";

      const modelo = obterModeloRubricaParaDemanda(demandaId);
      const detalhamentoDimensoes = modelo.dimensoes.map((dim, idx) => {
        const val = dims[`dim${idx}`] !== undefined ? dims[`dim${idx}`] : (dims[dim.id] !== undefined ? dims[dim.id] : 0);
        return `${dim.titulo}: ${val.toFixed(1)} / 2.5 pts`;
      }).join('\n');

      return `Prezado(a) estudante,

Sua equipe (${equipeNome}) recebeu uma devolutiva de avaliação formativa por rubricas na disciplina de Programação para a Internet 2 (ProgWeb 2 - CST em Sistemas para a Internet / IFSC Câmpus Garopaba).

==================================================
DEMANDA / CHECKPOINT AVALIADO:
• Código: ${dem.id}
• Título: ${dem.titulo}
• Instrumento Avaliativo: ${dem.instrumento || 'A2'}
• Matriz de Rubrica: ${modelo.rotulo}
• Integrantes: ${alunosDaEquipe || 'Equipe'}

PONTUAÇÃO CONSOLIDADA:
• Nota da Rubrica: ${notaStr} / 10.0 (${conceitoStr})

DETALHAMENTO POR DIMENSÃO:
${detalhamentoDimensoes}

PARECER FORMATIVO DO PROFESSOR:
"${feedback}"

LINK DE COMPROVAÇÃO / REPOSITÓRIO:
${linkRepo}
==================================================

Em caso de dúvidas conceituais ou recomendações de refatoração, procure o professor em horário de laboratório ou atendimento aos estudantes.

Atenciosamente,
Prof. André Moraes — IFSC Câmpus Garopaba`;
    }

    // =========================================================================
    // CLIENTE UNIFICADO DA API GOOGLE APPS SCRIPT (PADRÃO PI-1 & PI-2)
    // =========================================================================
    async function chamarApiAppsScript(acao, payload = {}) {
      const cfg = window.PROGWEB2_CONFIG;
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
        // Fallback em navegadores com bloqueio de redirecionamento 302 em POST (Safari ITP / Brave Shields):
        // se o erro for falha de rede/CORS (TypeError), tenta disparar via GET ?payload=... ou no-cors
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

    async function notificarEquipeEmail(demandaId, equipeNome) {
      const emails = obterEmailsEquipe(equipeNome);
      const aval = avaliacoesApp.find(a => a.demandaId === demandaId && a.equipe === equipeNome);
      const dem = demandasApp.find(d => d.id === demandaId) || { id: demandaId, titulo: demandaId, instrumento: 'A2' };

      showToast("Disparando E-mail...", `Enviando devolutiva em HTML via Planilha para ${equipeNome}...`, "fa-solid fa-spinner fa-spin text-primary");
      try {
        const res = await chamarApiAppsScript('salvar_avaliacao', {
          avaliacao: aval || {
            demandaId,
            equipe: equipeNome,
            instrumento: dem.instrumento || 'A2',
            nota: 10.0,
            feedback: 'Avaliação formativa registrada no painel.'
          },
          notificarEmail: true,
          destinatariosEmails: emails
        });
        showToast(
          "Devolutiva Enviada por E-mail!",
          `Notificação HTML enviada automaticamente pela planilha para ${res.totalEnviados || emails.length} integrante(s) de ${equipeNome}.`,
          "fa-solid fa-paper-plane text-success"
        );
      } catch (err) {
        console.warn("Erro ao enviar devolutiva via Apps Script:", err);
        showToast("Aviso de Envio", `Não foi possível enviar via planilha (${err.message || err}).`, "fa-solid fa-triangle-exclamation text-warning");
      }
    }

    function copiarDevolutivaTexto(demandaId, equipeNome) {
      const texto = gerarTextoDevolutiva(demandaId, equipeNome);
      navigator.clipboard.writeText(texto).then(() => {
        showToast("Devolutiva Copiada", "Texto completo da avaliação copiado para envio no WhatsApp ou SIGAA!", "fa-solid fa-clipboard-check text-success");
      });
    }

    function copiarDevolutivaModalRubrica() {
      const dId = document.getElementById('selectRubricaDemanda').value;
      const eq = document.getElementById('selectRubricaEquipe').value;
      copiarDevolutivaTexto(dId, eq);
    }

    function dispararEmailTurmaCompleta() {
      // Abre o modal de Comunicado Oficial (padrão PI-2) para envio automático via GmailApp
      const primeiraDemanda = demandasApp.find(d => !d.concluida) || demandasApp[0];
      if (primeiraDemanda) {
        abrirModalComunicadoDemanda(primeiraDemanda.id);
      } else {
        showTab('tab-docente');
      }
    }

    // =========================================================================
    // CÁLCULO DE PRAZOS E STATUS
    // =========================================================================
    function normalizarPrazo(prazo) {
      if (!prazo) return '';
      if (prazo instanceof Date) {
        if (isNaN(prazo.getTime())) return '';
        return prazo.toISOString().slice(0, 10);
      }
      const str = String(prazo).trim();
      if (!str || str === 'undefined' || str === 'null' || str === 'NaN') return '';

      if (str.includes('T')) {
        const parteData = str.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(parteData)) return parteData;
      }
      if (str.includes(' ')) {
        const parteData = str.split(' ')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(parteData)) return parteData;
        const matchPtBrEspaco = parteData.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (matchPtBrEspaco) {
          return `${matchPtBrEspaco[3]}-${matchPtBrEspaco[2].padStart(2, '0')}-${matchPtBrEspaco[1].padStart(2, '0')}`;
        }
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return str;
      }

      const matchPtBr = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (matchPtBr) {
        const dia = matchPtBr[1].padStart(2, '0');
        const mes = matchPtBr[2].padStart(2, '0');
        const ano = matchPtBr[3];
        return `${ano}-${mes}-${dia}`;
      }

      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
      }
      return '';
    }

    function calcularStatusPrazo(prazoStr, concluida, horaPrazo) {
      if (concluida) {
        return {
          classe: 'badge-pill-green',
          texto: '<i class="fa-solid fa-circle-check"></i> Concluída',
          urgente: false
        };
      }

      const prazoNormalizado = normalizarPrazo(prazoStr);
      if (!prazoNormalizado) {
        return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataPrazo = new Date(`${prazoNormalizado}T${horaPrazo || '23:59'}:59`);

      if (isNaN(dataPrazo.getTime())) {
        return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
      }

      const diffMs = dataPrazo - hoje;
      const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (isNaN(diffDias)) {
        return { classe: 'badge-pill-blue', texto: 'Sem prazo definido', urgente: false };
      }

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

    function gerarBotaoRecursoDemanda(d) {
      let link = (d.linkApoio || '').trim();

      if (d.id === 'DEM-SNCT-C1' && (!link || link.includes('main.pdf'))) {
        link = 'https://moodle.ifsc.edu.br/course/view.php?id=2663';
      } else if (d.id === 'DEM-SNCT-C2' && (!link || link.includes('main.pdf'))) {
        link = 'https://moodle.ifsc.edu.br/course/view.php?id=2664';
      }

      if (!link) return '';

      const linkEsc = escapeHtml(link);

      if (d.id === 'DEM-SNCT-C1' || link.includes('id=2663')) {
        return `
          <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
             class="btn btn-sm btn-outline-primary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
             title="Abrir Sala Oficial do Curso 1 no Moodle IFSC (id=2663)">
            <i class="bi bi-mortarboard-fill"></i> Sala Curso 1 no Moodle <i class="bi bi-box-arrow-up-right"></i>
          </a>
        `;
      }

      if (d.id === 'DEM-SNCT-C2' || link.includes('id=2664')) {
        return `
          <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
             class="btn btn-sm btn-outline-success py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
             title="Abrir Sala Oficial do Curso 2 no Moodle IFSC (id=2664)">
            <i class="bi bi-mortarboard-fill"></i> Sala Curso 2 no Moodle <i class="bi bi-box-arrow-up-right"></i>
          </a>
        `;
      }

      if (link.includes('moodle.ifsc.edu.br')) {
        return `
          <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
             class="btn btn-sm btn-outline-primary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
             title="Abrir Sala no Moodle IFSC">
            <i class="bi bi-mortarboard-fill"></i> Abrir Sala no Moodle <i class="bi bi-box-arrow-up-right"></i>
          </a>
        `;
      }

      if (link.toLowerCase().endsWith('.pdf') || link.includes('.pdf?')) {
        return `
          <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
             class="btn btn-sm btn-outline-secondary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
             title="Abrir Documento ou Roteiro em PDF">
            <i class="bi bi-file-earmark-pdf"></i> Abrir Roteiro PDF <i class="bi bi-box-arrow-up-right"></i>
          </a>
        `;
      }

      if (link.includes('github.com')) {
        return `
          <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
             class="btn btn-sm btn-outline-dark py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
             title="Abrir Repositório no GitHub">
            <i class="bi bi-github"></i> Abrir no GitHub <i class="bi bi-box-arrow-up-right"></i>
          </a>
        `;
      }

      return `
        <a href="${linkEsc}" target="_blank" rel="noopener noreferrer"
           class="btn btn-sm btn-outline-primary py-0 px-2 fs-label ms-auto d-inline-flex align-items-center gap-1"
           title="Abrir recurso ou sala de apoio">
          <i class="bi bi-box-arrow-up-right"></i> Abrir Recurso
        </a>
      `;
    }

    // =========================================================================
    // RENDERIZAÇÃO DA CENTRAL DE DEMANDAS
    // =========================================================================
    function filtrarDemandas(filtro, btn) {
      filtroAtualDemandas = filtro;
      if (btn) {
        document.querySelectorAll('#filterChipsContainer .filter-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
      }
      renderizarDemandas();
    }

    function obterMetadadosVisuaisDemanda(d) {
      const id = String(d.id || '').toUpperCase();
      if (id === 'DEM-SNCT-01') {
        return {
          etapaBadge: 'ETAPA 1 · CANDIDATURA',
          badgeCor: 'bg-success-subtle text-success border border-success-subtle',
          icone: 'bi-people-fill',
          corIcone: '#059669',
          bgIcone: 'rgba(5, 150, 105, 0.12)'
        };
      }
      if (id === 'DEM-SNCT-C1') {
        return {
          etapaBadge: 'ETAPA 2 · CURSO 1 (MOODLE)',
          badgeCor: 'bg-info-subtle text-dark border border-info-subtle',
          icone: 'bi-mortarboard-fill',
          corIcone: 'var(--accent-blue)',
          bgIcone: 'rgba(2, 132, 199, 0.12)'
        };
      }
      if (id === 'DEM-SNCT-C2') {
        return {
          etapaBadge: 'ETAPA 2 · CURSO 2 (MOODLE)',
          badgeCor: 'bg-success-subtle text-success border border-success-subtle',
          icone: 'bi-mortarboard-fill',
          corIcone: '#059669',
          bgIcone: 'rgba(5, 150, 105, 0.12)'
        };
      }
      if (id === 'DEM-SNCT-E3') {
        return {
          etapaBadge: 'ETAPA 3 · REVISÃO EM PAR',
          badgeCor: 'bg-primary-subtle text-primary border border-primary-subtle',
          icone: 'bi-check2-all',
          corIcone: 'var(--accent-blue)',
          bgIcone: 'rgba(2, 132, 199, 0.12)'
        };
      }
      if (id === 'DEM-SNCT-E4') {
        return {
          etapaBadge: 'ETAPA 4 · ENSAIO 120M',
          badgeCor: 'bg-secondary-subtle text-dark border',
          icone: 'bi-stopwatch-fill',
          corIcone: 'var(--accent-purple)',
          bgIcone: 'rgba(147, 51, 234, 0.12)'
        };
      }
      if (id === 'DEM-SNCT-E5') {
        return {
          etapaBadge: 'ETAPA 5 · OFICINAS SNCT',
          badgeCor: 'bg-danger-subtle text-danger border border-danger-subtle',
          icone: 'bi-rocket-takeoff-fill',
          corIcone: '#e11d48',
          bgIcone: 'rgba(225, 29, 72, 0.12)'
        };
      }
      if (id === 'DEM-02') {
        return {
          etapaBadge: 'CONSOLIDAÇÃO A2 · EXTENSÃO',
          badgeCor: 'bg-primary-subtle text-primary border',
          icone: 'bi-award-fill',
          corIcone: 'var(--accent-blue)',
          bgIcone: 'rgba(2, 132, 199, 0.12)'
        };
      }
      if (id === 'DEM-03') {
        return {
          etapaBadge: 'PROJETO A3 · VITRINE FLASK',
          badgeCor: 'bg-success-subtle text-success border',
          icone: 'bi-layers-fill',
          corIcone: '#059669',
          bgIcone: 'rgba(5, 150, 105, 0.12)'
        };
      }
      if (id === 'DEM-01') {
        return {
          etapaBadge: 'AVALIAÇÃO A1 · TEÓRICA',
          badgeCor: 'bg-warning-subtle text-warning border',
          icone: 'bi-journal-bookmark-fill',
          corIcone: 'var(--accent-amber)',
          bgIcone: 'rgba(217, 119, 6, 0.12)'
        };
      }
      return {
        etapaBadge: 'ROTEIROS A4 · LABORATÓRIO',
        badgeCor: 'bg-secondary-subtle text-secondary border',
        icone: 'bi-code-square',
        corIcone: '#64748b',
        bgIcone: 'rgba(100, 116, 139, 0.12)'
      };
    }

    function navegarParaEtapaSNCT(etapaNum) {
      if (etapaNum === 1) {
        showTab('tab-extensao');
        setTimeout(() => {
          const collapse = document.getElementById('collapseQuadroFrentes');
          if (collapse) collapse.open = true;
          const el = document.getElementById('painelNominalCandidaturasSNCT') || document.getElementById('quadroDemandasSNCT');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('snct-step-highlight');
            setTimeout(() => el.classList.remove('snct-step-highlight'), 2200);
          }
        }, 150);
      } else if (etapaNum === 2) {
        showTab('tab-extensao');
        setTimeout(() => {
          const collapse = document.getElementById('collapseQuadroFrentes');
          if (collapse) collapse.open = true;
          const el = document.getElementById('containerFrentesCurso1');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('snct-step-highlight');
            setTimeout(() => el.classList.remove('snct-step-highlight'), 2200);
          }
        }, 150);
      } else {
        showTab('tab-demandas');
        const idMap = { 3: 'DEM-SNCT-E3', 4: 'DEM-SNCT-E4', 5: 'DEM-SNCT-E5' };
        const dId = idMap[etapaNum];
        setTimeout(() => {
          const card = document.getElementById(`demanda-card-${dId}`) || document.querySelector(`.demanda-card[data-demanda-id="${dId}"]`);
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('snct-step-highlight');
            setTimeout(() => card.classList.remove('snct-step-highlight'), 2200);
          }
        }, 150);
      }
    }

    function renderizarTabelaChecklistFrentesDemanda(demandaId, cursoId, demandasSnct = []) {
      if (demandaId !== 'DEM-SNCT-C1' && demandaId !== 'DEM-SNCT-C2') return '';

      const cId = cursoId || (demandaId === 'DEM-SNCT-C1' ? 1 : 2);
      const frentes = (demandasSnct || []).filter(f => f.cursoId === cId);

      const dadosFrentesInfo = cId === 1 ? [
        {
          id: 'c1-frente-didatica',
          nome: 'Frente 1: Didática & Roteiro',
          icone: 'bi-journal-check',
          corIcone: '#0284c7',
          secaoMoodle: 'Seção Geral (0) e 1 a 4',
          entregavel: 'Rascunho do Micro-Roteiro em PDF (4 págs. LaTeX) + 5 Seções da sala organizadas',
          badgeArquivo: 'micro-roteiro-c1.pdf'
        },
        {
          id: 'c1-frente-starterkit',
          nome: 'Frente 2: Starter Kit Código',
          icone: 'bi-code-slash',
          corIcone: '#059669',
          secaoMoodle: 'Seção 1 (Código Inicial)',
          entregavel: 'Repositório template no GitHub + upload do pacote starter-kit-snct.zip na Seção 1',
          badgeArquivo: 'starter-kit-snct.zip'
        },
        {
          id: 'c1-frente-slides',
          nome: 'Frente 3: Slides 8 Telas',
          icone: 'bi-easel2',
          corIcone: '#d97706',
          secaoMoodle: 'Seção 0 (Apresentação)',
          entregavel: 'Apresentação no GitHub Pages + Link e PDF de contingência vinculados na Seção 0',
          badgeArquivo: 'slides-8-telas'
        },
        {
          id: 'c1-frente-monitoria',
          nome: 'Frente 4: Monitoria & Apoio',
          icone: 'bi-people',
          corIcone: '#9333ea',
          secaoMoodle: 'Seção 4 (Avaliação)',
          entregavel: 'Chave SNCT2026 testada + Pesquisa de Satisfação (3 perguntas) criada na Seção 4',
          badgeArquivo: 'chave-SNCT2026'
        }
      ] : [
        {
          id: 'c2-frente-didatica',
          nome: 'Frente 1: Didática & Roteiro',
          icone: 'bi-journal-check',
          corIcone: '#0284c7',
          secaoMoodle: 'Seção Geral (0) e 1 a 4',
          entregavel: 'Rascunho do Micro-Roteiro Painel Verde (4 págs. LaTeX) + 5 Seções da sala',
          badgeArquivo: 'micro-roteiro-c2.pdf'
        },
        {
          id: 'c2-frente-starterkit',
          nome: 'Frente 2: Starter Kit Código',
          icone: 'bi-code-slash',
          corIcone: '#059669',
          secaoMoodle: 'Seção 1 (Código Inicial)',
          entregavel: 'Repositório template no GitHub + pacote starter-kit-painel-verde.zip na Seção 1',
          badgeArquivo: 'starter-kit-painel-verde.zip'
        },
        {
          id: 'c2-frente-slides',
          nome: 'Frente 3: Slides 8 Telas',
          icone: 'bi-easel2',
          corIcone: '#d97706',
          secaoMoodle: 'Seção 0 (Apresentação)',
          entregavel: 'Apresentação no GitHub Pages + Link e PDF de contingência vinculados na Seção 0',
          badgeArquivo: 'slides-8-telas'
        },
        {
          id: 'c2-frente-monitoria',
          nome: 'Frente 4: Monitoria & Apoio',
          icone: 'bi-people',
          corIcone: '#9333ea',
          secaoMoodle: 'Seção 4 (Avaliação)',
          entregavel: 'Chave SNCT2026 testada + Pesquisa de Satisfação (3 perguntas) criada na Seção 4',
          badgeArquivo: 'chave-SNCT2026'
        }
      ];

      const moodleUrl = cId === 1 ? 'https://moodle.ifsc.edu.br/course/view.php?id=2663' : 'https://moodle.ifsc.edu.br/course/view.php?id=2664';

      const linhasHtml = dadosFrentesInfo.map(fInfo => {
        const fReal = frentes.find(f => f.id === fInfo.id);
        const membros = (fReal && Array.isArray(fReal.membros)) ? fReal.membros : [];
        const membroComLink = membros.find(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
        const linkEntrega = membroComLink ? membroComLink.linkEntrega.trim() : '';
        const entregue = Boolean(linkEntrega);

        return `
          <tr>
            <td>
              <div class="d-flex align-items-center gap-2">
                <span class="fs-6" style="color: ${fInfo.corIcone};"><i class="bi ${fInfo.icone}"></i></span>
                <div>
                  <div class="fw-bold text-heading">${escapeHtml(fInfo.nome)}</div>
                  <div class="text-muted fs-label">
                    ${membros.length > 0 ? `${membros.length} estudante(s) escalado(s)` : 'Aguardando trio'}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span class="badge bg-light text-dark border font-mono">
                <i class="bi bi-folder2-open me-1 text-primary"></i>${escapeHtml(fInfo.secaoMoodle)}
              </span>
            </td>
            <td>
              <div class="text-secondary mb-1">${escapeHtml(fInfo.entregavel)}</div>
              <span class="badge bg-secondary-subtle text-secondary font-code fs-label">
                ${escapeHtml(fInfo.badgeArquivo)}
              </span>
            </td>
            <td class="text-center">
              ${entregue ? `
                <div class="d-inline-flex flex-column align-items-center gap-1">
                  <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                    <i class="bi bi-check-circle-fill me-1"></i> Entregue
                  </span>
                  <a href="${escapeHtml(linkEntrega)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-link p-0 fs-label text-success fw-bold" title="Abrir link de entrega da frente">
                    <i class="bi bi-box-arrow-up-right me-1"></i>Ver Link
                  </a>
                </div>
              ` : `
                <span class="badge bg-warning-subtle text-dark border border-warning-subtle px-2 py-1">
                  <i class="bi bi-hourglass-split me-1 text-warning"></i> Pendente
                </span>
              `}
            </td>
          </tr>
        `;
      }).join('');

      return `
        <div class="my-3 p-2 rounded" style="background: var(--bg-card); border: 1px solid var(--border-color); border-left: 4px solid ${cId === 1 ? 'var(--accent-blue)' : 'var(--accent-emerald)'};">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2 px-1">
            <div class="d-flex align-items-center gap-2">
              <span class="badge ${cId === 1 ? 'bg-primary-subtle text-primary border-primary-subtle' : 'bg-success-subtle text-success border-success-subtle'} border font-outfit">
                <i class="fa-solid fa-list-check me-1"></i> CHECKLIST OPERACIONAL POR FRENTE (SALA MOODLE ID=${cId === 1 ? '2663' : '2664'})
              </span>
              <span class="fs-caption text-muted">Cada trio executa e publica seu entregável na seção indicada:</span>
            </div>
            <a href="${moodleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm ${cId === 1 ? 'btn-outline-primary' : 'btn-outline-success'} py-0 px-2 fs-label fw-bold d-inline-flex align-items-center gap-1">
              <i class="bi bi-mortarboard-fill"></i> Acessar Sala Curso ${cId} no Moodle <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </div>

          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0 fs-caption">
              <thead style="background: var(--bg-card-hover);">
                <tr class="text-muted fs-label">
                  <th style="width: 26%;">Frente de Trabalho</th>
                  <th style="width: 22%;">Local na Sala Moodle</th>
                  <th style="width: 38%;">Entregável Obrigatório (Até 07/11 às 23:59)</th>
                  <th style="width: 14%; text-align: center;">Checkpoint</th>
                </tr>
              </thead>
              <tbody>
                ${linhasHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    function inserirModeloChecklistMoodleComunicado() {
      const dId = document.getElementById('inputComunicadoDemandaId').value;
      const d = demandasApp.find(item => item.id === dId) || demandasApp.find(item => item.id === 'DEM-SNCT-C1');
      const cId = d && d.cursoSnctAlvo ? d.cursoSnctAlvo : (dId.includes('C2') ? 2 : 1);
      const moodleId = cId === 1 ? '2663' : '2664';
      const cursoNome = cId === 1 ? 'Curso 1: Meu Primeiro Site no Ar' : 'Curso 2: Painel Verde Garopaba';

      const textoModelo = `Prezados(as) estudantes de Programação para a Internet 2,

Conforme alinhado com a turma, segue o cronograma operacional das nossas próximas 3 semanas até a Semana Nacional de Ciência e Tecnologia (SNCT 2026, de 25/11 a 27/11):

📅 CRONOGRAMA INTEGRADO:
• Semanas 1 e 2 (Produção): Trabalho intensivo nas salas oficiais do Moodle para estruturar e publicar os entregáveis.
• Semana 3 (Testar a Aula): Ensaio geral cronometrado no laboratório (120 min) para simular a aula e validar se tudo está adequado para ministrar.
• Dia 26/11 (Quinta-feira): Ministração presencial dos nossos 2 cursos para a comunidade externa na SNCT!

Todos vocês possuem papel de Professor na sala do respectivo curso:
• Sala do ${cursoNome} no Moodle IFSC: https://moodle.ifsc.edu.br/course/view.php?id=${moodleId}

Abaixo segue o CHECKLIST OPERACIONAL com a missão de cada uma das 4 frentes:

1. 📘 Frente 1 (Didática & Micro-Roteiro):
   • Onde: Seção Geral (0) e Seções 1 a 4 da sala.
   • Entregável: Organizar as 5 seções da sala + publicar o rascunho do micro-roteiro em PDF (4 págs. LaTeX).

2. 💻 Frente 2 (Starter Kit de Código):
   • Onde: Seção 1 (Código Inicial) da sala.
   • Entregável: Homologar template no GitHub + upload do pacote .zip na Seção 1 do Moodle.

3. 🖥️ Frente 3 (Slides-Guia 8 Telas):
   • Onde: Seção 0 (Apresentação / Boas-Vindas) da sala.
   • Entregável: Publicar os slides responsivos no GitHub Pages + link e PDF na Seção 0 do Moodle.

4. 👥 Frente 4 (Monitoria de Bancada & Logística):
   • Onde: Seção 4 (Avaliação & Encerramento) da sala.
   • Entregável: Testar autoinscrição (chave SNCT2026) + cadastrar Pesquisa de Satisfação (3 perguntas).

Assim que publicarem na sala, lembrem-se de registrar o link de entrega no painel da disciplina para validação e avaliação formativa (A2).

Bons trabalhos e foco na produção!
Prof. André Moraes — IFSC Câmpus Garopaba`;

      const inputMsg = document.getElementById('inputComunicadoMensagem');
      if (inputMsg) {
        inputMsg.value = textoModelo;
        showToast("Modelo Carregado", "Checklist da Etapa 2 inserido no comunicado!", "fa-solid fa-list-check text-success");
      }
    }

    function renderizarDemandas() {
      const container = document.getElementById('gridDemandas');
      if (!container) return;

      let lista = [...demandasApp];

      if (filtroAtualDemandas === 'ativas') {
        lista = lista.filter(d => !d.concluida);
      } else if (filtroAtualDemandas === 'concluidas') {
        lista = lista.filter(d => d.concluida);
      } else if (filtroAtualDemandas === 'A2') {
        lista = lista.filter(d => d.instrumento === 'A2');
      } else if (filtroAtualDemandas === 'A3') {
        lista = lista.filter(d => d.instrumento === 'A3');
      } else if (filtroAtualDemandas === 'equipes' || filtroAtualDemandas === 'individual') {
        lista = lista.filter(d => normalizarAtribuicaoDemanda(d).tipoAtribuicao === filtroAtualDemandas);
      } else if (filtroAtualDemandas === 'atrasadas') {
        lista = lista.filter(d => !d.concluida && prazoExpirado(d) &&
          obterAlvosDemanda(d).some(a => !obterEntregaAlvo(d, a.chave).entregue));
      } else if (filtroAtualDemandas === 'minhas') {
        const aluno = obterAlunoLogado();
        if (!aluno) {
          showToast('Identifique-se', 'Faça login com seu e-mail institucional para ver suas demandas.', 'fa-solid fa-user-lock text-warning');
          lista = [];
        } else {
          lista = lista.filter(d => demandaAtribuidaAoAluno(d, aluno));
        }
      }

      // Ordena pelo prazo mais próximo (concluídas por último)
      lista.sort((a, b) => (a.concluida - b.concluida) || (obterDataPrazo(a) - obterDataPrazo(b)));

      atualizarKPIs();
      renderizarMuralComunicadosDocente();

      if (lista.length === 0) {
        container.innerHTML = `
          <div class="p-5 text-center w-100" style="grid-column: 1 / -1; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
            <i class="fa-solid fa-filter-circle-xmark text-muted fs-1 mb-3"></i>
            <h4 class="font-outfit text-heading">Nenhuma demanda encontrada neste filtro</h4>
            <p class="text-muted small mb-3">Alterne para outro filtro acima ou crie uma nova demanda pelo botão do Modo Docente.</p>
            <button onclick="filtrarDemandas('todas', document.querySelector('#filterChipsContainer .filter-chip'))" class="btn-action btn-outline-action">
              Ver Todas as Demandas
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = lista.map(d => {
        const statusPrazo = calcularStatusPrazo(d.prazo, d.concluida, d.horaPrazo);
        const painelAtribuicao = renderizarPainelAtribuicao(d);
        const cardClass = d.concluida ? 'demanda-card concluida' : (statusPrazo.urgente ? 'demanda-card urgente' : 'demanda-card');
        const meta = obterMetadadosVisuaisDemanda(d);
        
        const avaliacoesDestaDemanda = avaliacoesApp.filter(a => a.demandaId === d.id);
        const totalAvaliadas = avaliacoesDestaDemanda.length;

        const criteriosHtml = (d.criterios && d.criterios.length > 0)
          ? d.criterios.map(c => `
              <div class="d-flex align-items-start gap-2 mb-1 fs-body-sm">
                <i class="fa-solid fa-circle-check text-success mt-1 fs-small"></i>
                <span>${escapeHtml(c)}</span>
              </div>
            `).join('')
          : '<div class="text-muted small">Nenhum critério detalhado.</div>';

        const linkApoioHtml = gerarBotaoRecursoDemanda(d);

        const tabelaFrentesHtml = (d.id === 'DEM-SNCT-C1' || d.id === 'DEM-SNCT-C2')
          ? renderizarTabelaChecklistFrentesDemanda(d.id, d.cursoSnctAlvo, demandasSnctApp)
          : '';

        return `
          <div class="${cardClass}" id="demanda-card-${d.id}" data-demanda-id="${d.id}">
            <div>
              <div class="demanda-card-header mb-2">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <span class="badge font-outfit fs-label fw-bold ${meta.badgeCor} px-2 py-1">${meta.etapaBadge}</span>
                  <span class="badge font-code" style="background: var(--bg-card-hover); color: var(--accent-blue); border: 1px solid var(--border-color);">${d.id}</span>
                </div>
                <span class="badge-pill ${statusPrazo.classe} small">
                  ${statusPrazo.texto}
                </span>
              </div>

              <div class="d-flex align-items-start gap-2 mb-2">
                <div class="demanda-card-icon-tag" style="background: ${meta.bgIcone}; color: ${meta.corIcone};" title="${meta.etapaBadge}">
                  <i class="bi ${meta.icone}"></i>
                </div>
                <div class="grow overflow-hidden">
                  <h3 class="demanda-card-title mb-1">${escapeHtml(d.titulo)}</h3>
                  <div class="fs-caption text-muted d-flex align-items-center gap-2 flex-wrap">
                    <span><i class="fa-solid ${iconeAtribuicao(d)} me-1"></i>${escapeHtml(rotuloAtribuicao(d))}</span>
                    ${linkApoioHtml}
                  </div>
                </div>
              </div>

              <p class="demanda-card-desc mb-2">${escapeHtml(d.descricao)}</p>

              ${tabelaFrentesHtml}

              <!-- CRITÉRIOS DE ACEITE COLAPSÁVEIS COM VISUAL SUAVE -->
              <details class="demanda-criterios-details mb-3 p-2 rounded" style="background: var(--bg-card-hover); border: 1px dashed var(--border-color);" ${d.id.includes('DEM-SNCT-C') ? '' : ''}>
                <summary class="small fw-bold text-heading d-flex align-items-center justify-content-between py-1">
                  <span class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-list-check text-primary"></i>
                    <span>${d.id.includes('DEM-SNCT-C') ? 'Critérios de Aceite Gerais em Texto' : 'Critérios de Aceite Obrigatórios'} (${(d.criterios || []).length})</span>
                  </span>
                  <span class="fs-caption text-muted"><i class="bi bi-chevron-expand"></i></span>
                </summary>
                <div class="pt-2 mt-1 border-top">
                  ${criteriosHtml}
                </div>
              </details>

              ${painelAtribuicao}
            </div>

            <div>
              <div class="demanda-meta-row">
                <div>
                  <span class="fw-bold text-heading font-outfit">Pontos:</span> ${(d.pontos || 10).toFixed(1)} pts
                </div>
                <div>
                  <span class="fw-bold text-heading font-outfit">Avaliadas:</span> ${totalAvaliadas} / ${obterAlvosDemanda(d).length}
                </div>
                <div>
                  <span class="fw-bold text-heading font-outfit">Deadline:</span> ${formatarData(d.prazo)} às ${d.horaPrazo || '23:59'}
                </div>
              </div>

              <div class="demanda-actions">
                <button onclick="abrirModalAvaliarRubrica('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label" style="border-color: var(--accent-amber); color: var(--accent-amber);">
                  <i class="fa-solid fa-award me-1"></i> Avaliar Rubrica
                </button>
                <button onclick="abrirModalAlterarPrazoDemanda('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label docente-only" style="color: var(--accent-blue); border-color: var(--accent-blue);" title="Alterar prazo / prorrogar meta e notificar por e-mail">
                  <i class="fa-solid fa-calendar-plus me-1"></i> Prazo
                </button>
                <button onclick="reenviarAlertaDemanda('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label docente-only" style="color: var(--accent-amber); border-color: var(--accent-amber);" title="Reenviar alerta / lembrete automático por e-mail">
                  <i class="fa-solid fa-bell me-1"></i> Alerta
                </button>
                <button onclick="abrirModalComunicadoDemanda('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label docente-only" title="Enviar comunicado / esclarecimento por e-mail">
                  <i class="fa-solid fa-bullhorn me-1"></i> Comunicado
                </button>
                <button onclick="alternarConclusaoDemanda('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label docente-only" title="Marcar como concluída ou reabrir">
                  <i class="fa-solid ${d.concluida ? 'fa-rotate-left text-primary' : 'fa-check text-success'}"></i> ${d.concluida ? 'Reabrir' : 'Concluir'}
                </button>
                <button onclick="abrirModalEditarDemanda('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label docente-only" title="Editar Demanda">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="excluirDemanda('${d.id}')" class="btn-action btn-outline-action py-1 px-2 fs-label docente-only" style="color: var(--accent-rose);" title="Excluir Demanda">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function atualizarKPIs() {
      const total = demandasApp.length;
      const ativas = demandasApp.filter(d => !d.concluida).length;
      const concluidas = demandasApp.filter(d => d.concluida).length;
      const avaliacoesTotal = avaliacoesApp.length;

      const elTotal = document.getElementById('statTotalDemandas');
      const elAtivas = document.getElementById('statDemandasAtivas');
      const elConcluidas = document.getElementById('statDemandasConcluidas');
      const elAvaliacoes = document.getElementById('statAvaliacoesRegistradas');
      const kpiDemandasHeader = document.getElementById('kpiDemandasCount');

      if (elTotal) elTotal.innerText = total;
      if (elAtivas) elAtivas.innerText = ativas;
      if (elConcluidas) elConcluidas.innerText = concluidas;
      if (elAvaliacoes) elAvaliacoes.innerText = avaliacoesTotal;
      if (kpiDemandasHeader) kpiDemandasHeader.innerText = `${ativas} Ativas`;
    }

    // =========================================================================
    // MODAL DE CRIAÇÃO / EDIÇÃO DE DEMANDA
    // =========================================================================
    function abrirModalNovaDemanda() {
      document.getElementById('formDemanda').reset();
      document.getElementById('inputDemandaIdOriginal').value = '';
      document.getElementById('modalDemandaTitulo').innerHTML = '<i class="fa-solid fa-bullhorn text-primary me-2"></i> Nova Demanda / Broadcast';
      
      const proximoNum = demandasApp.length + 1;
      document.getElementById('inputDemandaCodigo').value = `DEM-${proximoNum < 10 ? '0' + proximoNum : proximoNum}`;
      document.getElementById('inputDemandaPontos').value = "10.0";
      
      const d = new Date();
      d.setDate(d.getDate() + 7);
      document.getElementById('inputDemandaPrazo').value = d.toISOString().split('T')[0];
      document.getElementById('inputDemandaHora').value = '23:59';

      preencherAtribuicaoNoModal({ tipoAtribuicao: 'turma', equipesAlvo: [], alunosAlvo: [] });
      document.getElementById('modalDemandaOverlay').classList.add('active');
    }

    function abrirModalEditarDemanda(id) {
      const d = demandasApp.find(item => item.id === id);
      if (!d) return;

      document.getElementById('inputDemandaIdOriginal').value = d.id;
      document.getElementById('inputDemandaCodigo').value = d.id;
      document.getElementById('inputDemandaInstrumento').value = d.instrumento || 'A2';
      document.getElementById('inputDemandaPontos').value = d.pontos || 10.0;
      document.getElementById('inputDemandaTitulo').value = d.titulo;
      document.getElementById('inputDemandaPrazo').value = d.prazo;
      document.getElementById('inputDemandaHora').value = d.horaPrazo || '23:59';
      preencherAtribuicaoNoModal(normalizarAtribuicaoDemanda(d));
      document.getElementById('inputDemandaDescricao').value = d.descricao;
      document.getElementById('inputDemandaCriterios').value = (d.criterios || []).join('\n');

      document.getElementById('modalDemandaTitulo').innerHTML = `<i class="fa-solid fa-pen-to-square text-primary me-2"></i> Editar Demanda: ${d.id}`;
      document.getElementById('modalDemandaOverlay').classList.add('active');
    }

    function fecharModalDemanda() {
      document.getElementById('modalDemandaOverlay').classList.remove('active');
    }

    async function salvarDemanda(event, forcarNotificar = null) {
      if (event) event.preventDefault();
      const idOriginal = document.getElementById('inputDemandaIdOriginal').value;
      const codigo = document.getElementById('inputDemandaCodigo').value.trim();
      const instrumento = document.getElementById('inputDemandaInstrumento').value;
      const pontos = parseFloat(document.getElementById('inputDemandaPontos').value) || 10.0;
      const titulo = document.getElementById('inputDemandaTitulo').value.trim();
      const prazo = document.getElementById('inputDemandaPrazo').value;
      const horaPrazo = document.getElementById('inputDemandaHora').value || '23:59';
      const atribuicao = lerAtribuicaoDoModal();
      if (!atribuicao) return;
      const { tipoAtribuicao, equipesAlvo, alunosAlvo } = atribuicao;
      const destinatario = rotuloAtribuicao(atribuicao);
      const descricao = document.getElementById('inputDemandaDescricao').value.trim();
      const criteriosTexto = document.getElementById('inputDemandaCriterios').value.trim();
      const criterios = criteriosTexto.split('\n').map(c => c.trim()).filter(c => c.length > 0);
      const checkEl = document.getElementById('checkDemandaNotificarEmail');
      const deveNotificar = forcarNotificar !== null ? Boolean(forcarNotificar) : (checkEl ? checkEl.checked : true);

      const instrumentoNome = instrumento === 'A1' ? 'A1 (Avaliação Teórica • 20%)' :
        (instrumento === 'A2' ? 'A2 (Curso SNCT • 20%)' :
        (instrumento === 'A3' ? 'A3 (Vitrine Flask • 35%)' :
        'A4 (Demais Entregas • 25%)'));

      if (idOriginal) {
        const idx = demandasApp.findIndex(d => d.id === idOriginal);
        if (idx !== -1) {
          demandasApp[idx] = {
            ...demandasApp[idx],
            id: codigo,
            instrumento,
            instrumentoNome,
            pontos,
            titulo,
            destinatario,
            tipoAtribuicao,
            equipesAlvo,
            alunosAlvo,
            prazo,
            horaPrazo,
            descricao,
            criterios
          };
        }
      } else {
        const nova = {
          id: codigo,
          titulo,
          instrumento,
          instrumentoNome,
          destinatario,
          tipoAtribuicao,
          equipesAlvo,
          alunosAlvo,
          prazo,
          horaPrazo,
          entregas: {},
          pontos,
          concluida: false,
          descricao,
          criterios
        };
        demandasApp.unshift(nova);
      }

      salvarDadosDemandas();
      renderizarDemandas();
      popularSelectsDeDemanda();
      fecharModalDemanda();

      const demandaSalva = demandasApp.find(dm => dm.id === codigo);
      const emailsAlvo = demandaSalva ? [...new Set(obterAlvosDemanda(demandaSalva).flatMap(a => a.emails))] : [];

      showToast(
        deveNotificar ? "Salvando & Disparando E-mail..." : "Gravando na Planilha...",
        `Sincronizando demanda ${codigo} com a planilha do Google Sheets...`,
        "fa-solid fa-cloud-arrow-up text-primary"
      );

      try {
        const res = await chamarApiAppsScript('criarDemanda', {
          id: codigo,
          projeto: tipoAtribuicao === 'turma' ? '*' : destinatario,
          titulo,
          descricao,
          prazo,
          horaPrazo,
          pontos: pontos.toFixed(1).replace('.', ','),
          criterios,
          instrumento,
          tipoAtribuicao,
          equipesAlvo,
          alunosAlvo,
          entregas: demandaSalva ? demandaSalva.entregas : {},
          notificarEmail: deveNotificar,
          destinatariosEmails: emailsAlvo
        });

        if (deveNotificar) {
          showToast(
            "Demanda Publicada & Notificada!",
            `Demanda ${codigo} gravada na planilha e e-mail HTML enviado para ${res.totalEnviados || emailsAlvo.length} estudante(s)!`,
            "fa-solid fa-paper-plane text-success"
          );
        } else {
          showToast("Demanda Salva na Planilha!", `Demanda ${codigo} sincronizada com sucesso (sem disparo de e-mail).`);
        }
      } catch (err) {
        console.warn("Aviso ao sincronizar demanda com Apps Script:", err);
        showToast("Salva Localmente", `Demanda ${codigo} registrada no painel (Aviso planilha: ${err.message || err}).`, "fa-solid fa-triangle-exclamation text-warning");
      }
    }

    // =========================================================================
    // AÇÕES DE DEMANDA NO PADRÃO PI-2: ALTERAR PRAZO, ALERTA E COMUNICADO
    // =========================================================================
    function abrirModalAlterarPrazoDemanda(demandaId) {
      const d = demandasApp.find(item => item.id === demandaId);
      if (!d) return;

      document.getElementById('inputAltPrazoDemandaId').value = d.id;
      document.getElementById('labelAltPrazoTituloDemanda').textContent = `${d.id} — ${d.titulo}`;
      document.getElementById('labelAltPrazoEscopoDemanda').textContent = `Escopo: ${rotuloAtribuicao(d)} • Prazo atual: ${formatarData(d.prazo)} às ${d.horaPrazo || '23:59'}`;
      document.getElementById('inputAltNovoPrazo').value = d.prazo || '';
      document.getElementById('inputAltNovaHora').value = d.horaPrazo || '23:59';
      document.getElementById('checkAltNotificar').checked = true;
      document.getElementById('inputAltMensagem').value = '';

      document.getElementById('modalAlterarPrazoOverlay').classList.add('active');
    }

    function fecharModalAlterarPrazo() {
      const el = document.getElementById('modalAlterarPrazoOverlay');
      if (el) el.classList.remove('active');
    }

    async function confirmarAlteracaoPrazoDemanda(event) {
      if (event) event.preventDefault();
      const demandaId = document.getElementById('inputAltPrazoDemandaId').value;
      const novoPrazo = document.getElementById('inputAltNovoPrazo').value;
      const novaHora = document.getElementById('inputAltNovaHora').value || '23:59';
      const notificar = document.getElementById('checkAltNotificar').checked;
      const mensagem = document.getElementById('inputAltMensagem').value.trim();

      const d = demandasApp.find(item => item.id === demandaId);
      if (!d || !novoPrazo) return;

      const prazoAnterior = d.prazo;
      d.prazo = novoPrazo;
      d.horaPrazo = novaHora;
      salvarDadosDemandas();
      renderizarDemandas();
      renderizarAreaDocente();

      const btn = document.getElementById('btnSalvarNovoPrazo');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Atualizando...';
      }

      const emailsAlvo = [...new Set(obterAlvosDemanda(d).flatMap(a => a.emails))];
      try {
        const res = await chamarApiAppsScript('alterarPrazoDemanda', {
          demandaId: d.id,
          projeto: normalizarAtribuicaoDemanda(d).tipoAtribuicao === 'turma' ? '*' : rotuloAtribuicao(d),
          titulo: d.titulo,
          descricao: d.descricao,
          prazoAnterior,
          novoPrazo,
          horaPrazo: novaHora,
          pontos: (d.pontos || 10).toFixed(1).replace('.', ','),
          criterios: d.criterios || [],
          notificar,
          mensagem,
          destinatariosEmails: emailsAlvo
        });
        fecharModalAlterarPrazo();
        showToast(
          "Prazo Atualizado!",
          notificar
            ? `Novo prazo (${formatarData(novoPrazo)}) salvo e notificação HTML enviada para ${res.totalEnviados || emailsAlvo.length} estudante(s)!`
            : `Novo prazo (${formatarData(novoPrazo)}) atualizado na planilha!`,
          "fa-solid fa-calendar-check text-success"
        );
      } catch (err) {
        fecharModalAlterarPrazo();
        showToast("Prazo Atualizado no Painel", `Prazo alterado localmente (Aviso Apps Script: ${err.message || err}).`, "fa-solid fa-triangle-exclamation text-warning");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i> Atualizar Prazo';
        }
      }
    }

    async function reenviarAlertaDemanda(demandaId) {
      const d = demandasApp.find(item => item.id === demandaId);
      if (!d) return;

      const escopoTxt = rotuloAtribuicao(d);
      const emailsAlvo = [...new Set(obterAlvosDemanda(d).flatMap(a => a.emails))];
      if (!confirm(`Deseja disparar automaticamente por e-mail (via Planilha / GmailApp) o alerta de lembrete de prazo da demanda "${d.id} — ${d.titulo}" para ${escopoTxt} (${emailsAlvo.length} e-mails)?`)) {
        return;
      }

      showToast("Disparando Lembrete...", `Enviando alerta de prazo em HTML via Planilha...`, "fa-solid fa-bell text-warning");
      try {
        const res = await chamarApiAppsScript('notificarDemanda', {
          demandaId: d.id,
          tipo: 'lembrete',
          projeto: normalizarAtribuicaoDemanda(d).tipoAtribuicao === 'turma' ? '*' : escopoTxt,
          titulo: d.titulo,
          descricao: d.descricao,
          prazo: d.prazo,
          horaPrazo: d.horaPrazo || '23:59',
          pontos: (d.pontos || 10).toFixed(1).replace('.', ','),
          criterios: d.criterios || [],
          destinatariosEmails: emailsAlvo
        });
        showToast(
          "Lembrete Enviado com Sucesso!",
          `Alerta de prazo disparado automaticamente por e-mail para ${res.totalEnviados || emailsAlvo.length} estudante(s)!`,
          "fa-solid fa-paper-plane text-success"
        );
      } catch (err) {
        showToast("Erro ao Enviar Lembrete", err.message || String(err), "fa-solid fa-triangle-exclamation text-danger");
      }
    }

    function abrirModalComunicadoDemanda(demandaId) {
      const d = demandasApp.find(item => item.id === demandaId);
      if (!d) return;

      document.getElementById('inputComunicadoDemandaId').value = d.id;
      document.getElementById('labelComunicadoTituloDemanda').textContent = `${d.id} — ${d.titulo}`;
      document.getElementById('labelComunicadoEscopoDemanda').textContent = `Escopo: ${rotuloAtribuicao(d)} • Prazo: ${formatarData(d.prazo)} às ${d.horaPrazo || '23:59'}`;
      document.getElementById('inputComunicadoMensagem').value = '';

      document.getElementById('modalComunicadoDemandaOverlay').classList.add('active');
    }

    function fecharModalComunicadoDemanda() {
      const el = document.getElementById('modalComunicadoDemandaOverlay');
      if (el) el.classList.remove('active');
    }

    async function confirmarEnvioComunicadoDemanda(event) {
      if (event) event.preventDefault();
      const demandaId = document.getElementById('inputComunicadoDemandaId').value;
      const mensagem = document.getElementById('inputComunicadoMensagem').value.trim();
      const d = demandasApp.find(item => item.id === demandaId);
      if (!d || !mensagem) return;

      const btn = document.getElementById('btnEnviarComunicadoModal');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Disparando...';
      }

      const escopoTxt = rotuloAtribuicao(d);
      const emailsAlvo = [...new Set(obterAlvosDemanda(d).flatMap(a => a.emails))];
      try {
        const res = await chamarApiAppsScript('notificarDemanda', {
          demandaId: d.id,
          tipo: 'comunicado',
          mensagem,
          projeto: normalizarAtribuicaoDemanda(d).tipoAtribuicao === 'turma' ? '*' : escopoTxt,
          titulo: d.titulo,
          descricao: d.descricao,
          prazo: d.prazo,
          horaPrazo: d.horaPrazo || '23:59',
          pontos: (d.pontos || 10).toFixed(1).replace('.', ','),
          criterios: d.criterios || [],
          destinatariosEmails: emailsAlvo
        });
        fecharModalComunicadoDemanda();
        showToast(
          "Comunicado Enviado!",
          `Comunicado HTML disparado automaticamente para ${res.totalEnviados || emailsAlvo.length} estudante(s)!`,
          "fa-solid fa-bullhorn text-success"
        );
      } catch (err) {
        showToast("Erro ao Disparar Comunicado", err.message || String(err), "fa-solid fa-triangle-exclamation text-danger");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane me-1"></i> Disparar Comunicado';
        }
      }
    }

    function alternarConclusaoDemanda(id) {
      const d = demandasApp.find(item => item.id === id);
      if (!d) return;
      d.concluida = !d.concluida;
      salvarDadosDemandas();
      renderizarDemandas();
      showToast(
        d.concluida ? "Demanda Concluída" : "Demanda Reaberta",
        `A demanda ${d.id} agora está marcada como ${d.concluida ? 'concluída' : 'ativa'}.`
      );
    }

    // =========================================================================
    // ATRIBUIÇÃO (TURMA / GRUPOS / INDIVIDUAL), PRAZOS E ENTREGAS POR ALVO
    // =========================================================================
    // Converte demandas antigas (campo "destinatario") para o novo modelo.
    function normalizarAtribuicaoDemanda(d) {
      if (!d) return { tipoAtribuicao: 'turma', equipesAlvo: [], alunosAlvo: [] };
      if (!d.tipoAtribuicao) {
        if (!d.destinatario || d.destinatario === 'Todos') {
          d.tipoAtribuicao = 'turma';
          d.equipesAlvo = [];
        } else {
          d.tipoAtribuicao = 'equipes';
          d.equipesAlvo = [d.destinatario];
        }
        d.alunosAlvo = [];
      }
      d.equipesAlvo = d.equipesAlvo || [];
      d.alunosAlvo = d.alunosAlvo || [];
      d.entregas = d.entregas || {};
      return d;
    }

    function rotuloAtribuicao(d) {
      const at = normalizarAtribuicaoDemanda(d);
      if (at.tipoAtribuicao === 'equipes') {
        return at.equipesAlvo.length === 1 ? at.equipesAlvo[0] : `${at.equipesAlvo.length} grupos`;
      }
      if (at.tipoAtribuicao === 'individual') {
        if (at.alunosAlvo.length === 1) {
          const al = alunosApp.find(a => a.id === at.alunosAlvo[0]);
          return al ? al.nome : '1 estudante';
        }
        return `${at.alunosAlvo.length} estudantes (individual)`;
      }
      return 'Todos';
    }

    function iconeAtribuicao(d) {
      const tipo = normalizarAtribuicaoDemanda(d).tipoAtribuicao;
      return tipo === 'equipes' ? 'fa-people-group' : (tipo === 'individual' ? 'fa-user' : 'fa-users');
    }

    // Lista os "alvos" que devem entregar: um por grupo ou um por estudante.
    function obterAlvosDemanda(d) {
      const at = normalizarAtribuicaoDemanda(d);
      if (at.tipoAtribuicao === 'equipes') {
        return at.equipesAlvo.map(eq => ({
          chave: 'equipe:' + eq,
          rotulo: eq,
          tipo: 'equipe',
          emails: obterEmailsEquipe(eq)
        }));
      }
      let alunos;
      if (d && (d.cursoSnctAlvo === 1 || d.cursoSnctAlvo === 2)) {
        const idsCurso = new Set();
        demandasSnctApp.filter(f => f.cursoId === d.cursoSnctAlvo).forEach(f => {
          (f.membros || []).forEach(m => { if (m.alunoId) idsCurso.add(String(m.alunoId)); });
        });
        alunos = idsCurso.size > 0
          ? alunosApp.filter(a => idsCurso.has(String(a.id)))
          : alunosApp.filter(a => a.ativo);
      } else {
        alunos = at.tipoAtribuicao === 'individual'
          ? alunosApp.filter(a => at.alunosAlvo.includes(a.id))
          : alunosApp.filter(a => a.ativo);
      }
      return alunos.map(a => ({
        chave: 'aluno:' + a.id,
        rotulo: a.nome,
        tipo: 'aluno',
        emails: a.email ? [a.email.trim()] : []
      }));
    }

    function obterEntregaAlvo(d, chave) {
      normalizarAtribuicaoDemanda(d);
      return d.entregas[chave] || { entregue: false, link: '', dataEntrega: '' };
    }

    function obterDataPrazo(d) {
      const norm = normalizarPrazo(d.prazo);
      if (!norm) return new Date(8640000000000000);
      const dt = new Date(`${norm}T${d.horaPrazo || '23:59'}:59`);
      return isNaN(dt.getTime()) ? new Date(8640000000000000) : dt;
    }

    function prazoExpirado(d) {
      return d.prazo ? obterDataPrazo(d) < new Date() : false;
    }

    function obterAlunoLogado() {
      const id = (usuarioLogadoGoogle && usuarioLogadoGoogle.alunoId) || alunoVotanteAtualId;
      return id ? alunosApp.find(a => String(a.id) === String(id)) || null : null;
    }

    // Chave de entrega que corresponde ao estudante nesta demanda (ou null).
    function chaveDoAlunoNaDemanda(d, aluno) {
      if (!aluno) return null;
      const at = normalizarAtribuicaoDemanda(d);
      if (at.tipoAtribuicao === 'turma') return aluno.ativo ? 'aluno:' + aluno.id : null;
      if (at.tipoAtribuicao === 'individual') return at.alunosAlvo.map(String).includes(String(aluno.id)) ? 'aluno:' + aluno.id : null;
      return at.equipesAlvo.includes(aluno.equipe) ? 'equipe:' + aluno.equipe : null;
    }

    function demandaAtribuidaAoAluno(d, aluno) {
      return chaveDoAlunoNaDemanda(d, aluno) !== null;
    }

    function renderizarPainelAtribuicao(d) {
      const alvos = obterAlvosDemanda(d);
      const entregues = alvos.filter(a => obterEntregaAlvo(d, a.chave).entregue).length;
      const pct = alvos.length ? Math.round((entregues / alvos.length) * 100) : 0;
      const expirado = prazoExpirado(d);
      const aluno = obterAlunoLogado();
      const minhaChave = chaveDoAlunoNaDemanda(d, aluno);
      const minhaEntrega = minhaChave ? obterEntregaAlvo(d, minhaChave) : null;

      const chips = alvos.map(a => {
        const e = obterEntregaAlvo(d, a.chave);
        const atrasada = e.entregue && e.dataEntrega && d.prazo && new Date(e.dataEntrega) > obterDataPrazo(d);
        const estado = e.entregue ? (atrasada ? 'atrasada' : 'entregue') : (expirado ? 'pendente-vencida' : 'pendente');
        const icone = e.entregue ? (atrasada ? 'bi-clock-history' : 'bi-check-circle-fill') : (expirado ? 'bi-x-circle-fill' : 'bi-circle');
        const dataFmt = e.dataEntrega && !isNaN(new Date(e.dataEntrega).getTime())
          ? new Date(e.dataEntrega).toLocaleString('pt-BR')
          : (e.data || 'Confirmada');
        const titulo = e.entregue
          ? `Entregue (${dataFmt})${atrasada ? ' — com atraso' : ''}`
          : (expirado ? 'Não entregue — prazo encerrado' : 'Pendente');
        const ehMeu = a.chave === minhaChave ? ' meu-alvo' : '';
        const link = e.link ? `<a href="${escapeHtml(e.link)}" target="_blank" rel="noopener" class="ms-1" title="Abrir entrega" onclick="event.stopPropagation()"><i class="bi bi-box-arrow-up-right"></i></a>` : '';
        return `<button type="button" class="alvo-chip ${estado}${ehMeu}" title="${escapeHtml(titulo)}"
                  onclick="alternarEntregaAlvoDocente('${d.id}', '${escapeHtml(a.chave)}')">
                  <i class="bi ${icone}"></i> ${escapeHtml(a.rotulo)}${link}
                </button>`;
      }).join('');

      const acaoAluno = minhaChave ? `
        <div class="minha-entrega-box">
          <span><i class="bi bi-person-check-fill me-1"></i>
            ${minhaEntrega.entregue ? 'Sua entrega foi registrada.' : (expirado ? 'Prazo encerrado — fale com o professor.' : 'Esta demanda está atribuída a você.')}
          </span>
          ${(!d.concluida && (!expirado || minhaEntrega.entregue)) ? `
          <button type="button" class="btn btn-sm btn-primary" onclick="registrarMinhaEntrega('${d.id}')">
            <i class="bi bi-upload me-1"></i>${minhaEntrega.entregue ? 'Atualizar link' : 'Registrar entrega'}
          </button>` : ''}
        </div>` : (!d.concluida ? `
        <div class="minha-entrega-box">
          <span><i class="bi bi-person-lock me-1 text-warning"></i>
            Identifique-se com seu login de estudante para registrar sua entrega nesta demanda.
          </span>
          <button type="button" class="btn btn-sm btn-outline-primary" onclick="iniciarLoginGoogle()">
            <i class="bi bi-google me-1"></i>Identificar para Entregar
          </button>
        </div>` : '');

      return `
        <div class="demanda-atribuicao-painel">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small fw-bold text-heading"><i class="fa-solid fa-inbox text-primary me-1"></i> Entregas: ${entregues} / ${alvos.length}</span>
            <span class="small text-muted">${pct}%</span>
          </div>
          <div class="progress mb-2" style="height: 6px;" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar bg-success" style="width: ${pct}%"></div>
          </div>
          ${acaoAluno}
          <details class="alvos-details">
            <summary class="small">Ver ${alvos.length} ${normalizarAtribuicaoDemanda(d).tipoAtribuicao === 'equipes' ? 'grupo(s)' : 'estudante(s)'} atribuído(s)</summary>
            <div class="alvos-chips">${chips || '<span class="small text-muted">Nenhum destinatário selecionado.</span>'}</div>
            <div class="small text-muted mt-1 docente-only">Clique num nome para marcar/desmarcar a entrega.</div>
          </details>
        </div>`;
    }

    function alternarEntregaAlvoDocente(demandaId, chave) {
      const d = demandasApp.find(item => item.id === demandaId);
      if (!d) return;
      if (!document.body.classList.contains('modo-docente-ativo')) {
        const alunoLogado = obterAlunoLogado();
        if (!alunoLogado) {
          showToast('Identifique-se para Entregar', 'Conecte sua conta Google ou informe sua matrícula para registrar sua entrega.', 'bi bi-person-check text-primary');
          iniciarLoginGoogle();
          return;
        }
        const minhaChave = chaveDoAlunoNaDemanda(d, alunoLogado);
        if (minhaChave && minhaChave === chave) {
          registrarMinhaEntrega(demandaId);
          return;
        }
        showToast('Somente o professor', 'Você pode registrar apenas a sua própria entrega. Para outros estudantes, ative o Modo Docente.', 'fa-solid fa-lock text-warning');
        return;
      }
      const atual = obterEntregaAlvo(d, chave);
      const novoEstado = !atual.entregue;
      d.entregas[chave] = novoEstado
        ? { entregue: true, link: atual.link || '', dataEntrega: new Date().toISOString(), registradoPor: 'Prof. André Moraes' }
        : { entregue: false, link: '', dataEntrega: '' };
      salvarDadosDemandas();
      renderizarDemandas();
      renderizarAreaDocente();

      chamarApiAppsScript('criarDemanda', {
        id: d.id,
        projeto: normalizarAtribuicaoDemanda(d).tipoAtribuicao === 'turma' ? '*' : rotuloAtribuicao(d),
        titulo: d.titulo,
        descricao: d.descricao || '',
        prazo: d.prazo || '',
        horaPrazo: d.horaPrazo || '23:59',
        pontos: (d.pontos || 10).toFixed(1).replace('.', ','),
        criterios: d.criterios || [],
        instrumento: d.instrumento || 'A2',
        tipoAtribuicao: d.tipoAtribuicao || 'turma',
        equipesAlvo: d.equipesAlvo || [],
        alunosAlvo: d.alunosAlvo || [],
        cursoSnctAlvo: d.cursoSnctAlvo || null,
        fixadaMural: Boolean(d.fixadaMural),
        linkApoio: d.linkApoio || '',
        entregas: d.entregas || {},
        notificarEmail: false
      }).then(() => {
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(err => console.warn('Aviso ao salvar entrega docente na planilha:', err));
    }

    function registrarMinhaEntrega(demandaId) {
      const d = demandasApp.find(item => item.id === demandaId);
      const aluno = obterAlunoLogado();
      const chave = chaveDoAlunoNaDemanda(d, aluno);
      if (!d || !chave) {
        showToast('Demanda não atribuída', 'Esta demanda não está atribuída a você.', 'fa-solid fa-circle-exclamation text-warning');
        return;
      }
      const atual = obterEntregaAlvo(d, chave);
      if (!atual.entregue && prazoExpirado(d)) {
        showToast('Prazo encerrado', 'O prazo desta demanda já terminou.', 'fa-solid fa-lock text-danger');
        return;
      }
      const link = prompt('Cole o link da entrega (GitHub, GitHub Pages, Drive, Moodle...):', atual.link || 'https://');
      if (link === null) return;
      const limpo = link.trim();
      if (!/^https?:\/\/\S+\.\S+/.test(limpo)) {
        showToast('Link inválido', 'Informe um endereço começando com http:// ou https://', 'fa-solid fa-link-slash text-danger');
        return;
      }
      d.entregas[chave] = {
        entregue: true,
        link: limpo,
        dataEntrega: atual.entregue ? atual.dataEntrega : new Date().toISOString(),
        registradoPor: aluno.nome
      };

      // Se for entrega de DEM-SNCT-C1, DEM-SNCT-C2 ou DEM-SNCT-01, espelha automaticamente na Frente SNCT do estudante
      const frenteDoAluno = demandasSnctApp.find(f =>
        Array.isArray(f.membros) && f.membros.some(m =>
          String(m.alunoId) === String(aluno.id) ||
          (m.matricula && aluno.matricula && String(m.matricula) === String(aluno.matricula)) ||
          (m.email && aluno.email && m.email.toLowerCase() === aluno.email.toLowerCase())
        )
      );
      if (frenteDoAluno) {
        const membroFrente = frenteDoAluno.membros.find(m =>
          String(m.alunoId) === String(aluno.id) ||
          (m.matricula && aluno.matricula && String(m.matricula) === String(aluno.matricula)) ||
          (m.email && aluno.email && m.email.toLowerCase() === aluno.email.toLowerCase())
        );
        if (membroFrente) {
          membroFrente.linkEntrega = limpo;
          salvarDemandasSNCT();
          renderizarQuadroDemandasSNCT();
          chamarApiAppsScript('salvar_link_entrega_snct', {
            frenteId: frenteDoAluno.id,
            alunoId: String(aluno.id),
            alunoNome: aluno.nome,
            matricula: aluno.matricula || '',
            email: aluno.email || '',
            linkEntrega: limpo
          }).catch(() => {});
        }
      }

      salvarDadosDemandas();
      renderizarDemandas();
      renderizarAreaDocente();
      showToast('Entrega registrada', `Entrega de ${d.id} salva e enviada para a planilha!`);

      // Envia tanto via criarDemanda (para garantir que a linha exista na aba Demandas com entregas_json) quanto concluirDemanda (para notificar o docente)
      chamarApiAppsScript('criarDemanda', {
        id: d.id,
        projeto: normalizarAtribuicaoDemanda(d).tipoAtribuicao === 'turma' ? '*' : rotuloAtribuicao(d),
        titulo: d.titulo,
        descricao: d.descricao || '',
        prazo: d.prazo || '',
        horaPrazo: d.horaPrazo || '23:59',
        pontos: (d.pontos || 10).toFixed(1).replace('.', ','),
        criterios: d.criterios || [],
        instrumento: d.instrumento || 'A2',
        tipoAtribuicao: d.tipoAtribuicao || 'turma',
        equipesAlvo: d.equipesAlvo || [],
        alunosAlvo: d.alunosAlvo || [],
        cursoSnctAlvo: d.cursoSnctAlvo || null,
        fixadaMural: Boolean(d.fixadaMural),
        linkApoio: d.linkApoio || '',
        entregas: d.entregas || {},
        notificarEmail: false
      }).then(() => {
        return chamarApiAppsScript('concluirDemanda', {
          demandaId: d.id,
          chaveAlvo: chave,
          evidencia: limpo,
          autor: aluno.nome,
          email: aluno.email || '',
          titulo: d.titulo,
          descricao: d.descricao || '',
          prazo: d.prazo || '',
          horaPrazo: d.horaPrazo || '23:59'
        });
      }).then(() => {
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(err => console.warn('Aviso ao sincronizar entrega na planilha:', err));
    }

    // ---- Modal: seleção de grupos / estudantes ----
    function preencherAtribuicaoNoModal(at) {
      const listaEq = document.getElementById('listaAlvosEquipes');
      listaEq.innerHTML = EQUIPES_PROGWEB2.map((eq, i) => {
        const qtd = alunosApp.filter(a => a.ativo && a.equipe === eq).length;
        return `<label class="alvo-opcao">
            <input type="checkbox" class="form-check-input" value="${escapeHtml(eq)}" ${at.equipesAlvo.includes(eq) ? 'checked' : ''}>
            <span>${escapeHtml(eq)}</span><span class="text-muted ms-auto">${qtd} membro(s)</span>
          </label>`;
      }).join('');

      const listaAl = document.getElementById('listaAlvosAlunos');
      listaAl.innerHTML = alunosApp
        .filter(a => a.ativo || at.alunosAlvo.includes(a.id))
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        .map(a => `<label class="alvo-opcao" data-busca="${escapeHtml((a.nome + ' ' + (a.matricula || '')).toLowerCase())}">
            <input type="checkbox" class="form-check-input" value="${escapeHtml(a.id)}" ${at.alunosAlvo.includes(a.id) ? 'checked' : ''} onchange="atualizarContadorAlvosAlunos()">
            <span>${escapeHtml(a.nome)}</span><span class="text-muted ms-auto font-code">${escapeHtml(a.equipe || '')}</span>
          </label>`).join('');

      document.getElementById('buscaAlvosAlunos').value = '';
      const radio = document.querySelector(`input[name="tipoAtribuicaoDemanda"][value="${at.tipoAtribuicao}"]`);
      if (radio) radio.checked = true;
      aoMudarTipoAtribuicao();
      atualizarContadorAlvosAlunos();
    }

    function aoMudarTipoAtribuicao() {
      const tipo = document.querySelector('input[name="tipoAtribuicaoDemanda"]:checked').value;
      document.getElementById('painelAtribTurma').classList.toggle('d-none', tipo !== 'turma');
      document.getElementById('painelAtribEquipes').classList.toggle('d-none', tipo !== 'equipes');
      document.getElementById('painelAtribIndividual').classList.toggle('d-none', tipo !== 'individual');
    }

    function filtrarListaAlvosAlunos(termo) {
      const t = termo.toLowerCase().trim();
      document.querySelectorAll('#listaAlvosAlunos .alvo-opcao').forEach(el => {
        el.classList.toggle('d-none', t !== '' && !el.dataset.busca.includes(t));
      });
    }

    function marcarTodosAlvos(listaId, marcar) {
      document.querySelectorAll(`#${listaId} input[type="checkbox"]`).forEach(cb => { cb.checked = marcar; });
      atualizarContadorAlvosAlunos();
    }

    function atualizarContadorAlvosAlunos() {
      const el = document.getElementById('contadorAlvosAlunos');
      if (el) el.innerText = document.querySelectorAll('#listaAlvosAlunos input:checked').length;
    }

    function lerAtribuicaoDoModal() {
      const tipoAtribuicao = document.querySelector('input[name="tipoAtribuicaoDemanda"]:checked').value;
      const marcados = id => [...document.querySelectorAll(`#${id} input:checked`)].map(cb => cb.value);
      const equipesAlvo = tipoAtribuicao === 'equipes' ? marcados('listaAlvosEquipes') : [];
      const alunosAlvo = tipoAtribuicao === 'individual' ? marcados('listaAlvosAlunos') : [];
      if (tipoAtribuicao === 'equipes' && equipesAlvo.length === 0) {
        showToast('Selecione um grupo', 'Marque pelo menos um grupo para esta demanda.', 'fa-solid fa-circle-exclamation text-warning');
        return null;
      }
      if (tipoAtribuicao === 'individual' && alunosAlvo.length === 0) {
        showToast('Selecione estudantes', 'Marque pelo menos um estudante para esta demanda.', 'fa-solid fa-circle-exclamation text-warning');
        return null;
      }
      return { tipoAtribuicao, equipesAlvo, alunosAlvo };
    }

    function excluirDemanda(id) {
      if (!confirm(`Deseja realmente excluir permanentemente a demanda ${id}? As avaliações registradas permanecerão arquivadas.`)) {
        return;
      }
      demandasApp = demandasApp.filter(d => d.id !== id);
      salvarDadosDemandas();
      renderizarDemandas();
      popularSelectsDeDemanda();
      showToast("Demanda Excluída", `Demanda ${id} removida com sucesso.`, "fa-solid fa-trash text-danger");
      chamarApiAppsScript('removerDemanda', { demandaId: id }).catch(() => {});
    }

    // =========================================================================
    // MODAL E MATRIZ DE AVALIAÇÃO POR RUBRICAS
    // =========================================================================
    function popularSelectsDeDemanda() {
      const selectModal = document.getElementById('selectRubricaDemanda');
      if (selectModal) {
        selectModal.innerHTML = demandasApp.map(d => `
          <option value="${d.id}">${d.id} — ${escapeHtml(d.titulo)} (${d.instrumento})</option>
        `).join('');
      }

      const selectFiltro = document.getElementById('selectFiltroDemandaRubrica');
      if (selectFiltro) {
        selectFiltro.innerHTML = `
          <option value="todas">Todas as Demandas &amp; Checkpoints</option>
          ${demandasApp.map(d => `<option value="${d.id}">${d.id} — ${escapeHtml(d.titulo)}</option>`).join('')}
        `;
      }
    }

    function renderizarDimensoesNoModalRubrica() {
      const container = document.getElementById('containerDimensoesRubrica');
      if (!container) return;

      const selDemanda = document.getElementById('selectRubricaDemanda');
      const demandaId = selDemanda ? selDemanda.value : 'DEM-01';
      const modelo = obterModeloRubricaParaDemanda(demandaId);

      const badgeModelo = document.getElementById('modalRubricaBadgeModelo');
      if (badgeModelo) {
        badgeModelo.className = `badge ${modelo.badgeClasse} fs-label`;
        badgeModelo.innerHTML = `<i class="bi ${modelo.icone} me-1"></i> ${escapeHtml(modelo.rotulo)}`;
      }

      container.innerHTML = modelo.dimensoes.map((dim, dimIdx) => {
        const valAtual = estadoRubricaAtual[`dim${dimIdx}`] !== undefined ? estadoRubricaAtual[`dim${dimIdx}`] : 2.5;

        const niveisHtml = dim.niveis.map(niv => {
          const isSelected = Math.abs(niv.valor - valAtual) < 0.05;
          const selectedClass = isSelected ? `selected ${niv.classe}` : '';
          return `
            <div class="rubrica-level-btn ${selectedClass}" onclick="selecionarNivelRubrica(${dimIdx}, ${niv.valor}, this)">
              <div class="fw-bold" style="font-size: 0.85rem;">${niv.rotulo}</div>
              <div class="level-desc text-muted" style="font-size: 0.8125rem; line-height: 1.25;">${niv.desc}</div>
            </div>
          `;
        }).join('');

        return `
          <div class="rubrica-dim-card">
            <div class="rubrica-dim-header">
              <h4 class="rubrica-dim-title">${dim.titulo}</h4>
              <span class="badge font-code" id="badgeDim${dimIdx}" style="background: var(--bg-card); color: var(--accent-blue); border: 1px solid var(--border-color);">
                ${valAtual.toFixed(1)} / 2.5 pts
              </span>
            </div>
            <p class="text-muted small mb-2" style="font-size: 0.78rem;">${dim.descricao}</p>
            <div class="rubrica-levels-grid">
              ${niveisHtml}
            </div>
          </div>
        `;
      }).join('');

      recalcularRubrica();
    }

    function selecionarNivelRubrica(dimIdx, valor, btn) {
      estadoRubricaAtual[`dim${dimIdx}`] = valor;
      
      const parentCard = btn.closest('.rubrica-dim-card');
      if (parentCard) {
        parentCard.querySelectorAll('.rubrica-level-btn').forEach(b => {
          b.className = 'rubrica-level-btn';
        });
        const selDemanda = document.getElementById('selectRubricaDemanda');
        const demandaId = selDemanda ? selDemanda.value : 'DEM-01';
        const dimensoes = obterDimensoesRubricaParaDemanda(demandaId);
        const nivObj = dimensoes[dimIdx] && dimensoes[dimIdx].niveis ? dimensoes[dimIdx].niveis.find(n => Math.abs(n.valor - valor) < 0.05) : null;
        const classeExtra = nivObj ? nivObj.classe : 'excelente';
        btn.className = `rubrica-level-btn selected ${classeExtra}`;

        const badge = parentCard.querySelector(`#badgeDim${dimIdx}`);
        if (badge) badge.innerText = `${valor.toFixed(1)} / 2.5 pts`;
      }

      recalcularRubrica();
    }

    function recalcularRubrica() {
      const soma = Object.values(estadoRubricaAtual).reduce((acc, curr) => acc + curr, 0);
      const totalEl = document.getElementById('rubricaNotaTotal');
      const badgeEl = document.getElementById('rubricaConceitoBadge');

      if (totalEl) totalEl.innerText = soma.toFixed(1);

      if (badgeEl) {
        if (soma >= 8.0) {
          badgeEl.className = 'fs-5 fw-bold text-success';
          badgeEl.innerHTML = '<i class="bi bi-star-fill text-warning me-1"></i> Excelente (Domínio Pleno)';
        } else if (soma >= 6.0) {
          badgeEl.className = 'fs-5 fw-bold text-primary';
          badgeEl.innerHTML = '<i class="bi bi-check-circle-fill text-primary me-1"></i> Conforme (Aprovado com Êxito)';
        } else if (soma >= 4.0) {
          badgeEl.className = 'fs-5 fw-bold text-warning';
          badgeEl.innerHTML = '<i class="bi bi-exclamation-circle-fill text-warning me-1"></i> Em Desenvolvimento (Requer Ajustes)';
        } else {
          badgeEl.className = 'fs-5 fw-bold text-danger';
          badgeEl.innerHTML = '<i class="bi bi-x-circle-fill text-danger me-1"></i> Insuficiente (Recuperação Paralela)';
        }
      }
    }

    function abrirModalAvaliarRubrica(demandaId, equipeId) {
      popularSelectsDeDemanda();
      const selDemanda = document.getElementById('selectRubricaDemanda');
      const selEquipe = document.getElementById('selectRubricaEquipe');

      if (demandaId && selDemanda) {
        selDemanda.value = demandaId;
      }
      if (equipeId && selEquipe) {
        selEquipe.value = equipeId;
      }

      carregarAvaliacaoExistenteNoModal();
      document.getElementById('modalRubricaOverlay').classList.add('active');
    }

    function carregarAvaliacaoExistenteNoModal() {
      const dId = document.getElementById('selectRubricaDemanda').value;
      const eq = document.getElementById('selectRubricaEquipe').value;

      // Atualizar lista visual de e-mails dos alunos da equipe
      const emails = obterEmailsEquipe(eq);
      const emailsSpan = document.getElementById('rubricaEmailsEquipeSpan');
      if (emailsSpan) {
        emailsSpan.innerText = emails.length ? emails.join(', ') : 'Nenhum e-mail vinculado a esta equipe';
      }

      const aval = avaliacoesApp.find(a => a.demandaId === dId && a.equipe === eq);

      if (aval && aval.dimensoes) {
        estadoRubricaAtual = { ...aval.dimensoes };
        document.getElementById('inputRubricaFeedback').value = aval.feedback || '';
        document.getElementById('inputRubricaLinkRepo').value = aval.linkRepo || '';
      } else {
        estadoRubricaAtual = { dim0: 2.5, dim1: 2.5, dim2: 2.5, dim3: 2.5 };
        document.getElementById('inputRubricaFeedback').value = '';
        document.getElementById('inputRubricaLinkRepo').value = '';
      }

      renderizarDimensoesNoModalRubrica();
    }

    function aoMudarDemandaNoModalRubrica(demandaId) {
      carregarAvaliacaoExistenteNoModal();
    }

    function aoMudarEquipeNoModalRubrica(equipe) {
      carregarAvaliacaoExistenteNoModal();
    }

    function fecharModalRubrica() {
      document.getElementById('modalRubricaOverlay').classList.remove('active');
    }

    function salvarAvaliacaoRubrica(event, notificarEmail = false) {
      if (event) event.preventDefault();
      const demandaId = document.getElementById('selectRubricaDemanda').value;
      const equipe = document.getElementById('selectRubricaEquipe').value;
      const feedback = document.getElementById('inputRubricaFeedback').value.trim();
      const linkRepo = document.getElementById('inputRubricaLinkRepo').value.trim();

      const notaFinal = Object.values(estadoRubricaAtual).reduce((a, b) => a + b, 0);

      let conceito = "Excelente";
      if (notaFinal < 4.0) conceito = "Insuficiente";
      else if (notaFinal < 6.0) conceito = "Em Desenvolvimento";
      else if (notaFinal < 8.0) conceito = "Conforme";

      const modelo = obterModeloRubricaParaDemanda(demandaId);
      const titulosDimensoes = modelo.dimensoes.map((d, i) => ({
        id: `dim${i}`,
        titulo: d.titulo,
        nota: estadoRubricaAtual[`dim${i}`] !== undefined ? estadoRubricaAtual[`dim${i}`] : 2.5
      }));

      const registro = {
        demandaId,
        equipe,
        nota: notaFinal,
        conceito,
        modeloRubrica: modelo.id,
        dimensoes: { ...estadoRubricaAtual },
        titulosDimensoes,
        feedback,
        linkRepo,
        dataAvaliacao: new Date().toISOString()
      };

      const idx = avaliacoesApp.findIndex(a => a.demandaId === demandaId && a.equipe === equipe);
      if (idx !== -1) {
        avaliacoesApp[idx] = registro;
      } else {
        avaliacoesApp.push(registro);
      }

      salvarDadosAvaliacoes();
      renderizarDemandas();
      renderizarTabelaRubricas();
      renderizarTabelaFechamento();
      fecharModalRubrica();

      const emailsEquipe = obterEmailsEquipe(equipe);
      chamarApiAppsScript('salvar_avaliacao', {
        avaliacao: registro,
        notificarEmail: Boolean(notificarEmail),
        destinatariosEmails: emailsEquipe
      }).then(res => {
        if (notificarEmail) {
          showToast(
            "Avaliação Salva & E-mail Enviado!",
            `Nota ${notaFinal.toFixed(1)} gravada na planilha e devolutiva enviada para ${res.totalEnviados || emailsEquipe.length} estudante(s)!`,
            "fa-solid fa-paper-plane text-success"
          );
        } else {
          showToast(
            "Avaliação Salva na Planilha!",
            `Nota ${notaFinal.toFixed(1)} registrada para ${equipe}.`,
            "fa-solid fa-award text-success"
          );
        }
      }).catch(err => {
        showToast("Avaliação Salva Localmente", `Nota ${notaFinal.toFixed(1)} salva (${err.message || err}).`, "fa-solid fa-triangle-exclamation text-warning");
      });
    }

    // =========================================================================
    // SUBABA 1: RENDERIZAÇÃO DO QUADRO DE ENTREGAS & RUBRICAS
    // =========================================================================
    function renderizarTabelaRubricas(filtroDemanda) {
      const container = document.getElementById('tabelaAvaliacoesContainer');
      if (!container) return;

      const elSelectFiltro = document.getElementById('selectFiltroDemandaRubrica');
      const filtroSel = filtroDemanda !== undefined ? filtroDemanda : (elSelectFiltro ? elSelectFiltro.value : 'todas');

      let lista = [...avaliacoesApp];
      if (filtroSel && filtroSel !== 'todas') {
        lista = lista.filter(a => a.demandaId === filtroSel);
      }

      if (lista.length === 0) {
        const idPrimeiraDemanda = (demandasApp && demandasApp[0]) ? demandasApp[0].id : 'DEM-01';
        container.innerHTML = `
          <div class="p-4 text-center text-muted" style="background: var(--bg-card-hover); border-radius: var(--radius-md);">
            <i class="fa-solid fa-clipboard-question fs-2 mb-2"></i>
            <p class="mb-1 fw-bold">Nenhuma avaliação por rubrica registrada para este filtro.</p>
            <p class="small mb-3">Abra a Central de Demandas ou clique no botão abaixo para avaliar a primeira equipe:</p>
            <button onclick="abrirModalAvaliarRubrica('${idPrimeiraDemanda}')" class="btn-action btn-outline-action py-1 px-3" style="font-size: 0.82rem;">
              <i class="fa-solid fa-award me-1"></i> Lançar Nova Avaliação
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <table class="table table-hover align-middle mb-0" style="font-size: 0.84rem;">
          <thead style="background: var(--bg-card-hover);">
            <tr>
              <th style="width: 26%;">Equipe &amp; Integrantes</th>
              <th style="width: 17%;">Demanda</th>
              <th style="width: 18%;">Dimensões da Rubrica</th>
              <th style="width: 14%; text-align: center;">Nota Consolidada</th>
              <th style="width: 25%; text-align: center;">Ações &amp; Notificações</th>
            </tr>
          </thead>
          <tbody>
            ${lista.map(av => {
              const dem = demandasApp.find(d => d.id === av.demandaId) || { titulo: av.demandaId, instrumento: 'A2' };
              const nota = (av.nota || 0).toFixed(1);
              const emails = obterEmailsEquipe(av.equipe);

              let badgeConceito = '<span class="badge bg-success-subtle text-success">Excelente</span>';
              if (av.nota < 4.0) badgeConceito = '<span class="badge bg-danger-subtle text-danger">Insuficiente</span>';
              else if (av.nota < 6.0) badgeConceito = '<span class="badge bg-warning-subtle text-warning">Em Desenv.</span>';
              else if (av.nota < 8.0) badgeConceito = '<span class="badge bg-primary-subtle text-primary">Conforme</span>';

              const dims = av.dimensoes || {};
              const modelo = obterModeloRubricaParaDemanda(av.demandaId);
              const dimsRef = modelo.dimensoes;

              const d1Tit = (dimsRef[0] && dimsRef[0].titulo) || 'Dimensão 1';
              const d2Tit = (dimsRef[1] && dimsRef[1].titulo) || 'Dimensão 2';
              const d3Tit = (dimsRef[2] && dimsRef[2].titulo) || 'Dimensão 3';
              const d4Tit = (dimsRef[3] && dimsRef[3].titulo) || 'Dimensão 4';

              const dimResumo = `
                <div class="d-flex gap-1 flex-wrap" style="font-size: 0.7rem;">
                  <span class="badge bg-light text-dark border" title="${escapeHtml(d1Tit)}: ${(dims.dim0 || 0).toFixed(1)}">D1: ${(dims.dim0 || 0).toFixed(1)}</span>
                  <span class="badge bg-light text-dark border" title="${escapeHtml(d2Tit)}: ${(dims.dim1 || 0).toFixed(1)}">D2: ${(dims.dim1 || 0).toFixed(1)}</span>
                  <span class="badge bg-light text-dark border" title="${escapeHtml(d3Tit)}: ${(dims.dim2 || 0).toFixed(1)}">D3: ${(dims.dim2 || 0).toFixed(1)}</span>
                  <span class="badge bg-light text-dark border" title="${escapeHtml(d4Tit)}: ${(dims.dim3 || 0).toFixed(1)}">D4: ${(dims.dim3 || 0).toFixed(1)}</span>
                </div>
              `;

              const feedbackHtml = av.feedback ? `
                <div class="text-muted small mt-1 text-truncate" style="max-width: 280px;" title="${escapeHtml(av.feedback)}">
                  <i class="fa-solid fa-comment-dots text-primary me-1"></i> "${escapeHtml(av.feedback)}"
                </div>
              ` : '';

              const emailsBadge = emails.length 
                ? `<div class="text-muted small mt-1" style="font-size:0.8125rem;"><i class="fa-solid fa-envelope me-1"></i> ${emails.length} e-mail(s) cadastrado(s)</div>`
                : `<div class="text-warning small mt-1" style="font-size:0.8125rem;"><i class="fa-solid fa-triangle-exclamation me-1"></i> Sem e-mail cadastrado</div>`;

              return `
                <tr>
                  <td>
                    <div class="fw-bold font-outfit text-heading">${escapeHtml(av.equipe)}</div>
                    ${emailsBadge}
                    ${feedbackHtml}
                  </td>
                  <td>
                    <span class="badge font-code" style="background: var(--bg-card); color: var(--accent-blue); border: 1px solid var(--border-color);">${av.demandaId}</span>
                    <div class="small text-muted text-truncate" style="max-width: 160px;">${escapeHtml(dem.titulo)}</div>
                  </td>
                  <td>${dimResumo}</td>
                  <td style="text-align: center;">
                    <div class="fs-5 fw-bold font-outfit text-heading">${nota} / 10.0</div>
                    <div>${badgeConceito}</div>
                  </td>
                  <td style="text-align: center;">
                    <div class="d-flex align-items-center justify-content-center gap-1 flex-wrap">
                      <button onclick="abrirModalAvaliarRubrica('${av.demandaId}', '${escapeHtml(av.equipe)}')" class="btn-action btn-outline-action py-1 px-2" style="font-size: 0.8125rem;" title="Editar Notas da Rubrica">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onclick="notificarEquipeEmail('${av.demandaId}', '${escapeHtml(av.equipe)}')" class="pi-btn-email" title="Enviar e-mail para os integrantes desta equipe com a nota e feedback">
                        <i class="fa-solid fa-envelope"></i> E-mail
                      </button>
                      <button onclick="copiarDevolutivaTexto('${av.demandaId}', '${escapeHtml(av.equipe)}')" class="pi-btn-copy" title="Copiar texto formatado da avaliação">
                        <i class="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    // =========================================================================
    // SUBABA 2: ESTUDANTES & E-MAILS PARA NOTIFICAÇÃO (ROSTER)
    // =========================================================================
    function alterarEquipeAlunoRapido(id, novaEquipe) {
      const al = alunosApp.find(a => a.id === id);
      if (!al) return;
      al.equipe = novaEquipe;
      salvarDadosAlunos();
      renderizarTabelaAlunos();
      renderizarTabelaFechamento();
      renderizarTabelaRubricas();
      showToast("Equipe Atualizada", `${al.nome}: ${novaEquipe}`, "fa-solid fa-users text-primary");
    }

    function renderizarTabelaAlunos() {
      const container = document.getElementById('tabelaAlunosContainer');
      if (!container) return;

      if (alunosApp.length === 0) {
        container.innerHTML = `
          <div class="p-4 text-center text-muted" style="background: var(--bg-card-hover); border-radius: var(--radius-md);">
            <i class="fa-solid fa-users-slash fs-2 mb-2"></i>
            <p class="mb-1 fw-bold">Nenhum estudante cadastrado no momento.</p>
            <p class="small mb-2">Use o formulário abaixo para colar a lista da turma do SIGAA ou adicione manualmente.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <table class="table table-hover align-middle mb-0" style="font-size: 0.84rem;">
          <thead style="background: var(--bg-card-hover);">
            <tr>
              <th style="width: 25%;">Estudante &amp; Matrícula</th>
              <th style="width: 32%;">Equipe / Projeto Extensionista</th>
              <th style="width: 23%;">E-mail para Notificação</th>
              <th style="width: 10%; text-align: center;">Status</th>
              <th style="width: 10%; text-align: center;">Ações</th>
            </tr>
          </thead>
          <tbody>
            ${alunosApp.map(al => {
              const mailtoIndividual = `mailto:${al.email}?subject=${encodeURIComponent('[ProgWeb 2] Notificação da Disciplina')}&body=${encodeURIComponent(`Olá, ${al.nome},\n\n`)}`;

              const optionsEquipes = [
                `<option value="Sem equipe definida" ${(!al.equipe || al.equipe === 'Sem equipe definida') ? 'selected' : ''}>⚠️ Sem equipe definida</option>`,
                ...EQUIPES_PROGWEB2.map(eq => `<option value="${escapeHtml(eq)}" ${al.equipe === eq ? 'selected' : ''}>${escapeHtml(eq)}</option>`)
              ].join('');

              const isSemEquipe = !al.equipe || al.equipe === 'Sem equipe definida';

              return `
                <tr>
                  <td>
                    <strong class="font-outfit text-heading">${escapeHtml(al.nome)}</strong>
                    ${al.matricula ? `<div class="small text-muted font-code" style="font-size: 0.75rem;"><i class="fa-solid fa-id-card me-1"></i>${escapeHtml(al.matricula)}</div>` : ''}
                  </td>
                  <td>
                    <div class="d-flex align-items-center gap-1">
                      <select class="form-select form-select-sm" style="font-size: 0.8rem; background: var(--bg-card); color: var(--text-main); border-color: ${isSemEquipe ? 'var(--accent-amber)' : 'var(--border-color)'};" onchange="alterarEquipeAlunoRapido('${al.id}', this.value)" title="Atribua a equipe do estudante">
                        ${optionsEquipes}
                      </select>
                    </div>
                  </td>
                  <td>
                    <a href="${mailtoIndividual}" class="font-code small text-primary text-decoration-none" title="Clique para enviar e-mail">
                      <i class="fa-solid fa-envelope me-1"></i>${escapeHtml(al.email)}
                    </a>
                  </td>
                  <td style="text-align: center;">
                    <span class="badge ${al.ativo ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                      ${al.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style="text-align: center;">
                    <div class="d-flex align-items-center justify-content-center gap-1">
                      <button onclick="abrirModalEditarAluno('${al.id}')" class="btn-action btn-outline-action py-1 px-2 docente-only" style="font-size: 0.8125rem;" title="Editar Aluno">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button onclick="excluirAluno('${al.id}')" class="btn-action btn-outline-action py-1 px-2 docente-only" style="font-size: 0.8125rem; color: var(--accent-rose);" title="Excluir Aluno">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    function abrirModalNovoAluno() {
      document.getElementById('formAluno').reset();
      document.getElementById('inputAlunoIdOriginal').value = '';
      if (document.getElementById('inputAlunoMatricula')) document.getElementById('inputAlunoMatricula').value = '';
      document.getElementById('modalAlunoTitulo').innerHTML = '<i class="fa-solid fa-user-plus text-primary me-2"></i> Cadastrar Estudante';
      document.getElementById('modalAlunoOverlay').classList.add('active');
    }

    function abrirModalEditarAluno(id) {
      const al = alunosApp.find(a => a.id === id);
      if (!al) return;

      document.getElementById('inputAlunoIdOriginal').value = al.id;
      document.getElementById('inputAlunoNome').value = al.nome;
      if (document.getElementById('inputAlunoMatricula')) document.getElementById('inputAlunoMatricula').value = al.matricula || '';
      document.getElementById('inputAlunoEquipe').value = al.equipe || 'Sem equipe definida';
      document.getElementById('inputAlunoEmail').value = al.email;
      document.getElementById('inputAlunoAtivo').checked = !!al.ativo;

      document.getElementById('modalAlunoTitulo').innerHTML = `<i class="fa-solid fa-user-pen text-primary me-2"></i> Editar: ${escapeHtml(al.nome)}`;
      document.getElementById('modalAlunoOverlay').classList.add('active');
    }

    function fecharModalAluno() {
      document.getElementById('modalAlunoOverlay').classList.remove('active');
    }

    function salvarAluno(event) {
      event.preventDefault();
      const idOriginal = document.getElementById('inputAlunoIdOriginal').value;
      const nome = document.getElementById('inputAlunoNome').value.trim();
      const matriculaEl = document.getElementById('inputAlunoMatricula');
      const matricula = matriculaEl ? matriculaEl.value.trim() : '';
      const equipe = document.getElementById('inputAlunoEquipe').value;
      const email = document.getElementById('inputAlunoEmail').value.trim().toLowerCase();
      const ativo = document.getElementById('inputAlunoAtivo').checked;

      if (idOriginal) {
        const idx = alunosApp.findIndex(a => a.id === idOriginal);
        if (idx !== -1) {
          alunosApp[idx] = { ...alunosApp[idx], nome, matricula, equipe, email, ativo };
          showToast("Estudante Atualizado", `${nome} foi atualizado(a) com sucesso!`);
        }
      } else {
        const novo = {
          id: String(Date.now()),
          nome,
          matricula,
          equipe,
          email,
          ativo
        };
        alunosApp.push(novo);
        showToast("Estudante Cadastrado", `${nome} adicionado(a) ao roster da turma!`);
      }

      salvarDadosAlunos();
      renderizarTabelaAlunos();
      renderizarTabelaRubricas();
      renderizarTabelaFechamento();
      fecharModalAluno();
    }

    function excluirAluno(id) {
      const al = alunosApp.find(a => a.id === id);
      if (!al) return;
      if (!confirm(`Deseja remover ${al.nome} do roster de estudantes?`)) return;

      alunosApp = alunosApp.filter(a => a.id !== id);
      salvarDadosAlunos();
      renderizarTabelaAlunos();
      renderizarTabelaRubricas();
      renderizarTabelaFechamento();
      showToast("Estudante Removido", `${al.nome} foi removido(a) da lista.`);
    }

    function processarImportacaoAlunos(event) {
      event.preventDefault();
      const texto = document.getElementById('textareaImportarAlunos').value.trim();
      if (!texto) return;

      const linhas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let adicionados = 0;
      let atualizados = 0;

      linhas.forEach((linha, i) => {
        const partes = linha.split(';').map(p => p.trim());
        if (partes.length >= 2) {
          const nome = partes[0];
          let equipe = partes[1] || 'Sem equipe definida';
          // Se for só número (ex: "1" ou "#1"), converter para o nome da equipe correspondente
          const numMatch = equipe.match(/\d+/);
          if (numMatch && EQUIPES_PROGWEB2[parseInt(numMatch[0]) - 1]) {
            equipe = EQUIPES_PROGWEB2[parseInt(numMatch[0]) - 1];
          }
          const email = partes[2] ? partes[2].toLowerCase() : `${nome.toLowerCase().replace(/\s+/g, '.')}@aluno.ifsc.edu.br`;

          const existente = alunosApp.find(a => a.nome.toLowerCase() === nome.toLowerCase());
          if (existente) {
            existente.equipe = equipe;
            existente.email = email;
            existente.ativo = true;
            atualizados++;
          } else {
            alunosApp.push({
              id: String(Date.now() + i),
              nome,
              equipe,
              email,
              ativo: true
            });
            adicionados++;
          }
        }
      });

      salvarDadosAlunos();
      renderizarTabelaAlunos();
      renderizarTabelaRubricas();
      renderizarTabelaFechamento();
      document.getElementById('textareaImportarAlunos').value = '';

      showToast("Roster Importado", `${adicionados} novos estudante(s) adicionados e ${atualizados} atualizados!`, "fa-solid fa-users text-success");
    }

    // =========================================================================
    // SUBABA 3: FECHAMENTO DE NOTAS & EXPORTAÇÃO SIGAA
    // =========================================================================
    function calcularNotaInstrumento(inst, equipeNome) {
      if (!equipeNome || equipeNome === 'Sem equipe definida') return null;
      const demanda = demandasApp.find(d => d.instrumento === inst);
      if (!demanda) return null;
      const aval = avaliacoesApp.find(a => a.demandaId === demanda.id && a.equipe === equipeNome);
      return aval && typeof aval.nota === 'number' ? aval.nota : null;
    }

    function renderizarTabelaFechamento() {
      const container = document.getElementById('tabelaFechamentoContainer');
      if (!container) return;

      if (alunosApp.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-muted">Cadastre os estudantes na sub-aba "Estudantes & E-mails" para visualizar o fechamento.</div>';
        return;
      }

      let somaMedias = 0;
      let qtdComNota = 0;
      let aprovados = 0;
      let recuperacao = 0;

      const linhas = alunosApp.map(al => {
        // Notas calculadas a partir das rubricas lançadas para a equipe ou estimativas
        const notaA1Calc = calcularNotaInstrumento('A1', al.equipe);
        const notaA2Calc = calcularNotaInstrumento('A2', al.equipe);
        const notaA3Calc = calcularNotaInstrumento('A3', al.equipe);
        const notaA4Calc = calcularNotaInstrumento('A4', al.equipe);

        const a1 = notaA1Calc !== null ? notaA1Calc : 7.5; // Estimativa padrão teórica
        const a2 = notaA2Calc !== null ? notaA2Calc : 8.0; // Curso SNCT
        const a3 = notaA3Calc !== null ? notaA3Calc : 8.5; // Vitrine Flask
        const a4 = notaA4Calc !== null ? notaA4Calc : 8.0; // Demais Entregas agrupadas

        const mf = (a1 * 0.20) + (a2 * 0.20) + (a3 * 0.35) + (a4 * 0.25);
        const mfArredondada = Math.round((mf + 1e-9) * 10) / 10;

        somaMedias += mfArredondada;
        qtdComNota++;

        const isAprovado = mfArredondada >= 6.0;
        if (isAprovado) aprovados++; else recuperacao++;

        const isSemEquipe = !al.equipe || al.equipe === 'Sem equipe definida';

        return `
          <tr>
            <td>
              <strong class="font-outfit text-heading">${escapeHtml(al.nome)}</strong>
              ${al.matricula ? `<div class="small text-muted font-code" style="font-size:0.75rem;">Matrícula: ${escapeHtml(al.matricula)}</div>` : ''}
              <div class="small ${isSemEquipe ? 'text-warning fw-semibold' : 'text-muted'}">
                ${isSemEquipe ? '<i class="fa-solid fa-triangle-exclamation me-1"></i>Sem equipe definida' : escapeHtml(al.equipe)}
              </div>
            </td>
            <td>
              <span class="font-code small text-muted">${escapeHtml(al.email)}</span>
            </td>
            <td style="text-align: center;">
              <strong>${a1.toFixed(1)}</strong>
              ${notaA1Calc !== null ? '<span class="badge bg-light text-primary border d-block mt-1" style="font-size:0.7rem;">rubrica</span>' : '<span class="badge bg-light text-muted border d-block mt-1" style="font-size:0.7rem;">estimada</span>'}
            </td>
            <td style="text-align: center;">
              <strong>${a2.toFixed(1)}</strong>
              ${notaA2Calc !== null ? '<span class="badge bg-light text-primary border d-block mt-1" style="font-size:0.7rem;">rubrica</span>' : '<span class="badge bg-light text-muted border d-block mt-1" style="font-size:0.7rem;">estimada</span>'}
            </td>
            <td style="text-align: center;">
              <strong>${a3.toFixed(1)}</strong>
              ${notaA3Calc !== null ? '<span class="badge bg-light text-primary border d-block mt-1" style="font-size:0.7rem;">rubrica</span>' : '<span class="badge bg-light text-muted border d-block mt-1" style="font-size:0.7rem;">estimada</span>'}
            </td>
            <td style="text-align: center;">
              <strong>${a4.toFixed(1)}</strong>
              ${notaA4Calc !== null ? '<span class="badge bg-light text-primary border d-block mt-1" style="font-size:0.7rem;">rubrica</span>' : '<span class="badge bg-light text-muted border d-block mt-1" style="font-size:0.7rem;">estimada</span>'}
            </td>
            <td style="text-align: center;">
              <span class="fs-6 fw-bold font-outfit text-heading">${mfArredondada.toFixed(1).replace('.', ',')}</span>
            </td>
            <td style="text-align: center;">
              <span class="badge ${isAprovado ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">
                ${isAprovado ? 'Aprovado' : 'Recuperação'}
              </span>
            </td>
          </tr>
        `;
      }).join('');

      const mediaGeralTurma = qtdComNota ? (somaMedias / qtdComNota).toFixed(2).replace('.', ',') : "—";

      container.innerHTML = `
        <div class="d-flex align-items-center gap-3 flex-wrap mb-3 p-2 rounded" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); font-size: 0.85rem;">
          <div><span class="text-muted">Total de Alunos:</span> <strong>${alunosApp.length}</strong></div>
          <div><span class="text-muted">Média Geral da Turma:</span> <strong class="text-primary">${mediaGeralTurma}</strong></div>
          <div><span class="text-muted">Aprovados Diretos (MF &ge; 6,0):</span> <strong class="text-success">${aprovados}</strong></div>
          <div><span class="text-muted">Em Recuperação Paralela:</span> <strong class="text-danger">${recuperacao}</strong></div>
        </div>

        <table class="table table-hover align-middle mb-0" id="tabelaFechamentoSigaaDados" style="font-size: 0.84rem;">
          <thead style="background: var(--bg-card-hover);">
            <tr>
              <th style="width: 22%;">Estudante &amp; Equipe</th>
              <th style="width: 18%;">E-mail para Notificação</th>
              <th style="width: 12%; text-align: center;" title="Avaliação Teórica (20%)">Nota A1 (20% • Teórica)</th>
              <th style="width: 12%; text-align: center;" title="Curso Ministrado na SNCT (20%)">Nota A2 (20% • Curso SNCT)</th>
              <th style="width: 12%; text-align: center;" title="Vitrine Comunitária Flask (35%)">Nota A3 (35% • Vitrine Flask)</th>
              <th style="width: 12%; text-align: center;" title="Demais Entregas Agrupadas (25%)">Nota A4 (25% • Entregas)</th>
              <th style="width: 6%; text-align: center;">Média Final</th>
              <th style="width: 6%; text-align: center;">Situação</th>
            </tr>
          </thead>
          <tbody>
            ${linhas}
          </tbody>
        </table>
      `;
    }

    function exportarTabelaFechamentoSIGAA() {
      if (alunosApp.length === 0) {
        alert("Nenhum estudante para exportar.");
        return;
      }

      let tsv = "Matrícula\tAluno\tEquipe\tE-mail\tNota A1 (20% - Teórica)\tNota A2 (20% - Curso SNCT)\tNota A3 (35% - Vitrine Flask)\tNota A4 (25% - Demais Entregas)\tMédia Final\tSituação\n";

      alunosApp.forEach(al => {
        const notaA1Calc = calcularNotaInstrumento('A1', al.equipe);
        const notaA2Calc = calcularNotaInstrumento('A2', al.equipe);
        const notaA3Calc = calcularNotaInstrumento('A3', al.equipe);
        const notaA4Calc = calcularNotaInstrumento('A4', al.equipe);

        const a1 = notaA1Calc !== null ? notaA1Calc : 7.5;
        const a2 = notaA2Calc !== null ? notaA2Calc : 8.0;
        const a3 = notaA3Calc !== null ? notaA3Calc : 8.5;
        const a4 = notaA4Calc !== null ? notaA4Calc : 8.0;

        const mf = (a1 * 0.20) + (a2 * 0.20) + (a3 * 0.35) + (a4 * 0.25);
        const mfFmt = (Math.round((mf + 1e-9) * 10) / 10).toFixed(1).replace('.', ',');
        const sit = mf >= 6.0 ? "Aprovado" : "Recuperação";

        tsv += `${al.matricula || ''}\t${al.nome}\t${al.equipe || 'Sem equipe definida'}\t${al.email}\t${a1.toFixed(1).replace('.', ',')}\t${a2.toFixed(1).replace('.', ',')}\t${a3.toFixed(1).replace('.', ',')}\t${a4.toFixed(1).replace('.', ',')}\t${mfFmt}\t${sit}\n`;
      });

      navigator.clipboard.writeText(tsv).then(() => {
        showToast(
          "Tabela Copiada para SIGAA",
          "Dados copiados em formato TSV (tabulado). Cole direto no Excel, Sheets ou SIGAA!",
          "fa-solid fa-clipboard-check text-success"
        );
      }).catch(err => {
        console.error("Erro ao copiar para clipboard:", err);
      });
    }

    // =========================================================================
    // VOTAÇÃO DE MINICURSOS DA SNCT (MODALIDADE 1 - EXTENSÃO)
    // =========================================================================
    function popularSelectEstudantesVotacao() {
      const select = document.getElementById('selectVotanteEstudante');
      if (!select) return;

      const valorSalvo = alunoVotanteAtualId;
      select.innerHTML = '<option value="">-- Selecione seu nome na turma (24 estudantes) --</option>';

      const alunosOrdenados = [...alunosApp].sort((a, b) => a.nome.localeCompare(b.nome));

      alunosOrdenados.forEach(al => {
        const jaVotou = votosOficinasApp.some(v => String(v.alunoId) === String(al.id));
        const seloVoto = jaVotou ? ' ✓ (Votou)' : '';
        const opt = document.createElement('option');
        opt.value = al.id;
        opt.textContent = `${al.nome}${al.matricula ? ' [' + al.matricula + ']' : ''}${seloVoto}`;
        select.appendChild(opt);
      });

      if (valorSalvo && alunosApp.some(a => String(a.id) === String(valorSalvo))) {
        select.value = valorSalvo;
      }
    }

    function aoMudarEstudanteVotante(alunoId) {
      alunoVotanteAtualId = alunoId;
      try {
        localStorage.setItem(STORAGE_KEY_ULTIMO_VOTANTE, alunoId);
      } catch (e) {}
      renderizarPainelVotacao();
    }

    // CARD DE PRODUÇÃO DOS MINICURSOS: o Curso 2 mostra o tema que lidera a votação
    function atualizarCursoDoisProducao(liderId, maxVotos, empate) {
      const card = document.getElementById('producaoCurso2');
      const titulo = document.getElementById('producaoCurso2Titulo');
      const status = document.getElementById('producaoCurso2Status');
      const publico = document.getElementById('producaoCurso2Publico');
      const tituloQuadro = document.getElementById('tituloCurso2QuadroDemandas');

      const lider = (liderId && maxVotos > 0 && !empate) ? oficinasVotacaoApp.find(o => o.id === liderId) : null;
      if (lider) {
        if (status) status.textContent = 'liderando a votação';
        if (titulo) titulo.textContent = lider.titulo;
        if (publico) publico.innerHTML = '<i class="bi bi-people-fill"></i>' + escapeHtml(lider.publico || 'Público a definir');
        if (tituloQuadro) tituloQuadro.textContent = `${lider.titulo} (Tema Líder na Votação)`;
      } else {
        if (status) status.textContent = empate && maxVotos > 0 ? 'empate na votação' : 'em votação';
        if (titulo) titulo.textContent = 'Definido pela votação da turma';
        if (publico) publico.innerHTML = '<i class="bi bi-people-fill"></i>Público conforme o tema escolhido';
        if (tituloQuadro) tituloQuadro.textContent = 'Tema Eleito na Votação';
      }
    }

    // =========================================================================
    // GESTÃO DE FRENTES CIRÚRGICAS & CANDIDATURAS DA SNCT (24 VAGAS)
    // =========================================================================
    function carregarDemandasSNCT() {
      try {
        const salvas = localStorage.getItem(STORAGE_KEY_DEMANDAS_SNCT);
        if (salvas) {
          const parsed = JSON.parse(salvas);
          if (Array.isArray(parsed) && parsed.length === DEMANDAS_PADRAO_SNCT.length) {
            demandasSnctApp = parsed.map((item, idx) => {
              const padrao = DEMANDAS_PADRAO_SNCT.find(p => p.id === item.id) || DEMANDAS_PADRAO_SNCT[idx];
              return {
                ...padrao,
                ...item,
                roteiroCodigo: padrao.roteiroCodigo,
                roteiroPdf: padrao.roteiroPdf,
                descricao: padrao.descricao,
                entregaveis: padrao.entregaveis,
                etapas: Array.isArray(item.etapas) && item.etapas.length === 3 ? item.etapas : [false, false, false]
              };
            });
          } else {
            demandasSnctApp = JSON.parse(JSON.stringify(DEMANDAS_PADRAO_SNCT));
            salvarDemandasSNCT();
          }
        } else {
          demandasSnctApp = JSON.parse(JSON.stringify(DEMANDAS_PADRAO_SNCT));
          salvarDemandasSNCT();
        }
      } catch (e) {
        console.error("Erro ao carregar demandas SNCT:", e);
        demandasSnctApp = JSON.parse(JSON.stringify(DEMANDAS_PADRAO_SNCT));
      }
    }

    function salvarDemandasSNCT() {
      try {
        localStorage.setItem(STORAGE_KEY_DEMANDAS_SNCT, JSON.stringify(demandasSnctApp));
      } catch (e) {
        console.error("Erro ao salvar demandas SNCT:", e);
      }
    }

    function restaurarDemandasPadraoSNCT() {
      if (!confirm("Deseja realmente restaurar as frentes de trabalho da SNCT para o padrão inicial? Todas as candidaturas salvas localmente serão limpas.")) {
        return;
      }
      demandasSnctApp = JSON.parse(JSON.stringify(DEMANDAS_PADRAO_SNCT));
      salvarDemandasSNCT();
      renderizarQuadroDemandasSNCT();
      renderizarCardHeroRoteirosSNCT();
      showToast("Frentes Restauradas", "O quadro de frentes de trabalho da SNCT foi restaurado para a estrutura padrão.", "bi bi-arrow-counterclockwise text-primary");
    }

    function navegarParaDemandasSNCT() {
      showTab('tab-extensao');
      setTimeout(() => {
        const collapse = document.getElementById('collapseQuadroFrentes');
        if (collapse) collapse.open = true;
        const el = document.getElementById('quadroDemandasSNCT');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }

    function renderizarCardHeroRoteirosSNCT() {
      let totalVagas = 0;
      let totalOcupadas = 0;
      let totalFrentes = demandasSnctApp.length;
      let frentesCompletas = 0;
      let frentesComEntrega = 0;
      let minhaFrente = null;

      demandasSnctApp.forEach(d => {
        const vagasMax = (d.vagasMax || 3);
        totalVagas += vagasMax;
        const membros = Array.isArray(d.membros) ? d.membros : [];
        totalOcupadas += membros.length;
        if (membros.length >= vagasMax) {
          frentesCompletas++;
        }
        const achouEntrega = membros.some(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
        if (achouEntrega) {
          frentesComEntrega++;
        }
        if (usuarioLogadoGoogle && usuarioLogadoGoogle.alunoId) {
          const achou = membros.find(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));
          if (achou) {
            minhaFrente = { frente: d, membro: achou };
          }
        }
      });

      const vagasRestantes = Math.max(0, totalVagas - totalOcupadas);
      const frentesSemEntrega = Math.max(0, totalFrentes - frentesComEntrega);
      const pctVagas = totalVagas > 0 ? Math.round((totalOcupadas / totalVagas) * 100) : 0;

      // 1. Atualização do Badge de Status no Topo do Card
      const badgeStatusEl = document.getElementById('cardSnctBadgeStatus');
      const badgeTextoEl = document.getElementById('cardSnctBadgeTexto');
      if (badgeTextoEl) {
        if (totalOcupadas === 0) {
          badgeTextoEl.textContent = `Mobilização (0/${totalVagas} Vagas)`;
        } else if (vagasRestantes === 0) {
          badgeTextoEl.textContent = `${totalVagas}/${totalVagas} Vagas Preenchidas (100%)`;
        } else {
          badgeTextoEl.textContent = `${totalOcupadas}/${totalVagas} Vagas (${vagasRestantes} abertas)`;
        }
      }
      if (badgeStatusEl) {
        if (vagasRestantes === 0 && frentesSemEntrega === 0) {
          badgeStatusEl.className = 'status-badge status-done';
        } else if (totalOcupadas > 0) {
          badgeStatusEl.className = 'status-badge status-current';
        } else {
          badgeStatusEl.className = 'status-badge status-next';
        }
      }

      // 2. Contador e Barra de Progresso de Vagas
      const totalEl = document.getElementById('heroSnctContadorVagas');
      const progressEl = document.getElementById('heroSnctProgressBar');
      if (totalEl) {
        totalEl.textContent = `${totalOcupadas} / ${totalVagas} vagas (${pctVagas}%)`;
      }
      if (progressEl) {
        progressEl.style.width = `${pctVagas}%`;
      }

      // 3. Faixa de Métricas Dinâmicas (Andamento vs Pendências)
      const metricasEl = document.getElementById('cardSnctMetricasAndamento');
      if (metricasEl) {
        metricasEl.innerHTML = `
          <span class="snct-metric-pill ${totalOcupadas === totalVagas ? 'success' : 'blue'}" title="Preenchimento geral das vagas">
            <i class="bi bi-people-fill"></i> ${totalOcupadas}/${totalVagas} vagas
          </span>
          <span class="snct-metric-pill ${vagasRestantes > 0 ? 'warning' : 'success'}" title="Vagas restantes para a turma">
            <i class="bi ${vagasRestantes > 0 ? 'bi-person-exclamation' : 'bi-check-all'}"></i> ${vagasRestantes > 0 ? vagasRestantes + ' vagas abertas' : 'Equipes completas'}
          </span>
          <span class="snct-metric-pill ${frentesComEntrega > 0 ? 'success' : 'purple'}" title="Frentes com link de entrega cadastrado">
            <i class="bi bi-file-earmark-check"></i> ${frentesComEntrega}/${totalFrentes} materiais vinculados
          </span>
          <span class="snct-metric-pill ${frentesSemEntrega > 0 ? 'warning' : 'success'}" title="Frentes com entregáveis a produzir">
            <i class="bi bi-hourglass-split"></i> ${frentesSemEntrega > 0 ? frentesSemEntrega + ' materiais pendentes' : '100% materiais entregues'}
          </span>
        `;
      }

      // 4. Status Pessoal do Aluno Logado
      const statusUserEl = document.getElementById('heroSnctStatusUsuario');
      if (statusUserEl) {
        if (!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId) {
          statusUserEl.innerHTML = `
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span class="fs-caption text-muted">
                <i class="bi bi-shield-lock me-1"></i> Identifique-se com Google para ver sua frente e entregáveis.
              </span>
              <button onclick="iniciarLoginGoogle()" class="btn btn-sm btn-outline-primary py-0 px-2 fs-caption" style="font-size: 11px;">
                <i class="bi bi-google me-1"></i> Identificar
              </button>
            </div>
          `;
        } else if (minhaFrente) {
          const membrosFrente = Array.isArray(minhaFrente.frente.membros) ? minhaFrente.frente.membros : [];
          const achouLink = membrosFrente.find(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
          const linkEntregaValido = achouLink ? achouLink.linkEntrega.trim() : '';

          statusUserEl.innerHTML = `
            <div class="d-flex flex-column gap-1">
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-1">
                <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-caption">
                  <i class="bi bi-check-circle-fill me-1"></i> Sua Frente: <strong>${escapeHtml(minhaFrente.frente.titulo)}</strong>
                </span>
                <button onclick="navegarParaDemandasSNCT()" class="btn btn-sm btn-link p-0 text-success text-decoration-none fs-caption">
                  Ver Frente <i class="bi bi-arrow-right-short"></i>
                </button>
              </div>
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-1 fs-caption">
                ${linkEntregaValido ? `
                  <span class="text-success"><i class="bi bi-link-45deg"></i> Entregável: <a href="${escapeHtml(linkEntregaValido)}" target="_blank" rel="noopener noreferrer" class="fw-bold text-success text-decoration-underline">Abrir Link</a></span>
                  <button onclick="editarLinkEntregaSNCT('${minhaFrente.frente.id}')" class="btn btn-sm btn-outline-secondary py-0 px-2 fs-caption" style="font-size: 11px;">Alterar Link</button>
                ` : `
                  <span class="text-warning-emphasis"><i class="bi bi-exclamation-triangle-fill text-warning me-1"></i> Entregável de material pendente</span>
                  <button onclick="editarLinkEntregaSNCT('${minhaFrente.frente.id}')" class="btn btn-sm btn-primary py-0 px-2 fs-caption" style="font-size: 11px;">Informar Link</button>
                `}
              </div>
            </div>
          `;
        } else {
          statusUserEl.innerHTML = `
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 fs-caption">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> Você ainda não assumiu uma frente (${vagasRestantes} vagas abertas)
              </span>
              <button onclick="navegarParaDemandasSNCT()" class="btn btn-sm btn-primary py-0 px-2 fs-caption" style="font-size: 11px;">
                <i class="bi bi-hand-index-thumb me-1"></i> Escolher Frente
              </button>
            </div>
          `;
        }
      }
    }

    function renderizarQuadroDemandasSNCT() {
      const containerC1 = document.getElementById('containerFrentesCurso1');
      const containerC2 = document.getElementById('containerFrentesCurso2');
      const spanTotalOcupadas = document.getElementById('spanTotalVagasOcupadas');

      if (!containerC1 || !containerC2) return;

      let totalOcupadas = 0;
      let totalVagas = 0;

      const frentesC1 = demandasSnctApp.filter(d => d.cursoId === 1);
      const frentesC2 = demandasSnctApp.filter(d => d.cursoId === 2);

      const renderFrenteCard = (frente) => {
        const membros = Array.isArray(frente.membros) ? frente.membros : [];
        const vagasOcupadas = membros.length;
        const vagasMax = frente.vagasMax || 3;
        totalOcupadas += vagasOcupadas;
        totalVagas += vagasMax;
        const completa = vagasOcupadas >= vagasMax;

        const souMembro = usuarioLogadoGoogle && usuarioLogadoGoogle.alunoId && membros.some(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));

        let htmlMembros = '';
        membros.forEach(m => {
          const ehVoce = usuarioLogadoGoogle && (String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));
          htmlMembros += `
            <div class="snct-membro-item">
              <div class="d-flex align-items-center gap-2 overflow-hidden">
                <i class="bi bi-person-fill ${ehVoce ? 'text-success' : 'text-primary'}"></i>
                <div class="overflow-hidden">
                  <div class="snct-membro-nome">${escapeHtml(m.nome)} ${ehVoce ? '<span class="badge bg-success-subtle text-success fs-label ms-1">Você</span>' : ''}</div>
                  <div class="text-muted" style="font-size: 0.72rem;">Matrícula: ${escapeHtml(m.matricula || 'N/A')}</div>
                </div>
              </div>
              <div class="text-end flex-shrink-0 d-flex align-items-center gap-1">
                ${m.linkEntrega ? `
                  <a href="${escapeHtml(m.linkEntrega)}" target="_blank" rel="noopener noreferrer" class="snct-membro-link" title="Abrir entregável da equipe">
                    <i class="bi bi-box-arrow-up-right"></i> Link
                  </a>
                ` : '<span class="text-muted" style="font-size: 0.72rem;">Pendente link</span>'}
                ${(ehVoce || document.body.classList.contains('modo-docente-ativo')) ? `
                  <button type="button" class="btn btn-sm btn-link text-danger p-0 ms-1" title="Desvincular da vaga" onclick="desistirCandidaturaSNCT('${frente.id}', '${m.alunoId}')">
                    <i class="bi bi-x-circle"></i>
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        });

        const vagasLivres = Math.max(0, vagasMax - vagasOcupadas);
        for (let i = 0; i < vagasLivres; i++) {
          htmlMembros += `
            <div class="snct-vaga-vazia">
              <i class="bi bi-dash-circle"></i> Vaga ${vagasOcupadas + i + 1} disponível
            </div>
          `;
        }

        let htmlAcao = '';
        if (souMembro) {
          const meuRegistro = membros.find(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));
          htmlAcao = `
            <div class="d-flex gap-2 mt-3">
              <button type="button" class="btn btn-sm btn-outline-primary flex-grow-1" onclick="editarLinkEntregaSNCT('${frente.id}')">
                <i class="bi bi-link-45deg me-1"></i> ${meuRegistro && meuRegistro.linkEntrega ? 'Alterar Link' : 'Informar Link'}
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" onclick="desistirCandidaturaSNCT('${frente.id}')" title="Liberar sua vaga para outro colega">
                <i class="bi bi-box-arrow-left"></i> Sair
              </button>
            </div>
          `;
        } else if (!completa) {
          if (!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId) {
            htmlAcao = `
              <button type="button" class="btn btn-sm btn-outline-primary w-100 mt-3" onclick="candidatarEstudanteSNCT('${frente.id}')">
                <i class="bi bi-hand-index-thumb me-1"></i> Candidatar-me (Requer Login)
              </button>
            `;
          } else {
            htmlAcao = `
              <button type="button" class="btn btn-sm btn-primary w-100 mt-3" onclick="candidatarEstudanteSNCT('${frente.id}')">
                <i class="bi bi-hand-index-thumb me-1"></i> Candidatar-me a esta Frente
              </button>
            `;
          }
        } else {
          htmlAcao = `
            <button type="button" class="btn btn-sm btn-outline-secondary w-100 mt-3" disabled>
              <i class="bi bi-lock-fill me-1"></i> Vagas Esgotadas (3/3)
            </button>
          `;
        }

        const etapasFrente = Array.isArray(frente.etapas) && frente.etapas.length === 3
          ? frente.etapas
          : [false, false, false];
        const etapa1Auto = vagasOcupadas > 0 || etapasFrente[0];
        const temLinkFrente = membros.some(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
        const etapa2Auto = temLinkFrente || etapasFrente[1];
        const estadosEtapas = [etapa1Auto, etapa2Auto, Boolean(etapasFrente[2])];
        const concluidasEtapas = estadosEtapas.filter(Boolean).length;
        const podeMarcarEtapa = souMembro || document.body.classList.contains('modo-docente-ativo');

        const htmlRoteiroPdf = frente.roteiroPdf ? `
          <div class="mb-2">
            <a href="${escapeHtml(frente.roteiroPdf)}" target="_blank" rel="noopener"
               class="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-between py-1 px-2">
              <span class="fs-caption fw-bold"><i class="bi bi-file-earmark-pdf-fill text-danger me-1"></i> ${escapeHtml(frente.roteiroCodigo || 'Roteiro PDF')} — Guia Passo a Passo</span>
              <i class="bi bi-box-arrow-up-right fs-caption"></i>
            </a>
          </div>
        ` : '';

        let htmlEntregaveis = '';
        if (Array.isArray(frente.entregaveis) && frente.entregaveis.length > 0) {
          htmlEntregaveis = `
            <div class="mt-2 pt-2 border-top">
              <div class="fs-label fw-bold text-muted text-uppercase mb-1">Entregáveis (GitHub &amp; Moodle):</div>
              <ul class="mb-2 ps-3 fs-caption text-muted">
                ${frente.entregaveis.map(ent => `<li>${escapeHtml(ent)}</li>`).join('')}
              </ul>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fs-label fw-bold text-muted text-uppercase">Andamento da Frente:</span>
                <span class="fs-label fw-bold text-primary">${concluidasEtapas}/3 etapas</span>
              </div>
              <div class="d-flex flex-column gap-1">
                ${ETAPAS_PADRAO_FRENTE_SNCT.map((rotuloEtapa, idxEtapa) => {
                  const marcada = estadosEtapas[idxEtapa];
                  return `
                    <label class="d-flex align-items-center gap-2 fs-caption ${marcada ? 'text-success fw-bold' : 'text-muted'}"
                           style="cursor: ${podeMarcarEtapa ? 'pointer' : 'default'};">
                      <input type="checkbox" class="form-check-input m-0"
                             ${marcada ? 'checked' : ''}
                             ${podeMarcarEtapa ? '' : 'disabled'}
                             onchange="alternarEtapaFrenteSNCT('${frente.id}', ${idxEtapa}, this.checked)">
                      <span>${escapeHtml(rotuloEtapa)}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }

        return `
          <div class="col-12 col-md-6 col-xl-3">
            <div class="snct-frente-card ${completa ? 'frente-completa' : ''} h-100">
              <div>
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <div class="d-flex align-items-center gap-2">
                    <span class="fs-5 text-primary"><i class="bi ${frente.icone || 'bi-gear'}"></i></span>
                    <h6 class="font-outfit fw-bold fs-6 text-heading mb-0">${escapeHtml(frente.titulo)}</h6>
                  </div>
                  <span class="snct-vaga-badge ${completa ? 'snct-vaga-lotada' : 'snct-vaga-disponivel'} flex-shrink-0">
                    <i class="bi ${completa ? 'bi-check-circle-fill' : 'bi-person-fill'}"></i> ${vagasOcupadas}/${vagasMax}
                  </span>
                </div>
                <p class="fs-caption text-muted mb-2">${escapeHtml(frente.descricao)}</p>
                ${htmlRoteiroPdf}
                <div class="mb-2">
                  <div class="fs-label fw-bold text-muted text-uppercase mb-1">Integrantes Escalados:</div>
                  ${htmlMembros}
                </div>
                ${htmlEntregaveis}
              </div>
              <div>
                ${htmlAcao}
              </div>
            </div>
          </div>
        `;
      };

      containerC1.innerHTML = frentesC1.map(renderFrenteCard).join('');
      containerC2.innerHTML = frentesC2.map(renderFrenteCard).join('');

      if (spanTotalOcupadas) {
        spanTotalOcupadas.textContent = totalOcupadas;
      }
      const ocupC1 = frentesC1.reduce((acc, f) => acc + ((f.membros || []).length), 0);
      const ocupC2 = frentesC2.reduce((acc, f) => acc + ((f.membros || []).length), 0);
      const elResC1 = document.getElementById('resumoVagasCurso1');
      const elResC2 = document.getElementById('resumoVagasCurso2');
      if (elResC1) elResC1.textContent = `${ocupC1} / 12 vagas ocupadas`;
      if (elResC2) elResC2.textContent = `${ocupC2} / 12 vagas ocupadas`;

      sincronizarDemandasComQuadroSNCT();
      renderizarAreaDocente();
      renderizarPainelNominalCandidaturasSNCT();
      renderizarCardHeroRoteirosSNCT();
    }

    function alternarEtapaFrenteSNCT(frenteId, idxEtapa, marcado) {
      const frente = demandasSnctApp.find(f => f.id === frenteId);
      if (!frente) return;
      if (!Array.isArray(frente.etapas) || frente.etapas.length !== 3) {
        frente.etapas = [false, false, false];
      }
      frente.etapas[idxEtapa] = Boolean(marcado);
      salvarDemandasSNCT();
      renderizarQuadroDemandasSNCT();
    }

    function sincronizarDemandasComQuadroSNCT() {
      const demCand = demandasApp.find(d => d.id === 'DEM-SNCT-01');
      const demC1 = demandasApp.find(d => d.id === 'DEM-SNCT-C1');
      const demC2 = demandasApp.find(d => d.id === 'DEM-SNCT-C2');
      if (!demCand && !demC1 && !demC2) return;

      if (demCand) normalizarAtribuicaoDemanda(demCand);
      if (demC1) normalizarAtribuicaoDemanda(demC1);
      if (demC2) normalizarAtribuicaoDemanda(demC2);

      let alterou = false;
      demandasSnctApp.forEach(frente => {
        const membros = Array.isArray(frente.membros) ? frente.membros : [];
        const membroComLink = membros.find(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
        const linkFrente = membroComLink ? membroComLink.linkEntrega.trim() : '';

        membros.forEach(m => {
          const aluno = alunosApp.find(a =>
            String(a.id) === String(m.alunoId) ||
            (m.matricula && String(a.matricula) === String(m.matricula)) ||
            (m.email && a.email && a.email.toLowerCase() === m.email.toLowerCase())
          );
          if (!aluno) return;
          const chave = 'aluno:' + aluno.id;

          if (demCand && (!demCand.entregas[chave] || !demCand.entregas[chave].entregue)) {
            demCand.entregas[chave] = {
              entregue: true,
              link: '',
              dataEntrega: m.dataInscricao || new Date().toISOString(),
              registradoPor: aluno.nome
            };
            alterou = true;
          }
          const demCurso = frente.cursoId === 1 ? demC1 : demC2;
          if (demCurso && linkFrente && (!demCurso.entregas[chave] || demCurso.entregas[chave].link !== linkFrente)) {
            demCurso.entregas[chave] = {
              entregue: true,
              link: linkFrente,
              dataEntrega: m.dataInscricao || new Date().toISOString(),
              registradoPor: aluno.nome
            };
            alterou = true;
          }
        });
      });

      if (alterou) {
        salvarDadosDemandas();
        renderizarDemandas();
      }
    }


    // =========================================================================
    // ÁREA DOCENTE & PAINEL DE FRENTES SNCT
    // =========================================================================
    function renderizarCardMinhaFrenteEstudante() {
      const containers = [
        document.getElementById('cardMinhaFrenteContainerDocente'),
        document.getElementById('cardMinhaFrenteContainerDemandas'),
        document.getElementById('cardMinhaFrenteContainerExtensao')
      ].filter(Boolean);

      if (containers.length === 0) return;

      const usuario = usuarioLogadoGoogle;
      const ehDocenteAtivo = document.body.classList.contains('modo-docente-ativo');

      // Caso 1: Usuário é o Docente André Moraes autenticado
      if (ehDocenteAtivo && (ehProfessor(usuario) || localStorage.getItem(STORAGE_KEY_DOCENTE_AUTH) === 'true')) {
        const frentesC1 = demandasSnctApp.filter(f => f.cursoId === 1);
        const frentesC2 = demandasSnctApp.filter(f => f.cursoId === 2);
        const escaladosC1 = frentesC1.reduce((acc, f) => acc + (f.membros || []).length, 0);
        const escaladosC2 = frentesC2.reduce((acc, f) => acc + (f.membros || []).length, 0);
        const linksC1 = frentesC1.filter(f => (f.membros || []).some(m => m.linkEntrega && m.linkEntrega.trim())).length;
        const linksC2 = frentesC2.filter(f => (f.membros || []).some(m => m.linkEntrega && m.linkEntrega.trim())).length;

        const htmlDocente = `
          <div class="p-3 rounded-3 mb-3" style="background: var(--bg-card); border: 1px solid var(--accent-amber); border-left: 5px solid var(--accent-amber); box-shadow: var(--shadow-sm);">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2 pb-2 border-bottom">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-warning text-dark px-2 py-1"><i class="fa-solid fa-chalkboard-user me-1"></i> PAINEL DO PROFESSOR</span>
                <span class="fw-bold text-heading fs-6">Prof. André Moraes — Visão de Gestão Operacional SNCT 2026</span>
              </div>
              <div class="d-flex align-items-center gap-2">
                <a href="https://moodle.ifsc.edu.br/course/view.php?id=2663" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary py-0 px-2 fs-caption">
                  <i class="bi bi-mortarboard-fill me-1"></i> Moodle C1 (2663) <i class="bi bi-box-arrow-up-right ms-1"></i>
                </a>
                <a href="https://moodle.ifsc.edu.br/course/view.php?id=2664" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-success py-0 px-2 fs-caption">
                  <i class="bi bi-mortarboard-fill me-1"></i> Moodle C2 (2664) <i class="bi bi-box-arrow-up-right ms-1"></i>
                </a>
                <button type="button" onclick="solicitarAcessoDocente()" class="btn btn-sm btn-outline-secondary py-0 px-2 fs-caption" title="Alternar para visão do estudante">
                  <i class="fa-solid fa-eye me-1"></i> Ver como Aluno
                </button>
              </div>
            </div>
            <div class="row g-2 align-items-center">
              <div class="col-md-3">
                <div class="fs-caption text-muted">Curso 1 (Site no Ar):</div>
                <div class="fw-bold text-heading fs-small"><i class="bi bi-people-fill text-primary me-1"></i>${escaladosC1}/12 escalados · ${linksC1}/4 frentes entregues</div>
              </div>
              <div class="col-md-3">
                <div class="fs-caption text-muted">Curso 2 (Painel Verde):</div>
                <div class="fw-bold text-heading fs-small"><i class="bi bi-people-fill text-success me-1"></i>${escaladosC2}/12 escalados · ${linksC2}/4 frentes entregues</div>
              </div>
              <div class="col-md-6 text-md-end">
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fs-caption">
                  <i class="bi bi-calendar-event me-1"></i> Semanas 1 e 2: Moodle · Semana 3: Ensaio Lab · Ministração: 26/11
                </span>
              </div>
            </div>
          </div>
        `;
        containers.forEach(c => { c.innerHTML = htmlDocente; });
        return;
      }

      // Caso 2: Usuário identificado como estudante
      const alunoId = (usuario && usuario.alunoId) ? String(usuario.alunoId) : (typeof alunoVotanteAtualId !== 'undefined' && alunoVotanteAtualId ? String(alunoVotanteAtualId) : null);
      let frenteEncontrada = null;

      if (alunoId || (usuario && (usuario.matricula || usuario.email))) {
        frenteEncontrada = demandasSnctApp.find(f => {
          const membros = Array.isArray(f.membros) ? f.membros : [];
          return membros.some(m =>
            (alunoId && String(m.alunoId) === String(alunoId)) ||
            (usuario && usuario.matricula && String(m.matricula) === String(usuario.matricula)) ||
            (usuario && usuario.email && m.email && m.email.toLowerCase().trim() === usuario.email.toLowerCase().trim())
          );
        });
      }

      // Caso 2A: Estudante está em uma frente
      if (frenteEncontrada) {
        const cursoId = frenteEncontrada.cursoId;
        const moodleId = cursoId === 1 ? '2663' : '2664';
        const moodleUrl = `https://moodle.ifsc.edu.br/course/view.php?id=${moodleId}`;
        const corBorda = cursoId === 1 ? 'var(--accent-blue)' : 'var(--accent-emerald)';
        const membros = Array.isArray(frenteEncontrada.membros) ? frenteEncontrada.membros : [];
        const membroComLink = membros.find(m => m.linkEntrega && m.linkEntrega.trim().length > 0);
        const linkEntrega = membroComLink ? membroComLink.linkEntrega.trim() : '';
        const temEntrega = Boolean(linkEntrega);
        const nomeEstudante = usuario && usuario.nome ? usuario.nome.split(' ')[0] : 'Estudante';

        // Detalhes pedagógicos específicos da frente
        const detalhes = DETALHES_FRENTES_SNCT[frenteEncontrada.id] || {
          entregavelEtapa2: frenteEncontrada.entregaveis ? frenteEncontrada.entregaveis.join(' · ') : 'Material Didático e Sala do Moodle',
          orientacao: frenteEncontrada.descricao || 'Produza a primeira versão do material da sua frente e publique na sala do curso.',
          checklist: frenteEncontrada.entregaveis || ['Elaborar material da frente', 'Publicar no Moodle institucional', 'Informar o link']
        };

        const htmlMembrosTrio = membros.map(m => {
          const ehVoce = (alunoId && String(m.alunoId) === String(alunoId)) || (usuario && usuario.matricula && String(m.matricula) === String(usuario.matricula));
          return `
            <div class="d-flex align-items-center justify-content-between py-1 border-bottom border-light-subtle">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-person-fill ${ehVoce ? 'text-success' : 'text-primary'}"></i>
                <div>
                  <span class="fw-semibold text-heading fs-caption">${escapeHtml(m.nome)}</span>
                  ${ehVoce ? '<span class="badge bg-success-subtle text-success fs-label ms-1">Você</span>' : ''}
                  ${m.email ? `<div class="fs-label text-muted"><a href="mailto:${escapeHtml(m.email)}" class="text-muted text-decoration-none"><i class="bi bi-envelope me-1"></i>${escapeHtml(m.email)}</a></div>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('');

        const htmlChecklist = detalhes.checklist.map(item => `
          <li class="d-flex align-items-start gap-2 mb-1">
            <i class="bi bi-check2-square text-primary mt-1"></i>
            <span>${escapeHtml(item)}</span>
          </li>
        `).join('');

        const cardHtml = `
          <div class="p-3 rounded-3 mb-3" style="background: var(--bg-card); border: 1px solid var(--border-color); border-left: 6px solid ${corBorda}; box-shadow: var(--shadow-sm);">
            
            <!-- CABEÇALHO DO CARD -->
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3 pb-2 border-bottom">
              <div>
                <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <span class="badge ${cursoId === 1 ? 'bg-primary' : 'bg-success'} px-2 py-1 font-mono">
                    <i class="bi bi-mortarboard-fill me-1"></i> CURSO ${cursoId} — ${cursoId === 1 ? 'MEU 1º SITE NO AR' : 'PAINEL VERDE GAROPABA'}
                  </span>
                  <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fs-caption">
                    <i class="bi bi-patch-check-fill me-1"></i> Alocação Homologada (A2 · 20%)
                  </span>
                </div>
                <h3 class="font-outfit fs-5 fw-bold text-heading mb-0">
                  <i class="bi ${frenteEncontrada.icone || 'bi-kanban'} text-primary me-2"></i>Sua Frente: ${escapeHtml(frenteEncontrada.titulo)}
                </h3>
                <p class="fs-caption text-muted mb-0 mt-1">
                  Olá, <strong>${escapeHtml(nomeEstudante)}</strong>! Confira abaixo sua equipe, o que seu trio precisa produzir na Etapa 2 e o link direto para a sala do seu curso no Moodle.
                </p>
              </div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <a href="${moodleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary fw-bold" title="Abrir sala no Moodle IFSC">
                  <i class="bi bi-mortarboard-fill me-1"></i> Sala Moodle C${cursoId} (id=${moodleId}) <i class="bi bi-box-arrow-up-right ms-1"></i>
                </a>
                ${frenteEncontrada.roteiroPdf ? `
                  <a href="${escapeHtml(frenteEncontrada.roteiroPdf)}" target="_blank" class="btn btn-sm btn-outline-secondary py-1 px-2 fs-caption" title="Guia Operacional PDF da Frente">
                    <i class="bi bi-file-earmark-pdf text-danger me-1"></i> Roteiro da Frente
                  </a>
                ` : ''}
              </div>
            </div>

            <!-- CORPO: 3 COLUNAS INTEGRATÓRIAS -->
            <div class="row g-3">
              
              <!-- COLUNA 1: TRIO ESCALADO -->
              <div class="col-lg-4">
                <div class="p-3 rounded-2 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color);">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="fs-caption fw-bold text-heading text-uppercase">
                      <i class="bi bi-people-fill text-primary me-1"></i> Seu Trio Escalado (${membros.length}/3)
                    </div>
                    <span class="badge ${membros.length === 3 ? 'bg-success' : 'bg-warning text-dark'} fs-label">
                      ${membros.length === 3 ? 'Completo' : 'Vaga Aberta'}
                    </span>
                  </div>
                  <div class="d-flex flex-column mb-2">
                    ${htmlMembrosTrio}
                  </div>
                  <div class="fs-label text-muted fst-italic">
                    <i class="bi bi-info-circle me-1"></i> Combine a divisão de tarefas com seus colegas de trio via e-mail ou WhatsApp.
                  </div>
                </div>
              </div>

              <!-- COLUNA 2: ENTREGÁVEL DA FRENTE (ETAPA 2) -->
              <div class="col-lg-5">
                <div class="p-3 rounded-2 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color);">
                  <div class="fs-caption fw-bold text-heading text-uppercase mb-1">
                    <i class="fa-solid fa-list-check text-primary me-1"></i> O que sua Frente Deve Entregar (Etapa 2)
                  </div>
                  <div class="fw-bold text-primary fs-small mb-2">${escapeHtml(detalhes.entregavelEtapa2)}</div>
                  <ul class="list-unstyled fs-caption text-muted mb-2">
                    ${htmlChecklist}
                  </ul>
                  <div class="p-2 rounded mt-2" style="background: var(--bg-card); border-left: 3px solid var(--accent-amber);">
                    <div class="fs-label fw-bold text-heading"><i class="bi bi-calendar-check text-warning me-1"></i> Cronograma de Execução:</div>
                    <div class="fs-label text-muted">Semanas 1 e 2: Moodle | Semana 3: Ensaio no Lab | Ministração: <strong>26/11/2026</strong></div>
                  </div>
                </div>
              </div>

              <!-- COLUNA 3: STATUS DA ENTREGA & BOTÃO DE REGISTRO -->
              <div class="col-lg-3">
                <div class="p-3 rounded-2 h-100 d-flex flex-column justify-content-between" style="background: var(--bg-card-hover); border: 1px solid var(--border-color);">
                  <div>
                    <div class="fs-caption fw-bold text-heading text-uppercase mb-2">
                      <i class="bi bi-award-fill text-warning me-1"></i> Status da Frente
                    </div>
                    ${temEntrega ? `
                      <div class="mb-2">
                        <span class="badge bg-success px-2 py-1 w-100 mb-2">
                          <i class="bi bi-check-circle-fill me-1"></i> Material da Frente Entregue!
                        </span>
                        <a href="${escapeHtml(linkEntrega)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-success w-100 fw-bold mb-2">
                          <i class="bi bi-box-arrow-up-right me-1"></i> Abrir Material Entregue
                        </a>
                      </div>
                    ` : `
                      <div class="mb-2">
                        <span class="badge bg-warning text-dark px-2 py-1 w-100 mb-2">
                          <i class="bi bi-clock-history me-1"></i> Entrega Pendente (Etapa 2)
                        </span>
                        <p class="fs-label text-muted mb-2">
                          Após publicar o material na sala do Moodle (ou GitHub), informe o link abaixo:
                        </p>
                      </div>
                    `}
                  </div>
                  <div>
                    <button type="button" onclick="editarLinkEntregaSNCT('${frenteEncontrada.id}')" class="btn btn-sm ${temEntrega ? 'btn-outline-secondary' : 'btn-success'} w-100 fw-bold py-2 shadow-sm">
                      <i class="bi bi-link-45deg me-1"></i> ${temEntrega ? 'Atualizar Link do Material' : 'Entregar Link do Material'}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        `;
        containers.forEach(c => { c.innerHTML = cardHtml; });
        return;
      }

      // Caso 2B: Estudante está logado, mas NÃO está em nenhuma frente
      if (alunoId || usuario) {
        const nomeEstudante = usuario && usuario.nome ? usuario.nome.split(' ')[0] : 'Estudante';
        const htmlSemFrente = `
          <div class="p-3 rounded-3 mb-3" style="background: rgba(245, 158, 11, 0.08); border: 1px solid var(--accent-amber); border-left: 5px solid var(--accent-amber); box-shadow: var(--shadow-sm);">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <div class="fw-bold text-heading fs-6"><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Atenção, ${escapeHtml(nomeEstudante)}: você ainda não escolheu sua frente na SNCT 2026!</div>
                <p class="fs-caption text-muted mb-0">Cada estudante deve integrar um trio em uma das 4 frentes do <strong>Curso 1</strong> ou <strong>Curso 2</strong> para a ministração da oficina presencial em <strong>26/11</strong> (Instrumento A2 — 20%).</p>
              </div>
              <button type="button" onclick="showTab('tab-extensao')" class="btn btn-sm btn-warning fw-bold text-dark">
                <i class="bi bi-hand-index-thumb me-1"></i> Escolher Minha Frente Agora
              </button>
            </div>
          </div>
        `;
        containers.forEach(c => { c.innerHTML = htmlSemFrente; });
        return;
      }

      // Caso 3: Visitante / Estudante não identificado
      const htmlDeslogado = `
        <div class="p-3 rounded-3 mb-3" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-left: 5px solid var(--accent-blue); box-shadow: var(--shadow-sm);">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <div class="fw-bold text-heading fs-small"><i class="bi bi-person-badge text-primary me-2"></i>Área do Estudante: Veja sua Frente, Trio e Entregáveis da SNCT 2026</div>
              <p class="fs-caption text-muted mb-0">Identifique-se com sua conta Google institucional para visualizar em qual curso e frente você está escalado(a), quem são seus colegas de equipe e o link direto para a sua sala no Moodle.</p>
            </div>
            <button type="button" onclick="iniciarLoginGoogle()" class="btn btn-sm btn-outline-primary fw-bold">
              <i class="bi bi-google me-1"></i> Identificar-me como Estudante
            </button>
          </div>
        </div>
      `;
      containers.forEach(c => { c.innerHTML = htmlDeslogado; });
    }

    function renderizarMuralComunicadosDocente() {
      const fixadas = demandasApp.filter(d => !d.concluida && (d.fixadaMural || d.id.startsWith('DEM-SNCT-')));
      const htmlMural = fixadas.length === 0 ? '' : `
        <div class="p-3 rounded-3" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-left: 5px solid var(--accent-amber);">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-warning text-dark"><i class="fa-solid fa-bullhorn me-1"></i> MURAL DO PROFESSOR — DEMANDAS &amp; ORIENTAÇÕES DA SEMANA</span>
              <span class="fs-caption text-muted">Atividades independentes para Curso 1 e Curso 2</span>
            </div>
            <button type="button" onclick="showTab('tab-docente')" class="btn btn-sm btn-outline-secondary py-0 px-2 fs-caption docente-only">
              <i class="fa-solid fa-sliders me-1"></i> Gerenciar na Área Docente
            </button>
          </div>
          <div class="row g-2">
            ${fixadas.slice(0, 4).map(d => {
              const st = calcularStatusPrazo(d.prazo, d.concluida, d.horaPrazo);
              const corBorda = d.cursoSnctAlvo === 1 ? 'var(--accent-blue)' : (d.cursoSnctAlvo === 2 ? 'var(--accent-emerald)' : 'var(--accent-amber)');
              return `
                <div class="col-md-4">
                  <div class="p-2 rounded h-100 d-flex flex-column justify-content-between" style="background: var(--bg-card); border: 1px solid var(--border-color); border-top: 3px solid ${corBorda};">
                    <div>
                      <div class="d-flex justify-content-between align-items-center gap-1 mb-1">
                        <span class="badge font-code" style="background: var(--bg-card-hover); color: var(--text-main); border: 1px solid var(--border-color);">${escapeHtml(d.id)}</span>
                        <span class="badge-pill ${st.classe} small">${st.texto}</span>
                      </div>
                      <div class="fw-bold text-heading fs-small mb-1">${escapeHtml(d.titulo)}</div>
                      <p class="fs-caption text-muted mb-2">${escapeHtml(d.descricao)}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-1 pt-1 border-top">
                      <span class="fs-label text-muted"><i class="bi bi-people me-1"></i>${escapeHtml(d.destinatario || rotuloAtribuicao(d))}</span>
                      <div class="d-flex gap-1">
                        ${d.linkApoio ? `
                          <a href="${escapeHtml(d.id === 'DEM-SNCT-C1' ? 'https://moodle.ifsc.edu.br/course/view.php?id=2663' : (d.id === 'DEM-SNCT-C2' ? 'https://moodle.ifsc.edu.br/course/view.php?id=2664' : d.linkApoio))}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary py-0 px-2 fs-label">
                            <i class="bi ${d.linkApoio.includes('moodle') || d.id.includes('DEM-SNCT-C') ? 'bi-mortarboard-fill' : (d.linkApoio.endsWith('.pdf') ? 'bi-file-earmark-pdf' : 'bi-box-arrow-up-right')} me-1"></i>${d.linkApoio.includes('moodle') || d.id.includes('DEM-SNCT-C') ? 'Moodle' : (d.linkApoio.endsWith('.pdf') ? 'Guia PDF' : 'Recurso')}
                          </a>
                        ` : ''}
                        <button type="button" onclick="showTab('tab-demandas')" class="btn btn-sm btn-link p-0 fs-label">Ver entrega</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      const elDem = document.getElementById('muralComunicadosDemandas');
      const elRot = document.getElementById('muralComunicadosTopoRoteiros');
      if (elDem) elDem.innerHTML = htmlMural;
      if (elRot) elRot.innerHTML = htmlMural;
    }

    function aoMudarTargetComunicadoDocente() {
      const tipo = document.getElementById('docenteTargetTipo').value;
      const wrap = document.getElementById('wrapDocenteTargetDetalhe');
      const label = document.getElementById('labelDocenteTargetDetalhe');
      const select = document.getElementById('docenteTargetDetalhe');
      if (!wrap || !select) return;

      if (tipo === 'frente_snct') {
        wrap.classList.remove('d-none');
        label.textContent = 'Selecione a Frente SNCT:';
        select.innerHTML = demandasSnctApp.map(f =>
          `<option value="${escapeHtml(f.id)}">Curso ${f.cursoId} — ${escapeHtml(f.titulo)}</option>`
        ).join('');
      } else if (tipo === 'equipe_projeto') {
        wrap.classList.remove('d-none');
        label.textContent = 'Selecione o Grupo:';
        select.innerHTML = EQUIPES_PROGWEB2.map(eq =>
          `<option value="${escapeHtml(eq)}">${escapeHtml(eq)}</option>`
        ).join('');
      } else if (tipo === 'aluno_individual') {
        wrap.classList.remove('d-none');
        label.textContent = 'Selecione o(a) Estudante:';
        select.innerHTML = alunosApp.filter(a => a.ativo).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(a =>
          `<option value="${escapeHtml(a.id)}">${escapeHtml(a.nome)} (${escapeHtml(a.matricula || '')})</option>`
        ).join('');
      } else {
        wrap.classList.add('d-none');
      }
    }

    async function publicarComunicadoDemandaDocente(event, modoEnvio = 'painel') {
      if (event) event.preventDefault();
      const targetTipo = document.getElementById('docenteTargetTipo').value;
      const targetDetalhe = document.getElementById('docenteTargetDetalhe') ? document.getElementById('docenteTargetDetalhe').value : '';
      const instrumento = document.getElementById('docenteInstrumento').value;
      const prazo = document.getElementById('docentePrazoData').value;
      const horaPrazo = document.getElementById('docentePrazoHora').value || '23:59';
      const titulo = document.getElementById('docenteTitulo').value.trim();
      const linkApoio = document.getElementById('docenteLinkApoio').value.trim();
      const descricao = document.getElementById('docenteMensagem').value.trim();
      const criterios = document.getElementById('docenteCriterios').value.split('\n').map(c => c.trim()).filter(Boolean);
      const fixadaMural = document.getElementById('docenteFixarMural').checked;

      if (!titulo || !descricao || !prazo) {
        showToast('Campos obrigatórios', 'Preencha título, prazo e mensagem para publicar a demanda.', 'fa-solid fa-circle-exclamation text-warning');
        return;
      }

      let tipoAtribuicao = 'turma';
      let equipesAlvo = [];
      let alunosAlvo = [];
      let cursoSnctAlvo = null;
      let destinatarioRotulo = 'Todos';

      if (targetTipo === 'curso1') {
        cursoSnctAlvo = 1;
        destinatarioRotulo = 'Equipes do Curso 1 SNCT (Meu Primeiro Site no Ar)';
      } else if (targetTipo === 'curso2') {
        cursoSnctAlvo = 2;
        destinatarioRotulo = 'Equipes do Curso 2 SNCT (Painel Verde)';
      } else if (targetTipo === 'pendentes_snct') {
        tipoAtribuicao = 'individual';
        const inscritos = new Set();
        demandasSnctApp.forEach(f => (f.membros || []).forEach(m => { if (m.alunoId) inscritos.add(String(m.alunoId)); }));
        alunosAlvo = alunosApp.filter(a => a.ativo && !inscritos.has(String(a.id))).map(a => String(a.id));
        destinatarioRotulo = `Pendentes de Candidatura SNCT (${alunosAlvo.length} estudantes)`;
      } else if (targetTipo === 'frente_snct') {
        const frente = demandasSnctApp.find(f => f.id === targetDetalhe);
        tipoAtribuicao = 'individual';
        alunosAlvo = frente ? (frente.membros || []).map(m => String(m.alunoId)).filter(Boolean) : [];
        destinatarioRotulo = frente ? `Curso ${frente.cursoId} · ${frente.titulo}` : 'Frente SNCT';
      } else if (targetTipo === 'equipe_projeto') {
        tipoAtribuicao = 'equipes';
        equipesAlvo = [targetDetalhe];
        destinatarioRotulo = targetDetalhe;
      } else if (targetTipo === 'aluno_individual') {
        tipoAtribuicao = 'individual';
        alunosAlvo = [String(targetDetalhe)];
        const al = alunosApp.find(a => String(a.id) === String(targetDetalhe));
        destinatarioRotulo = al ? al.nome : '1 estudante';
      }

      const codigo = 'DEM-' + (demandasApp.length + 1).toString().padStart(2, '0');
      const instrumentoNome = instrumento === 'A1' ? 'A1 (Avaliação Teórica • 20%)' :
        (instrumento === 'A2' ? 'A2 (Curso SNCT • 20%)' :
        (instrumento === 'A3' ? 'A3 (Vitrine Flask • 35%)' : 'A4 (Demais Entregas • 25%)'));

      const novaDemanda = {
        id: codigo,
        titulo,
        instrumento,
        instrumentoNome,
        destinatario: destinatarioRotulo,
        tipoAtribuicao,
        equipesAlvo,
        alunosAlvo,
        cursoSnctAlvo,
        fixadaMural,
        linkApoio,
        prazo,
        horaPrazo,
        entregas: {},
        pontos: 10.0,
        concluida: false,
        descricao,
        criterios: criterios.length > 0 ? criterios : ['Confirmar execução e registrar link de entrega no painel']
      };

      demandasApp.unshift(novaDemanda);
      salvarDadosDemandas();
      renderizarDemandas();
      renderizarAreaDocente();
      popularSelectsDeDemanda();

      const emailsAlvo = [...new Set(obterAlvosDemanda(novaDemanda).flatMap(a => a.emails))];
      const deveNotificar = modoEnvio === 'apps_script_email';

      document.getElementById('docenteTitulo').value = '';
      document.getElementById('docenteMensagem').value = '';

      showToast(
        deveNotificar ? 'Publicando & Enviando E-mail HTML...' : 'Gravando na Planilha...',
        `Sincronizando ${codigo} (${destinatarioRotulo}) com a planilha Google Sheets...`,
        'fa-solid fa-cloud-arrow-up text-primary'
      );

      try {
        const res = await chamarApiAppsScript('criarDemanda', {
          id: codigo,
          projeto: tipoAtribuicao === 'turma' && !cursoSnctAlvo ? '*' : destinatarioRotulo,
          titulo,
          descricao,
          prazo,
          horaPrazo,
          pontos: '10,0',
          criterios: novaDemanda.criterios,
          instrumento,
          tipoAtribuicao,
          equipesAlvo,
          alunosAlvo,
          cursoSnctAlvo,
          fixadaMural,
          linkApoio,
          notificarEmail: deveNotificar,
          destinatariosEmails: emailsAlvo
        });

        if (deveNotificar) {
          showToast(
            'Demanda Publicada & E-mail Disparado!',
            `Demanda ${codigo} gravada na planilha e enviada em HTML (padrão PI-1/PI-2) para ${res.totalEnviados || emailsAlvo.length} estudante(s)!`,
            'fa-solid fa-paper-plane text-success'
          );
        } else {
          showToast('Publicado na Planilha!', `Demanda ${codigo} salva na aba Demandas para ${destinatarioRotulo}.`);
        }
      } catch (e) {
        showToast('Demanda Publicada Localmente', `Demanda ${codigo} salva no painel (${e.message || e}).`, 'fa-solid fa-triangle-exclamation text-warning');
      }
    }

    function alocarAlunoEmFrenteDocente(frenteId, selectEl) {
      const alunoId = selectEl.value;
      if (!alunoId) return;
      const aluno = alunosApp.find(a => String(a.id) === String(alunoId));
      const frente = demandasSnctApp.find(f => f.id === frenteId);
      if (!aluno || !frente) return;

      if (!Array.isArray(frente.membros)) frente.membros = [];
      if (frente.membros.length >= (frente.vagasMax || 3)) {
        showToast('Frente completa', 'Esta frente já possui 3 integrantes.', 'bi bi-exclamation-octagon text-danger');
        selectEl.value = '';
        return;
      }

      // Remove de outra frente caso já estivesse inscrito
      demandasSnctApp.forEach(d => {
        if (Array.isArray(d.membros)) {
          d.membros = d.membros.filter(m => String(m.alunoId) !== String(aluno.id) && (!m.matricula || String(m.matricula) !== String(aluno.matricula)));
        }
      });

      frente.membros.push({
        alunoId: String(aluno.id),
        nome: aluno.nome,
        matricula: aluno.matricula || '',
        email: aluno.email || '',
        linkEntrega: '',
        dataInscricao: new Date().toISOString()
      });

      salvarDemandasSNCT();
      renderizarQuadroDemandasSNCT();
      renderizarAreaDocente();

      chamarApiAppsScript('candidatar_frente_snct', {
        frenteId: frente.id,
        frenteTitulo: `${frente.cursoNome} - ${frente.titulo}`,
        alunoId: String(aluno.id),
        alunoNome: aluno.nome,
        matricula: aluno.matricula || '',
        email: aluno.email || ''
      }).then(() => {
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn('Aviso ao alocar estudante no Apps Script:', e);
      });
      showToast('Estudante Alocado', `${aluno.nome} foi alocado(a) em ${frente.titulo} (Curso ${frente.cursoId}).`);
    }

    function prepararDemandaParaAlvoDocente(tipo, valor) {
      showTab('tab-docente', false);
      const selTipo = document.getElementById('docenteTargetTipo');
      if (selTipo) {
        selTipo.value = tipo;
        aoMudarTargetComunicadoDocente();
        const selDet = document.getElementById('docenteTargetDetalhe');
        if (selDet && valor) selDet.value = valor;
      }
      const form = document.getElementById('formComunicadoDocente');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const inputTit = document.getElementById('docenteTitulo');
      if (inputTit) inputTit.focus();
    }

    function renderizarAreaDocente() {
      renderizarMuralComunicadosDocente();
      const kpiContainer = document.getElementById('docenteKpisContainer');
      const cursosContainer = document.getElementById('docentePainelCursosSeparados');
      const tabelaContainer = document.getElementById('docenteTabelaRaioXAlunos');
      if (!kpiContainer || !cursosContainer || !tabelaContainer) return;

      const frentesC1 = demandasSnctApp.filter(f => f.cursoId === 1);
      const frentesC2 = demandasSnctApp.filter(f => f.cursoId === 2);
      const vagasC1 = frentesC1.reduce((acc, f) => acc + (f.membros || []).length, 0);
      const vagasC2 = frentesC2.reduce((acc, f) => acc + (f.membros || []).length, 0);
      const linksC1 = frentesC1.filter(f => (f.membros || []).some(m => m.linkEntrega && m.linkEntrega.trim())).length;
      const linksC2 = frentesC2.filter(f => (f.membros || []).some(m => m.linkEntrega && m.linkEntrega.trim())).length;

      const mapaAlunoFrente = new Map();
      demandasSnctApp.forEach(f => {
        (f.membros || []).forEach(m => {
          const al = alunosApp.find(a =>
            String(a.id) === String(m.alunoId) ||
            (m.matricula && String(a.matricula) === String(m.matricula))
          );
          if (al) mapaAlunoFrente.set(String(al.id), f);
        });
      });

      const ativos = alunosApp.filter(a => a.ativo);
      const semFrente = ativos.filter(a => !mapaAlunoFrente.has(String(a.id)));
      const demandasAtivas = demandasApp.filter(d => !d.concluida);

      kpiContainer.innerHTML = `
        <div class="col-md-3">
          <div class="p-3 rounded-3 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-blue);">
            <div class="fs-label fw-bold text-muted text-uppercase">Curso 1 — Meu 1º Site no Ar</div>
            <div class="fs-4 fw-bold font-outfit text-heading mt-1">${vagasC1} / 12 escalados</div>
            <div class="fs-caption text-muted">${linksC1} / 4 frentes com link entregue</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 rounded-3 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-emerald);">
            <div class="fs-label fw-bold text-muted text-uppercase">Curso 2 — Painel Verde</div>
            <div class="fs-4 fw-bold font-outfit text-heading mt-1">${vagasC2} / 12 escalados</div>
            <div class="fs-caption text-muted">${linksC2} / 4 frentes com link entregue</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 rounded-3 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-rose);">
            <div class="fs-label fw-bold text-muted text-uppercase">Sem Candidatura (Prazo 27/10)</div>
            <div class="fs-4 fw-bold font-outfit ${semFrente.length > 0 ? 'text-danger' : 'text-success'} mt-1">${semFrente.length} estudante(s)</div>
            <div class="fs-caption text-muted">Aloque abaixo ou cobre em 1 clique</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 rounded-3 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-top: 4px solid var(--accent-amber);">
            <div class="fs-label fw-bold text-muted text-uppercase">Demandas &amp; Comunicados Ativos</div>
            <div class="fs-4 fw-bold font-outfit text-heading mt-1">${demandasAtivas.length} ativa(s)</div>
            <div class="fs-caption text-muted">${votosOficinasApp.length} votos registrados na enquete</div>
          </div>
        </div>
      `;

      const ehDocente = document.body.classList.contains('modo-docente-ativo');

      const renderColunaCursoAdmin = (cursoId, tituloCurso, subtituloKit, cor) => {
        const frentes = demandasSnctApp.filter(f => f.cursoId === cursoId);
        const moodleUrl = cursoId === 1 ? 'https://moodle.ifsc.edu.br/course/view.php?id=2663' : 'https://moodle.ifsc.edu.br/course/view.php?id=2664';
        return `
          <div class="col-lg-6">
            <div class="p-3 rounded-3 h-100" style="background: var(--bg-card-hover); border: 1px solid var(--border-color); border-top: 4px solid ${cor};">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <div>
                  <span class="badge ${cursoId === 1 ? 'bg-info text-dark' : 'bg-success text-white'} font-mono">CURSO ${cursoId} (12 VAGAS)</span>
                  <h4 class="font-outfit fs-6 fw-bold text-heading mt-1 mb-0">${escapeHtml(tituloCurso)}</h4>
                  <div class="fs-caption text-muted">${escapeHtml(subtituloKit)}</div>
                </div>
                <div class="d-flex align-items-center gap-1 flex-wrap">
                  <a href="${moodleUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-success py-1 px-2 fs-caption fw-bold" title="Abrir Sala do Moodle">
                    <i class="bi bi-mortarboard-fill me-1"></i> Moodle (id=${cursoId === 1 ? '2663' : '2664'}) <i class="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                  <button type="button" class="btn btn-sm btn-outline-primary py-1 px-2 fs-caption docente-only"
                          onclick="prepararDemandaParaAlvoDocente('curso${cursoId}', '')">
                    <i class="fa-solid fa-bullhorn me-1"></i> Comunicar ao Curso ${cursoId}
                  </button>
                </div>
              </div>

              <div class="d-flex flex-column gap-2 mt-2">
                ${frentes.map(f => {
                  const membros = f.membros || [];
                  const link = (membros.find(m => m.linkEntrega && m.linkEntrega.trim()) || {}).linkEntrega || '';
                  const opcoesAlunos = semFrente.map(a => `<option value="${escapeHtml(a.id)}">+ Alocar: ${escapeHtml(a.nome)}</option>`).join('');
                  const souMembro = usuarioLogadoGoogle && (
                    (usuarioLogadoGoogle.alunoId && membros.some(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId))) ||
                    (usuarioLogadoGoogle.matricula && membros.some(m => String(m.matricula) === String(usuarioLogadoGoogle.matricula)))
                  );
                  return `
                    <div class="p-2 rounded" style="background: var(--bg-card); border: 1px solid var(--border-color);">
                      <div class="d-flex justify-content-between align-items-center flex-wrap gap-1 mb-1">
                        <div class="fw-bold text-heading fs-small">
                          <i class="bi ${f.icone} text-primary me-1"></i>${escapeHtml(f.titulo)}
                          <span class="badge bg-secondary-subtle text-secondary ms-1">${membros.length}/3</span>
                        </div>
                        <div class="d-flex align-items-center gap-1">
                          <a href="${escapeHtml(f.roteiroPdf || '#')}" target="_blank" class="btn btn-sm btn-outline-secondary py-0 px-2 fs-label">PDF</a>
                          <button type="button" class="btn btn-sm btn-outline-primary py-0 px-2 fs-label docente-only"
                                  onclick="prepararDemandaParaAlvoDocente('frente_snct', '${f.id}')">
                            <i class="bi bi-send"></i> Demanda p/ Frente
                          </button>
                        </div>
                      </div>
                      <div class="d-flex flex-wrap gap-1 mb-1">
                        ${membros.length > 0 ? membros.map(m => `
                          <span class="alvo-chip entregue">
                            <i class="bi bi-person-check-fill"></i> ${escapeHtml(m.nome)}
                            ${ehDocente ? `
                              <button type="button" class="btn btn-link btn-sm text-danger p-0 ms-1" title="Remover da frente"
                                      onclick="desistirCandidaturaSNCT('${f.id}', '${m.alunoId}')"><i class="bi bi-x"></i></button>
                            ` : ''}
                          </span>
                        `).join('') : '<span class="fs-caption text-danger">Nenhum integrante escalado ainda.</span>'}
                      </div>
                      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-1 pt-1 border-top">
                        <div class="fs-caption d-flex align-items-center gap-2 flex-wrap">
                          ${link ? `<a href="${escapeHtml(link)}" target="_blank" class="text-success fw-bold"><i class="bi bi-link-45deg"></i> Abrir Entrega</a>` : '<span class="text-muted">Sem link de entrega</span>'}
                          ${souMembro ? `
                            <button type="button" class="btn btn-sm btn-outline-success py-0 px-2 fs-label"
                                    onclick="editarLinkEntregaSNCT('${f.id}')">
                              <i class="bi bi-pencil-square me-1"></i> ${link ? 'Alterar Link da Frente' : 'Entregar Link'}
                            </button>
                          ` : ''}
                        </div>
                        ${ehDocente ? (
                          membros.length < 3 ? `
                            <select class="form-select form-select-sm py-0 docente-only" style="max-width: 210px; font-size: 12px;"
                                    onchange="alocarAlunoEmFrenteDocente('${f.id}', this)">
                              <option value="">+ Alocar estudante manualmente...</option>
                              ${opcoesAlunos}
                            </select>
                          ` : '<span class="badge bg-success-subtle text-success fs-label">Trio Completo</span>'
                        ) : (
                          membros.length >= 3 ? '<span class="badge bg-success-subtle text-success fs-label">Trio Completo</span>' : '<span class="badge bg-secondary-subtle text-muted fs-label">Vaga(s) Disponível(is)</span>'
                        )}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
      };

      cursosContainer.innerHTML =
        renderColunaCursoAdmin(1, 'Meu Primeiro Site no Ar (HTML, CSS & GitHub Pages)', 'Sala Moodle Curso 1 · Pacote: starter-kit-snct.zip', 'var(--accent-blue)') +
        renderColunaCursoAdmin(2, 'Painel Verde: Coleta Seletiva & Ecopontos de Garopaba', 'Sala Moodle Curso 2 · Pacote: starter-kit-painel-verde.zip', 'var(--accent-emerald)');

      const termo = (document.getElementById('buscaRaioXDocente') ? document.getElementById('buscaRaioXDocente').value : '').toLowerCase().trim();
      const alunosFiltrados = ativos
        .filter(a => !termo || (a.nome + ' ' + (a.matricula || '') + ' ' + (a.email || '')).toLowerCase().includes(termo))
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

      tabelaContainer.innerHTML = `
        <table class="table table-sm align-middle" style="background: var(--bg-card); border: 1px solid var(--border-color);">
          <thead>
            <tr class="fs-caption text-muted">
              <th>Estudante / Matrícula</th>
              <th>Curso &amp; Frente na SNCT</th>
              <th>Link SNCT / Moodle</th>
              <th>Demandas Entregues</th>
              <th class="text-end docente-only">Ação Direta Docente</th>
            </tr>
          </thead>
          <tbody>
            ${alunosFiltrados.map(a => {
              const f = mapaAlunoFrente.get(String(a.id));
              const m = f ? (f.membros || []).find(item => String(item.alunoId) === String(a.id) || String(item.matricula) === String(a.matricula)) : null;
              const linkFrente = f ? ((f.membros || []).find(x => x.linkEntrega && x.linkEntrega.trim()) || {}).linkEntrega : '';
              const demandasDoAluno = demandasAtivas.filter(d => demandaAtribuidaAoAluno(d, a));
              const entreguesAluno = demandasDoAluno.filter(d => {
                const ch = chaveDoAlunoNaDemanda(d, a);
                return ch && obterEntregaAlvo(d, ch).entregue;
              }).length;

              return `
                <tr class="fs-caption">
                  <td>
                    <div class="fw-bold text-heading">${escapeHtml(a.nome)}</div>
                    <div class="text-muted font-code">${escapeHtml(a.matricula || '')} · ${escapeHtml(a.email || '')}</div>
                  </td>
                  <td>
                    ${f ? `
                      <span class="badge ${f.cursoId === 1 ? 'bg-info text-dark' : 'bg-success text-white'} me-1">Curso ${f.cursoId}</span>
                      <span class="fw-semibold text-heading">${escapeHtml(f.titulo)}</span>
                    ` : '<span class="badge bg-danger-subtle text-danger">Pendente de candidatura</span>'}
                  </td>
                  <td>
                    ${linkFrente ? `<a href="${escapeHtml(linkFrente)}" target="_blank" class="text-success fw-bold"><i class="bi bi-box-arrow-up-right me-1"></i>Abrir Link</a>` : '<span class="text-muted">Pendente</span>'}
                  </td>
                  <td>
                    <span class="fw-bold ${entreguesAluno === demandasDoAluno.length && demandasDoAluno.length > 0 ? 'text-success' : 'text-warning-emphasis'}">
                      ${entreguesAluno} / ${demandasDoAluno.length}
                    </span>
                  </td>
                  <td class="text-end docente-only">
                    <button type="button" class="btn btn-sm btn-outline-primary py-0 px-2 fs-label"
                            onclick="prepararDemandaParaAlvoDocente('aluno_individual', '${escapeHtml(a.id)}')">
                      <i class="fa-solid fa-paper-plane me-1"></i> Demanda / Recado Individual
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    function renderizarPainelNominalCandidaturasSNCT() {
      const box = document.getElementById('painelNominalCandidaturasSNCT');
      const contadorEl = document.getElementById('contadorPrazoCandidaturaSNCT');
      if (contadorEl) {
        const status = calcularStatusPrazo('2026-10-27', false, '23:59');
        contadorEl.innerHTML = status.texto;
      }
      if (!box) return;

      const mapaInscritos = new Map();
      demandasSnctApp.forEach(frente => {
        (frente.membros || []).forEach(m => {
          const al = alunosApp.find(a =>
            String(a.id) === String(m.alunoId) ||
            (m.matricula && String(a.matricula) === String(m.matricula)) ||
            (m.email && a.email && a.email.toLowerCase() === m.email.toLowerCase())
          );
          const idChave = al ? String(al.id) : String(m.alunoId || m.matricula || m.nome);
          mapaInscritos.set(idChave, {
            nome: al ? al.nome : m.nome,
            frenteTitulo: `${frente.cursoId === 1 ? 'C1' : 'C2'} · ${frente.titulo}`
          });
        });
      });

      const ativos = alunosApp.filter(a => a.ativo);
      const pendentes = ativos.filter(a => !mapaInscritos.has(String(a.id)));
      const confirmados = ativos.filter(a => mapaInscritos.has(String(a.id)));

      box.innerHTML = `
        <details class="alvos-details">
          <summary class="fs-caption fw-bold text-heading">
            <i class="bi bi-clipboard2-check text-primary me-1"></i>
            Acompanhamento Nominal de Candidaturas: <span class="text-success">${confirmados.length} confirmada(s)</span> ·
            <span class="${pendentes.length > 0 ? 'text-danger' : 'text-success'}">${pendentes.length} pendente(s)</span>
            (clique para expandir)
          </summary>
          <div class="mt-2 p-2 rounded" style="background: var(--bg-card); border: 1px solid var(--border-color);">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <span class="fs-caption text-muted">Verifique se seu nome já consta como escalado em uma frente até <strong>27/10 às 23:59</strong>:</span>
              <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 fs-caption docente-only"
                      onclick="cobrarCandidaturasPendentesEmail()">
                <i class="bi bi-envelope-exclamation me-1"></i> Cobrar ${pendentes.length} Pendente(s) por E-mail
              </button>
            </div>
            <div class="alvos-chips">
              ${confirmados.map(a => {
                const info = mapaInscritos.get(String(a.id));
                return `<span class="alvo-chip entregue" title="${escapeHtml(info.frenteTitulo)}">
                  <i class="bi bi-check-circle-fill"></i> ${escapeHtml(a.nome)} <strong class="ms-1">(${escapeHtml(info.frenteTitulo)})</strong>
                </span>`;
              }).join('')}
              ${pendentes.map(a => `
                <span class="alvo-chip pendente-vencida" title="Ainda não se candidatou em nenhuma frente">
                  <i class="bi bi-exclamation-circle"></i> ${escapeHtml(a.nome)}
                </span>
              `).join('')}
            </div>
          </div>
        </details>
      `;
    }

    async function cobrarCandidaturasPendentesEmail() {
      const inscritosIds = new Set();
      demandasSnctApp.forEach(f => (f.membros || []).forEach(m => {
        if (m.alunoId) inscritosIds.add(String(m.alunoId));
      }));
      const pendentes = alunosApp.filter(a => a.ativo && !inscritosIds.has(String(a.id)) && a.email);
      const emails = pendentes.map(a => a.email.trim());
      if (emails.length === 0) {
        showToast('Todos inscritos!', 'Todos os estudantes ativos já escolheram uma frente.', 'bi bi-check-circle text-success');
        return;
      }
      if (!confirm(`Deseja disparar um lembrete automático por e-mail HTML (via Planilha / GmailApp) para os ${emails.length} estudante(s) que ainda não escolheram uma frente da SNCT?`)) {
        return;
      }

      showToast('Disparando Lembrete SNCT...', `Enviando e-mail HTML via Planilha para ${emails.length} estudante(s)...`, 'bi bi-envelope-paper text-warning');
      try {
        const res = await chamarApiAppsScript('enviar_comunicado_html', {
          tipo: 'lembrete',
          id: 'DEM-SNCT-01',
          titulo: 'Prazo Final (27/10 às 23:59): Escolha sua Frente de Trabalho da SNCT (Curso 1 ou Curso 2)',
          escopoTxt: `Estudantes Pendentes de Candidatura SNCT (${emails.length})`,
          prazo: '2026-10-27',
          horaPrazo: '23:59',
          pontos: '10,0',
          criterios: '1. Acessar o Portal de ProgWeb 2 e conectar-se com seu e-mail institucional\n2. Confirmar vaga em 1 das 8 frentes (4 do Curso 1 ou 4 do Curso 2)\n3. Baixar o Roteiro Operacional em PDF da sua frente e iniciar a etapa no Moodle',
          descricao: 'Lembrete automático: como nesta semana o professor não estará presencialmente em sala, todas as orientações, divisão entre Curso 1 (Meu 1º Site no Ar) e Curso 2 (Painel Verde) e os 4 roteiros em PDF estão disponíveis no portal.',
          mensagem: 'Ainda não identificamos sua candidatura em nenhuma das 8 frentes da SNCT 2026. Escolha sua frente até 27/10 às 23:59 para garantir sua equipe!',
          emails
        });
        showToast(
          'Cobrança Enviada por E-mail!',
          `Lembrete HTML enviado automaticamente pela planilha para ${res.totalEnviados || emails.length} estudante(s) pendente(s)!`,
          'fa-solid fa-paper-plane text-success'
        );
      } catch (err) {
        showToast('Erro no Disparo Automático', err.message || String(err), 'fa-solid fa-triangle-exclamation text-danger');
      }
    }

    function candidatarEstudanteSNCT(demandaId) {
      if (!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId) {
        showToast(
          "Autenticação Necessária",
          "Conecte-se com sua conta Google para registrar sua candidatura na frente de trabalho.",
          "bi bi-google text-primary"
        );
        iniciarLoginGoogle();
        return;
      }

      const frente = demandasSnctApp.find(d => d.id === demandaId);
      if (!frente) return;

      if (!Array.isArray(frente.membros)) frente.membros = [];

      // Verifica se já está nesta frente
      const jaEstaAqui = frente.membros.some(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));
      if (jaEstaAqui) {
        showToast("Você já está nesta frente", "Sua vaga já está garantida nesta equipe de trabalho.", "bi bi-info-circle text-primary");
        return;
      }

      // Verifica se a frente está cheia
      if (frente.membros.length >= (frente.vagasMax || 3)) {
        showToast("Vagas Esgotadas", "Esta frente já atingiu o limite de 3 estudantes.", "bi bi-exclamation-octagon text-danger");
        return;
      }

      // Verifica se já está em outra frente
      let frenteAnterior = null;
      demandasSnctApp.forEach(d => {
        if (d.id !== demandaId && Array.isArray(d.membros)) {
          const achou = d.membros.find(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));
          if (achou) frenteAnterior = d;
        }
      });

      if (frenteAnterior) {
        const migrar = confirm(`Você já está escalado(a) na frente "${frenteAnterior.titulo}". Deseja migrar para "${frente.titulo}"? Sua vaga anterior será liberada para um colega.`);
        if (!migrar) return;

        // Remove da anterior
        frenteAnterior.membros = frenteAnterior.membros.filter(m => String(m.alunoId) !== String(usuarioLogadoGoogle.alunoId) && (!m.matricula || String(m.matricula) !== String(usuarioLogadoGoogle.matricula)));
      }

      // Adiciona na nova frente
      frente.membros.push({
        alunoId: String(usuarioLogadoGoogle.alunoId),
        nome: usuarioLogadoGoogle.nome,
        matricula: usuarioLogadoGoogle.matricula || '',
        email: usuarioLogadoGoogle.email,
        linkEntrega: '',
        dataInscricao: new Date().toISOString()
      });

      salvarDemandasSNCT();
      renderizarQuadroDemandasSNCT();
      renderizarCardHeroRoteirosSNCT();

      showToast(
        "Candidatura Confirmada!",
        `Você assumiu uma vaga na frente: ${frente.titulo}! Sincronizando com a planilha...`,
        "bi bi-check-circle-fill text-success"
      );

      // Sincronização assíncrona com backend Google Apps Script
      chamarApiAppsScript('candidatar_frente_snct', {
        frenteId: frente.id,
        frenteTitulo: `${frente.cursoNome} - ${frente.titulo}`,
        alunoId: String(usuarioLogadoGoogle.alunoId),
        alunoNome: usuarioLogadoGoogle.nome,
        matricula: usuarioLogadoGoogle.matricula || '',
        email: usuarioLogadoGoogle.email || ''
      }).then(res => {
        console.log("Candidatura gravada na planilha Google Sheets com sucesso!");
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn("Aviso ao enviar candidatura para Apps Script:", e);
        showToast("Aviso na Sincronização", e.message || "Verifique sua conexão e clique em Atualizar Dados.", "bi bi-exclamation-triangle text-warning");
        sincronizarComBackendAppsScript(false);
      });
    }

    const ultimasDesistenciasSnctMs = {};

    function desistirCandidaturaSNCT(demandaId, alunoIdEspecifico) {
      const frente = demandasSnctApp.find(d => d.id === demandaId);
      if (!frente || !Array.isArray(frente.membros)) return;

      const alvoId = alunoIdEspecifico || (usuarioLogadoGoogle ? usuarioLogadoGoogle.alunoId : null);
      if (!alvoId) return;

      if (!confirm("Deseja realmente liberar esta vaga na frente de trabalho?")) {
        return;
      }

      ultimasDesistenciasSnctMs[`${demandaId}:${String(alvoId)}`] = Date.now();
      const membroRemovido = frente.membros.find(m => String(m.alunoId) === String(alvoId));
      frente.membros = frente.membros.filter(m => String(m.alunoId) !== String(alvoId) && (!usuarioLogadoGoogle || String(m.matricula) !== String(usuarioLogadoGoogle.matricula)));

      salvarDemandasSNCT();
      renderizarQuadroDemandasSNCT();
      renderizarCardHeroRoteirosSNCT();

      showToast("Vaga Liberada", "A vaga foi disponibilizada novamente para a turma.", "bi bi-box-arrow-left text-muted");

      // Sincronização assíncrona com backend Google Apps Script
      chamarApiAppsScript('desistir_frente_snct', {
        frenteId: demandaId,
        alunoId: String(alvoId),
        matricula: (membroRemovido && membroRemovido.matricula) || ((usuarioLogadoGoogle && String(usuarioLogadoGoogle.alunoId) === String(alvoId)) ? (usuarioLogadoGoogle.matricula || '') : ''),
        email: (membroRemovido && membroRemovido.email) || ((usuarioLogadoGoogle && String(usuarioLogadoGoogle.alunoId) === String(alvoId)) ? (usuarioLogadoGoogle.email || '') : '')
      }).then(() => {
        console.log("Vaga liberada na planilha Google Sheets com sucesso!");
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn("Aviso ao liberar vaga no Apps Script:", e);
      });
    }

    function editarLinkEntregaSNCT(demandaId) {
      if (!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId) {
        iniciarLoginGoogle();
        return;
      }
      const frente = demandasSnctApp.find(d => d.id === demandaId);
      if (!frente || !Array.isArray(frente.membros)) return;

      const membro = frente.membros.find(m => String(m.alunoId) === String(usuarioLogadoGoogle.alunoId) || (m.matricula && String(m.matricula) === String(usuarioLogadoGoogle.matricula)));
      if (!membro) return;

      const linkAtual = membro.linkEntrega || '';
      const novoLink = prompt("Informe o link do entregável da sua equipe (ex: repositório GitHub, GitHub Pages, Sala Moodle, Google Drive ou Overleaf):", linkAtual);
      if (novoLink === null) return;

      const linkLimpo = novoLink.trim();
      membro.linkEntrega = linkLimpo;
      salvarDemandasSNCT();
      renderizarQuadroDemandasSNCT();

      showToast("Link Atualizado", "O link do entregável da sua frente foi salvo e sincronizado com a planilha!", "bi bi-link-45deg text-success");

      // Sincronização assíncrona do link de entrega com backend Google Apps Script
      chamarApiAppsScript('salvar_link_entrega_snct', {
        frenteId: demandaId,
        alunoId: String(usuarioLogadoGoogle.alunoId),
        alunoNome: usuarioLogadoGoogle.nome || membro.nome || '',
        matricula: usuarioLogadoGoogle.matricula || membro.matricula || '',
        email: usuarioLogadoGoogle.email || membro.email || '',
        linkEntrega: linkLimpo
      }).then(() => {
        console.log("Link de entrega gravado na planilha Google Sheets com sucesso!");
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn("Aviso ao salvar link de entrega no Apps Script:", e);
      });
    }

    function renderizarPainelVotacao() {
      const grid = document.getElementById('gridOpcoesVotacao');
      if (!grid) return;

      const totalEstudantes = alunosApp.length || 24;
      const totalVotos = votosOficinasApp.length;
      const pctParticipacao = totalEstudantes > 0 ? Math.round((totalVotos / totalEstudantes) * 100) : 0;

      const totalContagemEl = document.getElementById('totalVotosContagem');
      if (totalContagemEl) {
        totalContagemEl.textContent = `${totalVotos} / ${totalEstudantes} votos (${pctParticipacao}%)`;
      }

      const contagem = {};
      oficinasVotacaoApp.forEach(op => contagem[op.id] = 0);
      votosOficinasApp.forEach(v => {
        if (contagem[v.opcaoId] !== undefined) {
          contagem[v.opcaoId]++;
        }
      });

      let maxVotos = 0;
      let liderId = null;
      let empate = false;
      Object.keys(contagem).forEach(id => {
        if (contagem[id] > maxVotos) {
          maxVotos = contagem[id];
          liderId = id;
          empate = false;
        } else if (contagem[id] === maxVotos && maxVotos > 0) {
          empate = true;
        }
      });

      const temaLiderEl = document.getElementById('temaLiderGeral');
      if (temaLiderEl) {
        if (liderId && maxVotos > 0 && !empate) {
          const opLider = oficinasVotacaoApp.find(o => o.id === liderId);
          temaLiderEl.innerHTML = `<span class="text-muted">Tema Mais Votado:</span> <strong class="text-warning ms-1"><i class="bi bi-trophy-fill me-1"></i>${escapeHtml(opLider ? opLider.titulo : '')} (${maxVotos} votos)</strong>`;
        } else if (empate && maxVotos > 0) {
          temaLiderEl.innerHTML = `<span class="text-muted">Tema Mais Votado:</span> <strong class="text-info ms-1"><i class="bi bi-arrow-left-right me-1"></i>Empate na liderança (${maxVotos} votos)</strong>`;
        } else {
          temaLiderEl.innerHTML = `<span class="text-muted">Tema Mais Votado:</span> <strong class="text-muted ms-1">— Votação iniciada —</strong>`;
        }
      }

      atualizarCursoDoisProducao(liderId, maxVotos, empate);

      const votoEstudanteAtual = alunoVotanteAtualId
        ? votosOficinasApp.find(v => String(v.alunoId) === String(alunoVotanteAtualId))
        : null;

      const statusEl = document.getElementById('statusVotoEstudante');
      if (statusEl) {
        if (!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId) {
          statusEl.innerHTML = '<span class="text-warning fw-semibold"><i class="bi bi-shield-lock-fill me-1"></i>Votação Bloqueada:</span> <span class="text-muted">Conecte-se com sua conta Google institucional para liberar o voto.</span>';
        } else {
          const alunoObj = alunosApp.find(a => String(a.id) === String(usuarioLogadoGoogle.alunoId));
          const nomeAluno = alunoObj ? alunoObj.nome.split(' ')[0] : (usuarioLogadoGoogle.nome ? usuarioLogadoGoogle.nome.split(' ')[0] : 'Estudante');
          if (votoEstudanteAtual) {
            const opcaoVotada = oficinasVotacaoApp.find(o => o.id === votoEstudanteAtual.opcaoId);
            const tituloVotado = opcaoVotada ? opcaoVotada.titulo : 'Opção';
            statusEl.innerHTML = `<span class="text-success fw-bold"><i class="bi bi-check2-circle me-1"></i>Olá, ${escapeHtml(nomeAluno)}! Seu voto computado é:</span> <div class="text-heading fw-semibold text-truncate" title="${escapeHtml(tituloVotado)}">${escapeHtml(tituloVotado)}</div>`;
          } else {
            statusEl.innerHTML = `<span class="text-primary fw-bold"><i class="bi bi-hand-index-thumb me-1"></i>Olá, ${escapeHtml(nomeAluno)}!</span> <div class="text-muted">Você ainda não votou. Escolha um tema abaixo:</div>`;
          }
        }
      }

      grid.innerHTML = oficinasVotacaoApp.map(op => {
        const qtdVotos = contagem[op.id] || 0;
        const pct = totalVotos > 0 ? Math.round((qtdVotos / totalVotos) * 100) : 0;
        const isLider = liderId === op.id && maxVotos > 0;
        const isVotadoPeloAluno = votoEstudanteAtual && votoEstudanteAtual.opcaoId === op.id;

        return `
          <div class="votacao-opcao-card ${isLider ? 'lider' : ''} ${isVotadoPeloAluno ? 'votado-pelo-aluno' : ''}" id="card-oficina-${op.id}">
            <div>
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-1 mb-2">
                <span class="ext-theme-badge ${op.corBadge || 'badge-pill-purple'}">
                  <i class="bi ${escapeHtml(op.icone || 'bi-laptop')}"></i> ${escapeHtml(op.categoria)}
                </span>
                ${isLider ? '<span class="badge bg-warning text-dark fw-bold" style="font-size:0.72rem;"><i class="bi bi-trophy-fill me-1"></i>LÍDER</span>' : ''}
                ${isVotadoPeloAluno ? '<span class="badge bg-success text-white fw-bold" style="font-size:0.72rem;"><i class="bi bi-check-circle-fill me-1"></i>SEU VOTO</span>' : ''}
              </div>

              <h5 class="font-outfit fs-6 fw-bold text-heading mb-1">${escapeHtml(op.titulo)}</h5>
              <p class="text-muted small mb-2" style="font-size: 0.8125rem;">${escapeHtml(op.descricao)}</p>
              
              <div class="mb-2 text-muted" style="font-size: 0.74rem;">
                <i class="bi bi-people-fill text-primary me-1"></i><strong>Público:</strong> ${escapeHtml(op.publico || 'Comunidade externa')}
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between align-items-center small text-muted mb-1" style="font-size: 0.78rem;">
                <span><strong>${qtdVotos}</strong> ${qtdVotos === 1 ? 'voto' : 'votos'}</span>
                <span class="fw-bold ${isLider ? 'text-warning' : 'text-primary'}">${pct}%</span>
              </div>
              <div class="votacao-progress-wrap">
                <div class="votacao-progress-bar" style="width: ${pct}%;"></div>
              </div>

              <div class="d-flex align-items-center gap-2 mt-2">
                ${!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId ? `
                  <button type="button" onclick="iniciarLoginGoogle()" class="btn btn-sm btn-outline-primary w-100" style="font-size: 0.8125rem;">
                    <i class="bi bi-google me-1"></i> Fazer login para votar
                  </button>
                ` : isVotadoPeloAluno ? `
                  <button type="button" class="btn btn-sm btn-success w-100 disabled" style="opacity: 0.95; font-size: 0.8125rem;">
                    <i class="bi bi-check-circle-fill me-1"></i> Voto Confirmado
                  </button>
                ` : `
                  <button type="button" onclick="registrarVoto('${op.id}')" class="btn btn-sm btn-primary w-100" style="font-size: 0.8125rem;">
                    <i class="bi bi-hand-thumbs-up me-1"></i> Votar neste tema
                  </button>
                `}

                ${op.criadaPorDocente ? `
                  <button type="button" onclick="excluirOpcaoOficina('${op.id}')" class="btn btn-sm btn-outline-danger docente-only py-1 px-2" title="Excluir opção criada pelo docente" style="font-size: 0.75rem;">
                    <i class="bi bi-trash"></i>
                  </button>
                ` : ''}
              </div>
            </div>
        `;
      }).join('');
    }

    // =========================================================================
    // AUTENTICAÇÃO COM GOOGLE IDENTITY SERVICES & SESSÃO ESTUDANTE
    // =========================================================================
    function parseJwt(token) {
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

    function initGoogleAuth() {
      // 1. Restaurar sessão salva do usuário
      try {
        const sessaoSalva = localStorage.getItem(STORAGE_KEY_GOOGLE_SESSION);
        if (sessaoSalva) {
          usuarioLogadoGoogle = JSON.parse(sessaoSalva);
          if (usuarioLogadoGoogle) {
            const isDocente = ehProfessor(usuarioLogadoGoogle);
            usuarioLogadoGoogle.ehDocente = isDocente;
            if (!usuarioLogadoGoogle.alunoId && !isDocente) {
              const matchReparo = localizarEstudanteNoRoster(usuarioLogadoGoogle.email || '', usuarioLogadoGoogle.nome || '');
              if (matchReparo) {
                usuarioLogadoGoogle.alunoId = String(matchReparo.id);
                usuarioLogadoGoogle.matricula = String(matchReparo.matricula || '');
                usuarioLogadoGoogle.nome = matchReparo.nome;
                localStorage.setItem(STORAGE_KEY_GOOGLE_SESSION, JSON.stringify(usuarioLogadoGoogle));
              }
            }
            if (isDocente) {
              if (localStorage.getItem(STORAGE_KEY_MODO_DOCENTE) === 'true') {
                document.body.classList.add('modo-docente-ativo');
                atualizarUIModoDocente(true);
              }
            } else {
              // Estudante nunca entra no modo docente
              document.body.classList.remove('modo-docente-ativo');
              localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'false');
              atualizarUIModoDocente(false);
            }
          }
          atualizarInterfaceUsuarioGoogle();
          
          if (usuarioLogadoGoogle && usuarioLogadoGoogle.alunoId) {
            alunoVotanteAtualId = String(usuarioLogadoGoogle.alunoId);
          }
        }
      } catch (e) {
        console.warn("Erro ao restaurar sessão Google:", e);
      }

      // 2. Inicializar Google Identity Services se disponível
      const clientId = (window.PROGWEB2_CONFIG && window.PROGWEB2_CONFIG.googleClientId)
        ? window.PROGWEB2_CONFIG.googleClientId
        : '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com';

      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: aoReceberCredencialGoogle,
            auto_select: false,
            cancel_on_tap_outside: true
          });
        } catch (err) {
          console.warn("Aviso na inicialização do Google Identity Services:", err);
        }
      }
    }

    // Alias de compatibilidade para chamadas legadas de login Google
    function fazerLoginGoogleVotacao() {
      iniciarLoginGoogle();
    }

    function removerAcentos(str) {
      return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    function localizarEstudanteNoRoster(termoOuEmail, nomeGoogle = '') {
      const limpo = String(termoOuEmail || '').toLowerCase().trim();
      const limpoSemAcento = removerAcentos(termoOuEmail);
      const userPrefix = limpo.includes('@') ? limpo.split('@')[0] : '';

      // 1. Busca exata por e-mail ou matrícula
      let match = alunosApp.find(a =>
        (a.email && a.email.toLowerCase().trim() === limpo) ||
        (a.matricula && String(a.matricula).trim() === limpo)
      );
      if (match) return match;

      // 2. Busca por prefixo do e-mail (ex: victor.f2006@... ou nome antes do @)
      if (userPrefix && userPrefix.length >= 3) {
        match = alunosApp.find(a => {
          const pref = (a.email || '').split('@')[0].toLowerCase().trim();
          return pref && pref === userPrefix;
        });
        if (match) return match;
      }

      // 3. Busca por nome do perfil Google (quando o aluno loga com @aluno.ifsc.edu.br mas no SIGAA estava @gmail/@hotmail)
      const alvoNome = removerAcentos(nomeGoogle || (!limpo.includes('@') ? limpoSemAcento : ''));
      if (alvoNome && alvoNome.length >= 4) {
        const partesAlvo = alvoNome.split(/\s+/).filter(p => p.length > 2);
        match = alunosApp.find(a => {
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

    function iniciarLoginGoogle() {
      const clientId = (window.PROGWEB2_CONFIG && window.PROGWEB2_CONFIG.googleClientId)
        ? window.PROGWEB2_CONFIG.googleClientId
        : '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com';

      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: aoReceberCredencialGoogle
          });
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              const emailInput = prompt("Identificação do Estudante:\nDigite seu e-mail cadastrado no SIGAA, sua matrícula ou seu nome completo:");
              if (emailInput && emailInput.trim()) {
                autenticarEstudantePorEmailManual(emailInput.trim());
              }
            }
          });
          return;
        } catch (e) {
          console.warn("Erro ao invocar prompt Google:", e);
        }
      }

      const emailInput = prompt("Identificação do Estudante:\nDigite seu e-mail cadastrado no SIGAA, sua matrícula ou seu nome completo:");
      if (emailInput && emailInput.trim()) {
        autenticarEstudantePorEmailManual(emailInput.trim());
      }
    }

    function autenticarEstudantePorEmailManual(emailDigitado) {
      if (ehProfessor(emailDigitado)) {
        usuarioLogadoGoogle = {
          nome: 'Prof. André Moraes',
          email: emailDigitado,
          ehDocente: true,
          origem: 'manual'
        };
        try {
          localStorage.setItem(STORAGE_KEY_GOOGLE_SESSION, JSON.stringify(usuarioLogadoGoogle));
          localStorage.setItem(STORAGE_KEY_DOCENTE_AUTH, 'true');
          localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'true');
        } catch (e) {}
        document.body.classList.add('modo-docente-ativo');
        atualizarUIModoDocente(true);
        atualizarInterfaceUsuarioGoogle();
        renderizarAreaDocente();
        renderizarCardMinhaFrenteEstudante();
        showToast("Identificação Docente", "Bem-vindo(a), Prof. André Moraes! Controles liberados.", "fa-solid fa-chalkboard-user text-warning");
        return;
      }

      const alunoMatch = localizarEstudanteNoRoster(emailDigitado, emailDigitado);

      if (alunoMatch) {
        usuarioLogadoGoogle = {
          nome: alunoMatch.nome,
          email: alunoMatch.email,
          alunoId: String(alunoMatch.id),
          matricula: String(alunoMatch.matricula || ''),
          ehDocente: false,
          origem: 'manual'
        };
        try {
          localStorage.setItem(STORAGE_KEY_GOOGLE_SESSION, JSON.stringify(usuarioLogadoGoogle));
          localStorage.setItem(STORAGE_KEY_ULTIMO_VOTANTE, String(alunoMatch.id));
          localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'false');
          localStorage.removeItem(STORAGE_KEY_DOCENTE_AUTH);
        } catch (e) {}
        document.body.classList.remove('modo-docente-ativo');
        alunoVotanteAtualId = String(alunoMatch.id);
        atualizarUIModoDocente(false);
        atualizarInterfaceUsuarioGoogle();
        popularSelectEstudantesVotacao();
        renderizarPainelVotacao();
        renderizarAreaDocente();
        renderizarCardMinhaFrenteEstudante();
        showToast("Identificação Concluída!", `Bem-vindo(a), ${alunoMatch.nome.split(' ')[0]}! Suas candidaturas, votos e entregas estão liberados.`, "bi bi-person-check-fill text-success");
      } else {
        alert(`Não localizamos "${emailDigitado}" na lista dos 24 estudantes matriculados. Tente digitar seu número de matrícula do SIGAA ou seu nome completo.`);
      }
    }

    function aoReceberCredencialGoogle(response) {
      if (!response || !response.credential) return;

      const payload = parseJwt(response.credential);
      if (!payload || !payload.email) {
        alert("Não foi possível extrair os dados da sua conta Google.");
        return;
      }

      const emailGoogle = payload.email.toLowerCase().trim();
      const nomeGoogle = payload.name || payload.given_name || '';
      const isProf = ehProfessor(emailGoogle);

      let alunoMatch = !isProf ? localizarEstudanteNoRoster(emailGoogle, nomeGoogle) : null;

      usuarioLogadoGoogle = {
        nome: isProf ? 'Prof. André Moraes' : (alunoMatch ? alunoMatch.nome : (nomeGoogle || 'Estudante')),
        email: payload.email,
        picture: payload.picture || '',
        sub: payload.sub,
        alunoId: alunoMatch ? String(alunoMatch.id) : '',
        matricula: alunoMatch ? String(alunoMatch.matricula || '') : '',
        ehDocente: isProf,
        origem: 'google'
      };

      if (!alunoMatch && !isProf) {
        const matriculaInput = prompt(`Conta Google conectada: ${payload.email}\nDigite sua matrícula do SIGAA ou seu nome completo para vincular ao seu perfil da turma:`);
        if (matriculaInput && matriculaInput.trim()) {
          const buscaManual = localizarEstudanteNoRoster(matriculaInput.trim(), matriculaInput.trim());
          if (buscaManual) {
            alunoMatch = buscaManual;
            usuarioLogadoGoogle.alunoId = String(alunoMatch.id);
            usuarioLogadoGoogle.matricula = String(alunoMatch.matricula || '');
            usuarioLogadoGoogle.nome = alunoMatch.nome;
          }
        }
      }

      if (isProf) {
        document.body.classList.add('modo-docente-ativo');
        try {
          localStorage.setItem(STORAGE_KEY_DOCENTE_AUTH, 'true');
          localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'true');
        } catch (e) {}
        atualizarUIModoDocente(true);
      } else {
        document.body.classList.remove('modo-docente-ativo');
        try {
          localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'false');
          localStorage.removeItem(STORAGE_KEY_DOCENTE_AUTH);
        } catch (e) {}
        atualizarUIModoDocente(false);
      }

      if (alunoMatch) {
        alunoVotanteAtualId = String(alunoMatch.id);
        try {
          localStorage.setItem(STORAGE_KEY_ULTIMO_VOTANTE, String(alunoMatch.id));
        } catch (e) {}
      }

      try {
        localStorage.setItem(STORAGE_KEY_GOOGLE_SESSION, JSON.stringify(usuarioLogadoGoogle));
      } catch (e) {}

      atualizarInterfaceUsuarioGoogle();
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();
      renderizarAreaDocente();
      renderizarCardMinhaFrenteEstudante();

      showToast(
        isProf ? "Login Docente Realizado!" : "Login Google Realizado!",
        isProf ? "Bem-vindo, Prof. André Moraes! Painel administrativo disponível." : `Bem-vindo(a), ${usuarioLogadoGoogle.nome.split(' ')[0]}! Identificação ativa para candidaturas, entregas e votação.`,
        isProf ? "fa-solid fa-chalkboard-user text-warning" : "bi bi-google text-primary"
      );
    }

    function atualizarInterfaceUsuarioGoogle() {
      const btnHeader = document.getElementById('btnGoogleSignInHeader');
      const badgeHeader = document.getElementById('userBadgeHeader');
      const nameHeader = document.getElementById('userDisplayNameHeader');
      const picHeader = document.getElementById('userPictureHeader');
      const iconHeader = document.getElementById('userIconHeader');

      const bannerPendente = document.getElementById('bannerLoginObrigatorioVotacao');
      const cardAutenticado = document.getElementById('cardEstudanteAutenticadoVotacao');
      const nomeVotacao = document.getElementById('nomeAuthVotacao');
      const detalhesVotacao = document.getElementById('detalhesAuthVotacao');
      const avatarVotacao = document.getElementById('avatarAuthVotacao');
      const iconeWrapperVotacao = document.getElementById('iconeWrapperAuthVotacao');

      if (usuarioLogadoGoogle && (usuarioLogadoGoogle.alunoId || usuarioLogadoGoogle.ehDocente)) {
        if (btnHeader) btnHeader.classList.add('d-none');
        if (badgeHeader) {
          badgeHeader.classList.remove('d-none');
          badgeHeader.classList.add('d-inline-flex');
        }
        if (nameHeader) {
          const primeiroNome = usuarioLogadoGoogle.ehDocente ? 'Prof. André' : usuarioLogadoGoogle.nome.split(' ')[0];
          nameHeader.textContent = primeiroNome;
          nameHeader.title = `${usuarioLogadoGoogle.nome} (${usuarioLogadoGoogle.email})`;
        }
        if (picHeader && usuarioLogadoGoogle.picture) {
          picHeader.src = usuarioLogadoGoogle.picture;
          picHeader.style.display = 'inline-block';
          if (iconHeader) iconHeader.style.display = 'none';
        } else if (iconHeader) {
          iconHeader.style.display = 'inline-block';
          iconHeader.className = usuarioLogadoGoogle.ehDocente ? 'fa-solid fa-chalkboard-user text-warning' : 'bi bi-person-check-fill text-success';
          if (picHeader) picHeader.style.display = 'none';
        }

        // Painel de votação SNCT
        if (bannerPendente) bannerPendente.classList.add('d-none');
        if (cardAutenticado) {
          cardAutenticado.classList.remove('d-none');
          cardAutenticado.classList.add('d-flex');
        }
        if (nomeVotacao) {
          nomeVotacao.textContent = usuarioLogadoGoogle.nome;
        }
        if (detalhesVotacao) {
          detalhesVotacao.textContent = usuarioLogadoGoogle.ehDocente
            ? `Professor da Disciplina | E-mail: ${usuarioLogadoGoogle.email}`
            : `Matrícula: ${usuarioLogadoGoogle.matricula || 'N/A'} | E-mail: ${usuarioLogadoGoogle.email}`;
        }
        if (avatarVotacao && usuarioLogadoGoogle.picture) {
          avatarVotacao.src = usuarioLogadoGoogle.picture;
          avatarVotacao.style.display = 'inline-block';
          if (iconeWrapperVotacao) iconeWrapperVotacao.style.display = 'none';
        } else if (iconeWrapperVotacao) {
          iconeWrapperVotacao.style.display = 'flex';
          if (avatarVotacao) avatarVotacao.style.display = 'none';
        }
      } else {
        if (btnHeader) btnHeader.classList.remove('d-none');
        if (badgeHeader) {
          badgeHeader.classList.add('d-none');
          badgeHeader.classList.remove('d-inline-flex');
        }

        // Painel de votação SNCT
        if (bannerPendente) bannerPendente.classList.remove('d-none');
        if (cardAutenticado) {
          cardAutenticado.classList.add('d-none');
          cardAutenticado.classList.remove('d-flex');
        }
      }

      renderizarCardHeroRoteirosSNCT();
      renderizarQuadroDemandasSNCT();
      renderizarDemandas();
      renderizarCardMinhaFrenteEstudante();
    }

    function efetuarLogoutGoogle() {
      usuarioLogadoGoogle = null;
      alunoVotanteAtualId = '';
      try {
        localStorage.removeItem(STORAGE_KEY_GOOGLE_SESSION);
        localStorage.removeItem(STORAGE_KEY_ULTIMO_VOTANTE);
        localStorage.removeItem(STORAGE_KEY_DOCENTE_AUTH);
        localStorage.setItem(STORAGE_KEY_MODO_DOCENTE, 'false');
      } catch (e) {}

      document.body.classList.remove('modo-docente-ativo');
      atualizarUIModoDocente(false);
      atualizarInterfaceUsuarioGoogle();
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();
      renderizarAreaDocente();
      renderizarCardMinhaFrenteEstudante();

      showToast(
        "Sessão Encerrada",
        "Você desconectou sua identificação Google do dashboard.",
        "bi bi-box-arrow-right text-muted"
      );
    }

    // =========================================================================
    // SINCRONIZAÇÃO COM BACKEND GOOGLE APPS SCRIPT
    // =========================================================================
    let sincronizacaoEmAndamento = false;

    async function sincronizarComBackendAppsScript(mostrarFeedback = false) {
      const cfg = window.PROGWEB2_CONFIG;
      if (!cfg || !cfg.apiUrl || !cfg.apiUrl.trim()) {
        return;
      }
      if (sincronizacaoEmAndamento && !mostrarFeedback) return;
      sincronizacaoEmAndamento = true;

      const apiUrl = cfg.apiUrl.trim();
      const statusHeader = document.getElementById('statusSyncHeader');
      const iconHeader = document.getElementById('iconSyncHeader');
      if (iconHeader) iconHeader.classList.add('fa-spin');
      if (mostrarFeedback && statusHeader) statusHeader.textContent = 'Sincronizando...';

      try {
        const urlGet = `${apiUrl}${apiUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
        const resp = await fetch(urlGet, { method: 'GET', mode: 'cors', cache: 'no-store' });
        if (!resp.ok) return;

        const data = await resp.json();
        if (!data || !data.ok) return;

        let mudou = false;

        // 1. Sincroniza opções de oficinas
        if (Array.isArray(data.oficinas) && data.oficinas.length > 0) {
          const remotasMapeadas = data.oficinas.map(o => ({
            id: o.id || ('oficina-' + Math.random().toString(36).substring(2, 7)),
            titulo: o.titulo || 'Oficina',
            categoria: o.categoria || 'Geral',
            icone: o.icone || 'bi-laptop',
            corBadge: o.corBadge || 'badge-pill-purple',
            descricao: o.descricao || '',
            publico: o.publico || 'Comunidade externa',
            criadaPorDocente: String(o.criada_por_docente) === 'true'
          }));

          OFICINAS_PADRAO_SNCT.forEach(padrao => {
            if (!remotasMapeadas.some(r => r.id === padrao.id)) {
              remotasMapeadas.unshift(padrao);
            }
          });

          oficinasVotacaoApp = remotasMapeadas;
          salvarOficinasVotacao();
          mudou = true;
        }

        // 2. Sincroniza votos (preservando e reenviando voto local pendente do estudante logado)
        if (Array.isArray(data.votos)) {
          const votosRemotos = data.votos.map(v => ({
            alunoId: String(v.aluno_id || ''),
            alunoNome: v.aluno_nome || '',
            matricula: String(v.matricula || ''),
            opcaoId: v.opcao_id || '',
            timestamp: v.data_hora || ''
          })).filter(v => v.alunoId && v.opcaoId);

          if (usuarioLogadoGoogle && usuarioLogadoGoogle.alunoId) {
            const meuId = String(usuarioLogadoGoogle.alunoId);
            const votoLocalMeu = votosOficinasApp.find(v => String(v.alunoId) === meuId);
            const votoRemotoMeu = votosRemotos.find(v => String(v.alunoId) === meuId);
            if (votoLocalMeu && !votoRemotoMeu) {
              votosRemotos.push(votoLocalMeu);
              const opObj = oficinasVotacaoApp.find(o => o.id === votoLocalMeu.opcaoId);
              chamarApiAppsScript('votar_oficina', {
                alunoId: meuId,
                alunoNome: votoLocalMeu.alunoNome || usuarioLogadoGoogle.nome || '',
                matricula: votoLocalMeu.matricula || usuarioLogadoGoogle.matricula || '',
                email: usuarioLogadoGoogle.email || '',
                opcaoId: votoLocalMeu.opcaoId,
                opcaoTitulo: opObj ? opObj.titulo : votoLocalMeu.opcaoId
              }).catch(() => {});
            }
          }

          votosOficinasApp = votosRemotos;
          salvarVotosOficinas();
          mudou = true;
        }

        // 3. Sincroniza candidaturas às frentes da SNCT (reconciliando candidaturas/links locais pendentes)
        if (Array.isArray(data.candidaturas)) {
          let mudouCandidaturas = false;
          demandasSnctApp.forEach(f => {
            const remotas = data.candidaturas
              .filter(c => String(c.frente_id) === String(f.id))
              .map(c => ({
                alunoId: String(c.aluno_id || ''),
                nome: c.aluno_nome || '',
                matricula: String(c.matricula || ''),
                email: c.email || '',
                linkEntrega: c.link_entrega || '',
                dataInscricao: c.data_hora || ''
              }));

            const locaisAtuais = Array.isArray(f.membros) ? f.membros : [];
            locaisAtuais.forEach(mLocal => {
              const idLocal = String(mLocal.alunoId || '');
              if (!idLocal) return;
              const chaveDesistencia = `${f.id}:${idLocal}`;
              if (ultimasDesistenciasSnctMs[chaveDesistencia] && (Date.now() - ultimasDesistenciasSnctMs[chaveDesistencia] < 20000)) {
                return;
              }
              const idxRem = remotas.findIndex(r =>
                String(r.alunoId) === idLocal ||
                (r.matricula && mLocal.matricula && String(r.matricula) === String(mLocal.matricula))
              );
              const ehDoUsuarioLogado = usuarioLogadoGoogle && String(usuarioLogadoGoogle.alunoId) === idLocal;

              if (idxRem === -1 && (ehDoUsuarioLogado || mLocal.linkEntrega)) {
                if (remotas.length < (f.vagasMax || 3)) {
                  remotas.push({
                    alunoId: idLocal,
                    nome: mLocal.nome || '',
                    matricula: String(mLocal.matricula || ''),
                    email: mLocal.email || '',
                    linkEntrega: mLocal.linkEntrega || '',
                    dataInscricao: mLocal.dataInscricao || ''
                  });
                  chamarApiAppsScript('candidatar_frente_snct', {
                    frenteId: f.id,
                    frenteTitulo: `${f.cursoNome} - ${f.titulo}`,
                    alunoId: idLocal,
                    alunoNome: mLocal.nome || '',
                    matricula: String(mLocal.matricula || ''),
                    email: mLocal.email || ''
                  }).then(() => {
                    if (mLocal.linkEntrega) {
                      chamarApiAppsScript('salvar_link_entrega_snct', {
                        frenteId: f.id,
                        alunoId: idLocal,
                        alunoNome: mLocal.nome || '',
                        matricula: String(mLocal.matricula || ''),
                        email: mLocal.email || '',
                        linkEntrega: mLocal.linkEntrega
                      }).catch(() => {});
                    }
                  }).catch(() => {});
                }
              } else if (idxRem !== -1 && mLocal.linkEntrega && !remotas[idxRem].linkEntrega) {
                remotas[idxRem].linkEntrega = mLocal.linkEntrega;
                chamarApiAppsScript('salvar_link_entrega_snct', {
                  frenteId: f.id,
                  alunoId: idLocal,
                  alunoNome: remotas[idxRem].nome || mLocal.nome || '',
                  matricula: String(remotas[idxRem].matricula || mLocal.matricula || ''),
                  email: remotas[idxRem].email || mLocal.email || '',
                  linkEntrega: mLocal.linkEntrega
                }).catch(() => {});
              }
            });

            const atuaisJson = JSON.stringify(f.membros || []);
            const novasJson = JSON.stringify(remotas);
            if (atuaisJson !== novasJson) {
              f.membros = remotas;
              mudouCandidaturas = true;
            }
          });

          if (mudouCandidaturas) {
            salvarDemandasSNCT();
            mudou = true;
          }
          // Sempre sincroniza entregas da DEM-SNCT-01 com o quadro de frentes
          sincronizarDemandasComQuadroSNCT();
          renderizarQuadroDemandasSNCT();
          renderizarCardHeroRoteirosSNCT();
        }

        // 4. Sincroniza demandas gravadas na aba Demandas da planilha e reenvia entregas locais pendentes
        if (Array.isArray(data.demandas)) {
          let mudouDemandas = false;
          const mapaRemotas = {};
          data.demandas.forEach(rem => {
            if (!rem || !rem.id) return;
            mapaRemotas[String(rem.id).toUpperCase()] = rem;
            const idx = demandasApp.findIndex(d => String(d.id).toUpperCase() === String(rem.id).toUpperCase());
            if (idx !== -1) {
              if (rem.prazo) {
                const normRemPrazo = normalizarPrazo(rem.prazo);
                if (normRemPrazo && demandasApp[idx].prazo !== normRemPrazo) {
                  demandasApp[idx].prazo = normRemPrazo;
                  mudouDemandas = true;
                }
              }
              if (rem.horaPrazo && demandasApp[idx].horaPrazo !== rem.horaPrazo) {
                demandasApp[idx].horaPrazo = rem.horaPrazo;
                mudouDemandas = true;
              }
              if (rem.entregas && typeof rem.entregas === 'object' && Object.keys(rem.entregas).length > 0) {
                const mescladas = { ...(demandasApp[idx].entregas || {}), ...rem.entregas };
                if (JSON.stringify(demandasApp[idx].entregas || {}) !== JSON.stringify(mescladas)) {
                  demandasApp[idx].entregas = mescladas;
                  mudouDemandas = true;
                }
              }
            } else {
              demandasApp.unshift({
                id: rem.id,
                titulo: rem.titulo || rem.id,
                instrumento: rem.instrumento || 'A2',
                instrumentoNome: rem.instrumento === 'A3' ? 'A3 (Vitrine Flask • 35%)' : 'A2 (Curso SNCT • 20%)',
                destinatario: rem.destinatario || 'Todos',
                tipoAtribuicao: rem.tipoAtribuicao || 'turma',
                equipesAlvo: rem.equipesAlvo || [],
                alunosAlvo: rem.alunosAlvo || [],
                cursoSnctAlvo: rem.cursoSnctAlvo || null,
                fixadaMural: Boolean(rem.fixadaMural),
                linkApoio: rem.id === 'DEM-SNCT-C1' ? 'https://moodle.ifsc.edu.br/course/view.php?id=2663' : (rem.id === 'DEM-SNCT-C2' ? 'https://moodle.ifsc.edu.br/course/view.php?id=2664' : (rem.linkApoio || '')),
                prazo: normalizarPrazo(rem.prazo) || '',
                horaPrazo: rem.horaPrazo || '23:59',
                entregas: rem.entregas || {},
                pontos: rem.pontos || 10.0,
                concluida: Boolean(rem.concluida),
                descricao: rem.descricao || '',
                criterios: Array.isArray(rem.criterios) ? rem.criterios : []
              });
              mudouDemandas = true;
            }
          });

          // Reconciliação: se houver entregas locais registradas no navegador que ainda não constam na planilha remota, envia para a planilha
          demandasApp.forEach(dLocal => {
            if (!dLocal || !dLocal.id || !dLocal.entregas || typeof dLocal.entregas !== 'object') return;
            const rem = mapaRemotas[String(dLocal.id).toUpperCase()];
            const entregasRem = (rem && rem.entregas && typeof rem.entregas === 'object') ? rem.entregas : {};
            const chavesPendentes = Object.keys(dLocal.entregas).filter(ch => {
              const entLocal = dLocal.entregas[ch];
              if (!entLocal || !entLocal.entregue) return false;
              // Para DEM-SNCT-01, só envia se tiver link ou se a demanda já existir sem essa chave
              if (dLocal.id === 'DEM-SNCT-01' && !entLocal.link && !rem) return false;
              const entRem = entregasRem[ch];
              return !entRem || !entRem.entregue || (entLocal.link && !entRem.link);
            });

            if (chavesPendentes.length > 0) {
              chamarApiAppsScript('criarDemanda', {
                demanda: dLocal,
                notificarEmail: false,
                destinatariosEmails: []
              }).catch(() => {});
            }
          });

          if (mudouDemandas) {
            salvarDadosDemandas();
            mudou = true;
          }
          renderizarDemandas();
          popularSelectsDeDemanda();
        }

        // 5. Sincroniza avaliações por rubrica
        if (Array.isArray(data.avaliacoes) && data.avaliacoes.length > 0) {
          let mudouAval = false;
          data.avaliacoes.forEach(avRem => {
            if (!avRem || !avRem.demanda_id || !avRem.equipe) return;
            const jaTem = avaliacoesApp.some(a => a.demandaId === avRem.demanda_id && a.equipe === avRem.equipe);
            if (!jaTem) {
              avaliacoesApp.push({
                id: avRem.id || ('aval-' + Date.now()),
                demandaId: avRem.demanda_id,
                equipe: avRem.equipe,
                instrumento: avRem.instrumento || 'A2',
                dim0: Number(avRem.dim1 || 2.5),
                dim1: Number(avRem.dim2 || 2.5),
                dim2: Number(avRem.dim3 || 2.5),
                dim3: Number(avRem.dim4 || 2.5),
                nota: Number(avRem.nota_final || 10),
                feedback: avRem.feedback || '',
                data: avRem.data_hora || ''
              });
              mudouAval = true;
            }
          });
          if (mudouAval) {
            salvarDadosAvaliacoes();
            renderizarTabelaRubricas();
            renderizarTabelaFechamento();
            mudou = true;
          }
        }

        popularSelectEstudantesVotacao();
        renderizarPainelVotacao();
        renderizarAreaDocente();

        const horaStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (statusHeader) {
          statusHeader.textContent = `Sincronizado ${horaStr}`;
        }

        if (mostrarFeedback) {
          const totalCand = Array.isArray(data.candidaturas) ? data.candidaturas.length : 0;
          const totalVotos = Array.isArray(data.votos) ? data.votos.length : 0;
          showToast(
            "Sincronizado em Tempo Real!",
            `Planilha atualizada às ${horaStr}: ${totalCand} candidatura(s) SNCT e ${totalVotos} voto(s) carregados.`,
            "bi bi-cloud-check-fill text-success"
          );
        }
      } catch (err) {
        console.warn("ProgWeb 2: Falha ao sincronizar com Apps Script (operando offline):", err);
        if (mostrarFeedback) {
          showToast("Aviso de Conexão", "Não foi possível conectar à planilha no momento. Tentando novamente em instantes.", "bi bi-wifi-off text-warning");
        }
      } finally {
        sincronizacaoEmAndamento = false;
        if (iconHeader) iconHeader.classList.remove('fa-spin');
      }
    }

    function registrarVoto(opcaoId) {
      if (!usuarioLogadoGoogle || !usuarioLogadoGoogle.alunoId) {
        showToast(
          "Login Google Obrigatório",
          "Para garantir a integridade da votação, faça login institucional com sua conta Google.",
          "bi bi-shield-lock-fill text-warning"
        );
        iniciarLoginGoogle();
        return;
      }

      const alunoId = String(usuarioLogadoGoogle.alunoId);
      const alunoObj = alunosApp.find(a => String(a.id) === alunoId);
      if (!alunoObj) {
        alert("Estudante associado à conta Google não encontrado na lista oficial.");
        return;
      }

      const opcaoObj = oficinasVotacaoApp.find(o => o.id === opcaoId);
      const tituloOpcao = opcaoObj ? opcaoObj.titulo : 'a oficina selecionada';

      const idx = votosOficinasApp.findIndex(v => String(v.alunoId) === alunoId);
      const agora = new Date().toLocaleString('pt-BR');

      if (idx !== -1) {
        votosOficinasApp[idx].opcaoId = opcaoId;
        votosOficinasApp[idx].timestamp = agora;
      } else {
        votosOficinasApp.push({
          alunoId: String(alunoObj.id),
          alunoNome: alunoObj.nome,
          matricula: String(alunoObj.matricula || ''),
          opcaoId: opcaoId,
          timestamp: agora
        });
      }

      // Persistência local imediata
      salvarVotosOficinas();
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();

      showToast(
        "Voto Registrado com Sucesso!",
        `${alunoObj.nome.split(' ')[0]}, seu voto foi computado para "${tituloOpcao}".`,
        "bi bi-check-circle-fill text-success"
      );

      // Sincronização assíncrona com backend Google Apps Script
      chamarApiAppsScript('votar_oficina', {
        alunoId: String(alunoObj.id),
        alunoNome: alunoObj.nome,
        matricula: String(alunoObj.matricula || ''),
        email: alunoObj.email || (usuarioLogadoGoogle ? usuarioLogadoGoogle.email : ''),
        opcaoId: opcaoId,
        opcaoTitulo: tituloOpcao
      }).then(() => {
        console.log("Voto gravado na planilha Google Sheets com sucesso!");
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn("Aviso ao enviar voto para Apps Script (gravado localmente):", e);
      });
    }

    function abrirModalNovaOficina() {
      document.getElementById('inputNovaOficinaTitulo').value = '';
      document.getElementById('inputNovaOficinaCategoria').value = '';
      document.getElementById('inputNovaOficinaIcone').value = 'bi-laptop';
      document.getElementById('inputNovaOficinaPublico').value = '';
      document.getElementById('inputNovaOficinaDescricao').value = '';
      document.getElementById('modalNovaOficinaOverlay').classList.add('active');
    }

    function fecharModalNovaOficina() {
      document.getElementById('modalNovaOficinaOverlay').classList.remove('active');
    }

    function salvarNovaOficina(event) {
      if (event) event.preventDefault();
      const titulo = document.getElementById('inputNovaOficinaTitulo').value.trim();
      const categoria = document.getElementById('inputNovaOficinaCategoria').value.trim();
      const icone = document.getElementById('inputNovaOficinaIcone').value;
      const publico = document.getElementById('inputNovaOficinaPublico').value.trim();
      const descricao = document.getElementById('inputNovaOficinaDescricao').value.trim();

      if (!titulo || !categoria || !descricao) {
        alert("Por favor, preencha os campos obrigatórios da oficina.");
        return;
      }

      const novaOficina = {
        id: "oficina-docente-" + Date.now(),
        titulo,
        categoria,
        icone,
        corBadge: "badge-pill-purple",
        descricao,
        publico,
        criadaPorDocente: true
      };

      oficinasVotacaoApp.push(novaOficina);
      salvarOficinasVotacao();
      fecharModalNovaOficina();
      renderizarPainelVotacao();

      showToast(
        "Nova Oficina Publicada!",
        `O tema "${titulo}" foi adicionado com sucesso e já está disponível para votação da turma!`,
        "bi bi-stars text-warning"
      );

      // Sincroniza com backend Google Apps Script
      chamarApiAppsScript('adicionar_oficina', {
        id: novaOficina.id,
        titulo: novaOficina.titulo,
        categoria: novaOficina.categoria,
        icone: novaOficina.icone,
        descricao: novaOficina.descricao,
        publico: novaOficina.publico
      }).then(() => {
        console.log("Oficina sincronizada com a planilha Google Sheets!");
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn("Aviso ao sincronizar oficina com Apps Script:", e);
      });
    }

    function excluirOpcaoOficina(opcaoId) {
      const opcao = oficinasVotacaoApp.find(o => o.id === opcaoId);
      if (!opcao) return;

      if (!confirm(`Tem certeza que deseja excluir a opção "${opcao.titulo}"? Os votos associados a ela serão removidos.`)) {
        return;
      }

      oficinasVotacaoApp = oficinasVotacaoApp.filter(o => o.id !== opcaoId);
      votosOficinasApp = votosOficinasApp.filter(v => v.opcaoId !== opcaoId);

      salvarOficinasVotacao();
      salvarVotosOficinas();
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();

      showToast("Opção Excluída", `A oficina foi removida da votação.`, "bi bi-trash text-danger");
    }

    function reiniciarVotacao() {
      if (!confirm("Atenção Docente: Tem certeza que deseja zerar TODOS os votos computados para a 2ª oficina da SNCT?")) {
        return;
      }
      votosOficinasApp = [];
      salvarVotosOficinas();
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();
      showToast("Votação Zerada", "Todos os votos foram reiniciados.", "bi bi-arrow-counterclockwise text-warning");

      // Sincroniza reset no backend Google Apps Script
      chamarApiAppsScript('zerar_votacao', {}).then(() => {
        console.log("Votação zerada na planilha Google Sheets com sucesso!");
        setTimeout(() => sincronizarComBackendAppsScript(false), 1200);
      }).catch(e => {
        console.warn("Aviso ao zerar votação no Apps Script:", e);
      });
    }

    function abrirModalAuditoriaVotos() {
      const container = document.getElementById('conteudoAuditoriaVotosContainer');
      if (!container) return;

      if (votosOficinasApp.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-muted">Nenhum voto foi registrado até o momento.</div>';
      } else {
        const linhas = votosOficinasApp.map(v => {
          const op = oficinasVotacaoApp.find(o => o.id === v.opcaoId);
          return `
            <tr>
              <td><strong>${escapeHtml(v.alunoNome)}</strong></td>
              <td class="font-code small text-muted">${escapeHtml(v.matricula || '—')}</td>
              <td><span class="badge bg-primary-subtle text-primary border">${escapeHtml(op ? op.titulo : v.opcaoId)}</span></td>
              <td class="small text-muted">${escapeHtml(v.timestamp || '—')}</td>
            </tr>
          `;
        }).join('');

        container.innerHTML = `
          <table class="table table-hover align-middle mb-0" style="font-size: 0.82rem;">
            <thead style="background: var(--bg-card-hover);">
              <tr>
                <th>Estudante</th>
                <th>Matrícula</th>
                <th>Tema Votado</th>
                <th>Horário</th>
              </tr>
            </thead>
            <tbody>
              ${linhas}
            </tbody>
          </table>
        `;
      }

      document.getElementById('modalAuditoriaVotosOverlay').classList.add('active');
    }

    function fecharModalAuditoriaVotos() {
      document.getElementById('modalAuditoriaVotosOverlay').classList.remove('active');
    }

    function exportarAuditoriaVotosTSV() {
      if (votosOficinasApp.length === 0) {
        alert("Nenhum voto registrado para exportar.");
        return;
      }

      let tsv = "Estudante\tMatrícula\tTema Votado\tData/Hora\n";
      votosOficinasApp.forEach(v => {
        const op = oficinasVotacaoApp.find(o => o.id === v.opcaoId);
        tsv += `${v.alunoNome}\t${v.matricula || ''}\t${op ? op.titulo : v.opcaoId}\t${v.timestamp || ''}\n`;
      });

      navigator.clipboard.writeText(tsv).then(() => {
        showToast("Votos Copiados", "Dados tabulados copiados para a área de transferência!", "bi bi-clipboard-check text-success");
      });
    }

    // =========================================================================
    // EXPORTAÇÃO, IMPORTAÇÃO JSON E RESTAURAÇÃO DE PADRÕES
    // =========================================================================
    function exportarDadosDemandas() {
      const backup = {
        progweb2_version: "2026-2",
        dataExportacao: new Date().toISOString(),
        demandas: demandasApp,
        avaliacoes: avaliacoesApp,
        alunos: alunosApp,
        oficinasVotacao: oficinasVotacaoApp,
        votosOficinas: votosOficinasApp
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `progweb2_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast("Backup Concluído", "Arquivo JSON baixado com sucesso!");
    }

    function importarDadosDemandas(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const json = JSON.parse(e.target.result);
          if (json.demandas && Array.isArray(json.demandas)) {
            demandasApp = json.demandas;
            salvarDadosDemandas();
          }
          if (json.avaliacoes && Array.isArray(json.avaliacoes)) {
            avaliacoesApp = json.avaliacoes;
            salvarDadosAvaliacoes();
          }
          if (json.alunos && Array.isArray(json.alunos)) {
            alunosApp = json.alunos;
            salvarDadosAlunos();
          }
          if (json.oficinasVotacao && Array.isArray(json.oficinasVotacao)) {
            oficinasVotacaoApp = json.oficinasVotacao;
            salvarOficinasVotacao();
          }
          if (json.votosOficinas && Array.isArray(json.votosOficinas)) {
            votosOficinasApp = json.votosOficinas;
            salvarVotosOficinas();
          }
          renderizarDemandas();
          popularSelectsDeDemanda();
          renderizarTabelaRubricas();
          renderizarTabelaAlunos();
          renderizarTabelaFechamento();
          popularSelectEstudantesVotacao();
          renderizarPainelVotacao();
          showToast("Dados Importados", "Demandas, avaliações, roster e votação de oficinas restaurados!");
        } catch (err) {
          alert("Arquivo JSON inválido ou corrompido.");
          console.error(err);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function restaurarDemandasPadrao() {
      if (!confirm("Deseja restaurar as demandas, rubricas e lista de alunos para o padrão inicial do ProgWeb 2?")) {
        return;
      }
      demandasApp = JSON.parse(JSON.stringify(DEMANDAS_INICIAIS));
      alunosApp = JSON.parse(JSON.stringify(ESTUDANTES_PADRAO));
      oficinasVotacaoApp = JSON.parse(JSON.stringify(OFICINAS_PADRAO_SNCT));
      votosOficinasApp = [];
      salvarDadosDemandas();
      salvarDadosAlunos();
      salvarOficinasVotacao();
      salvarVotosOficinas();
      renderizarDemandas();
      popularSelectsDeDemanda();
      renderizarTabelaRubricas();
      renderizarTabelaAlunos();
      renderizarTabelaFechamento();
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();
      showToast("Padrões Restaurados", "Demandas, roster e opções de oficinas redefinidos com sucesso!");
    }

    // =========================================================================
    // TOAST / FEEDBACK VISUAL
    // =========================================================================
    let toastTimeout = null;
    function showToast(titulo, mensagem, iconeClass = "fa-solid fa-circle-check text-success") {
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

    // =========================================================================
    // FUNÇÕES AUXILIARES DE FORMATAÇÃO E ESCAPE
    // =========================================================================
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function formatarData(dataStr) {
      const norm = normalizarPrazo(dataStr);
      if (!norm) return '-';
      const partes = norm.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataStr;
    }

    // =========================================================================
    // NAVEGAÇÃO ENTRE ABAS
    // =========================================================================
    function showTab(tabId, shouldScroll = true) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add('active');

      const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId));
      if (activeBtn) activeBtn.classList.add('active');

      if (shouldScroll) {
        const tabsContainer = document.querySelector('.dashboard-tabs');
        if (tabsContainer) {
          tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (tabId === 'tab-demandas') {
        renderizarDemandas();
        renderizarCardMinhaFrenteEstudante();
        sincronizarComBackendAppsScript(false);
      } else if (tabId === 'tab-extensao') {
        renderizarQuadroDemandasSNCT();
        renderizarPainelVotacao();
        renderizarCardMinhaFrenteEstudante();
        sincronizarComBackendAppsScript(false);
      } else if (tabId === 'tab-avaliacao') {
        trocarSubAbaNotas(subabaNotasAtual);
        sincronizarComBackendAppsScript(false);
      } else if (tabId === 'tab-docente') {
        renderizarAreaDocente();
        renderizarCardMinhaFrenteEstudante();
        sincronizarComBackendAppsScript(false);
      }
    }

    // =========================================================================
    // TEMA CLARO / ESCURO
    // =========================================================================
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-bs-theme');
      }
      localStorage.setItem('progweb2-theme-preference', next);
      updateThemeIcon(next);
    }

    function updateThemeIcon(theme) {
      const icon = document.getElementById('themeIcon');
      const text = document.getElementById('themeText');
      if (!icon) return;
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill text-warning';
        if (text) text.innerText = 'Modo Claro';
      } else {
        icon.className = 'bi bi-moon-stars-fill';
        if (text) text.innerText = 'Modo Escuro';
      }
    }

    // =========================================================================
    // COPIAR ENUNCIADO PARA ÁREA DE TRANSFERÊNCIA
    // =========================================================================
    function copyToClipboard(elementId, btn) {
      const text = document.getElementById(elementId).innerText;
      navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copiado!';
        setTimeout(() => { btn.innerHTML = originalHtml; }, 2500);
      });
    }

    function copySimpleLink(text, btn) {
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copiado!';
        btn.style.background = 'var(--accent-emerald)';
        btn.style.color = '#ffffff';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      });
    }

    // =========================================================================
    // INICIALIZAÇÃO NA CARGA DA PÁGINA
    // =========================================================================
    (function initTheme() {
      const saved = localStorage.getItem('progweb2-theme-preference');
      if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        updateThemeIcon('dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-bs-theme');
        updateThemeIcon('light');
      }
    })();

    // Fechar modais ao teclar ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        fecharModalDemanda();
        fecharModalRubrica();
        fecharModalAluno();
        fecharModalNovaOficina();
        fecharModalAuditoriaVotos();
        fecharModalAlterarPrazo();
        fecharModalComunicadoDemanda();
      }
    });

    // =========================================================================
    // GERENCIAMENTO DO CARD EM DESTAQUE VISUAL (FOCO DA TURMA)
    // =========================================================================
    const STORAGE_KEY_CARD_DESTAQUE = 'progweb2_card_destaque_v1';

    function initDestaqueCards() {
      const salvo = localStorage.getItem(STORAGE_KEY_CARD_DESTAQUE);
      // Se não houver nada salvo, o card da SNCT é o foco ativo inicial
      const cardInicial = (salvo !== null) ? salvo : 'card-roteiro-snct';
      aplicarDestaqueCard(cardInicial, false);
    }

    function aplicarDestaqueCard(cardId, persistir = true) {
      const todosCards = document.querySelectorAll('.roteiros-grid .roteiro-card');
      const selectEl = document.getElementById('selectCardDestaque');

      todosCards.forEach(c => {
        const id = c.getAttribute('data-card-id') || c.id;
        const btnDestaque = c.querySelector('.btn-destaque-card');
        const labelDestaque = c.querySelector('.destaque-btn-label');
        const iconDestaque = c.querySelector('.btn-destaque-card i');

        if (cardId && id === cardId) {
          c.classList.add('roteiro-highlight');
          if (btnDestaque) {
            btnDestaque.classList.add('active');
            btnDestaque.title = 'Remover destaque deste card';
          }
          if (labelDestaque) labelDestaque.textContent = 'Em Destaque';
          if (iconDestaque) iconDestaque.className = 'bi bi-star-fill text-warning';
        } else {
          c.classList.remove('roteiro-highlight');
          if (btnDestaque) {
            btnDestaque.classList.remove('active');
            btnDestaque.title = 'Marcar este card como foco principal da turma';
          }
          if (labelDestaque) labelDestaque.textContent = 'Destacar';
          if (iconDestaque) iconDestaque.className = 'bi bi-star';
        }
      });

      if (selectEl) {
        selectEl.value = cardId || '';
      }

      if (persistir) {
        localStorage.setItem(STORAGE_KEY_CARD_DESTAQUE, cardId || '');
        if (cardId) {
          const cardAlvo = document.getElementById(cardId) || document.querySelector(`[data-card-id="${cardId}"]`);
          const elTit = cardAlvo ? cardAlvo.querySelector('.roteiro-title') : null;
          const tituloAlvo = elTit ? elTit.textContent : 'Card';
          showToast("Foco Atualizado", `Card "${tituloAlvo}" marcado com destaque visual para a turma.`, "bi bi-star-fill text-warning");
        } else {
          showToast("Destaque Removido", "Nenhum card está marcado com destaque visual.", "bi bi-info-circle text-primary");
        }
      }
    }

    function alternarDestaqueCard(cardId) {
      const cardAlvo = document.getElementById(cardId) || document.querySelector(`[data-card-id="${cardId}"]`);
      const jaDestacado = cardAlvo && cardAlvo.classList.contains('roteiro-highlight');
      if (jaDestacado) {
        aplicarDestaqueCard('', true);
      } else {
        aplicarDestaqueCard(cardId, true);
      }
    }

    function selecionarCardDestaque(cardId) {
      aplicarDestaqueCard(cardId, true);
    }

    function limparDestaqueCards() {
      aplicarDestaqueCard('', true);
    }

    window.addEventListener("DOMContentLoaded", () => {
      carregarDados();
      initModoDocente();
      popularSelectsDeDemanda();
      renderizarDemandas();
      trocarSubAbaNotas('entregas');
      popularSelectEstudantesVotacao();
      renderizarPainelVotacao();
      carregarDemandasSNCT();
      renderizarQuadroDemandasSNCT();
      renderizarCardHeroRoteirosSNCT();
      initDestaqueCards();
      initGoogleAuth();
      renderizarCardMinhaFrenteEstudante();
      sincronizarComBackendAppsScript(false);

      if (window.PROGWEB2_CONFIG && window.PROGWEB2_CONFIG.syncIntervalMs) {
        setInterval(() => sincronizarComBackendAppsScript(false), window.PROGWEB2_CONFIG.syncIntervalMs);
      }

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          sincronizarComBackendAppsScript(false);
        }
      });

      // Verificar hash da URL na carga (ex: #tab-demandas ou #tab-avaliacao)
      const hash = window.location.hash ? window.location.hash.substring(1) : "";
      if (hash && document.getElementById(hash)) {
        showTab(hash, false);
      }
    });


// =========================================================================
// REGISTRO DE COMPATIBILIDADE GLOBAL PARA HANDLERS INLINE NO DOM
// =========================================================================
const funcoesGlobais = {
  abrirAreaDocenteDireto,
  abrirPainelFrentesGestao,
  abrirModalAlterarPrazoDemanda,
  abrirModalAuditoriaVotos,
  abrirModalAvaliarRubrica,
  abrirModalComunicadoDemanda,
  abrirModalEditarAluno,
  abrirModalEditarDemanda,
  abrirModalNovaDemanda,
  abrirModalNovaOficina,
  abrirModalNovoAluno,
  alocarAlunoEmFrenteDocente,
  alterarEquipeAlunoRapido,
  alternarConclusaoDemanda,
  alternarDestaqueCard,
  alternarEntregaAlvoDocente,
  alternarEtapaFrenteSNCT,
  aoMudarDemandaNoModalRubrica,
  aoMudarEquipeNoModalRubrica,
  aoMudarEstudanteVotante,
  aoMudarTargetComunicadoDocente,
  aoMudarTipoAtribuicao,
  atualizarContadorAlvosAlunos,
  candidatarEstudanteSNCT,
  cobrarCandidaturasPendentesEmail,
  confirmarAlteracaoPrazoDemanda,
  confirmarEnvioComunicadoDemanda,
  copiarDevolutivaModalRubrica,
  copiarDevolutivaTexto,
  copySimpleLink,
  copyToClipboard,
  desistirCandidaturaSNCT,
  dispararEmailTurmaCompleta,
  editarLinkEntregaSNCT,
  efetuarLogoutGoogle,
  excluirAluno,
  excluirDemanda,
  excluirOpcaoOficina,
  exportarAuditoriaVotosTSV,
  exportarDadosDemandas,
  exportarTabelaFechamentoSIGAA,
  fecharModalAlterarPrazo,
  fecharModalAluno,
  fecharModalAuditoriaVotos,
  fecharModalComunicadoDemanda,
  fecharModalDemanda,
  fecharModalNovaOficina,
  fecharModalRubrica,
  filtrarDemandas,
  filtrarListaAlvosAlunos,
  importarDadosDemandas,
  iniciarLoginGoogle,
  inserirModeloChecklistMoodleComunicado,
  limparDestaqueCards,
  marcarTodosAlvos,
  navegarParaDemandasSNCT,
  navegarParaEtapaSNCT,
  notificarEquipeEmail,
  prepararDemandaParaAlvoDocente,
  processarImportacaoAlunos,
  publicarComunicadoDemandaDocente,
  reenviarAlertaDemanda,
  registrarMinhaEntrega,
  registrarVoto,
  reiniciarVotacao,
  renderizarAreaDocente,
  renderizarCardMinhaFrenteEstudante,
  renderizarTabelaRubricas,
  restaurarDemandasPadrao,
  restaurarDemandasPadraoSNCT,
  salvarAluno,
  salvarAvaliacaoRubrica,
  salvarDemanda,
  salvarNovaOficina,
  selecionarCardDestaque,
  selecionarNivelRubrica,
  showTab,
  sincronizarComBackendAppsScript,
  solicitarAcessoDocente,
  toggleModoDocente,
  toggleTheme,
  trocarSubAbaNotas
};

Object.entries(funcoesGlobais).forEach(([nome, fn]) => {
  if (typeof fn === "function") {
    window[nome] = fn;
  }
});


console.info("🚀 [ProgWeb 2] Frontend inicializado com arquitetura ES6 Modules!");
