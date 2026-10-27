# Briefing — Roteiros das Frentes de Trabalho SNCT 2026

Documento de referência comum aos 4 roteiros das frentes (pasta `snct-frentes/`).

## Contexto
- Turma de ProgWeb 2 (IFSC Garopaba, 24 estudantes) organiza **2 oficinas de 120 min** na SNCT 2026
  (curricularização da extensão, 40h, instrumento A2 = 20% da nota).
  - **Curso 1 — Meu Primeiro Site no Ar** (HTML, CSS, GitHub Pages, botão WhatsApp, QR Code).
  - **Curso 2 — Tema eleito na votação** (empate atual 4 × 4 entre *Painel Verde: Coleta Seletiva & Ecopontos*
    e *JavaScript: Quiz Interativo*; o professor confirma o tema).
- Cada curso tem **4 frentes, 3 vagas cada** (24 vagas):
  1. **Didática & Micro-Roteiro** (`frente-didatica`) — roteiro A4 do participante (máx. 4 páginas, LaTeX da UC) e **sala do curso no Moodle**.
  2. **Starter Kit & Código Base GitHub** (`frente-starterkit`) — repositório-modelo enxuto, testado no laboratório, Plano B offline (pen-drive).
  3. **Slides-Guia de Projeção (8 telas)** (`frente-slides`) — slides HTML + Bootstrap 5 no GitHub Pages, numeração casada com o roteiro.
  4. **Monitoria de Bancada & Logística** (`frente-monitoria`) — laboratório, inscrições, presença, satisfação, autorização de imagem, escala de monitores, fotos, relatório.
- Plano da oficina (120 min): 00–15 acolhida e demo via QR Code; 15–35 Bloco 1 (abrir starter kit, personalizar nome/bio/foto/cores);
  35–70 Bloco 2 (componente central: seções + botão WhatsApp no Curso 1; lógica interativa no Curso 2);
  70–95 Bloco 3 (repositório GitHub + GitHub Pages); 95–110 Bloco 4 (QR Code e teste no celular); 110–120 avaliação e fotos.
- Princípio: zero tela em branco, zero instalação complexa.

## Moodle institucional (decisão do professor)
Os cursos serão disponibilizados no **Moodle institucional do IFSC**, onde os próprios estudantes podem atuar com papel de
**professor** do curso. Cada roteiro deve explicar o papel da sua frente no Moodle:
- Didática: cria/organiza a sala (seções = blocos da oficina), publica o roteiro PDF e textos de apoio.
- Starter Kit: publica o `.zip` do kit e o link do repositório como recurso; link para o fork/“Use this template”.
- Slides: insere os slides como recurso URL (GitHub Pages) em cada seção.
- Monitoria: configura presença/feedback (ex.: atividade Pesquisa/Feedback do Moodle) e verifica com a coordenação/TI
  **como os participantes externos acessarão** (inscrição, chave de inscrição ou acesso de visitante). Isso é um risco a confirmar cedo.
Não invente nomes de menus que não existam no Moodle; use os termos padrão (Ativar edição, Adicionar uma atividade ou recurso,
Arquivo, URL, Página, Pesquisa/Feedback, Participantes, Métodos de inscrição).

## Cronograma
- **Candidatura no painel: até 27/10/2026 (terça) às 23:59.**
- **Semana 28/10–30/10 (professor ausente):** encontro da frente em aula, divisão de papéis, primeiro rascunho, check-in.
- Depois: versão de revisão em par entre frentes do mesmo curso → **ensaio geral** (uma equipe ministra para a outra no laboratório)
  → oficina na SNCT → relatório. Datas do ensaio e da SNCT: “a confirmar pelo professor”.

## Padrão técnico (obrigatório)
- `main.tex` com `\newcommand{\numeroRoteiro}{SNCT~N}`, `\newcommand{\tituloCurto}{...}` e
  `\input{../../base-de-conhecimento/preambulo-roteiro-moderno.tex}`; conteúdo em `content.tex`.
- Seguir `base-de-conhecimento/padrao-visual-roteiros-pdf.md` (capa, cartões, objetivos, mapaAula, passos, boxTeste, checklist).
  Em vez de `\trilhaRoteiros`, usar uma tabela das 4 frentes destacando a atual e com quem ela depende/entrega.
- Código completo (Zero-Ellipsis), linhas de código ≤ 103 caracteres, só ícones Font Awesome 5, sem `\newpage`/`\vspace` manuais.
- Compilar com `tectonic main.tex` dentro da pasta; o PDF deve ser `main.pdf`.
- Português claro, direto, para estudantes de 2º/3º semestre que vão trabalhar **sem o professor presente** esta semana.
- Todo roteiro deve ter: “O que fazer nesta semana (28–30/10)” com tarefas por membro (Membro A/B/C),
  marcos com entregável e onde registrar (link de entrega no painel da UC), critérios de “pronto”, riscos comuns, e checklist final.

