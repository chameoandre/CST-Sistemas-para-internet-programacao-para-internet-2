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

