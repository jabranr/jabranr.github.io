import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const ARTICLES_DIR = path.resolve('articles');
const SITE_DESCRIPTION =
  'Jabran Rafique is a Senior Software Engineer and Tech Lead at Sky, building progressive, performant and accessible web.';

// Read `description` from an article's front matter (single-quoted, plain or double-quoted YAML)
function frontMatterDescription(file) {
  const source = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
  const frontMatter = source.split(/^---$/m)[1] || '';
  const match = frontMatter.match(/^description:\s*(.+)$/m);
  if (!match) return undefined;
  const value = match[1].trim();
  if (value.startsWith("'")) return value.slice(1, -1).replace(/''/g, "'");
  if (value.startsWith('"')) return JSON.parse(value);
  return value;
}

const articles = fs
  .readdirSync(ARTICLES_DIR)
  .filter((file) => file.endsWith('.md'))
  .map((file) => ({
    file,
    url: `/articles/${file.replace(/\.md$/, '')}/`,
    description: frontMatterDescription(file),
  }));

async function metaDescriptions(page) {
  return {
    description: await page.locator('meta[name="description"]').getAttribute('content'),
    og: await page.locator('meta[property="og:description"]').getAttribute('content'),
    twitter: await page.locator('meta[name="twitter:description"]').getAttribute('content'),
  };
}

test.describe('Meta descriptions', { tag: ['@e2e'] }, () => {
  test('every article has a unique description of 70 to 160 characters', () => {
    expect(articles.length).toBeGreaterThan(0);
    for (const { file, description } of articles) {
      expect(description, `${file} has no description`).toBeTruthy();
      expect(description.length, `${file} description length`).toBeGreaterThanOrEqual(70);
      expect(description.length, `${file} description length`).toBeLessThanOrEqual(160);
      expect(description, `${file} uses an em dash`).not.toContain('—');
    }
    const unique = new Set(articles.map(({ description }) => description));
    expect(unique.size).toBe(articles.length);
  });

  test('every article page renders its own description in the meta tags', async ({ page }) => {
    for (const { url, description } of articles) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      expect(await metaDescriptions(page), url).toEqual({ description, og: description, twitter: description });
    }
  });

  test('top-level pages have their own description', async ({ page }) => {
    const seen = new Set();
    for (const url of ['/', '/articles/', '/projects/', '/speaking/', '/resume/', '/contact/']) {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const { description, og, twitter } = await metaDescriptions(page);
      expect(description, url).not.toBe(SITE_DESCRIPTION);
      expect(description.length, url).toBeGreaterThanOrEqual(70);
      expect(description.length, url).toBeLessThanOrEqual(160);
      expect([og, twitter], url).toEqual([description, description]);
      expect(seen.has(description), `${url} repeats another page's description`).toBeFalsy();
      seen.add(description);
    }
  });

  test('paginated list pages add the page number to the description', async ({ page }) => {
    await page.goto('/articles/2/', { waitUntil: 'domcontentloaded' });
    const { description } = await metaDescriptions(page);
    expect(description).toMatch(/ Page 2 of \d+\.$/);
  });
});
