---
name: statistical-analysis
description: Check statistical claims, experimental reporting, p-values, confidence intervals, ablations, baselines, and reproducibility language in scientific papers.
tags:
  - statistics
  - experiments
  - reproducibility
  - ablation
auto-context:
  - "*.tex"
  - "*.bib"
  - "*.csv"
---

# Statistical Analysis Skill

Use this skill when reviewing results, experiments, ablation studies, or empirical claims.

## Checklist

- Confirm that claims are supported by the reported measurements.
- Check whether sample size, variance, confidence intervals, and statistical tests are reported when needed.
- Distinguish statistical significance from practical significance.
- Verify that baselines, ablations, and evaluation metrics match the stated research question.
- Identify missing seeds, splits, preprocessing details, and hardware/runtime reporting.

## Output

- List unsupported or ambiguous claims first.
- Recommend minimal wording changes or table additions.
- Do not invent numerical results.
