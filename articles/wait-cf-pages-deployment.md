---
layout: post
title: Wait for Cloudflare Pages deployment in GitHub Actions
date: 2026-04-20 07:00:00
categories: articles
tags: [Github, Github Actions, Github Workflows, Cloudflare, Cloudflare Pages]
excerpt: 'Here is a quick overview of my journey from WordPress to Github that introduced me to amazing collection of tools in web industry.'
permalink: '/articles/github-pages-cloudflare-pages-deployment/'
comment: true
private: false
---

If you deploy to [Cloudflare Pages](https://pages.cloudflare.com/) and run end-to-end tests, smoke checks, or cache-purge steps afterwards, you have probably hit this problem: your workflow happily marches on to the next step before Cloudflare has even finished building the site.

The deployment is asynchronous. GitHub has no native way of knowing when Cloudflare Pages is done, so subsequent steps that depend on the live URL can end up running against a stale — or entirely absent — deployment.

Here is how I solved that with a small reusable GitHub Actions workflow.

---

### The problem

A typical CD pipeline for a Cloudflare Pages project looks roughly like this:

```
→ push → build → deploy (handled by built-in Cloudflare action)
→ run E2E tests (against live URLs) (handled by custom GitHub Workflow)
```

The deploy step triggers Cloudflare's build pipeline, but it returns almost immediately. By the time the test step runs, the deployment is usually still in progress. This leads to flaky test results and false negatives that are frustrating to debug.

What we actually need is a step that sits between `deploy` and `run tests` and simply waits — polling Cloudflare's API until the deployment status comes back as `success` or `failure`.

---

### The solution

I put together a reusable composite action, `actions/wait-cf-pages-deployment`, as part of my shared [workflows repository](https://github.com/jabranr/workflows).

It uses the Cloudflare REST API to poll the latest deployment for a given Pages project and blocks the workflow until one of three things happens:

- The deployment status changes to `success`
- The deployment status changes to `failure` (and the workflow step fails accordingly)
- The polling timeout is reached

The action accepts the following inputs:

| Input          | Required | Description                              |
| -------------- | -------- | ---------------------------------------- |
| `github-token` | No       | github-token to use for GitHub API calls |

### Usage

Reference it directly in your workflow using `workflow_call`:

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

E2E tests will not start until `wait-for-deployment` resolves, and `wait-for-deployment` will not resolve until Cloudflare confirms the deployment is complete.

---

### How the polling works

Under the hood, the action calls the Cloudflare API endpoint:

```
GET /accounts/{account_id}/pages/projects/{project_name}/deployments
```

It reads the `latest_stage.status` field on the most recent deployment object. Cloudflare cycles this through several stages — `queued`, `cloning_repo`, `building`, `deploying` — before eventually settling on `success` or `failure`.

The action loops on a configurable interval and exits as soon as a terminal status is reached, or once the timeout expires.

---

### References

- [actions/wait-cf-pages-deployment on GitHub](https://github.com/jabranr/workflows#actionswait-cf-pages-deployment)
- [Cloudflare Pages API documentation](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/)
- [GitHub Actions — reusable workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows)
