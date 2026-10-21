/**
 * ProgWeb 2 (IFSC Garopaba) — Backend Google Apps Script
 * Unidade Curricular: Programação para a Internet 2 (PIT II / CST Sistemas para Internet)
 * 
 * Funcionalidades:
 * - Votação em tempo real para a 2ª Oficina da SNCT (com auditoria nominal)
 * - Persistência de Demandas e Avaliações por Rubricas
 * - Sincronização do Roster dos 24 Estudantes
 * - Notificações automáticas por e-mail via GmailApp
 * 
 * Implantação: veja o passo a passo em apps-script/README-IMPLANTACAO.md
 */

// ============================ CONFIGURAÇÃO ============================
var CONFIG = {
  NOME_PLANILHA: 'ProgWeb2 — Votação SNCT, Demandas & Avaliações (IFSC Garopaba)',
  GOOGLE_CLIENT_ID: '827223670130-f312ur39hg8bamvbce5noc0iaajq8b1a.apps.googleusercontent.com',
  DOCENTES: [
    'andre.moraes@ifsc.edu.br',
    'chameoandre@gmail.com'
  ],
  DOMINIOS_PERMITIDOS: ['ifsc.edu.br', 'aluno.ifsc.edu.br'],
  NOTIFICAR_EMAIL: true
};

// ============================ INSTALAÇÃO INICIAL ============================
/**
 * Execute esta função UMA VEZ no editor do Apps Script para criar a planilha
 * de controle no seu Google Drive e configurar todas as abas automaticamente.
 */
function instalar() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SPREADSHEET_ID');
  var ss;

  if (sheetId) {
    try {
      ss = SpreadsheetApp.openById(sheetId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.NOME_PLANILHA);
    props.setProperty('SPREADSHEET_ID', ss.getId());
    Logger.log('Nova planilha criada com sucesso: ' + ss.getUrl());
  }

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

  // 3. Aba Demandas
  var abaDemandas = obterOuCriarAba(ss, 'Demandas');
  if (abaDemandas.getLastRow() === 0) {
    abaDemandas.appendRow(['id', 'titulo', 'instrumento', 'instrumento_nome', 'destinatario', 'prazo', 'pontos', 'concluida', 'descricao', 'criterios']);
    formatarCabecalho(abaDemandas, '#0284c7');
  }

  // 4. Aba Avaliacoes
  var abaAvaliacoes = obterOuCriarAba(ss, 'Avaliacoes');
  if (abaAvaliacoes.getLastRow() === 0) {
    abaAvaliacoes.appendRow(['id', 'data_hora', 'equipe', 'demanda_id', 'instrumento', 'nota', 'feedback', 'link_repo', 'avaliador']);
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

  Logger.log('Instalação concluída com sucesso! Planilha: ' + ss.getUrl());
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
    var demandas = lerAbaComoObjetos(ss.getSheetByName('Demandas'));
    var avaliacoes = lerAbaComoObjetos(ss.getSheetByName('Avaliacoes'));
    var estudantes = lerAbaComoObjetos(ss.getSheetByName('Estudantes'));

    return jsonResponse({
      ok: true,
      votos: votos,
      oficinas: oficinas,
      demandas: demandas,
      avaliacoes: avaliacoes,
      estudantes: estudantes,
      atualizado_em: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({ ok: false, erro: err.message });
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
      return jsonResponse({ ok: false, erro: 'Planilha não instalada. Execute instalar().' });
    }

    // 1. AÇÃO: VOTAR EM OFICINA SNCT
    if (acao === 'votar_oficina') {
      var abaVotos = ss.getSheetByName('Votos_SNCT');
      var alunoId = String(req.alunoId || '');
      var alunoNome = req.alunoNome || '';
      var matricula = req.matricula || '';
      var email = req.email || '';
      var opcaoId = req.opcaoId || '';
      var opcaoTitulo = req.opcaoTitulo || '';
      var agora = new Date().toLocaleString('pt-BR');

      if (!alunoId || !opcaoId) {
        return jsonResponse({ ok: false, erro: 'alunoId e opcaoId são obrigatórios.' });
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

    // 2. AÇÃO: ADICIONAR NOVA OFICINA (MODO DOCENTE)
    if (acao === 'adicionar_oficina') {
      var abaOf = ss.getSheetByName('Oficinas_Opcoes');
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

    // 3. AÇÃO: ZERAR VOTAÇÃO (MODO DOCENTE)
    if (acao === 'zerar_votacao') {
      var abaV = ss.getSheetByName('Votos_SNCT');
      var totalLinhas = abaV.getLastRow();
      if (totalLinhas > 1) {
        abaV.deleteRows(2, totalLinhas - 1);
      }
      return jsonResponse({ ok: true, mensagem: 'Votação zerada com sucesso na planilha!' });
    }

    // 4. AÇÃO: SALVAR AVALIAÇÃO COM RUBRICA E NOTIFICAR
    if (acao === 'salvar_avaliacao') {
      var abaAv = ss.getSheetByName('Avaliacoes');
      var aval = req.avaliacao;
      var agoraAv = new Date().toLocaleString('pt-BR');
      var idAv = aval.id || ('aval-' + new Date().getTime());

      abaAv.appendRow([
        idAv,
        agoraAv,
        aval.equipe || '',
        aval.demandaId || '',
        aval.instrumento || '',
        aval.nota || 0,
        aval.feedback || '',
        aval.linkRepo || '',
        req.avaliador || 'Prof. André Moraes'
      ]);

      // Disparo de e-mail institucional via GmailApp se habilitado
      if (CONFIG.NOTIFICAR_EMAIL && req.notificarEmail && req.destinatariosEmails && req.destinatariosEmails.length > 0) {
        enviarEmailAvaliacao(req.destinatariosEmails, aval);
      }

      return jsonResponse({ ok: true, id: idAv, mensagem: 'Avaliação registrada com sucesso!' });
    }

    // 5. AÇÃO: DISPARAR E-MAIL PARA A TURMA
    if (acao === 'disparar_email_turma') {
      if (!CONFIG.NOTIFICAR_EMAIL) {
        return jsonResponse({ ok: false, erro: 'Envio de e-mails desabilitado em CONFIG.' });
      }
      var assunto = req.assunto || 'IFSC Garopaba — ProgWeb 2: Comunicado Geral';
      var mensagemCorpo = req.mensagem || '';
      var listaEmails = req.emails || [];

      if (listaEmails.length > 0) {
        GmailApp.sendEmail('', assunto, mensagemCorpo, {
          bcc: listaEmails.join(','),
          name: 'Prof. André Moraes — ProgWeb 2 (IFSC)'
        });
      }

      return jsonResponse({ ok: true, enviados: listaEmails.length });
    }

    return jsonResponse({ ok: false, erro: 'Ação não reconhecida: ' + acao });
  } catch (err) {
    return jsonResponse({ ok: false, erro: err.message });
  }
}

// ============================ UTILITÁRIOS ============================

function obterPlanilha() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SPREADSHEET_ID');
  if (sheetId) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {
      return null;
    }
  }
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
  var header = aba.getRange(1, 1, 1, aba.getLastColumn());
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

function enviarEmailAvaliacao(emails, aval) {
  try {
    var assunto = 'IFSC ProgWeb 2 — Avaliação Lançada: ' + aval.equipe;
    var corpo = 'Olá estudantes da ' + aval.equipe + ',\n\n' +
      'Uma nova avaliação por rubrica foi registrada pelo docente na disciplina de Programação para a Internet 2.\n\n' +
      '• Instrumento: ' + (aval.instrumento || 'A2') + '\n' +
      '• Demanda: ' + (aval.demandaId || '—') + '\n' +
      '• Nota Atribuída: ' + (aval.nota !== undefined ? aval.nota.toFixed(1) : '—') + ' / 10,0\n\n' +
      'Parecer Formativo do Docente:\n' +
      (aval.feedback || 'Sem observações adicionais.') + '\n\n' +
      'Acesse o Dashboard da disciplina para mais detalhes:\n' +
      'https://chameoandre.github.io/CST-Sistemas-para-internet-programacao-para-internet-2/\n\n' +
      'Atenciosamente,\n' +
      'Prof. André Moraes — IFSC Câmpus Garopaba';

    GmailApp.sendEmail('', assunto, corpo, {
      bcc: emails.join(','),
      name: 'Prof. André Moraes — ProgWeb 2 (IFSC)'
    });
  } catch (e) {
    Logger.log('Erro ao enviar e-mail: ' + e.message);
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
