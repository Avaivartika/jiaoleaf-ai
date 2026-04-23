---
name: literature-review
description: Build a structured literature review for a manuscript. Use for related work, paper positioning, research gaps, contribution framing, and citation synthesis.
tags:
  - literature
  - related-work
  - citations
  - research
auto-context:
  - "*.tex"
  - "*.bib"
---

# Literature Review Skill

Use this skill to improve related-work and background sections in a LaTeX paper.

## Workflow

1. Identify the target claim, problem, or section being revised.
2. Extract cited works from the active `.tex` and available `.bib` files.
3. Group the literature by method, dataset/domain, contribution type, and limitation.
4. Rewrite the section as a coherent argument rather than a citation list.
5. Flag missing citations, overclaiming, uncited comparisons, and weak transitions.

## Output

- Provide a concise diagnosis of the current literature structure.
- Suggest a paragraph-level outline.
- When editing, preserve existing citation keys unless a replacement is explicitly justified.
- If citations are missing, ask for sources or mark placeholders as `TODO: citation needed`.
