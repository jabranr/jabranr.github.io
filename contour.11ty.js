const Core = require('./assets/js/contour-core.js');

// Coarser than the live canvas: lines are simplified and rounded to whole pixels to keep files small
const CELL = 14;
const STEP = 0.075;
const BASE = -1.4;
const TOLERANCE = 0.7;

/**
 * Pre-rendered contour maps at /contour/<slug>.svg.
 *
 * Used as CSS masks (see .contour-mask in styles/main.css) so the lines take the
 * theme colour, need no JavaScript, and are cached like any other image.
 * Every article and project gets its own terrain, seeded from its slug.
 */
module.exports = class ContourMaps {
  data() {
    return {
      pagination: {
        data: 'collections.contourMaps',
        size: 1,
        alias: 'map',
      },
      permalink: (data) => `/contour/${data.map.slug}.svg`,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ map }) {
    const { slug, width, height, tilt } = map;
    const terrain = Core.createTerrain(Core.hashString(slug), { width, tilt });
    const grid = Core.sampleGrid(terrain, width, height, CELL, 0);
    const lines = [];
    const index = [];

    Core.march(grid, CELL, STEP, BASE, (li, level, x1, y1, x2, y2) => {
      (li % 5 === 0 ? index : lines).push(x1, y1, x2, y2);
    });

    const path = (segments) =>
      Core.toPathData(
        Core.chain(segments).map((pts) => Core.simplify(pts, TOLERANCE)),
        0
      );

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
      `<path fill="none" stroke="#000" stroke-opacity=".42" stroke-width="1" stroke-linecap="round" d="${path(lines)}"/>`,
      `<path fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round" d="${path(index)}"/>`,
      '</svg>',
    ].join('');
  }
};
