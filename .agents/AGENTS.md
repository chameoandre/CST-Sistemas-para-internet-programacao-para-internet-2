# Directives & Quality Assurance Rules for ProgWeb 2 Workspace (IFSC Garopaba)

The rules in this file are automatically loaded by the AI assistant whenever working within this workspace.

## 1. GitHub Pages & Deployment Verification
- **Jekyll Bypass (.nojekyll):** Maintain a `.nojekyll` file at the repository root to prevent GitHub Pages build failures on raw code snippets, LaTeX files, or macOS metadata.
- **Post-Push Live Verification:** After pushing commits with `git push origin main`, verify live deployment readiness and ensure GitHub Pages URLs respond cleanly without build errors.

## 2. Pedagogical Progression & Code Examples
- **Library Separation:** Keep pure static component layouts (e.g., Bootstrap 5 static cards/tables) distinct from interactive versions (Bootstrap + jQuery / JS).
- **Step-by-Step Library Introductions:** When introducing a new library or tool for the first time (e.g., jQuery in Exemplo 6), explicitly teach the 3 mandatory steps:
  1. Script inclusion via CDN (`<script src="..."></script>`).
  2. Safe DOM initialization wrapper (`$(document).ready(function() { ... })`).
  3. Command syntax and selector anatomy (`$(seletor).método()`).
- **Spacious Code Previews:** Presentation slide code blocks (e.g., Slide 7 & Slide 8) must use generous scroll viewports (`max-height: 420px` or 100% card width) to facilitate live coding and classroom projection.
- **Explicit Dependency CDN Declarations:** Always declare required secondary CDN stylesheets (such as `bootstrap-icons.min.css` for `<i class="bi bi-*"></i>`) in code examples and slide documentation.

## 3. LaTeX Compilation & PDF Output
- **Compiler Requirement:** Use `tectonic` for all `.tex` file compilations (`prog-internet-2.tex`, `plano_de_ensino.tex`, etc.).
- **PDF Artifact Sync:** Always compile and verify output PDFs after editing TeX sources.

## 4. Repository Hygiene & Commits
- **Git Commit Messages:** Write clear, professional commit messages in Portuguese starting with action verbs (e.g., `Estrutura o Exemplo 6...`, `Adiciona o arquivo .nojekyll...`).
- **Ignored Metadata:** Maintain `.gitignore` entries for `.DS_Store`, `Icon\r`, and auxiliary LaTeX build logs.

## 5. Workspace Trust & Command Execution Directives
- **Trusted Workspace Execution:** This workspace (`uc-programacao-para-a-internet-2`) is fully trusted for file creation, modification, LaTeX compilation via `tectonic`, and Git operations.
- **Streamlined Command Execution:** Always combine shell commands into single non-interactive executions (e.g. using `&&` operators) to streamline builds, testing, and git deployments without unnecessary interactive prompt pauses.

## 6. Base de Conhecimento & Regra do Código Completo (Zero-Ellipsis Rule)
- **Base de Conhecimento:** Consultar as diretrizes em `base-de-conhecimento/` como fonte única de verdade para elaboração de materiais didáticos.
- **Código Completo em Tutoriais:** Todo trecho de código nos roteiros destinados aos estudantes deve ser 100% completo, sem resumos, sem reticências (`...`) ou omissões de elementos (como `#toastMensagem`, opções de `<select>`, ou contêineres). Qualquer elemento manipulado no JavaScript deve estar expressamente criado no HTML dos passos anteriores.

## 7. Tipografia e Bootstrap no Dashboard (`index.html`)
- **Bootstrap obrigatório:** O `index.html` carrega o Bootstrap 5.3.3 (`bootstrap.min.css`). Não remova esse link: o markup depende das classes utilitárias (`text-muted`, `small`, `fw-bold`, `row`/`col-*`, `form-control` etc.).
- **Sem tamanhos inline:** Não use `font-size` em atributos `style`. Use os tokens da "CAMADA DE LEGIBILIDADE": `--fs-label` (12px), `--fs-caption` (13px), `--fs-small` (14px), `--fs-body-sm` (15px) e `--fs-body` (16px).
- **Piso de leitura:** Texto corrido nunca fica abaixo de 15px; somente selos e rótulos curtos podem usar 12–13px.
- **Contraste:** Texto secundário usa `var(--text-muted)`, nunca um cinza fixo; contraste mínimo de 4,5:1 nos temas claro e escuro.
- **Fontes:** Inter (corpo), Outfit (títulos) e Fira Code (código). Novas regras de estilo entram na camada de legibilidade, no fim do `<style>`.
