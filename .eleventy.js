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
      quiet: true
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
    return [
      ...collectionApi.getFilteredByTag('articles'),
      ...collectionApi.getFilteredByTag('projects')
    ].sort((a, b) => b.date - a.date);
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
  eleventyConfig.addFilter(
    'format_date',
    function (value, format = 'MMMM DD, YYYY') {
      if (format === 'unix') {
        return +dayjs();
      }

      if (value === undefined) {
        return dayjs().format(format);
      }

      return dayjs(Number(value)).format(format);
    }
  );

  eleventyConfig.addFilter('appVersion', function () {
    if (fs.existsSync('./version.txt')) {
      return fs.readFileSync('./version.txt', 'utf8').trim();
    }
    return 'not-set';
  });

  // Get OG image path for a page (convention-based)
  eleventyConfig.addFilter('ogImage', function (value) {
    if (!value) {
      return '/icon-1024x1024.png';
    }

    // Extract slug from URL
    const urlParts = value.split('/').filter(Boolean);
    if (urlParts.length === 0) {
      return '/icon-1024x1024.png';
    }

    // Get the last part of the URL as the slug
    const slug = urlParts[urlParts.length - 1];
    const ogImagePath = path.resolve(__dirname, `./public/og/${slug}.png`);

    // Check if OG image exists
    if (fs.existsSync(ogImagePath)) {
      return `/og/${slug}.png`;
    }

    // Fallback to default icon
    return '/icon-1024x1024.png';
  });

  // format date time
  eleventyConfig.addFilter('absoluteUrl', function (value) {
    if (!Boolean(value) || value === '/') {
      return config.APP_HOSTNAME;
    }

    const regulateSlash = value.startsWith('/') ? value : `'/'${value}`;
    return `${config.APP_HOSTNAME}${regulateSlash}`;
  });

  eleventyConfig.addWatchTarget('./styles/');

  // add 404 for dev server
  eleventyConfig.setServerOptions({
    showVersion: true
  });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};
