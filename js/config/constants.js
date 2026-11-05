/**
 * Configurações estáticas, chaves de armazenamento e dados padrão
 * Unidade Curricular: Programação para a Internet 2 (IFSC Garopaba)
 */

export const STORAGE_KEY_DEMANDAS = 'progweb2_demandas_data';
export const STORAGE_KEY_AVALIACOES = 'progweb2_rubricas_avaliacoes';
export const STORAGE_KEY_ALUNOS = 'progweb2_alunos_data';
export const STORAGE_KEY_MODO_DOCENTE = 'progweb2_modo_docente';
export const STORAGE_KEY_OFICINAS_VOTACAO = 'progweb2_oficinas_votacao_v1';
export const STORAGE_KEY_VOTOS_OFICINAS = 'progweb2_votos_oficinas_v1';
export const STORAGE_KEY_ULTIMO_VOTANTE = 'progweb2_ultimo_votante';
export const STORAGE_KEY_GOOGLE_SESSION = 'progweb2_google_session_v1';
export const STORAGE_KEY_DEMANDAS_SNCT = 'progweb2_demandas_snct_v1';
export const STORAGE_KEY_DOCENTE_AUTH = 'progweb2_docente_autenticado_v1';
export const STORAGE_KEY_VISIBILIDADE_MODULOS = 'progweb2_visibilidade_modulos_estudantes';

export const MODULOS_SISTEMA_PADRAO = [
  { id: 'tab-roteiros', nome: '1. Roteiros Práticos', icone: 'bi bi-code-square', cor: 'text-success', grupo: 'Laboratório & Aulas', descricao: 'Caderno de roteiros práticos, guias em PDF e tarefas guiadas', padraoVisivel: true, fixo: true },
  { id: 'tab-cronograma', nome: '2. Cronograma Semestral', icone: 'bi bi-calendar-range-fill', cor: 'text-info', grupo: 'Laboratório & Aulas', descricao: 'Planejamento das 20 aulas semanais e marcos da disciplina', padraoVisivel: true, fixo: false },
  { id: 'tab-extensao', nome: '3. Extensão SNCT (40h)', icone: 'bi bi-megaphone-fill', cor: 'text-purple', grupo: 'Extensão & Entregas', descricao: 'Curricularização, 8 frentes de produção e oficinas de 120 min', padraoVisivel: true, fixo: false },
  { id: 'tab-demandas', nome: '4. Demandas & Checkpoints', icone: 'fa-solid fa-list-check', cor: 'text-warning', grupo: 'Extensão & Entregas', descricao: 'Mural de demandas da semana, prazos e recados das equipes', padraoVisivel: true, fixo: false },
  { id: 'tab-raio-x', nome: '0. Raio-X & Panorama Geral', icone: 'bi bi-speedometer2', cor: 'text-primary', grupo: 'Visão Geral', descricao: 'Panorama conceitual, arquitetura em camadas e objetivos da UC', padraoVisivel: false, fixo: false },
  { id: 'tab-avaliacao', nome: '5. Sistema Avaliativo & Rubricas', icone: 'bi bi-calculator-fill', cor: 'text-warning', grupo: 'Avaliação & PPC', descricao: 'Critérios das avaliações A1, A2 e A3 e simulador de notas', padraoVisivel: false, fixo: false },
  { id: 'tab-ementa', nome: '6. Ementa Oficial & PPC', icone: 'bi bi-book-half', cor: 'text-secondary', grupo: 'Avaliação & PPC', descricao: 'Conteúdo programático formal e bibliografia básica/complementar', padraoVisivel: false, fixo: false },
  { id: 'tab-sigaa', nome: '7. Central de Tarefas no SIGAA', icone: 'bi bi-mortarboard-fill', cor: 'text-primary', grupo: 'Avaliação & PPC', descricao: 'Controle de prazos e sincronização de envios no SIGAA', padraoVisivel: false, fixo: false }
];

export const DETALHES_FRENTES_SNCT = {
  'c1-frente-didatica': {
    entregavelEtapa2: 'Micro-Roteiro Cirúrgico de 4 págs (PDF) & 5 Seções da Sala no Moodle',
    orientacao: 'Elaborar o micro-roteiro em LaTeX no padrão visual da UC e estruturar as 5 seções da sala do Curso 1 no Moodle institucional (papel de Professor).',
    checklist: [
      'Micro-roteiro em LaTeX compilado em PDF de até 4 páginas',
      'Configuração das 5 seções da Sala 2663 do Moodle IFSC',
      'Revisão dos passos didáticos com os trios das outras frentes'
    ]
  },
  'c1-frente-starterkit': {
    entregavelEtapa2: 'Repositório Template GitHub & Pacote starter-kit-snct.zip no Moodle',
    orientacao: 'Disponibilizar o repositório template (HTML5, CSS com :root e botão WhatsApp flutuante), fazer upload do zip na Seção 1 do Moodle e testar no pen-drive.',
    checklist: [
      'Repositório template no GitHub com código limpo e comentado',
      'Arquivo starter-kit-snct.zip publicado na Seção 1 do Moodle (id=2663)',
      'Pen-drive de Plano B para contingência offline no laboratório'
    ]
  },
  'c1-frente-slides': {
    entregavelEtapa2: 'Slides-Guia de 8 Telas no GitHub Pages & Link na Seção 0 do Moodle',
    orientacao: 'Apresentação em HTML/Bootstrap 5 de 8 telas para projeção na TV/telão do laboratório, sincronizada com o roteiro e vinculada na Seção 0 do Moodle.',
    checklist: [
      'Slides interativos de 8 telas responsivas com Bootstrap 5',
      'Deploy publicado e acessível no GitHub Pages',
      'Link da apresentação inserido na Seção 0 do Moodle (id=2663)'
    ]
  },
  'c1-frente-monitoria': {
    entregavelEtapa2: 'Chave de Inscrição SNCT2026, Pesquisa na Seção 4 & Escala de Bancada',
    orientacao: 'Configurar a autoinscrição (chave SNCT2026) e formulário de avaliação de 3 perguntas na Seção 4 do Moodle, escala de bancada dos 2 labs e fotos.',
    checklist: [
      'Autoinscrição com chave SNCT2026 validada na Sala 2663 do Moodle',
      'Pesquisa de satisfação de 3 perguntas na Seção 4 do Moodle',
      'Escala presencial de bancada e lista de presença impressa'
    ]
  },
  'c2-frente-didatica': {
    entregavelEtapa2: 'Micro-Roteiro Cirúrgico Painel Verde & 5 Seções da Sala no Moodle',
    orientacao: 'Redigir micro-roteiro cirúrgico em LaTeX (4 págs.) focado no componente interativo de coleta seletiva e organizar as 5 seções da sala do Curso 2 no Moodle.',
    checklist: [
      'Micro-roteiro em LaTeX compilado em PDF (máx. 4 páginas)',
      'Estruturação das 5 seções da Sala 2664 no Moodle IFSC',
      'Alinhamento do fluxo prático com os trios do Curso 2'
    ]
  },
  'c2-frente-starterkit': {
    entregavelEtapa2: 'Repositório GitHub de Ecopontos & starter-kit-painel-verde.zip',
    orientacao: 'Código base com filtro dinâmico de bairros e ecopontos, upload do starter-kit-painel-verde.zip na Seção 1 do Moodle e pen-drive de contingência.',
    checklist: [
      'Código base com tabela e filtro de ecopontos funcional',
      'Pacote starter-kit-painel-verde.zip publicado na Seção 1 do Moodle (id=2664)',
      'Cópia em pen-drive para execução offline de contingência'
    ]
  },
  'c2-frente-slides': {
    entregavelEtapa2: 'Slides-Guia Painel Verde no GitHub Pages & Link na Seção 0 do Moodle',
    orientacao: 'Apresentação de 8 telas com passo a passo ilustrado do painel interativo no GitHub Pages e link/PDF na Seção 0 do Moodle.',
    checklist: [
      'Apresentação de slides de 8 telas no GitHub Pages',
      'Link da apresentação inserido na Seção 0 do Moodle (id=2664)',
      'Versão em PDF para backup no computador do laboratório'
    ]
  },
  'c2-frente-monitoria': {
    entregavelEtapa2: 'Chave SNCT2026, Pesquisa na Seção 4 & Escala do Lab de Informática',
    orientacao: 'Chave de acesso institucional no Moodle Curso 2, pesquisa de 3 perguntas na Seção 4, organização das máquinas do lab e registro fotográfico.',
    checklist: [
      'Chave de autoinscrição SNCT2026 testada na Sala 2664 do Moodle',
      'Pesquisa de satisfação configurada na Seção 4 do Moodle',
      'Escala presencial de monitores para auxílio de bancada'
    ]
  }
};

export const ETAPAS_PADRAO_FRENTE_SNCT = [
      "1. Candidatura & divisão (27/10)",
      "2. Rascunho & sala no Moodle (30/10)",
      "3. Revisão cruzada & ensaio no lab"
    ];

export const DEMANDAS_PADRAO_SNCT = [
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

export const OFICINAS_PADRAO_SNCT = [
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

export const EQUIPES_PROGWEB2 = [
      "Equipe 1 — Vitrine Comercial & Negócios Locais",
      "Equipe 2 — Portal PetCare (Adoção Animal)",
      "Equipe 3 — Ecoturismo & Trilhas de Garopaba",
      "Equipe 4 — Monitoramento das Praias",
      "Equipe 5 — Feira Agroecológica Local",
      "Equipe 6 — Acessibilidade em Espaços Públicos"
    ];

export const ESTUDANTES_PADRAO = [
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

export const DEMANDAS_INICIAIS = [
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
