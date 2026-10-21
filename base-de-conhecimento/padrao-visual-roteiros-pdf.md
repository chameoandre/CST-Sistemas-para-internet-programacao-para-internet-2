# Padrão visual dos Roteiros Práticos em PDF (LaTeX) — ProgWeb 2

> Registrado em 21/10/2026, adaptado do padrão da UC **Iniciação Científica e Extensionista**
> (`uc-iniciacao-cientifica-extensionista/.agents/base-de-conhecimento/padrao-visual-roteiros-pdf.md`).
> Preâmbulo único, compartilhado por todos os roteiros: [`preambulo-roteiro-moderno.tex`](preambulo-roteiro-moderno.tex).
> Roteiros no padrão: **01, 02, 03, 04, 05 (Parte 1)** e **05 (Parte 2 — Tarefa Guiada)**.
> Referência mais completa: `roteiro-5/content.tex` (Parte 1).

## 1. Princípios

1. **Leitura confortável:** fonte sem serifa (Source Sans Pro), entrelinha 1,18, parágrafos separados por espaço (sem recuo), tabelas e caixas alinhadas à esquerda.
2. **Código que o aluno copia do PDF funciona:** o código nas janelas nunca é resumido (regra *Zero-Ellipsis*, ver `diretrizes-materiais-pedagogicos.md`) e nenhuma linha passa de **103 caracteres** — é o que cabe numa linha da janela de código; acima disso o PDF quebra a linha e a cópia sai partida.
3. **Cores institucionais IFSC em tons suaves:** azul-escuro e verde como base; cores de destaque só para significado (dica, atenção, conceito, checkpoint, avançado).
4. **Ícones com função, não decoração** (`fontawesome5`).

## 2. Como montar um roteiro

`main.tex` de cada roteiro (o `\documentclass` está dentro do preâmbulo):

```latex
\newcommand{\numeroRoteiro}{06}
\newcommand{\tituloCurto}{Título curto do cabeçalho}
\input{../base-de-conhecimento/preambulo-roteiro-moderno.tex}
\begin{document}
\input{content.tex}
\end{document}
```

Compilar com `tectonic main.tex` (dentro da pasta do roteiro).

### Abertura padrão do `content.tex` (nesta ordem)

1. `\capaRoteiro{ícone}{Título}{Subtítulo}{chips}` — faixa em degradê azul → verde; chips com `\chip{\faIcone}{texto}` (módulo, ferramentas, pré-requisito).
2. `\cartoesUC{Produto deste roteiro}` — três cartões: UC, docente, produto.
3. `\begin{boxObjetivos} \begin{itemize}...\end{itemize} \end{boxObjetivos}` — "Ao final desta prática você será capaz de…".
4. `\begin{mapaAula}` com quatro `\etapaMapa{cor}{n}{Título}{descrição (Seção~\ref{...})}` (cores: `azulMedio`, `verdeVivo`, `ambar`, `roxo`).
5. `\section{Onde este roteiro se encaixa}` com `\trilhaRoteiros{n}` (trilha 01 → 05 com o roteiro atual em destaque) e a figura de prévia da aplicação.

Fechamento: seção de checklist com `\begin{checklist} \begin{itemize} \item[\caixaMarcar] ... \end{itemize} \end{checklist}` e, quando houver, `\begin{dica}{Próximo passo}`.

## 3. Componentes

| Componente | Sintaxe | Quando usar |
|---|---|---|
| Janela de código | `\begin{boxCodigoJS}[caminho/arquivo.js]` (também `boxCodigoHTML`, `boxCodigoPY`, `boxCodigoCSS`) | Todo código que o aluno digita ou copia. O argumento é o nome do arquivo mostrado na barra |
| Janela genérica | `\begin{codigo}[txt]{requirements.txt}` | Arquivos sem realce (txt, json simples) |
| Árvore de pastas | `\begin{arvore}[Título]` | Estrutura de diretórios do projeto |
| Terminal | `\begin{saida}[Terminal]` | Comandos e respostas do terminal (fundo escuro) |
| Croqui | `\begin{boxCroqui}[Título]` | Desenho em texto do fluxo ou da tela |
| Navegador | `\begin{mockupNavegador}[Título]` | Prévia da tela final |
| Passo | `\passo{1.2}{Criar a página HTML}` | Antes de cada janela de código do passo a passo |
| Manter junto | `\manterJunto{n}` (n = linhas do bloco) | Antes do `\passo` de blocos curtos (até ~48 linhas): o bloco não se divide entre páginas |
| Atividade / fase | `\begin{boxAtividade}[Título]` | Enunciado de mini-exemplo, fase ou tarefa |
| Checkpoint | `\begin{boxTeste}[Título]` | "Como testar" depois de cada passo |
| Conceito | `\begin{conceito}{Título}` | Fundamentação teórica curta |
| Dica / Atenção / Sucesso / Avançado | `\begin{dica}{…}`, `atencao`, `sucesso`, `avancado` | Boas práticas, riscos, princípios, conteúdo opcional |
| Repositório | `\begin{repositorio}{Código-fonte completo no GitHub}` | Links para os arquivos no GitHub |
| Tecla / botão | `\tecla{Ctrl}+\tecla{C}`, `\botao{Arquivo}\seta\botao{Salvar}` | Atalhos e caminhos de interface |
| Tabela | `\renewcommand{\arraystretch}{1.45}\rowcolors{2}{fundo}{white}` + `\cabecalho \cab{Coluna} & …` | Sem linhas; 1ª coluna `R` (rótulo em negrito azul), demais `Y` (X alinhada à esquerda) |

Os nomes antigos de cores (`azulTitulo`, `ifscGreen`, `cinzaFundo`…) continuam definidos, mas novos roteiros devem usar a paleta nova (`azul`, `azulMedio`, `verde`, `verdeVivo`, `ambar`, `vermelho`, `roxo`, `suave`, `borda`, `fundo`).

## 4. Armadilhas já resolvidas (não repetir)

- **Linhas de código com mais de 103 caracteres** quebram no PDF e a cópia sai partida (o Roteiro 05 ainda tem 4 e a Tarefa Guiada 13, herdadas da versão anterior).
- **Não usar `\newpage` nem `\vspace` manuais** para empurrar código: use `\manterJunto{n}`.
- **Não usar `$\Box$`** (o pacote `newtxmath` não é mais carregado): use `\caixaMarcar`.
- **Não numerar subtítulos à mão** (`\subsection{1. Leitura…}`): a numeração é automática.
- **`\texttt` longos sem espaço** em texto corrido estouram a margem: caminhos e URLs vão em `\path{…}`/`\url{…}` (quebram em qualquer ponto, pacote `xurl`); cadeias de métodos recebem `\allowbreak{}` depois dos pontos.
- **Ícones:** só nomes do Font Awesome 5 (ex.: `\faExclamationTriangle`, `\faCheckCircle`); nomes do FA6 (`\faTriangleExclamation`) não existem no pacote `fontawesome5`.
- **Vírgula no título de `tcolorbox`** quebra as opções: envolver o título em chaves (`[{Título, com vírgula}]`).
