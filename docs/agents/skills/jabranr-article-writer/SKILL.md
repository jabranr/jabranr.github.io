---
name: jabranr-article-writer
description: Draft or edit posts in articles/ on jabranr.github.io matching the site's existing voice, structure, and frontmatter. Use when asked to "write a new article/post", "draft a blog post", "add an article", or when editing an existing article's prose. Also flags recurring writing-quality issues in the corpus so they don't get repeated in new posts. Do not use for code-only changes (templates, styles, config) unrelated to article prose.
---

# Jabranr article writer

Voice model built from `articles/*.md` (2012–present). Two post families exist; pick one deliberately, don't blend them.

## Post families

**Personal/narrative** (e.g. `first-tech-job.md`, `finally-a-blog-and-folio.md`): reflective, first-person storytelling, long flowing paragraphs, real names/places/dates, one pull-quote via `>` blockquote mid-post, no subheadings or light use of `###` only. Ends on a reflective one-liner, not a call-to-action.

**Technical how-to** (e.g. `fix-wrangler-deploy-error-in-remix-app.md`, `github-pages-cloudflare-pages-deployment.md`): opens with the concrete problem/symptom (often an actual error string in a code block) in 2-3 short paragraphs, stated as flowing prose rather than under a heading, then the solution follows as prose too — do not use `### The problem` / `### The solution` as literal headings, that pattern reads as templated and should be retired. Use `###` subheadings only for genuinely distinct named topics within the post (e.g. `### Word wrapping on a canvas`, `### Gotcha`), never as generic labels for the problem/solution structure itself. Short paragraphs (2-5 sentences), code blocks with language tags, a `### References` bullet list of source links at the end. Newer ones use `---` horizontal rules between major sections; older ones don't — match whichever convention the rest of the corpus is trending toward (post-2023 style is the current standard).

## Frontmatter — use the current (post-2023) shape, not the legacy one

```yaml
---
layout: post
title: Clear, specific title — no clickbait, sentence case is fine unquoted
date: YYYY-MM-DD HH:MM:SS
categories: articles
tags: [articles, tag-one, tag-two]
excerpt: 'One sentence that states what the reader will learn or what happened — must not just repeat the opening sentence of the body.'
comment: true
private: false
---
```

Do **not** carry over `permalink:` or `thumbnail:` — these appear empty in old posts and are dead weight; newer posts have already dropped them.

## Voice characteristics to reproduce

- First person, direct, unhedged: "Here is how I solved that", not "One might consider...".
- States a real problem the author actually hit, not a hypothetical.
- Technical posts credit sources inline as links the first time a tool/repo/issue is mentioned.
- Opinions are stated plainly ("This is what we are trying to achieve at Rated People") rather than softened.
- Sentence length varies; technical explanation sentences are short and concrete, personal narrative sentences run longer and are more descriptive.
- Uses `—` (em dash) or `&mdash;`/`&ndash;` for asides — pick one style per post and be consistent within it, prefer plain `—` for new posts.
- Tables only when listing structured options/inputs (see `github-pages-cloudflare-pages-deployment.md`), not decoratively.
- Ends technical posts with a working code snippet or references list — not a generic summary paragraph ("In conclusion, we have learned...").

## Writing for the reader, not for someone with repo access

The reader cannot see this codebase. Never reference internal file paths, private scripts, or repo-specific structure as if the reader already knows them.

- Don't write "I wrote `scripts/generate-og-images.js`" — write "I wrote a small script" or "I wrote a small Node script" and only name a path if that path is itself the point being taught (e.g. `node_modules/wrangler/src/entry.ts` in the wrangler patch post, because the reader needs that exact path to reproduce the fix).
- Before naming any file path, ask: does the reader need this path to follow along, or is it just internal bookkeeping? If it's bookkeeping, drop it.
- When frontmatter, config, or data structure is mentioned, show a short illustrative example (even a 2-3 line truncated one) rather than asserting its shape in prose. A reader should never have to trust an unexplained claim about a structure they can't see.
- Public, referenceable things (published packages, public GitHub repos, public docs, tools everyone can install) are fine to name directly — the constraint is specifically about repo-private internals.

## Explain the problem in plain words before the solution

Every "how I solved X" section must do two things, in order, before any code appears:

1. State the problem in the simplest possible wording — what breaks, what's annoying, or what's missing, as if explaining to someone who has never seen the codebase. One or two sentences, no jargon that hasn't been introduced yet.
2. Only then introduce the solution, and note any real tradeoffs made along the way (why this approach over an obvious alternative) — don't just present the solution as the only option that existed.

Do not open a solution section with a code snippet or a tool name before the reader knows _why_ it's needed. If a paragraph mentions a technique or library for the first time, the sentence before it should already have made clear what problem that technique solves.

Do this as continuous prose, not as `### The problem` / `### The solution` headings — that labelling is templated filler; the transition from problem to solution should read naturally without announcing itself.

## Existing quality issues in the corpus — do not repeat these in new posts, and flag them if touching an old post

- Inconsistent `tags` array quoting (mix of quoted strings and bare capitalized words in the same array). New posts: all lowercase, all unquoted unless the tag has a space or hyphen requiring quotes.
- Inconsistent title quoting (`'Title'` vs bare `Title`) across posts — use bare unquoted titles unless the title contains a colon or starts with a special character.
- Some older posts have run-on paragraphs (6+ sentences, shifting topic mid-paragraph) and occasional tense drift within a single paragraph — new posts should keep one paragraph to one idea.
- A few older technical posts skip a "References" section even though they cite issues/PRs inline — always close a technical post with references if any external links were cited.
- Old excerpts sometimes just copy the article's first sentence verbatim — write the excerpt as a distinct one-line summary.
- Minor grammar slips survive in old posts (subject-verb agreement, "advance" for "advanced", "lease" for "least") — proofread new content properly; don't preserve these as "voice".

## Pedagogical techniques worth borrowing (from joshwcomeau.com) — structure, not tone

These are content-quality techniques, not a voice to imitate. Comeau's blog is playful, emoji-heavy, and full of interactive demos and course upsells — none of that fits this corpus. What's worth taking is _how he builds understanding_, adapted to this site's plainer, more direct voice:

- **Answer the "why" at the exact point of confusion, not after.** When introducing a property/decision that looks arbitrary (e.g. "why `max-width` and not `width`?"), state the reason in the very next sentence — don't wait for a later paragraph or a FAQ-style recap. A short rhetorical question is fine here ("Why not just X?") as long as it's answered immediately, not left hanging as a hook.
- **Use one concrete analogy per genuinely confusing mechanism, not one per paragraph.** Comeau's "auto margins are like Hungry Hungry Hippos" works because it's used exactly once, for the one part of the mechanism that's actually non-obvious. Reach for an analogy only when a plain explanation has already been tried and still feels abstract — don't decorate easy concepts with cute comparisons for their own sake.
- **State a limitation honestly instead of glossing over it.** When something almost works, or a technique has a real caveat, say so plainly and explain the boundary, rather than presenting the solution as unconditionally clean. This matches the existing "note real tradeoffs" rule, but the specific move to borrow is naming _why_ the limitation exists, not just that it exists.
- **When multiple valid approaches were compared, end with a short decision guide, not a single "best" answer.** A few bullets mapping situation → approach (e.g. "if X, use A; if Y, use B") is more useful than declaring one technique universally superior, and doubles as a legitimate non-generic closing section.
- **Prefer showing the failure before the fix.** If a naive first attempt would produce a wrong or surprising result, show that outcome (or describe it precisely) before introducing the corrected approach — this is what makes the fix feel earned rather than asserted.
- Do not adopt: emoji as punctuation, sidebar/interactive widgets, "Let's..." as a section-opening tic, or course/product plugs. Those are specific to Comeau's brand and would clash with this corpus's plainer voice.

## Anti-slop guardrails (hard constraints)

- No throat-clearing openers: never start with "In today's fast-paced world", "In this article, we will explore", or similar generic framing.
- No content-free transition phrases ("It's important to note that", "Let's dive in", "Without further ado").
- No padding with obvious statements or repeating the excerpt inside the first paragraph.
- No listicle-ifying a narrative post — bullet lists belong in technical posts describing steps/options, not in personal stories.
- Every technical claim must be something the author could plausibly have verified (a real command, a real error message, a real repo) — don't invent tools, stats, or "studies show" filler.
- Don't add a generic "Conclusion" section; end with the last concrete point, a code block, or references, matching the corpus.
- Keep the post's actual length proportional to content — most posts here are 80-160 lines; don't stretch a simple fix into a padded 300-line article.

## Workflow

1. Identify which family (narrative vs technical) the topic fits.
2. Read 1-2 of the most similar existing articles for that family before drafting (rg by topic/tag in `articles/`).
3. Draft frontmatter using the current shape above; pick a real, specific `date`.
4. Draft body following that family's structure; keep paragraphs short and single-topic.
5. Self-check before finishing:
   - Against the "existing quality issues" and "anti-slop guardrails" lists above.
   - No internal/private file paths named unless the reader needs that exact path to follow along.
   - Every structure (frontmatter, config, data shape) mentioned in prose has a short example shown, not just asserted.
   - Every solution section states the plain-language problem first, then the solution and its tradeoffs.
   - Every non-obvious decision is justified at the point it's introduced (see "Pedagogical techniques" above), and technical posts comparing multiple approaches end with a decision guide instead of declaring one universal winner.
6. Save as `articles/<lowercase-hyphenated-title>.md`.
7. Suggest running `npm start` to preview and `npm test` if templates/collections are affected.
