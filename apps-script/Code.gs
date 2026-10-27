/**
 * ProgWeb 2 (IFSC Garopaba) — Backend Google Apps Script (Padrão Unificado PI-I & PI-II)
 * Unidade Curricular: Programação para a Internet II (CST em Sistemas para Internet)
 *
 * Funcionalidades:
 * - Gestão de Demandas & Checkpoints (criarDemanda, alterarPrazoDemanda, notificarDemanda, concluirDemanda, removerDemanda)
 * - Disparo automático de e-mails em HTML rico (GmailApp) idêntico ao formato de PI-1 e PI-2:
 *     • Nova Demanda / Checkpoint Docente (Cabeçalho Verde IFSC #16a34a)
 *     • Lembrete de Prazo de Demanda Pendente (Cabeçalho Âmbar #d97706)
 *     • Comunicado / Esclarecimento da Equipe Docente (Cabeçalho Roxo #7c3aed)
 *     • Atualização / Prorrogação de Prazo de Entrega (Cabeçalho Azul Oceano #0284c7)
 *     • Avaliação por Rubrica & Devolutiva Formativa (Cabeçalho Esmeralda #059669)
 *     • Notificação ao Docente quando estudante registra entrega ou candidatura SNCT
 * - Votação em tempo real para a 2ª Oficina da SNCT (com auditoria nominal)
 * - Candidaturas e links de entrega das 8 Frentes de Trabalho da SNCT (Curso 1 e Curso 2)
 * - Menu customizado na própria planilha (onOpen) para disparo direto de notificações
 *
 * Implantação: veja o passo a passo em apps-script/README-IMPLANTACAO.md
 */

// ============================ CONFIGURAÇÃO ============================
var CONFIG = {
  NOME_PLANILHA: 'ProgWeb2 — Votação SNCT, Demandas & Avaliações (IFSC Garopaba)',
  GOOGLE_CLIENT_ID: '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com',
  DASHBOARD_URL: 'https://chameoandre.github.io/CST-Sistemas-para-internet-programacao-para-internet-2/',
  NOME_REMETENTE: 'Programação para Internet II • IFSC Garopaba',
  DISCIPLINA_CURTA: 'ProgWeb 2',
  DOCENTES: [
    'andre.moraes@ifsc.edu.br',
    'chameoandre@gmail.com'
  ],
  DOMINIOS_PERMITIDOS: ['ifsc.edu.br', 'aluno.ifsc.edu.br'],
  NOTIFICAR_EMAIL: true
};

var CAB_DEMANDAS = [
  'id', 'data', 'projeto', 'titulo', 'descricao', 'prazo', 'hora_prazo',
  'criado_por', 'status', 'concluida_em', 'evidencia', 'concluida_por',
  'pontos', 'criterios', 'instrumento', 'atribuicao_json', 'entregas_json'
];

// ============================ MENU NA PLANILHA ============================
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('🚀 ProgWeb 2 — Automação de E-mails')
      .addItem('1. Inicializar / Verificar Abas da Planilha', 'instalar')
      .addSeparator()
      .addItem('📧 Disparar Nova Demanda da Linha Selecionada (Aba Demandas)', 'menuDispararNovaDemandaLinha_')
      .addItem('⏳ Enviar Lembrete de Prazo da Linha Selecionada (Aba Demandas)', 'menuDispararLembreteLinha_')
      .addItem('📢 Cobrar Estudantes sem Candidatura SNCT por E-mail', 'menuCobrarPendentesSnct_')
      .addToUi();
  } catch (e) {
    Logger.log('onOpen fora do contexto de UI: ' + e);
  }
}

// ============================ INSTALAÇÃO INICIAL ============================
/**
 * Execute esta função UMA VEZ no editor do Apps Script para criar ou atualizar
 * a planilha de controle no seu Google Drive e configurar todas as abas.
 */
function instalar() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SPREADSHEET_ID');
  var ss = null;

  if (sheetId) {
    try {
      ss = SpreadsheetApp.openById(sheetId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    try {
      var active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) ss = active;
    } catch (e) {}
  }

  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.NOME_PLANILHA);
  }

  props.setProperty('SPREADSHEET_ID', ss.getId());
  Logger.log('Planilha vinculada com sucesso: ' + ss.getUrl());

  // 1. Aba Votos_SNCT
  var abaVotos = obterOuCriarAba(ss, 'Votos_SNCT');
  if (abaVotos.getLastRow() === 0) {
    abaVotos.appendRow(['data_hora', 'aluno_id', 'aluno_nome', 'matricula', 'email', 'opcao_id', 'opcao_titulo']);
    formatarCabecalho(abaVotos, '#4f46e5');
  }

  // 2. Aba Oficinas_Opcoes
  var abaOficinas = obterOuCriarAba(ss, 'Oficinas_Opcoes');
  if (abaOficinas.getLastRow() === 0) {
    abaOficinas.appendRow(['id', 'titulo', 'categoria', 'icone', 'descricao', 'publico', 'criada_por_docente']);
    formatarCabecalho(abaOficinas, '#7c3aed');
    abaOficinas.appendRow([
      'oficina-vitrine',
      'Vitrine para Empreendedores Locais',
      'Economia Local & Comércio',
      'bi-shop',
      'Oficina prática para comerciantes, feirantes e autônomos locais criarem um catálogo responsivo em Bootstrap 5 com botão de pedidos direto via WhatsApp.',
      'Comerciantes locais, feirantes e pequenos empreendedores de Garopaba.',
      'false'
    ]);
    abaOficinas.appendRow([
      'oficina-quiz',
      'JavaScript: Quiz Interativo',
      'Vocação em TI & Juventude',
      'bi-controller',
      'Voltada a estudantes de escolas públicas municipais e estaduais, explorando lógica, manipulação do DOM e contagem de pontos dinâmica em tempo real no navegador.',
      'Estudantes do Ensino Fundamental e Médio da rede pública.',
      'false'
    ]);
    abaOficinas.appendRow([
      'oficina-verde',
      'Painel Verde: Coleta Seletiva & Ecopontos',
      'Sustentabilidade & Meio Ambiente',
      'bi-recycle',
      'Alinhada à vocação ambiental de Garopaba e ao tema da SNCT: criação de página com filtros por resíduos recicláveis (vidro, plástico) e mapa interativo de ecopontos.',
      'Comunidade geral, ambientalistas e associações de bairro.',
      'false'
    ]);
  }

  // 3. Aba Demandas (Unificada com o padrão PI-1 e PI-2)
  var abaDemandas = obterOuCriarAba(ss, 'Demandas');
  if (abaDemandas.getLastRow() === 0) {
    abaDemandas.appendRow(CAB_DEMANDAS);
    formatarCabecalho(abaDemandas, '#16a34a');

    var agoraIso = new Date().toISOString();
    var demandasIniciais = [
      [
        'DEM-SNCT-01', agoraIso, '*',
        'Passo 1 (Prazo Terça 27/10 às 23:59): Candidatura em uma das 8 Frentes da SNCT (Curso 1 ou Curso 2)',
        'Escolha sua frente de trabalho (3 vagas por frente) na Aba 3 — Curricularização da Extensão. São 4 frentes para o Curso 1 (Meu Primeiro Site no Ar) e 4 frentes para o Curso 2 (Painel Verde: Coleta Seletiva & Ecopontos).',
        '2026-10-27', '23:59', 'Prof. André Moraes', 'pendente', '', '', '', '10,0',
        'Autenticar-se com e-mail institucional no portal\nConfirmar vaga em 1 das 8 frentes (4 do Curso 1 ou 4 do Curso 2)\nBaixar o Roteiro Operacional em PDF da sua frente',
        'A2', JSON.stringify({ tipoAtribuicao: 'turma', equipesAlvo: [], alunosAlvo: [], fixadaMural: true }), '{}'
      ],
      [
        'DEM-SNCT-C1', agoraIso, 'CURSO-1',
        'Curso 1 (Meu 1º Site no Ar): Produção do Material, Sala Moodle & Starter Kit até 30/10',
        'Produção das 4 frentes do Curso 1 (Frente 1.1 Apostila/Moodle, Frente 1.2 Starter Kit HTML/CSS, Frente 1.3 Slides & Quiz, Frente 1.4 Monitoria & Deploy GitHub Pages).',
        '2026-10-30', '23:59', 'Prof. André Moraes', 'pendente', '', '', '', '10,0',
        'Seguir a seção do Curso 1 no PDF da sua frente\nConfigurar a Sala Moodle do Curso 1 como Professor\nRegistrar o link do repositório GitHub / sala Moodle no card da frente',
        'A2', JSON.stringify({ tipoAtribuicao: 'turma', cursoSnctAlvo: 1, fixadaMural: true, linkApoio: 'snct-frentes/BRIEFING.md' }), '{}'
      ],
      [
        'DEM-SNCT-C2', agoraIso, 'CURSO-2',
        'Curso 2 (Painel Verde Garopaba): Produção do Material, Sala Moodle & Starter Kit até 30/10',
        'Produção das 4 frentes do Curso 2 (Frente 2.1 Guia Ambiental/Moodle, Frente 2.2 Starter Kit Painel Verde JS, Frente 2.3 Slides & Quiz Ambiental, Frente 2.4 Monitoria & Deploy GitHub Pages).',
        '2026-10-30', '23:59', 'Prof. André Moraes', 'pendente', '', '', '', '10,0',
        'Seguir a seção do Curso 2 no PDF da sua frente\nConfigurar a Sala Moodle do Curso 2 como Professor\nRegistrar o link do repositório GitHub / sala Moodle no card da frente',
        'A2', JSON.stringify({ tipoAtribuicao: 'turma', cursoSnctAlvo: 2, fixadaMural: true, linkApoio: 'snct-frentes/BRIEFING.md' }), '{}'
      ]
    ];
    demandasIniciais.forEach(function(d) { abaDemandas.appendRow(d); });
  } else {
    garantirColunasDemandas_(abaDemandas);
  }

  // 4. Aba Avaliacoes
  var abaAvaliacoes = obterOuCriarAba(ss, 'Avaliacoes');
  if (abaAvaliacoes.getLastRow() === 0) {
    abaAvaliacoes.appendRow(['id', 'data_hora', 'equipe', 'demanda_id', 'instrumento', 'nota', 'feedback', 'link_repo', 'avaliador', 'dimensoes_json']);
    formatarCabecalho(abaAvaliacoes, '#059669');
  }

  // 5. Aba Estudantes
  var abaEstudantes = obterOuCriarAba(ss, 'Estudantes');
  if (abaEstudantes.getLastRow() === 0) {
    abaEstudantes.appendRow(['id', 'matricula', 'nome', 'equipe', 'email', 'ativo']);
    formatarCabecalho(abaEstudantes, '#334155');

    var estudantes = [
      ['1', '202510706080', 'Antonio Duarte de Avila Neto', 'Sem equipe definida', 'antonioduarte1991@hotmail.com', 'true'],
      ['2', '202510704356', 'Arthur Bressan Silva', 'Sem equipe definida', 'arthurbressan789@gmail.com', 'true'],
      ['3', '202510704359', 'Bernardo Luz da Silva', 'Sem equipe definida', 'bernardinholuz@gmail.com', 'true'],
      ['4', '202510704126', 'Caio Siega Larroque', 'Sem equipe definida', 'caio1611sl@gmail.com', 'true'],
      ['5', '202510704365', 'Felipe Machado da Silveira', 'Sem equipe definida', 'felipems3004@gmail.com', 'true'],
      ['6', '202510704131', 'Gustavo Freitas Lima', 'Sem equipe definida', 'sinarasurfvilla@hotmail.com', 'true'],
      ['7', '202510705413', 'Henrique de Souza Figueredo', 'Sem equipe definida', 'figueredosouzahenrique@gmail.com', 'true'],
      ['8', '202510706851', 'Henrique Marcondes de Medeiros', 'Sem equipe definida', 'henrique.marcondes@outlook.com', 'true'],
      ['9', '202510704132', 'Igor Goncalves Pinheiro', 'Sem equipe definida', 'igorgoncalvesp20@gmail.com', 'true'],
      ['10', '202510704367', 'Igor Strauch Perrot', 'Sem equipe definida', 'igorperrot006@gmail.com', 'true'],
      ['11', '202510704139', 'Jhulia Vitoria Adao dos Santos', 'Sem equipe definida', 'jhuliavitoria226@gmail.com', 'true'],
      ['12', '202510704146', 'Julia Melo Fonseca', 'Sem equipe definida', 'mfjulia07@gmail.com', 'true'],
      ['13', '202510704369', 'Kauan Souza de Oliveira', 'Sem equipe definida', 'kauansouzadeoliveira12@gmail.com', 'true'],
      ['14', '202510705417', 'Luana Lazzarin Toebe', 'Sem equipe definida', 'luanalazzarinrodrigues@gmail.com', 'true'],
      ['15', '202510706157', 'Marina Carmen Cornelius', 'Sem equipe definida', 'marina.c.cornelius@gmail.com', 'true'],
      ['16', '202510704351', 'Pietro Caetano Fleith', 'Sem equipe definida', 'ceco1995@gmail.com', 'true'],
      ['17', '202510704374', 'Rafael Bittencourt Fenianos', 'Sem equipe definida', 'fenianosrafael@gmail.com', 'true'],
      ['18', '202510704352', 'Renan Gomes Pinto', 'Sem equipe definida', 'rgomespinto19@gmail.com', 'true'],
      ['19', '202523204395', 'Sabrina Moro Villela Pacheco', 'Sem equipe definida', 'sabrinap@ifsc.edu.br', 'true'],
      ['20', '202510706162', 'Samuel da Silveira Dick', 'Sem equipe definida', 'samuka.silveira@gmail.com', 'true'],
      ['21', '202510704353', 'Valentim Aita do Nascimento', 'Sem equipe definida', 'valentim.2018307217@aluno.iffar.edu.br', 'true'],
      ['22', '202510704379', 'Victor Fioravante Xavier', 'Sem equipe definida', 'victor.f2006@aluno.ifsc.edu.br', 'true'],
      ['23', '202510704380', 'Victor Sirigu Hasegawa', 'Sem equipe definida', 'victor.sirigu@gmail.com', 'true'],
      ['24', '202510704355', 'Yan Martins Ody', 'Sem equipe definida', 'yanescoteiro@gmail.com', 'true']
    ];

    estudantes.forEach(function(est) {
      abaEstudantes.appendRow(est);
    });
  }

  // 6. Aba Candidaturas_SNCT (Frentes de Trabalho da Turma)
  var abaCandidaturas = obterOuCriarAba(ss, 'Candidaturas_SNCT');
  if (abaCandidaturas.getLastRow() === 0) {
    abaCandidaturas.appendRow(['data_hora', 'frente_id', 'frente_titulo', 'aluno_id', 'aluno_nome', 'matricula', 'email', 'link_entrega']);
    formatarCabecalho(abaCandidaturas, '#10b981');
  }

  Logger.log('Instalação concluída com sucesso! Planilha: ' + ss.getUrl());
  return ss.getUrl();
}

function garantirColunasDemandas_(aba) {
  if (!aba || aba.getLastRow() < 1) return;
  var lastCol = aba.getLastColumn();
  if (lastCol < CAB_DEMANDAS.length) {
    aba.getRange(1, 1, 1, CAB_DEMANDAS.length).setValues([CAB_DEMANDAS]);
    formatarCabecalho(aba, '#16a34a');
  }
}

// ============================ ENDPOINTS HTTP ============================

function doGet(e) {
  try {
    var ss = obterPlanilha();
    if (!ss) {
      return jsonResponse({ ok: false, erro: 'Planilha não instalada. Execute instalar() no editor.' });
    }

    var votos = lerAbaComoObjetos(ss.getSheetByName('Votos_SNCT'));
    var oficinas = lerAbaComoObjetos(ss.getSheetByName('Oficinas_Opcoes'));
    var demandas = lerDemandasPublicas_(ss);
    var avaliacoes = lerAbaComoObjetos(ss.getSheetByName('Avaliacoes'));
    var estudantes = lerAbaComoObjetos(ss.getSheetByName('Estudantes'));
    var abaCand = ss.getSheetByName('Candidaturas_SNCT');
    var candidaturas = abaCand ? lerAbaComoObjetos(abaCand) : [];

    return jsonResponse({
      ok: true,
      votos: votos,
      oficinas: oficinas,
      demandas: demandas,
      avaliacoes: avaliacoes,
      estudantes: estudantes,
      candidaturas: candidaturas,
      atualizado_em: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({ ok: false, erro: String(err.message || err) });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, erro: 'Requisição sem corpo JSON.' });
    }

    var req = JSON.parse(e.postData.contents);
    var acao = req.acao;
    var ss = obterPlanilha();

    if (!ss) {
      instalar();
      ss = obterPlanilha();
    }

    // ------------------------------------------------------------------
    // 1. GESTÃO DE DEMANDAS & NOTIFICAÇÕES AUTOMÁTICAS (PADRÃO PI-1 / PI-2)
    // ------------------------------------------------------------------
    if (acao === 'criarDemanda' || acao === 'criar_demanda' || acao === 'salvar_demanda') {
      return jsonResponse(criarOuSalvarDemanda_(ss, req));
    }

    if (acao === 'alterarPrazoDemanda' || acao === 'alterar_prazo_demanda') {
      return jsonResponse(alterarPrazoDemanda_(ss, req));
    }

    if (acao === 'notificarDemanda' || acao === 'notificar_demanda') {
      return jsonResponse(notificarDemanda_(ss, req));
    }

    if (acao === 'concluirDemanda' || acao === 'concluir_demanda' || acao === 'registrar_entrega_demanda') {
      return jsonResponse(concluirDemanda_(ss, req));
    }

    if (acao === 'removerDemanda' || acao === 'remover_demanda') {
      return jsonResponse(removerDemanda_(ss, req));
    }

    // ------------------------------------------------------------------
    // 2. AVALIAÇÃO POR RUBRICA & DEVOLUTIVA AUTOMÁTICA POR E-MAIL
    // ------------------------------------------------------------------
    if (acao === 'salvar_avaliacao' || acao === 'salvarAvaliacao') {
      return jsonResponse(salvarAvaliacao_(ss, req));
    }

    // ------------------------------------------------------------------
    // 3. COMUNICADO DIRETO / DISPARO EM LOTE COM TEMPLATE HTML PI-2
    // ------------------------------------------------------------------
    if (acao === 'disparar_email_turma' || acao === 'enviar_comunicado_html') {
      return jsonResponse(dispararComunicadoHtml_(ss, req));
    }

    // ------------------------------------------------------------------
    // 4. VOTAÇÃO EM OFICINA DA SNCT
    // ------------------------------------------------------------------
    if (acao === 'votar_oficina') {
      var abaVotos = obterOuCriarAba(ss, 'Votos_SNCT');
      var alunoId = String(req.alunoId || '');
      var alunoNome = req.alunoNome || '';
      var matricula = req.matricula || '';
      var email = req.email || '';
      var opcaoId = req.opcaoId || '';
      var opcaoTitulo = req.opcaoTitulo || '';
      var agora = new Date().toLocaleString('pt-BR');

      if (!alunoId || !opcaoId || !email) {
        return jsonResponse({ ok: false, erro: 'Identificação por conta Google (e-mail) é obrigatória para computar o voto.' });
      }

      var dados = abaVotos.getDataRange().getValues();
      var linhaExistente = -1;
      for (var i = 1; i < dados.length; i++) {
        if (String(dados[i][1]) === alunoId || (email && String(dados[i][4]).toLowerCase() === email.toLowerCase())) {
          linhaExistente = i + 1;
          break;
        }
      }

      if (linhaExistente !== -1) {
        abaVotos.getRange(linhaExistente, 1).setValue(agora);
        abaVotos.getRange(linhaExistente, 6).setValue(opcaoId);
        abaVotos.getRange(linhaExistente, 7).setValue(opcaoTitulo);
      } else {
        abaVotos.appendRow([agora, alunoId, alunoNome, matricula, email, opcaoId, opcaoTitulo]);
      }

      return jsonResponse({ ok: true, mensagem: 'Voto registrado com sucesso no backend!', aluno: alunoNome, opcaoId: opcaoId });
    }

    if (acao === 'adicionar_oficina') {
      var abaOf = obterOuCriarAba(ss, 'Oficinas_Opcoes');
      var idOf = req.id || ('oficina-docente-' + new Date().getTime());
      abaOf.appendRow([
        idOf,
        req.titulo || '',
        req.categoria || '',
        req.icone || 'bi-laptop',
        req.descricao || '',
        req.publico || '',
        'true'
      ]);
      return jsonResponse({ ok: true, id: idOf, mensagem: 'Oficina adicionada com sucesso!' });
    }

    if (acao === 'zerar_votacao') {
      var abaV = obterOuCriarAba(ss, 'Votos_SNCT');
      var totalLinhas = abaV.getLastRow();
      if (totalLinhas > 1) {
        abaV.deleteRows(2, totalLinhas - 1);
      }
      return jsonResponse({ ok: true, mensagem: 'Votação zerada com sucesso na planilha!' });
    }

    // ------------------------------------------------------------------
    // 5. CANDIDATURAS & ENTREGAS DAS FRENTES DA SNCT (CURSO 1 E CURSO 2)
    // ------------------------------------------------------------------
    if (acao === 'candidatar_frente_snct') {
      var abaCand = obterOuCriarAba(ss, 'Candidaturas_SNCT');
      if (abaCand.getLastRow() === 0) {
        abaCand.appendRow(['data_hora', 'frente_id', 'frente_titulo', 'aluno_id', 'aluno_nome', 'matricula', 'email', 'link_entrega']);
        formatarCabecalho(abaCand, '#10b981');
      }

      var frenteId = req.frenteId || '';
      var frenteTitulo = req.frenteTitulo || '';
      var alunoIdCand = String(req.alunoId || '');
      var alunoNomeCand = req.alunoNome || '';
      var matriculaCand = String(req.matricula || '');
      var emailCand = req.email || '';
      var agoraCand = new Date().toLocaleString('pt-BR');

      if (!frenteId || (!alunoIdCand && !matriculaCand)) {
        return jsonResponse({ ok: false, erro: 'Identificação do estudante e ID da frente são obrigatórios.' });
      }

      var dadosCand = abaCand.getDataRange().getValues();
      var vagasOcupadas = 0;
      var linhaExistenteCand = -1;

      for (var c = 1; c < dadosCand.length; c++) {
        var rowFrenteId = String(dadosCand[c][1]);
        var rowAlunoId = String(dadosCand[c][3]);
        var rowMatricula = String(dadosCand[c][5]);
        var rowEmail = String(dadosCand[c][6]).toLowerCase();

        if ((alunoIdCand && rowAlunoId === alunoIdCand) || (matriculaCand && rowMatricula === matriculaCand) || (emailCand && rowEmail === emailCand.toLowerCase())) {
          linhaExistenteCand = c + 1;
        }

        if (rowFrenteId === frenteId) {
          if (!((alunoIdCand && rowAlunoId === alunoIdCand) || (matriculaCand && rowMatricula === matriculaCand))) {
            vagasOcupadas++;
          }
        }
      }

      if (vagasOcupadas >= 3) {
        return jsonResponse({ ok: false, erro: 'As 3 vagas desta frente já foram preenchidas por outros colegas.' });
      }

      if (linhaExistenteCand !== -1) {
        abaCand.getRange(linhaExistenteCand, 1).setValue(agoraCand);
        abaCand.getRange(linhaExistenteCand, 2).setValue(frenteId);
        abaCand.getRange(linhaExistenteCand, 3).setValue(frenteTitulo);
        if (alunoNomeCand) abaCand.getRange(linhaExistenteCand, 5).setValue(alunoNomeCand);
        if (emailCand) abaCand.getRange(linhaExistenteCand, 7).setValue(emailCand);
      } else {
        abaCand.appendRow([agoraCand, frenteId, frenteTitulo, alunoIdCand, alunoNomeCand, matriculaCand, emailCand, '']);
      }

      // Notifica estudante e docente por e-mail sobre a confirmação da candidatura
      if (CONFIG.NOTIFICAR_EMAIL && req.notificarEmail !== false) {
        enviarEmailConfirmacaoCandidaturaSnct_(ss, {
          frenteId: frenteId,
          frenteTitulo: frenteTitulo,
          alunoId: alunoIdCand,
          alunoNome: alunoNomeCand,
          email: emailCand
        });
      }

      return jsonResponse({ ok: true, mensagem: 'Candidatura registrada com sucesso na planilha!', frenteId: frenteId });
    }

    if (acao === 'desistir_frente_snct') {
      var abaCandDes = obterOuCriarAba(ss, 'Candidaturas_SNCT');
      var frenteIdDes = req.frenteId || '';
      var alunoIdDes = String(req.alunoId || '');
      var matriculaDes = String(req.matricula || '');
      var emailDes = String(req.email || '').toLowerCase();

      var dadosDes = abaCandDes.getDataRange().getValues();
      var linhaParaRemover = -1;

      for (var dIdx = 1; dIdx < dadosDes.length; dIdx++) {
        var rFrenteId = String(dadosDes[dIdx][1]);
        var rAlunoId = String(dadosDes[dIdx][3]);
        var rMatricula = String(dadosDes[dIdx][5]);
        var rEmail = String(dadosDes[dIdx][6]).toLowerCase();

        var matchAluno = (alunoIdDes && rAlunoId === alunoIdDes) || (matriculaDes && rMatricula === matriculaDes) || (emailDes && rEmail === emailDes);
        if (matchAluno && (!frenteIdDes || rFrenteId === frenteIdDes)) {
          linhaParaRemover = dIdx + 1;
          break;
        }
      }

      if (linhaParaRemover !== -1) {
        abaCandDes.deleteRow(linhaParaRemover);
        return jsonResponse({ ok: true, mensagem: 'Vaga liberada com sucesso na planilha!' });
      }

      return jsonResponse({ ok: true, mensagem: 'Nenhuma candidatura ativa encontrada para remoção.' });
    }

    if (acao === 'salvar_link_entrega_snct') {
      var abaCandLink = obterOuCriarAba(ss, 'Candidaturas_SNCT');
      var frenteIdLink = req.frenteId || '';
      var alunoIdLink = String(req.alunoId || '');
      var matriculaLink = String(req.matricula || '');
      var emailLink = String(req.email || '').toLowerCase();
      var linkEntrega = req.linkEntrega || '';

      var dadosLink = abaCandLink.getDataRange().getValues();
      var linhaParaAtualizar = -1;
      var nomeAlunoEntrega = req.alunoNome || '';
      var tituloFrenteEntrega = '';

      for (var lIdx = 1; lIdx < dadosLink.length; lIdx++) {
        var lFrenteId = String(dadosLink[lIdx][1]);
        var lAlunoId = String(dadosLink[lIdx][3]);
        var lMatricula = String(dadosLink[lIdx][5]);
        var lEmail = String(dadosLink[lIdx][6]).toLowerCase();

        var matchAl = (alunoIdLink && lAlunoId === alunoIdLink) || (matriculaLink && lMatricula === matriculaLink) || (emailLink && lEmail === emailLink);
        if (matchAl && (!frenteIdLink || lFrenteId === frenteIdLink)) {
          linhaParaAtualizar = lIdx + 1;
          nomeAlunoEntrega = dadosLink[lIdx][4] || nomeAlunoEntrega;
          tituloFrenteEntrega = dadosLink[lIdx][2] || frenteIdLink;
          break;
        }
      }

      if (linhaParaAtualizar !== -1) {
        abaCandLink.getRange(linhaParaAtualizar, 8).setValue(linkEntrega);
        if (CONFIG.NOTIFICAR_EMAIL && linkEntrega) {
          enviarEmailNotificacaoDocente_(nomeAlunoEntrega, emailLink, tituloFrenteEntrega, 'Link de entrega SNCT atualizado', linkEntrega);
        }
        return jsonResponse({ ok: true, mensagem: 'Link de entrega registrado na planilha com sucesso!' });
      }

      return jsonResponse({ ok: false, erro: 'Candidatura não localizada para atualização do link.' });
    }

    return jsonResponse({ ok: false, erro: 'Ação não reconhecida: ' + acao });
  } catch (err) {
    return jsonResponse({ ok: false, erro: String(err.message || err) });
  }
}

// ============================================================================
// GESTÃO DE DEMANDAS & NOTIFICAÇÕES AUTOMÁTICAS (FORMATO PI-1 & PI-2)
// ============================================================================

function criarOuSalvarDemanda_(ss, body) {
  var aba = obterOuCriarAba(ss, 'Demandas');
  garantirColunasDemandas_(aba);

  var id = String(body.id || body.codigo || ('DEM-' + Date.now().toString(36).toUpperCase())).trim();
  var projeto = String(body.projeto || body.destinatario || '*').trim();
  var titulo = seguro_(body.titulo || '', 200);
  var descricao = seguro_(body.descricao || '', 4000);
  var prazo = seguro_(body.prazo || '', 30);
  var horaPrazo = seguro_(body.horaPrazo || '23:59', 10);
  var pontos = seguro_(String(body.pontos != null ? body.pontos : '10,0'), 30);
  var criteriosArr = Array.isArray(body.criterios) ? body.criterios : String(body.criterios || '').split('\n').filter(Boolean);
  var criteriosTxt = seguro_(criteriosArr.join('\n'), 3000);
  var instrumento = seguro_(body.instrumento || 'A2', 20);
  var autor = seguro_(body.autor || 'Prof. André Moraes', 100);
  var agora = new Date().toISOString();

  if (!titulo) throw new Error('Informe o título da demanda.');

  var atribuicaoObj = {
    tipoAtribuicao: body.tipoAtribuicao || 'turma',
    equipesAlvo: body.equipesAlvo || [],
    alunosAlvo: body.alunosAlvo || [],
    cursoSnctAlvo: body.cursoSnctAlvo || null,
    fixadaMural: Boolean(body.fixadaMural),
    linkApoio: body.linkApoio || ''
  };
  var atribuicaoJson = JSON.stringify(atribuicaoObj);
  var entregasJson = typeof body.entregas === 'object' ? JSON.stringify(body.entregas) : String(body.entregas || '{}');

  var dados = aba.getDataRange().getValues();
  var linhaExistente = -1;
  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]).toUpperCase() === id.toUpperCase()) {
      linhaExistente = i + 1;
      break;
    }
  }

  var linhaValores = [
    id, agora, projeto, titulo, descricao, prazo, horaPrazo,
    autor, body.concluida ? 'concluida' : 'pendente',
    body.concluidaEm || '', body.evidencia || '', body.concluidaPor || '',
    pontos, criteriosTxt, instrumento, atribuicaoJson, entregasJson
  ];

  if (linhaExistente > 1) {
    aba.getRange(linhaExistente, 1, 1, CAB_DEMANDAS.length).setValues([linhaValores]);
  } else {
    aba.appendRow(linhaValores);
  }

  var totalEnviados = 0;
  var deveNotificar = (body.notificarEmail !== false) && CONFIG.NOTIFICAR_EMAIL;
  if (deveNotificar) {
    var emailsDestino = resolverEmailsDestinatarios_(ss, {
      projeto: projeto,
      tipoAtribuicao: atribuicaoObj.tipoAtribuicao,
      equipesAlvo: atribuicaoObj.equipesAlvo,
      alunosAlvo: atribuicaoObj.alunosAlvo,
      cursoSnctAlvo: atribuicaoObj.cursoSnctAlvo,
      emailsExplicitos: body.destinatariosEmails || body.emails || []
    });

    totalEnviados = enviarEmailDemanda_(emailsDestino, {
      id: id,
      escopoTxt: projeto === '*' ? 'Geral (Toda a Turma — 24 Estudantes)' : projeto,
      titulo: titulo,
      descricao: descricao,
      prazo: prazo,
      horaPrazo: horaPrazo,
      autor: autor,
      pontos: pontos,
      criterios: criteriosTxt,
      linkApoio: atribuicaoObj.linkApoio
    });
  }

  return { ok: true, id: id, totalEnviados: totalEnviados };
}

function alterarPrazoDemanda_(ss, body) {
  var demandaId = String(body.demandaId || body.id || '').trim();
  var novoPrazo = seguro_(body.prazo || body.novoPrazo || '', 30);
  var novaHora = seguro_(body.horaPrazo || body.novaHora || '23:59', 10);
  var notificar = body.notificar !== false;
  var mensagem = seguro_(body.mensagem || '', 3000);
  var autor = seguro_(body.autor || 'Prof. André Moraes', 100);

  if (!demandaId) throw new Error('Demanda não informada.');
  if (!novoPrazo) throw new Error('Informe o novo prazo.');

  var aba = obterOuCriarAba(ss, 'Demandas');
  garantirColunasDemandas_(aba);
  var dados = aba.getDataRange().getValues();
  var dem = null;

  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]).toUpperCase() === demandaId.toUpperCase()) {
      var prazoAntigo = String(dados[i][5] || '');
      aba.getRange(i + 1, 6).setValue(novoPrazo);
      aba.getRange(i + 1, 7).setValue(novaHora);
      var atrib = {};
      try { atrib = JSON.parse(String(dados[i][15] || '{}')); } catch (e) {}

      dem = {
        id: dados[i][0],
        projeto: dados[i][2],
        titulo: dados[i][3],
        descricao: dados[i][4],
        prazoAnterior: prazoAntigo,
        novoPrazo: novoPrazo,
        horaPrazo: novaHora,
        criadoPor: dados[i][7] || autor,
        pontos: dados[i][12],
        criterios: dados[i][13],
        atribuicao: atrib
      };
      break;
    }
  }

  // Caso a demanda existisse apenas no cliente, cria na planilha e envia
  if (!dem && body.titulo) {
    criarOuSalvarDemanda_(ss, {
      id: demandaId,
      projeto: body.projeto || '*',
      titulo: body.titulo,
      descricao: body.descricao || '',
      prazo: novoPrazo,
      horaPrazo: novaHora,
      pontos: body.pontos || '10,0',
      criterios: body.criterios || '',
      notificarEmail: false
    });
    dem = {
      id: demandaId,
      projeto: body.projeto || '*',
      titulo: body.titulo,
      descricao: body.descricao || '',
      prazoAnterior: body.prazoAnterior || '',
      novoPrazo: novoPrazo,
      horaPrazo: novaHora,
      criadoPor: autor,
      pontos: body.pontos || '10,0',
      criterios: Array.isArray(body.criterios) ? body.criterios.join('\n') : (body.criterios || ''),
      atribuicao: {}
    };
  }

  if (!dem) throw new Error('Demanda não encontrada na planilha.');

  var totalEnviados = 0;
  if (notificar && CONFIG.NOTIFICAR_EMAIL) {
    totalEnviados = enviarNotificacaoDemandaCustom_(ss, dem, 'prazo', mensagem, autor, body.destinatariosEmails || body.emails || []);
  }

  return { ok: true, id: demandaId, novoPrazo: novoPrazo, horaPrazo: novaHora, totalEnviados: totalEnviados };
}

function notificarDemanda_(ss, body) {
  var demandaId = String(body.demandaId || body.id || '').trim();
  var tipo = String(body.tipo || 'lembrete'); // 'lembrete' | 'comunicado'
  var mensagem = seguro_(body.mensagem || '', 3000);
  var autor = seguro_(body.autor || 'Prof. André Moraes', 100);

  if (!demandaId) throw new Error('Demanda não informada.');

  var aba = obterOuCriarAba(ss, 'Demandas');
  garantirColunasDemandas_(aba);
  var dados = aba.getDataRange().getValues();
  var dem = null;

  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]).toUpperCase() === demandaId.toUpperCase()) {
      var atrib = {};
      try { atrib = JSON.parse(String(dados[i][15] || '{}')); } catch (e) {}
      dem = {
        id: dados[i][0],
        projeto: dados[i][2],
        titulo: dados[i][3],
        descricao: dados[i][4],
        prazo: dados[i][5],
        horaPrazo: dados[i][6] || '23:59',
        criadoPor: dados[i][7] || autor,
        pontos: dados[i][12],
        criterios: dados[i][13],
        atribuicao: atrib
      };
      break;
    }
  }

  // Se ainda não estava na aba Demandas, cadastra automaticamente com os dados vindos do frontend
  if (!dem && body.titulo) {
    criarOuSalvarDemanda_(ss, {
      id: demandaId,
      projeto: body.projeto || '*',
      titulo: body.titulo,
      descricao: body.descricao || '',
      prazo: body.prazo || '',
      horaPrazo: body.horaPrazo || '23:59',
      pontos: body.pontos || '10,0',
      criterios: body.criterios || '',
      notificarEmail: false
    });
    dem = {
      id: demandaId,
      projeto: body.projeto || '*',
      titulo: body.titulo,
      descricao: body.descricao || '',
      prazo: body.prazo || '',
      horaPrazo: body.horaPrazo || '23:59',
      criadoPor: autor,
      pontos: body.pontos || '10,0',
      criterios: Array.isArray(body.criterios) ? body.criterios.join('\n') : (body.criterios || ''),
      atribuicao: {}
    };
  }

  if (!dem) throw new Error('Demanda não encontrada.');

  var totalEnviados = enviarNotificacaoDemandaCustom_(ss, dem, tipo, mensagem, autor, body.destinatariosEmails || body.emails || []);
  return { ok: true, id: demandaId, tipo: tipo, totalEnviados: totalEnviados };
}

function concluirDemanda_(ss, body) {
  var demandaId = String(body.demandaId || body.id || '').trim();
  if (!demandaId) throw new Error('Demanda não informada.');

  var aba = obterOuCriarAba(ss, 'Demandas');
  garantirColunasDemandas_(aba);
  var dados = aba.getDataRange().getValues();
  var achou = false;
  var agora = new Date().toISOString();
  var autor = seguro_(body.autor || body.alunoNome || 'Estudante', 120);
  var emailAutor = String(body.email || '').trim();
  var evidencia = seguro_(body.evidencia || body.link || body.texto || '', 500);
  var chaveAlvo = String(body.chaveAlvo || '').trim();
  var tituloDemanda = demandaId;

  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]).toUpperCase() === demandaId.toUpperCase()) {
      tituloDemanda = String(dados[i][3] || demandaId);
      var entregasObj = {};
      try { entregasObj = JSON.parse(String(dados[i][16] || '{}')); } catch (e) { entregasObj = {}; }

      if (chaveAlvo) {
        entregasObj[chaveAlvo] = {
          entregue: body.entregue !== false,
          link: evidencia,
          obs: seguro_(body.obs || '', 400),
          dataEntrega: agora,
          registradoPor: autor
        };
        aba.getRange(i + 1, 17).setValue(JSON.stringify(entregasObj));
      }

      if (body.concluirGeral) {
        aba.getRange(i + 1, 9).setValue('concluida');
      }
      aba.getRange(i + 1, 10).setValue(agora);
      aba.getRange(i + 1, 11).setValue(evidencia);
      aba.getRange(i + 1, 12).setValue(autor);
      achou = true;
      break;
    }
  }

  if (CONFIG.NOTIFICAR_EMAIL && evidencia) {
    enviarEmailNotificacaoDocente_(autor, emailAutor, tituloDemanda + ' (' + demandaId + ')', body.obs || 'Entrega registrada pelo dashboard', evidencia);
  }

  return { ok: true, demandaId: demandaId, atualizado: achou };
}

function removerDemanda_(ss, body) {
  var demandaId = String(body.demandaId || body.id || '').trim();
  if (!demandaId) return { ok: true };
  var aba = ss.getSheetByName('Demandas');
  if (!aba) return { ok: true };
  var dados = aba.getDataRange().getValues();
  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]).toUpperCase() === demandaId.toUpperCase()) {
      aba.deleteRow(i + 1);
      return { ok: true, removido: demandaId };
    }
  }
  return { ok: true };
}

function lerDemandasPublicas_(ss) {
  var aba = ss.getSheetByName('Demandas');
  if (!aba || aba.getLastRow() < 2) return [];
  garantirColunasDemandas_(aba);
  var dados = aba.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < dados.length; i++) {
    if (!dados[i][0]) continue;
    var atrib = {};
    var entregas = {};
    try { atrib = JSON.parse(String(dados[i][15] || '{}')); } catch (e) { atrib = {}; }
    try { entregas = JSON.parse(String(dados[i][16] || '{}')); } catch (e) { entregas = {}; }

    list.push({
      id: String(dados[i][0]),
      data: String(dados[i][1] || ''),
      projeto: String(dados[i][2] || '*'),
      destinatario: String(dados[i][2] || 'Todos'),
      titulo: String(dados[i][3] || ''),
      descricao: String(dados[i][4] || ''),
      prazo: formatarDataIso_(dados[i][5]),
      horaPrazo: String(dados[i][6] || '23:59'),
      criadoPor: String(dados[i][7] || 'Prof. André Moraes'),
      status: String(dados[i][8] || 'pendente'),
      concluida: String(dados[i][8] || '') === 'concluida',
      concluidaEm: String(dados[i][9] || ''),
      evidencia: String(dados[i][10] || ''),
      concluidaPor: String(dados[i][11] || ''),
      pontos: parseFloat(String(dados[i][12] || '10').replace(',', '.')) || 10.0,
      criterios: String(dados[i][13] || '').split('\n').map(function(s) { return s.trim(); }).filter(Boolean),
      instrumento: String(dados[i][14] || 'A2'),
      tipoAtribuicao: atrib.tipoAtribuicao || 'turma',
      equipesAlvo: atrib.equipesAlvo || [],
      alunosAlvo: atrib.alunosAlvo || [],
      cursoSnctAlvo: atrib.cursoSnctAlvo || null,
      fixadaMural: Boolean(atrib.fixadaMural),
      linkApoio: atrib.linkApoio || '',
      entregas: entregas
    });
  }
  return list;
}

// ============================================================================
// TEMPLATES HTML RICOS DE E-MAIL (IDÊNTICOS AO PADRÃO DE PI-1 & PI-2)
// ============================================================================

function formatarDataEmail_(prazoStr) {
  if (!prazoStr) return '';
  if (prazoStr instanceof Date) {
    var d1 = String(prazoStr.getDate()).padStart(2, '0');
    var m1 = String(prazoStr.getMonth() + 1).padStart(2, '0');
    var a1 = prazoStr.getFullYear();
    return d1 + '/' + m1 + '/' + a1;
  }
  var str = String(prazoStr).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    var p = str.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }
  var d = new Date(str);
  if (!isNaN(d.getTime())) {
    var dia = String(d.getDate()).padStart(2, '0');
    var mes = String(d.getMonth() + 1).padStart(2, '0');
    var ano = d.getFullYear();
    return dia + '/' + mes + '/' + ano;
  }
  return str;
}

function formatarDataIso_(val) {
  if (!val) return '';
  if (val instanceof Date) {
    var a = val.getFullYear();
    var m = String(val.getMonth() + 1).padStart(2, '0');
    var d = String(val.getDate()).padStart(2, '0');
    return a + '-' + m + '-' + d;
  }
  var s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    var p = s.split('/');
    return p[2] + '-' + p[1] + '-' + p[0];
  }
  return s;
}

function montarHtmlEmailDemanda_(params) {
  var tipo = params.tipo || 'nova';
  var idCodigo = params.id ? ('[' + params.id + '] ') : '';
  var titulo = params.titulo || '';
  var escopoTxt = params.escopoTxt || 'Geral (Turma ProgWeb 2)';
  var prazoFormatado = formatarDataEmail_(params.prazo);
  var horaPrazo = params.horaPrazo || '23:59';
  var prazoAnteriorFormatado = formatarDataEmail_(params.prazoAnterior);
  var pontos = params.pontos || '';
  var criterios = params.criterios || '';
  var descricao = params.descricao || '';
  var mensagem = params.mensagem || '';
  var linkApoio = params.linkApoio || '';
  var autor = params.autor || 'Prof. André Moraes';
  var dashboardUrl = CONFIG.DASHBOARD_URL;

  // Paleta de cores por tipo (Idêntica ao Projeto Integrador II)
  var corHeader = '#16a34a'; // Verde IFSC padrão
  var tituloHeader = '&#127919; Nova Demanda &amp; Checkpoint Docente';
  var introTexto = 'O professor de Programa&ccedil;&atilde;o para a Internet II registrou uma nova meta avaliativa para voc&ecirc; e sua equipe:';

  if (tipo === 'lembrete') {
    corHeader = '#d97706'; // Âmbar
    tituloHeader = '&#9203; Lembrete de Prazo: Demanda Pendente';
    introTexto = 'Este &eacute; um lembrete docente referente &agrave; demanda em andamento na disciplina. Confira o prazo limite e registre sua entrega no painel:';
  } else if (tipo === 'comunicado') {
    corHeader = '#7c3aed'; // Roxo
    tituloHeader = '&#128227; Comunicado Oficial da Doc&ecirc;ncia';
    introTexto = 'O professor enviou uma orienta&ccedil;&atilde;o/comunicado complementar vinculado &agrave; seguinte atividade:';
  } else if (tipo === 'prazo') {
    corHeader = '#0284c7'; // Azul Oceano
    tituloHeader = '&#128197; Atualiza&ccedil;&atilde;o de Prazo de Entrega';
    introTexto = 'O prazo limite da seguinte demanda foi atualizado pelo professor:';
  }

  var html = '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:24px 12px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">' +
    '<div style="max-width:650px;margin:0 auto;color:#1e293b;line-height:1.6;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#ffffff;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">' +
      '<div style="background:' + corHeader + ';padding:22px 26px;color:#ffffff;">' +
        '<h2 style="margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;">' + tituloHeader + '</h2>' +
        '<p style="margin:4px 0 0;font-size:0.85rem;opacity:0.92;">Programa&ccedil;&atilde;o para a Internet II &bull; CST em Sistemas para Internet &bull; IFSC Garopaba</p>' +
      '</div>' +
      '<div style="padding:26px;">' +
        '<p style="margin-top:0;font-size:1rem;color:#0f172a;">Ol&aacute;, estudantes (<strong>' + escopoTxt + '</strong>),</p>' +
        '<p style="color:#475569;font-size:0.95rem;margin-bottom:20px;">' + introTexto + '</p>' +

        '<div style="background:#f8fafc;border-left:4px solid ' + corHeader + ';border-radius:8px;padding:14px 18px;margin:18px 0;font-size:0.92rem;border:1px solid #e2e8f0;border-left-width:4px;">' +
          '<div style="font-size:1.05rem;font-weight:700;color:#0f172a;margin-bottom:6px;">' + idCodigo + titulo + '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:12px;color:#475569;font-size:0.85rem;margin-top:4px;">' +
            '<div><strong>&#128203; Escopo:</strong> ' + escopoTxt + '</div>' +
            (prazoFormatado ? ('<div><strong>&#128197; Prazo Limite:</strong> <span style="color:#b45309;font-weight:700;">' + prazoFormatado + ' &agrave;s ' + horaPrazo + '</span></div>') : '') +
            (prazoAnteriorFormatado ? ('<div style="color:#94a3b8;font-size:0.8rem;">(Prazo anterior: ' + prazoAnteriorFormatado + ')</div>') : '') +
            (pontos ? ('<div><strong>&#11088; Pontua&ccedil;&atilde;o / Peso:</strong> ' + pontos + ' pts</div>') : '') +
          '</div>' +
        '</div>';

  if (mensagem) {
    html += '<div style="margin-top:20px;">' +
      '<h3 style="color:#475569;font-size:0.92rem;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">&#128172; Mensagem &amp; Esclarecimento Docente (' + autor + '):</h3>' +
      '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #3b82f6;border-radius:8px;padding:14px 16px;font-size:0.92rem;color:#1e3a8a;white-space:pre-line;line-height:1.55;">' +
        mensagem +
      '</div>' +
    '</div>';
  }

  if (criterios) {
    html += '<div style="margin-top:20px;">' +
      '<h3 style="color:#166534;font-size:0.92rem;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">&#128203; Crit&eacute;rios de Aceite &amp; Checklist Formativo:</h3>' +
      '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #22c55e;border-radius:8px;padding:14px 16px;font-size:0.92rem;color:#14532d;white-space:pre-line;line-height:1.55;">' +
        criterios +
      '</div>' +
    '</div>';
  }

  if (descricao) {
    html += '<div style="margin-top:20px;">' +
      '<h3 style="color:#0e7490;font-size:0.92rem;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;font-weight:700;">&#128221; Detalhes e Orienta&ccedil;&otilde;es T&eacute;cnicas:</h3>' +
      '<div style="background:#ecfeff;border:1px solid #a5f3fc;border-left:4px solid #06b6d4;border-radius:8px;padding:14px 16px;font-size:0.9rem;color:#155e75;white-space:pre-line;line-height:1.55;">' +
        descricao +
      '</div>' +
    '</div>';
  }

  if (linkApoio) {
    var urlCompleta = /^https?:\/\//i.test(linkApoio) ? linkApoio : (dashboardUrl + linkApoio.replace(/^\//, ''));
    html += '<div style="margin-top:16px;font-size:0.88rem;">' +
      '<strong>&#128279; Material / Roteiro de Apoio:</strong> <a href="' + urlCompleta + '" target="_blank" style="color:#0284c7;font-weight:600;">' + urlCompleta + '</a>' +
    '</div>';
  }

  html += '<div style="margin-top:28px;padding:20px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;text-align:center;">' +
        '<p style="margin:0 0 10px;font-size:0.88rem;color:#64748b;">Acompanhe os roteiros em PDF, candidaturas da SNCT e registre sua entrega no dashboard:</p>' +
        '<a href="' + dashboardUrl + '" target="_blank" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:700;padding:10px 22px;border-radius:6px;font-size:0.92rem;box-shadow:0 2px 4px rgba(0,0,0,0.1);">' +
          '&#128640; Acessar Portal de Programa&ccedil;&atilde;o para Internet II' +
        '</a>' +
      '</div>' +

      '<hr style="border:none;border-top:1px solid #e2e8f0;margin:26px 0 16px;">' +
      '<p style="font-size:0.82rem;color:#64748b;margin:0;line-height:1.5;">' +
        '<strong>Doc&ecirc;ncia &mdash; Programa&ccedil;&atilde;o para a Internet II</strong><br>' +
        'Prof. Dr. Andr&eacute; Moraes<br>' +
        'Instituto Federal de Santa Catarina (IFSC) &mdash; C&acirc;mpus Garopaba' +
      '</p>' +
    '</div>' +
  '</div>' +
  '</body></html>';

  return html;
}

// ============================================================================
// RESOLUÇÃO AUTOMÁTICA DE DESTINATÁRIOS DIRETO DA PLANILHA
// ============================================================================

function resolverEmailsDestinatarios_(ss, filtro) {
  var emails = [];
  var explicitos = filtro.emailsExplicitos || [];
  explicitos.forEach(function(em) {
    var limpo = String(em || '').toLowerCase().trim();
    if (limpo && limpo.indexOf('@') > 0 && emails.indexOf(limpo) === -1) {
      emails.push(limpo);
    }
  });

  if (emails.length > 0) return emails;

  var abaEst = ss.getSheetByName('Estudantes');
  if (!abaEst || abaEst.getLastRow() < 2) return emails;
  var dadosEst = abaEst.getDataRange().getValues();

  var projeto = String(filtro.projeto || '*').trim();
  var tipoAtribuicao = String(filtro.tipoAtribuicao || 'turma');
  var equipesAlvo = (filtro.equipesAlvo || []).map(function(s) { return String(s).trim().toLowerCase(); });
  var alunosAlvo = (filtro.alunosAlvo || []).map(function(s) { return String(s).trim(); });
  var cursoSnctAlvo = filtro.cursoSnctAlvo ? Number(filtro.cursoSnctAlvo) : null;

  // Se for direcionado a Curso 1 ou Curso 2 da SNCT, busca na aba Candidaturas_SNCT
  if (cursoSnctAlvo === 1 || cursoSnctAlvo === 2 || projeto === 'CURSO-1' || projeto === 'CURSO-2') {
    var numCurso = cursoSnctAlvo || (projeto === 'CURSO-1' ? 1 : 2);
    var prefixo = 'c' + numCurso + '-';
    var abaCand = ss.getSheetByName('Candidaturas_SNCT');
    if (abaCand && abaCand.getLastRow() >= 2) {
      var dadosCand = abaCand.getDataRange().getValues();
      for (var c = 1; c < dadosCand.length; c++) {
        var fId = String(dadosCand[c][1] || '').toLowerCase();
        var emCand = String(dadosCand[c][6] || '').toLowerCase().trim();
        if (fId.indexOf(prefixo) === 0 && emCand.indexOf('@') > 0 && emails.indexOf(emCand) === -1) {
          emails.push(emCand);
        }
      }
    }
    if (emails.length > 0) return emails;
  }

  for (var i = 1; i < dadosEst.length; i++) {
    var idEst = String(dadosEst[i][0] || '').trim();
    var matEst = String(dadosEst[i][1] || '').trim();
    var nomeEst = String(dadosEst[i][2] || '').trim();
    var eqEst = String(dadosEst[i][3] || '').trim().toLowerCase();
    var emailEst = String(dadosEst[i][4] || '').toLowerCase().trim();
    var ativoEst = String(dadosEst[i][5] || 'true').toLowerCase() !== 'false';

    if (!ativoEst || emailEst.indexOf('@') < 0) continue;

    var incluir = false;
    if (tipoAtribuicao === 'individual' && alunosAlvo.length > 0) {
      incluir = (alunosAlvo.indexOf(idEst) >= 0 || alunosAlvo.indexOf(matEst) >= 0 || alunosAlvo.indexOf(nomeEst) >= 0);
    } else if (tipoAtribuicao === 'equipes' && equipesAlvo.length > 0) {
      incluir = (equipesAlvo.indexOf(eqEst) >= 0);
    } else if (projeto === '*' || projeto.toLowerCase() === 'todos' || tipoAtribuicao === 'turma') {
      incluir = true;
    } else if (eqEst === projeto.toLowerCase() || nomeEst.toLowerCase() === projeto.toLowerCase()) {
      incluir = true;
    }

    if (incluir && emails.indexOf(emailEst) === -1) {
      emails.push(emailEst);
    }
  }

  return emails;
}

function enviarEmailDemanda_(emailsDestino, params) {
  if (!emailsDestino || !emailsDestino.length) return 0;

  var escopoTxt = params.escopoTxt || 'Geral (Turma)';
  var assunto = '[ProgWeb 2] Nova Demanda Docente: ' + (params.id ? params.id + ' — ' : '') + params.titulo + ' [' + escopoTxt + ']';
  var corpoTexto = 'Olá,\n\n' +
    'O professor ' + (params.autor || 'André Moraes') + ' registrou uma nova demanda para você em Programação para a Internet II:\n\n' +
    '🎯 Título: ' + params.titulo + '\n' +
    '📋 Escopo: ' + escopoTxt + '\n' +
    '📅 Prazo: ' + (formatarDataEmail_(params.prazo) || 'Sem data limite') + ' às ' + (params.horaPrazo || '23:59') + '\n' +
    (params.descricao ? ('\n📝 Detalhes e Orientações:\n' + params.descricao + '\n') : '') +
    (params.criterios ? ('\n✅ Critérios de Aceite:\n' + params.criterios + '\n') : '') +
    '\nAcesse o Dashboard da disciplina:\n' + CONFIG.DASHBOARD_URL + '\n';

  var htmlBody = montarHtmlEmailDemanda_({
    tipo: 'nova',
    id: params.id,
    titulo: params.titulo,
    escopoTxt: escopoTxt,
    prazo: params.prazo,
    horaPrazo: params.horaPrazo,
    pontos: params.pontos || '10,0',
    criterios: params.criterios || '',
    descricao: params.descricao || '',
    linkApoio: params.linkApoio || '',
    mensagem: '',
    autor: params.autor || 'Prof. André Moraes'
  });

  var enviados = 0;
  emailsDestino.forEach(function(to) {
    try {
      GmailApp.sendEmail(to, assunto, corpoTexto, {
        htmlBody: htmlBody,
        name: CONFIG.NOME_REMETENTE
      });
      enviados++;
    } catch (err) {
      Logger.log('Erro ao enviar para ' + to + ': ' + err);
    }
  });

  return enviados;
}

function enviarNotificacaoDemandaCustom_(ss, dem, tipo, mensagem, autor, emailsExplicitos) {
  var atrib = dem.atribuicao || {};
  var emailsDestino = resolverEmailsDestinatarios_(ss, {
    projeto: dem.projeto,
    tipoAtribuicao: atrib.tipoAtribuicao || 'turma',
    equipesAlvo: atrib.equipesAlvo || [],
    alunosAlvo: atrib.alunosAlvo || [],
    cursoSnctAlvo: atrib.cursoSnctAlvo || null,
    emailsExplicitos: emailsExplicitos || []
  });

  if (!emailsDestino.length) return 0;

  var escopoTxt = (!dem.projeto || dem.projeto === '*') ? 'Geral (Toda a Turma)' : String(dem.projeto);
  var assunto = '';
  var corpoTexto = '';

  if (tipo === 'prazo') {
    assunto = '[ProgWeb 2 ALTERAÇÃO DE PRAZO] ' + dem.titulo + ' [' + escopoTxt + ']';
    corpoTexto = 'Olá,\n\nO professor atualizou o prazo da demanda:\n\n' +
      'Demanda: ' + dem.titulo + '\nEscopo: ' + escopoTxt + '\nNOVO PRAZO: ' + formatarDataEmail_(dem.novoPrazo) + ' às ' + (dem.horaPrazo || '23:59') + '\n' +
      (mensagem ? ('Mensagem: ' + mensagem + '\n') : '') +
      '\nDashboard: ' + CONFIG.DASHBOARD_URL + '\n';
  } else if (tipo === 'comunicado') {
    assunto = '[ProgWeb 2 COMUNICADO] ' + dem.titulo + ' [' + escopoTxt + ']';
    corpoTexto = 'Olá,\n\nO professor enviou um comunicado sobre a demanda:\n\n' +
      'Demanda: ' + dem.titulo + '\nEscopo: ' + escopoTxt + '\n' +
      'Mensagem: ' + (mensagem || '(Sem mensagem adicional)') + '\n\n' +
      'Dashboard: ' + CONFIG.DASHBOARD_URL + '\n';
  } else {
    assunto = '[ProgWeb 2 LEMBRETE] Prazo de Demanda: ' + dem.titulo + ' [' + escopoTxt + ']';
    corpoTexto = 'Olá,\n\nEste é um lembrete docente referente à demanda em andamento:\n\n' +
      'Demanda: ' + dem.titulo + '\nEscopo: ' + escopoTxt + '\nPrazo: ' + (formatarDataEmail_(dem.prazo) || 'Sem data limite') + ' às ' + (dem.horaPrazo || '23:59') + '\n' +
      (mensagem ? ('Mensagem: ' + mensagem + '\n') : '') +
      '\nDashboard: ' + CONFIG.DASHBOARD_URL + '\n';
  }

  var htmlBody = montarHtmlEmailDemanda_({
    tipo: tipo,
    id: dem.id,
    titulo: dem.titulo,
    escopoTxt: escopoTxt,
    prazo: dem.novoPrazo || dem.prazo,
    horaPrazo: dem.horaPrazo || '23:59',
    prazoAnterior: dem.prazoAnterior,
    pontos: dem.pontos,
    criterios: dem.criterios,
    descricao: dem.descricao,
    linkApoio: atrib.linkApoio || '',
    mensagem: mensagem,
    autor: autor
  });

  var enviados = 0;
  emailsDestino.forEach(function(to) {
    try {
      GmailApp.sendEmail(to, assunto, corpoTexto, {
        htmlBody: htmlBody,
        name: CONFIG.NOME_REMETENTE
      });
      enviados++;
    } catch (err) {
      Logger.log('Erro ao enviar para ' + to + ': ' + err);
    }
  });

  return enviados;
}

function dispararComunicadoHtml_(ss, req) {
  if (!CONFIG.NOTIFICAR_EMAIL) {
    return { ok: false, erro: 'Envio de e-mails desabilitado em CONFIG.' };
  }
  var titulo = req.titulo || req.assunto || 'Comunicado Oficial da Disciplina';
  var assunto = req.assunto || ('[ProgWeb 2 COMUNICADO] ' + titulo);
  var mensagem = req.mensagem || '';
  var escopoTxt = req.escopoTxt || 'Turma de Programação para a Internet II';
  var emails = resolverEmailsDestinatarios_(ss, {
    projeto: req.projeto || '*',
    emailsExplicitos: req.emails || req.destinatariosEmails || []
  });

  if (!emails.length) {
    return { ok: false, erro: 'Nenhum destinatário localizado para envio.' };
  }

  var htmlBody = montarHtmlEmailDemanda_({
    tipo: req.tipo || 'comunicado',
    id: req.id || '',
    titulo: titulo,
    escopoTxt: escopoTxt,
    prazo: req.prazo || '',
    horaPrazo: req.horaPrazo || '23:59',
    pontos: req.pontos || '',
    criterios: req.criterios || '',
    descricao: req.descricao || '',
    linkApoio: req.linkApoio || '',
    mensagem: mensagem,
    autor: req.autor || 'Prof. André Moraes'
  });

  var enviados = 0;
  emails.forEach(function(to) {
    try {
      GmailApp.sendEmail(to, assunto, mensagem, {
        htmlBody: htmlBody,
        name: CONFIG.NOME_REMETENTE
      });
      enviados++;
    } catch (e) {
      Logger.log('Erro ao enviar comunicado para ' + to + ': ' + e);
    }
  });

  return { ok: true, enviados: enviados, totalEnviados: enviados };
}

// ============================================================================
// AVALIAÇÃO POR RUBRICA E NOTIFICAÇÕES DOCENTE / ESTUDANTE
// ============================================================================

function salvarAvaliacao_(ss, req) {
  var abaAv = obterOuCriarAba(ss, 'Avaliacoes');
  var aval = req.avaliacao || req;
  var agoraAv = new Date().toLocaleString('pt-BR');
  var idAv = aval.id || ('AV-' + (aval.demandaId || 'DEM') + '-' + String(aval.equipe || '').replace(/\s+/g, ''));
  var dimensoesJson = typeof aval.dimensoes === 'object' ? JSON.stringify(aval.dimensoes) : String(aval.dimensoes || '{}');

  var dados = abaAv.getDataRange().getValues();
  var linhaEncontrada = -1;
  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][0]) === idAv || (String(dados[i][2]) === String(aval.equipe) && String(dados[i][3]) === String(aval.demandaId))) {
      linhaEncontrada = i + 1;
      break;
    }
  }

  var linha = [
    idAv,
    agoraAv,
    aval.equipe || '',
    aval.demandaId || '',
    aval.instrumento || 'A2',
    aval.nota != null ? aval.nota : 0,
    aval.feedback || '',
    aval.linkRepo || '',
    req.avaliador || 'Prof. André Moraes',
    dimensoesJson
  ];

  if (linhaEncontrada > 1) {
    abaAv.getRange(linhaEncontrada, 1, 1, linha.length).setValues([linha]);
  } else {
    abaAv.appendRow(linha);
  }

  var totalEnviados = 0;
  if (CONFIG.NOTIFICAR_EMAIL && req.notificarEmail !== false) {
    var emailsEquipe = resolverEmailsDestinatarios_(ss, {
      projeto: aval.equipe || '*',
      tipoAtribuicao: 'equipes',
      equipesAlvo: aval.equipe ? [aval.equipe] : [],
      emailsExplicitos: req.destinatariosEmails || []
    });
    totalEnviados = enviarEmailAvaliacaoHtml_(emailsEquipe, aval);
  }

  return { ok: true, id: idAv, totalEnviados: totalEnviados, mensagem: 'Avaliação registrada com sucesso!' };
}

function enviarEmailAvaliacaoHtml_(emails, aval) {
  if (!emails || !emails.length) return 0;

  var notaNum = Number(aval.nota != null ? aval.nota : 0);
  var notaStr = notaNum.toFixed(1);
  var equipe = aval.equipe || 'Equipe';
  var demandaId = aval.demandaId || '—';
  var instrumento = aval.instrumento || 'A2';
  var feedback = aval.feedback || 'Avaliação formativa concluída conforme rubrica.';
  var linkRepo = aval.linkRepo || '';
  var dims = aval.dimensoes || {};

  var assunto = '[ProgWeb 2 DEVOLUTIVA & NOTA] ' + demandaId + ' — ' + equipe + ' (' + notaStr + ' / 10,0)';
  var corpo = 'Olá, estudantes (' + equipe + '),\n\n' +
    'O professor orientador registrou a avaliação formativa por rubrica da sua entrega:\n\n' +
    '• Demanda: ' + demandaId + '\n' +
    '• Instrumento: ' + instrumento + '\n' +
    '• Nota Consolidada: ' + notaStr + ' / 10,0\n' +
    '• Parecer Formativo: ' + feedback + '\n\n' +
    'Confira os detalhes no Dashboard:\n' + CONFIG.DASHBOARD_URL + '\n';

  var criteriosTexto = '1. Arquitetura Modular & Estrutura: ' + Number(dims.dim0 || 2.5).toFixed(1) + ' / 2.5 pts\n' +
    '2. Manipulação do DOM, Forms & Interatividade: ' + Number(dims.dim1 || 2.5).toFixed(1) + ' / 2.5 pts\n' +
    '3. Integração, Dados & Regras de Negócio: ' + Number(dims.dim2 || 2.5).toFixed(1) + ' / 2.5 pts\n' +
    '4. UX, Responsividade & Publicação (GitHub Pages/Moodle): ' + Number(dims.dim3 || 2.5).toFixed(1) + ' / 2.5 pts';

  var htmlBody = montarHtmlEmailDemanda_({
    tipo: 'nova',
    id: demandaId,
    titulo: 'Devolutiva de Avaliação por Rubrica — Nota: ' + notaStr + ' / 10,0',
    escopoTxt: equipe,
    prazo: '',
    pontos: notaStr + ' / 10,0',
    criterios: criteriosTexto,
    descricao: linkRepo ? ('Link avaliado: ' + linkRepo) : '',
    mensagem: feedback,
    autor: 'Prof. André Moraes'
  });

  var enviados = 0;
  emails.forEach(function(to) {
    try {
      GmailApp.sendEmail(to, assunto, corpo, {
        htmlBody: htmlBody,
        name: CONFIG.NOME_REMETENTE
      });
      enviados++;
    } catch (e) {
      Logger.log('Erro ao enviar avaliação para ' + to + ': ' + e);
    }
  });
  return enviados;
}

function enviarEmailConfirmacaoCandidaturaSnct_(ss, info) {
  try {
    var emailAluno = String(info.email || '').toLowerCase().trim();
    if (!emailAluno || emailAluno.indexOf('@') < 0) {
      var res = resolverEmailsDestinatarios_(ss, {
        tipoAtribuicao: 'individual',
        alunosAlvo: [String(info.alunoId || ''), String(info.alunoNome || '')]
      });
      if (res.length > 0) emailAluno = res[0];
    }

    if (emailAluno && emailAluno.indexOf('@') > 0) {
      var cursoTxt = String(info.frenteId || '').indexOf('c2-') === 0
        ? 'Curso 2 — Painel Verde: Coleta Seletiva & Ecopontos'
        : 'Curso 1 — Meu Primeiro Site no Ar (HTML, CSS & GitHub Pages)';

      var htmlAluno = montarHtmlEmailDemanda_({
        tipo: 'nova',
        id: info.frenteId ? info.frenteId.toUpperCase() : 'SNCT',
        titulo: 'Inscrição Confirmada: ' + (info.frenteTitulo || info.frenteId),
        escopoTxt: (info.alunoNome || 'Estudante') + ' • ' + cursoTxt,
        prazo: '2026-10-30',
        horaPrazo: '23:59',
        pontos: '10,0',
        criterios: '1. Baixar e seguir o Roteiro Operacional em PDF da sua frente no portal\n2. Estruturar sua parte correspondente na Sala Moodle do curso (perfil Professor)\n3. Registrar o link do entregável (GitHub/Moodle) no card da frente até 30/10',
        descricao: 'Sua candidatura foi registrada com sucesso na planilha oficial da disciplina.',
        mensagem: 'Olá, ' + (info.alunoNome || '') + '! Sua vaga na frente "' + (info.frenteTitulo || info.frenteId) + '" (' + cursoTxt + ') está garantida.',
        autor: 'Prof. André Moraes'
      });

      GmailApp.sendEmail(
        emailAluno,
        '[ProgWeb 2 SNCT] Candidatura Confirmada: ' + (info.frenteTitulo || info.frenteId),
        'Sua candidatura na frente ' + (info.frenteTitulo || info.frenteId) + ' foi confirmada! Acesse: ' + CONFIG.DASHBOARD_URL,
        { htmlBody: htmlAluno, name: CONFIG.NOME_REMETENTE }
      );
    }

    enviarEmailNotificacaoDocente_(info.alunoNome, emailAluno, info.frenteTitulo || info.frenteId, 'Nova candidatura registrada na frente da SNCT', '');
  } catch (e) {
    Logger.log('Erro em enviarEmailConfirmacaoCandidaturaSnct_: ' + e);
  }
}

function enviarEmailNotificacaoDocente_(nomeAluno, emailAluno, contexto, texto, evidencia) {
  try {
    var assunto = '[ProgWeb 2] Registro de Atividade / Entrega — ' + (nomeAluno || 'Estudante');
    var corpo = 'Olá, Professor,\n\n' +
      'Um novo registro foi enviado no Dashboard de Programação para a Internet II:\n\n' +
      '• Estudante: ' + (nomeAluno || '—') + (emailAluno ? (' (' + emailAluno + ')') : '') + '\n' +
      '• Frente / Demanda: ' + (contexto || '—') + '\n' +
      '• Ação / Relato: ' + (texto || '—') + '\n' +
      (evidencia ? ('• Link de Evidência / Entrega: ' + evidencia + '\n') : '') +
      '\nAcesse o Dashboard:\n' + CONFIG.DASHBOARD_URL + '\n';

    CONFIG.DOCENTES.forEach(function(docEmail) {
      if (docEmail && docEmail.indexOf('@') > 0) {
        GmailApp.sendEmail(docEmail, assunto, corpo, { name: CONFIG.NOME_REMETENTE });
      }
    });
  } catch (e) {
    Logger.log('Erro ao notificar docente: ' + e);
  }
}

// ============================================================================
// AÇÕES ACIONADAS DIRETAMENTE PELO MENU DA PLANILHA (GOOGLE SHEETS UI)
// ============================================================================

function menuDispararNovaDemandaLinha_() {
  dispararDemandaDaLinhaSelecionada_('nova');
}

function menuDispararLembreteLinha_() {
  dispararDemandaDaLinhaSelecionada_('lembrete');
}

function dispararDemandaDaLinhaSelecionada_(tipo) {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getActiveSheet();
  if (!aba || aba.getName() !== 'Demandas') {
    ui.alert('Atenção', 'Selecione uma linha dentro da aba "Demandas" para disparar a notificação.', ui.ButtonSet.OK);
    return;
  }
  var row = aba.getActiveCell().getRow();
  if (row < 2) {
    ui.alert('Atenção', 'Selecione uma linha de demanda (a partir da linha 2).', ui.ButtonSet.OK);
    return;
  }
  var dados = aba.getRange(row, 1, 1, CAB_DEMANDAS.length).getValues()[0];
  var demId = String(dados[0] || '');
  if (!demId) {
    ui.alert('Linha vazia', 'A linha selecionada não possui um ID de demanda.', ui.ButtonSet.OK);
    return;
  }

  var res = notificarDemanda_(ss, { demandaId: demId, tipo: tipo });
  ui.alert('Disparo Concluído', 'Notificação (' + tipo + ') da demanda "' + dados[3] + '" enviada automaticamente para ' + (res.totalEnviados || 0) + ' estudante(s)!', ui.ButtonSet.OK);
}

function menuCobrarPendentesSnct_() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var abaEst = ss.getSheetByName('Estudantes');
  var abaCand = ss.getSheetByName('Candidaturas_SNCT');
  if (!abaEst) {
    ui.alert('Execute primeiro a opção "1. Inicializar / Verificar Abas da Planilha".');
    return;
  }

  var inscritosEmails = [];
  var inscritosIds = [];
  if (abaCand && abaCand.getLastRow() >= 2) {
    var dCand = abaCand.getDataRange().getValues();
    for (var i = 1; i < dCand.length; i++) {
      if (dCand[i][3]) inscritosIds.push(String(dCand[i][3]).trim());
      if (dCand[i][6]) inscritosEmails.push(String(dCand[i][6]).toLowerCase().trim());
    }
  }

  var emailsPendentes = [];
  var dEst = abaEst.getDataRange().getValues();
  for (var j = 1; j < dEst.length; j++) {
    var idA = String(dEst[j][0]).trim();
    var emA = String(dEst[j][4]).toLowerCase().trim();
    var atA = String(dEst[j][5] || 'true').toLowerCase() !== 'false';
    if (atA && emA.indexOf('@') > 0 && inscritosIds.indexOf(idA) === -1 && inscritosEmails.indexOf(emA) === -1) {
      emailsPendentes.push(emA);
    }
  }

  if (emailsPendentes.length === 0) {
    ui.alert('Tudo em dia!', 'Todos os estudantes ativos já possuem candidatura registrada na SNCT.', ui.ButtonSet.OK);
    return;
  }

  var res = dispararComunicadoHtml_(ss, {
    tipo: 'lembrete',
    id: 'DEM-SNCT-01',
    titulo: 'Prazo Final (27/10 às 23:59): Escolha sua Frente de Trabalho da SNCT (Curso 1 ou Curso 2)',
    escopoTxt: 'Estudantes com Candidatura Pendente na SNCT',
    prazo: '2026-10-27',
    horaPrazo: '23:59',
    pontos: '10,0',
    criterios: '1. Acessar o Portal de ProgWeb 2 e conectar-se com seu e-mail institucional\n2. Escolher 1 das 8 frentes (Curso 1: Meu 1º Site no Ar ou Curso 2: Painel Verde)\n3. Baixar o Roteiro Operacional em PDF da sua frente e iniciar a etapa no Moodle',
    mensagem: 'Ainda não identificamos sua inscrição em nenhuma das frentes das oficinas da SNCT 2026. Escolha sua frente até hoje às 23:59 para não ficar sem grupo!',
    emails: emailsPendentes
  });

  ui.alert('Lembrete Enviado!', 'E-mail HTML enviado automaticamente para ' + (res.totalEnviados || 0) + ' estudante(s) pendente(s).', ui.ButtonSet.OK);
}

// ============================ UTILITÁRIOS ============================

function obterPlanilha() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SPREADSHEET_ID');
  if (sheetId) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {}
  }
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      props.setProperty('SPREADSHEET_ID', active.getId());
      return active;
    }
  } catch (e) {}
  return null;
}

function obterOuCriarAba(ss, nome) {
  var aba = ss.getSheetByName(nome);
  if (!aba) {
    aba = ss.insertSheet(nome);
  }
  return aba;
}

function formatarCabecalho(aba, corFundo) {
  var cols = Math.max(aba.getLastColumn(), 1);
  var header = aba.getRange(1, 1, 1, cols);
  header.setBackground(corFundo);
  header.setFontColor('#ffffff');
  header.setFontWeight('bold');
  aba.setFrozenRows(1);
}

function lerAbaComoObjetos(aba) {
  if (!aba || aba.getLastRow() < 2) return [];
  var valores = aba.getDataRange().getValues();
  var cabecalhos = valores[0];
  var resultado = [];

  for (var i = 1; i < valores.length; i++) {
    var obj = {};
    for (var j = 0; j < cabecalhos.length; j++) {
      obj[cabecalhos[j]] = valores[i][j];
    }
    resultado.push(obj);
  }
  return resultado;
}

function seguro_(v, max) {
  var s = String(v == null ? '' : v).replace(/\r\n?/g, '\n').trim();
  if (max && s.length > max) s = s.slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
