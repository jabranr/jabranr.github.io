const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");
const dayjs = require("dayjs");
const timeToRead = require("eleventy-plugin-time-to-read");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const dotenvFile = path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`);

if (fs.existsSync(dotenvFile)) {
  require('dotenv-expand').expand(
    require('dotenv').config({
      path: dotenvFile,
      quiet: true
    })
  );
}

const config = require("./_data/config");

module.exports = function (eleventyConfig) {
  // add config to globals
  Object.keys(config).forEach((k) => {
    eleventyConfig.addNunjucksGlobal(`env_${k}`, config[k]);
  });

  // add plugins
  eleventyConfig.addPlugin(timeToRead);
  eleventyConfig.addPlugin(syntaxHighlight);

  // copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "public/**": "." });
  eleventyConfig.addPassthroughCopy({
    "node_modules/normalize.css/normalize.css": "assets/css/normalize.css",
  });

  // add dump for debugging
  eleventyConfig.addFilter("dump", function (value) {
    return util.inspect(value, { depth: 5 });
  });

  // format numbers
  eleventyConfig.addFilter("number_format", function (value) {
    if (Number(value) === 0) {
      return "N/A";
    }

    return Number(value).toLocaleString();
  });

  // format date time
  eleventyConfig.addFilter(
    "format_date",
    function (value, format = "MMMM DD, YYYY") {
      if (format === "unix") {
        return +dayjs();
      }

      if (value === undefined) {
        return dayjs().format(format);
      }

      return dayjs(Number(value)).format(format);
    }
  );

  // format date time
  eleventyConfig.addFilter("absoluteUrl", function (value) {
    if (!Boolean(value) || value === "/") {
      return config.APP_HOSTNAME;
    }

    const regulateSlash = value.startsWith("/") ? value : `'/'${value}`;
    return `${config.APP_HOSTNAME}${regulateSlash}`;
  });

  eleventyConfig.addWatchTarget("./styles/");

  // add 404 for dev server
  eleventyConfig.setServerOptions({
    showVersion: true,
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
