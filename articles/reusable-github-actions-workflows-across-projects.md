---
layout: post
title: Keeping GitHub Actions workflows in one place instead of copying YAML between repos
date: 2026-09-23 11:00:00
categories: articles
tags: [articles, github-actions, ci-cd, workflows]
excerpt: 'How I stopped copy-pasting CI YAML between personal projects by pulling PR checks, npm publishing, and integration tests into one reusable workflows repository.'
comment: true
private: false
---

Most of my personal projects need roughly the same CI pipeline: run tests, build, lint, check formatting, typecheck, and publish to npm on merge. I had been copying that YAML from one repo's `.github/workflows/` into the next, tweaking a script name here and there. Every fix to that pipeline meant going back and repeating the same edit in every project that had a copy.

Copy-pasted CI configuration drifts. A fix applied to one project's workflow doesn't reach the others unless I remember to go back and apply it everywhere, and after enough repos, I stopped being able to say with confidence which version of the pipeline a given project was actually running.

GitHub Actions supports calling a workflow defined in another repository as if it were a job, using `uses:` at the job level instead of copying its steps. I moved the shared pipeline logic into its own repository and had each project's workflow reduce to a short list of these calls, with `with:` inputs for whatever varies between projects.

```yaml
jobs:
  pr-checks:
    uses: jabranr/workflows/.github/workflows/reusable-pr-checks.yml@main
    with:
      node-version: 24
      run-typecheck: true
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

Fixing a bug in the pipeline now means editing it once, in one repository, and every project referencing `@main` picks it up on its next run.

### Two different levels of reuse

Not everything that repeats across projects is a whole pipeline — some of it is a single step. GitHub Actions has a second mechanism for that: composite actions, referenced at the step level with `uses:` instead of the job level.

The repository ended up split along that line:

- **Reusable workflows** (`reusable-pr-checks.yml`, `reusable-npm-publish.yml`, `reusable-integration.yml`) — whole jobs, called once per pipeline stage.
- **Composite actions** (`actions/actionlint`, `actions/wait-cf-pages-deployment`, `actions/performance-audit`) — single steps, dropped into an existing job alongside other steps.

Getting this split right matters for how projects actually use the repository. A project that already has its own custom CI job but just needs to wait on a Cloudflare Pages deployment before running Lighthouse shouldn't have to adopt an entire reusable workflow just for that one step — a composite action fits there instead.

### A concrete example: waiting on the right commit

The `wait-cf-pages-deployment` action polls GitHub's Checks API until the Cloudflare Pages check run for the current commit completes. The part that took the most iteration wasn't the polling loop — it was figuring out _which_ commit to poll against.

On a `pull_request` event, Cloudflare Pages posts its check against the PR's head commit, not the synthetic merge commit GitHub creates for the diff. Polling the wrong SHA means the check is never found. The action resolves the ref with a small fallback chain to handle that:

```js
const ref = context.payload.pull_request?.head?.sha || context.payload.after || context.sha;
```

This picks the PR head SHA when running on a pull request, the pushed commit SHA on a direct push, and falls back to the default context SHA otherwise. Getting that fallback order wrong was the actual bug the first version of this action had — the fix was three lines, but finding which line needed to change took longer than writing the polling loop did.

Which mechanism to reach for depends on what's actually repeating:

- Need the same whole job (checkout, install, test, build, lint) across projects? Use a reusable workflow, called with `uses:` at the job level.
- Need one step (wait for a deployment, lint the workflow files themselves, run an audit) inside a job a project already has? Use a composite action, called with `uses:` at the step level.
- Not sure yet, because the project's existing pipeline is still project-specific? Start with a composite action for the one repeated step — it's easier to fold into an existing job than to migrate a whole pipeline into someone else's reusable workflow shape.

### References

- [GitHub Actions: reusing workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows)
- [GitHub Actions: creating a composite action](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-composite-action)
- [jabranr/workflows on GitHub](https://github.com/jabranr/workflows)
