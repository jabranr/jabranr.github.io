import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const slugs = (dir) =>
  fs
    .readdirSync(path.resolve(dir))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));

async function sitemapLocs(request) {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

// Paths of the sitemap URLs; the host is APP_HOSTNAME, which differs per environment
async function sitemapPaths(request) {
  return (await sitemapLocs(request)).map((loc) => new URL(loc).pathname);
}

test.describe('Sitemap', { tag: ['@e2e'] }, () => {
  test('should list each URL once', async ({ request }) => {
    const locs = await sitemapLocs(request);
    const duplicates = locs.filter((loc, index) => locs.indexOf(loc) !== index);
    expect(duplicates).toEqual([]);
  });

  test('should list every article and project as an absolute, trailing-slash URL', async ({ request }) => {
    const locs = await sitemapLocs(request);
    const paths = locs.map((loc) => new URL(loc).pathname);
    for (const slug of slugs('articles')) expect(paths).toContain(`/articles/${slug}/`);
    for (const slug of slugs('projects')) expect(paths).toContain(`/projects/${slug}/`);
    for (const url of ['/', '/articles/', '/projects/', '/speaking/', '/contact/']) expect(paths).toContain(url);
    expect(locs.filter((loc) => !/^https?:\/\/[^/]+\/(.*\/)?$/.test(loc))).toEqual([]);
  });

  test('should leave out noindex and utility pages', async ({ request }) => {
    const paths = await sitemapPaths(request);
    for (const url of ['/404/', '/resume/', '/speed/', '/articles/2/', '/projects/2/', '/search.json', '/feed.xml']) {
      expect(paths).not.toContain(url);
    }
    expect(paths.filter((url) => url.includes('googleb30'))).toEqual([]);
  });

  test('should give each article its date as <lastmod>', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toMatch(
      /<loc>[^<]+\/articles\/github-pages-cloudflare-pages-deployment\/<\/loc>\s*<lastmod>2026-04-20<\/lastmod>/
    );
  });
});
