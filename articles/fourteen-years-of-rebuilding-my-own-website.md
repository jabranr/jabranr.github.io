---
layout: post
title: 'Fourteen years of rebuilding my own website'
date: 2026-09-23 09:00:00
categories: articles
tags: [articles, personal blog, jekyll, eleventy, wordpress]
excerpt: 'A look back at why this site has gone through WordPress, Jekyll, and now Eleventy — not because any of them broke, but because I kept wanting to try what came next.'
comment: true
private: false
---

This site started on WordPress in November 2012. It has been rebuilt at least twice since then, and neither rebuild happened because something was broken.

I moved off WordPress in 2014, onto Jekyll and GitHub Pages, and I'm writing this from a version of the site that now runs on Eleventy. Looking back at why, the honest answer both times was mostly curiosity, with a genuine complaint about the previous setup tucked in alongside it.

### Why WordPress felt like overkill

WordPress is a full CMS — a database, an admin panel, a plugin ecosystem, a theme system. All of that is useful if you're publishing dynamic content, managing multiple authors, or need a non-technical editor to update pages. None of that applied to a personal blog and portfolio with one author and a handful of static pages.

Running a database and a PHP application just to serve pages that never actually changed after publishing felt like carrying far more machinery than the job needed. That mismatch, more than any specific problem with WordPress itself, is what pushed the first move.

### The move to Jekyll

Jekyll turns Markdown files into static HTML at build time, so there's no server-side application running at all once the site is built — just files, served directly. That fit a blog far better: write a post in Markdown, generate the site, push the output.

It also meant I got to learn a proper static-site build pipeline for the first time — Sass for stylesheets, Grunt for task automation, and GitHub Pages for hosting the output directly from a repository. None of that was strictly necessary to keep the blog running; I wanted to learn those tools, and moving the site was a good excuse to actually use them on something real rather than a toy project.

### Why Jekyll eventually stopped being the answer

Static output solved the WordPress problem. What it didn't solve, over time, was the build tooling around it. Between Jekyll's Ruby-based plugin ecosystem, Grunt task configuration, and Sass compilation, keeping the build working meant keeping three separate toolchains updated and compatible with each other.

None of that tooling was ever the point — the point was writing and publishing. Wanting less of it, and wanting better build and page performance out of the box, was the real reason for the next move, not any particular thing breaking.

### Landing on Eleventy

Eleventy generates static HTML like Jekyll does, but from a Node-based toolchain instead of a Ruby one, with Nunjucks templates and a much smaller footprint than a typical JavaScript framework. Combined with Tailwind for styling and Cloudflare Pages for hosting, the current setup needs a fraction of the moving parts the Jekyll-era build did.

That's also where most of the newer, more technical posts on this site have come from — patching a `wrangler` deploy issue, waiting on Cloudflare Pages deployments in GitHub Actions, generating Open Graph images at build time. All of that is a byproduct of actually using the current stack, not a plan drawn up in advance.

### What stayed the same

The actual content hasn't changed shape much across three platforms — articles, projects, and a resume. What changed each time was how much infrastructure sat underneath that content, and each move traded one set of tradeoffs for another rather than arriving at something permanent.

I'd be surprised if this is the last rebuild.
