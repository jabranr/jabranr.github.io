---
layout: post
title: Wait for Cloudflare Pages deployment in GitHub Actions
date: 2026-04-20 07:00:00
categories: articles
tags: [articles, Github, Github Actions, Github Workflows, Cloudflare, Cloudflare Pages]
excerpt: 'How to wait for a Cloudflare Pages deployment to complete in GitHub Actions before running dependent jobs like E2E tests or Lighthouse checks.'
comment: true
private: false
---

If you deploy to [Cloudflare Pages](https://pages.cloudflare.com/) and run end-to-end tests, smoke checks, or cache-purge steps afterwards, you have probably hit this problem: your workflow happily marches on to the next step before Cloudflare has even finished building the site.

The deployment is asynchronous. Your workflow can move on before the Cloudflare Pages deployment check for that commit is complete, so subsequent steps that depend on the live URL can end up running against a stale — or entirely absent — deployment.

Here is how I solved that with a small reusable GitHub Actions workflow.

---

### The problem

A typical CD pipeline for a Cloudflare Pages project looks roughly like this:

```
→ push → build → trigger Cloudflare Pages deployment
→ run E2E tests (against live URLs)
```

The deploy step triggers Cloudflare's build pipeline, but it returns almost immediately. By the time the test step runs, the deployment is usually still in progress. This leads to flaky test results and false negatives that are frustrating to debug.

What we actually need is a step that sits between `deploy` and `run tests` and simply waits — polling GitHub's Checks API until the Cloudflare Pages check run for the current commit is completed.

---

### The solution

I put together a reusable composite action, `actions/wait-cf-pages-deployment`, as part of my shared [workflows repository](https://github.com/jabranr/workflows).

It uses GitHub's Checks API to poll the Cloudflare Pages check run for the current commit and blocks the workflow until one of three things happens:

- The check run completes with a `success` conclusion
- The check run completes with a non-success conclusion (and the workflow step fails accordingly)
- The polling timeout is reached

The action accepts the following inputs:

| Input          | Required | Description                              |
| -------------- | -------- | ---------------------------------------- |
| `github-token` | No       | github-token to use for GitHub API calls |

### Usage

Reference it directly in your workflow step:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Wait for Cloudflare Pages deployment
        uses: jabranr/workflows/.github/actions/wait-cf-pages-deployment@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - name: Run E2E tests
        run: npm run test:e2e
```

E2E tests will not start until `wait-for-deployment` resolves, and `wait-for-deployment` will not resolve until the Cloudflare Pages check run is completed successfully.

---

### How the polling works

Under the hood, the action calls the GitHub Checks API endpoint for the current commit:

```
GET /repos/{owner}/{repo}/commits/{ref}/check-runs
```

It finds the **Cloudflare Pages** check run in that response, checks whether its `status` is `completed`, and then verifies the `conclusion` is `success`.

The action polls every 15 seconds for up to 2 minutes and exits as soon as a terminal status is reached, or once the timeout expires.

---

### References

- [actions/wait-cf-pages-deployment on GitHub](https://github.com/jabranr/workflows#actionswait-cf-pages-deployment)
- [GitHub Checks API documentation](https://docs.github.com/en/rest/checks/runs)
- [GitHub Actions — reusable workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows)

---

_Updated: 2026-04-22. This article was corrected and updated for technical errors; an earlier version was partially written by AI and included inaccurate details._
