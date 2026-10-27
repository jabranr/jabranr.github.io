const dayjs = require('dayjs');

const SKIP_TAGS = new Set(['articles', 'projects']);

/**
 * Search index for the command palette (assets/js/command.js), at /search.json.
 * Fetched the first time the palette opens.
 */
module.exports = class SearchIndex {
  data() {
    return {
      permalink: '/search.json',
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections }) {
    const toItem = (group) => (item) => {
      const tags = [].concat(item.data.tags || []).filter((tag) => typeof tag === 'string' && !SKIP_TAGS.has(tag));
      return {
        g: group,
        t: item.data.title,
        u: item.url,
        y: dayjs(item.date).format('YYYY'),
        k: tags.join(' ').toLowerCase(),
      };
    };

    return JSON.stringify([
      ...[...collections.articles].reverse().map(toItem('Articles')),
      ...[...collections.projects].reverse().map(toItem('Projects')),
    ]);
  }
};
