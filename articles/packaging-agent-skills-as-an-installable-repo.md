---
layout: post
title: Packaging AI agent skills so they can be installed, not copy-pasted
date: 2026-09-23 10:00:00
categories: articles
tags: [articles, ai-agents, tooling, developer-experience]
excerpt: 'How I turned a growing pile of copy-pasted agent instructions into an installable skills repository, and what made a plain file layout the right call.'
comment: true
private: false
---

I keep a small set of tools I use across most of my projects — a shared Prettier config, a shared ESLint setup, some reusable GitHub Actions. Every time I started a new project, I ended up re-explaining the same setup steps to whichever AI coding agent I was using that day: install this package, create that config file, wire up this script. The instructions were always slightly different depending on which agent I was talking to and what I remembered to mention.

Re-explaining the same setup steps by hand doesn't scale, and it isn't reliable — some detail gets left out or phrased differently each time, and the agent ends up guessing at the parts I forgot to say. What I actually wanted was to write each setup procedure down once, in a shape any agent could load directly, instead of retyping it into a chat window per project.

I put together a small repository that holds nothing but setup instructions, one per tool, following the open [Agent Skills specification](https://agentskills.io): a plain `SKILL.md` file with a YAML frontmatter block, grouped under a `skills/<name>/` directory. No runtime code, no build step — just documents an agent can read.

```yaml
---
name: jabraf-prettier
description: Set up Prettier in a project using a shared base config.
---
```

The layout ended up mirroring the tools it documents:

```
skills/
  jabraf-prettier/SKILL.md
  jabraf-eslint/SKILL.md
  jabraf-vitest/SKILL.md
  jabraf-dev-setup/SKILL.md   # orchestrates the individual tool skills
```

Each skill covers one tool in isolation, and one umbrella skill exists purely to chain the individual ones together for a full setup. That separation matters more than it looks: an agent working on an ESLint-only task shouldn't have to load instructions about Vitest just because they live in the same repository.

### Distribution: a CLI instead of git clone

The other half of the problem was distribution. Cloning the whole repository into every project just to read a couple of Markdown files felt backwards, and it would leave stale copies behind the moment the source was updated.

Instead, the repository is installed with the [`skills` CLI](https://github.com/vercel-labs/skills), which fetches just the requested skill directly from GitHub:

```bash
# Install everything, globally, for a given agent
npx skills add jabranr/skills -g -a claude-code --skill '*' -y

# Install just one skill, scoped to the current project
npx skills add jabranr/skills -a claude-code --skill jabraf-prettier -y
```

Because the CLI works against any agent that implements the same specification, the same repository is usable from Claude Code, Codex, Cursor, and others, without maintaining a separate copy of instructions per tool.

### Why not just a README

A README documents a human. These files needed to be readable by an agent deciding, on its own, whether a given skill applies to the current request — which is exactly what the `description` field in the frontmatter is for. Writing that description precisely enough that an agent picks the right skill without being told to turned out to be most of the actual work; the setup steps underneath were usually the easy part.

This only works while the CLI can reach GitHub — there's no offline or vendored fallback, so a skill can't be installed in an environment without network access. That's a real constraint of fetching skills on demand rather than checking them into every project, and it's the tradeoff for not having to keep vendored copies in sync.

### References

- [Agent Skills specification](https://agentskills.io)
- [`skills` CLI on GitHub](https://github.com/vercel-labs/skills)
- [jabranr/skills on GitHub](https://github.com/jabranr/skills)
