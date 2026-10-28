const fs = require('node:fs');
const path = require('node:path');
const util = require('node:util');
const dayjs = require('dayjs');
const timeToRead = require('eleventy-plugin-time-to-read');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const dotenvFile = path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`);

if (fs.existsSync(dotenvFile)) {
  require('dotenv-expand').expand(
    require('dotenv').config({
      path: dotenvFile,
      quiet: true,
    })
  );
}

const config = require('./_data/config');

module.exports = function (eleventyConfig) {
  // add config to globals
  Object.keys(config).forEach((k) => {
    eleventyConfig.addNunjucksGlobal(`env_${k}`, config[k]);
  });

  // combine collections for RSS
  eleventyConfig.addCollection('rss', function (collectionApi) {
    return [...collectionApi.getFilteredByTag('articles'), ...collectionApi.getFilteredByTag('projects')].sort(
      (a, b) => b.date - a.date
    );
  });

  // contour maps rendered at /contour/<slug>.svg (see contour.11ty.js)
  const { width, height, tilt } = require('./assets/js/contour-core.js').PAGE_MAP;
  const pageMap = { width, height, tilt };
  eleventyConfig.addCollection('contourMaps', function (collectionApi) {
    const pages = [...collectionApi.getFilteredByTag('articles'), ...collectionApi.getFilteredByTag('projects')].map(
      (item) => ({ slug: item.page.fileSlug, ...pageMap })
    );
    // read fresh (not require) so edits show up while serving
    const work = JSON.parse(fs.readFileSync(path.resolve(__dirname, './_data/work.json'), 'utf8')).map((item) => ({
      slug: item.map,
      width: 720,
      height: 440,
      tilt: 0.2,
    }));

    return [
      { slug: 'home', width: 1600, height: 900, tilt: 0.35 },
      { slug: 'off-the-map', width: 1600, height: 900, tilt: 0 },
      { slug: 'page-articles', width: 1600, height: 440, tilt: 0.6 },
      { slug: 'page-projects', width: 1600, height: 440, tilt: 0.6 },
      { slug: 'page-speaking', width: 1600, height: 440, tilt: 0.6 },
      ...work,
      ...pages,
    ];
  });

  // add plugins
  eleventyConfig.addPlugin(timeToRead);
  eleventyConfig.addPlugin(syntaxHighlight);

  // copy static assets
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy({ public: '.' });

  // add dump for debugging
  eleventyConfig.addFilter('dump', function (value) {
    return util.inspect(value, { depth: 5 });
  });

  // format numbers
  eleventyConfig.addFilter('number_format', function (value) {
    if (Number(value) === 0) {
      return 'N/A';
    }

    return Number(value).toLocaleString();
  });

  // format date time
  eleventyConfig.addFilter('format_date', function (value, format = 'MMMM DD, YYYY') {
    if (format === 'unix') {
      return +dayjs();
    }

    if (value === undefined) {
      return dayjs().format(format);
    }

    return dayjs(Number(value)).format(format);
  });

  eleventyConfig.addFilter('appVersion', function () {
    if (fs.existsSync('./version.txt')) {
      return fs.readFileSync('./version.txt', 'utf8').trim();
    }
    return 'not-set';
  });

  // Get OG image path for a page (convention-based, see scripts/generate-og-images.js)
  eleventyConfig.addFilter('ogImage', function (value) {
    const fallback = fs.existsSync(path.resolve(__dirname, './public/og/default.jpg'))
      ? '/og/default.jpg'
      : '/icon-1024x1024.png';

    // Get the last part of the URL as the slug
    const slug = String(value || '')
      .split('/')
      .filter(Boolean)
      .pop();

    if (slug && fs.existsSync(path.resolve(__dirname, `./public/og/${slug}.jpg`))) {
      return `/og/${slug}.jpg`;
    }

    return fallback;
  });

  // format date time
  eleventyConfig.addFilter('absoluteUrl', function (value) {
    if (!Boolean(value) || value === '/') {
      return config.APP_HOSTNAME;
    }

    const regulateSlash = value.startsWith('/') ? value : `'/'${value}`;
    return `${config.APP_HOSTNAME}${regulateSlash}`;
  });

  // group a list of pages by year, newest first: [{ year, items }]
  eleventyConfig.addFilter('groupByYear', function (items) {
    const groups = [];
    for (const item of items) {
      const year = dayjs(item.date).format('YYYY');
      const last = groups[groups.length - 1];
      if (last && last.year === year) {
        last.items.push(item);
      } else {
        groups.push({ year, items: [item] });
      }
    }
    return groups;
  });

  // unique view-transition-name for a page, so its title morphs between list and page
  eleventyConfig.addFilter('vtName', function (url) {
    const slug = String(url || '')
      .split('/')
      .filter(Boolean)
      .pop();
    return `t-${(slug || 'home').replace(/[^a-z0-9-]/gi, '-')}`;
  });

  eleventyConfig.addNunjucksGlobal('currentYear', new Date().getFullYear());

  eleventyConfig.addWatchTarget('./styles/');
  eleventyConfig.addWatchTarget('./assets/js/');

  // add 404 for dev server
  eleventyConfig.setServerOptions({
    showVersion: true,
  });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
