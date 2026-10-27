/**
 * Contour core: seeded terrain + marching squares.
 *
 * Shared by the browser (assets/js/contour.js), the build (contour SVGs in
 * contour.11ty.js) and the OG image script, so every surface draws the same map.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ContourCore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const GRADIENTS = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // Edge pairs crossed by a contour for each marching-squares case.
  // Corners: 8 top-left, 4 top-right, 2 bottom-right, 1 bottom-left.
  // Edges: 0 top, 1 right, 2 bottom, 3 left.
  const CASES = [
    [],
    [3, 2],
    [2, 1],
    [3, 1],
    [0, 1],
    [0, 1, 3, 2],
    [0, 2],
    [3, 0],
    [3, 0],
    [0, 2],
    [3, 0, 2, 1],
    [0, 1],
    [3, 1],
    [2, 1],
    [3, 2],
    [],
  ];

  // FNV-1a, so a page URL always maps to the same terrain
  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createNoise(seed) {
    const perm = new Uint8Array(512);
    const p = [];
    for (let i = 0; i < 256; i++) p.push(i);

    let s = (seed % 2147483646) + 1;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const tmp = p[i];
      p[i] = p[j];
      p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    const grad = (h, x, y) => {
      const g = GRADIENTS[h & 7];
      return g[0] * x + g[1] * y;
    };
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

    return function noise(x, y) {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const X = xi & 255;
      const Y = yi & 255;
      const xf = x - xi;
      const yf = y - yi;
      const u = fade(xf);
      const v = fade(yf);
      const g00 = grad(perm[perm[X] + Y], xf, yf);
      const g10 = grad(perm[perm[X + 1] + Y], xf - 1, yf);
      const g01 = grad(perm[perm[X] + Y + 1], xf, yf - 1);
      const g11 = grad(perm[perm[X + 1] + Y + 1], xf - 1, yf - 1);
      const x1 = g00 + u * (g10 - g00);
      const x2 = g01 + u * (g11 - g01);
      return x1 + v * (x2 - x1);
    };
  }

  /**
   * Terrain height at (x, y) in CSS pixels, drifting with time t (seconds).
   * `tilt` raises the right-hand side so the map has a direction to it.
   */
  function createTerrain(seed, options) {
    const opts = options || {};
    const noise = createNoise(seed);
    const scale = 1 / (opts.scale || 190);
    const tilt = opts.tilt == null ? 0.35 : opts.tilt;
    const width = opts.width || 1;

    return function height(x, y, t) {
      const time = t || 0;
      let h =
        noise(x * scale + time * 0.045, y * scale + 3.1) +
        0.5 * noise(x * scale * 2.2 - 7.3, y * scale * 2.2 - time * 0.07);
      h += (x / width) * tilt - tilt * 0.35;
      return h;
    };
  }

  /**
   * Sample a height function onto a grid.
   * Returns { field, cols, rows } where field has (cols + 1) * (rows + 1) values.
   */
  function sampleGrid(height, width, heightPx, cell, t, field) {
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(heightPx / cell);
    const size = (cols + 1) * (rows + 1);
    const out = field && field.length === size ? field : new Float32Array(size);
    let k = 0;
    for (let j = 0; j <= rows; j++) {
      const y = j * cell;
      for (let i = 0; i <= cols; i++) {
        out[k++] = height(i * cell, y, t);
      }
    }
    return { field: out, cols, rows };
  }

  /**
   * Marching squares over every contour level crossing each cell.
   * emit(levelIndex, level, x1, y1, x2, y2, cellX, cellY) is called per segment.
   */
  function march(grid, cell, step, base, emit) {
    const field = grid.field;
    const cols = grid.cols;
    const rows = grid.rows;
    const stride = cols + 1;
    const ex = [0, 0, 0, 0];
    const ey = [0, 0, 0, 0];

    for (let j = 0; j < rows; j++) {
      const y0 = j * cell;
      for (let i = 0; i < cols; i++) {
        const x0 = i * cell;
        const k = j * stride + i;
        const a = field[k];
        const b = field[k + 1];
        const c = field[k + stride + 1];
        const d = field[k + stride];
        const min = Math.min(a, b, c, d);
        const max = Math.max(a, b, c, d);
        const last = Math.floor((max - base) / step);

        for (let li = Math.ceil((min - base) / step); li <= last; li++) {
          const l = base + li * step;
          const index = (a > l ? 8 : 0) | (b > l ? 4 : 0) | (c > l ? 2 : 0) | (d > l ? 1 : 0);
          const edges = CASES[index];
          if (!edges.length) continue;

          ex[0] = x0 + (cell * (l - a)) / (b - a);
          ey[0] = y0;
          ex[1] = x0 + cell;
          ey[1] = y0 + (cell * (l - b)) / (c - b);
          ex[2] = x0 + (cell * (l - d)) / (c - d);
          ey[2] = y0 + cell;
          ex[3] = x0;
          ey[3] = y0 + (cell * (l - a)) / (d - a);

          for (let e = 0; e < edges.length; e += 2) {
            emit(li, l, ex[edges[e]], ey[edges[e]], ex[edges[e + 1]], ey[edges[e + 1]], x0, y0);
          }
        }
      }
    }
  }

  /**
   * Join loose segments into polylines so SVG output stays small.
   * segments: flat array [x1, y1, x2, y2, ...]. Returns arrays of [x, y, x, y, ...].
   */
  function chain(segments) {
    const key = (x, y) => Math.round(x * 10) + ',' + Math.round(y * 10);
    const count = segments.length / 4;
    const ends = new Map();
    const used = new Uint8Array(count);

    const add = (k, i) => {
      const list = ends.get(k);
      if (list) list.push(i);
      else ends.set(k, [i]);
    };
    for (let i = 0; i < count; i++) {
      add(key(segments[i * 4], segments[i * 4 + 1]), i);
      add(key(segments[i * 4 + 2], segments[i * 4 + 3]), i);
    }

    const next = (x, y) => {
      const list = ends.get(key(x, y));
      if (!list) return -1;
      for (const i of list) if (!used[i]) return i;
      return -1;
    };

    const lines = [];
    for (let i = 0; i < count; i++) {
      if (used[i]) continue;
      used[i] = 1;
      const pts = [segments[i * 4], segments[i * 4 + 1], segments[i * 4 + 2], segments[i * 4 + 3]];

      // extend forwards from the tail, then backwards from the head
      for (const forward of [true, false]) {
        for (;;) {
          const x = forward ? pts[pts.length - 2] : pts[0];
          const y = forward ? pts[pts.length - 1] : pts[1];
          const n = next(x, y);
          if (n < 0) break;
          used[n] = 1;
          const sx = segments[n * 4];
          const sy = segments[n * 4 + 1];
          const startsHere = key(sx, sy) === key(x, y);
          const ox = startsHere ? segments[n * 4 + 2] : sx;
          const oy = startsHere ? segments[n * 4 + 3] : sy;
          if (forward) pts.push(ox, oy);
          else pts.unshift(ox, oy);
        }
      }
      lines.push(pts);
    }
    return lines;
  }

  /** Ramer–Douglas–Peucker: drop points that stay within `tolerance` px of the line */
  function simplify(pts, tolerance) {
    const n = pts.length / 2;
    if (n < 3) return pts;
    const keep = new Uint8Array(n);
    keep[0] = keep[n - 1] = 1;
    const sq = tolerance * tolerance;
    const stack = [0, n - 1];

    while (stack.length) {
      const last = stack.pop();
      const first = stack.pop();
      const ax = pts[first * 2];
      const ay = pts[first * 2 + 1];
      const dx = pts[last * 2] - ax;
      const dy = pts[last * 2 + 1] - ay;
      const len = dx * dx + dy * dy || 1;
      let worst = 0;
      let at = -1;

      for (let i = first + 1; i < last; i++) {
        const px = pts[i * 2] - ax;
        const py = pts[i * 2 + 1] - ay;
        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / len));
        const ex = px - t * dx;
        const ey = py - t * dy;
        const dist = ex * ex + ey * ey;
        if (dist > worst) {
          worst = dist;
          at = i;
        }
      }
      if (worst > sq) {
        keep[at] = 1;
        stack.push(first, at, at, last);
      }
    }

    const out = [];
    for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i * 2], pts[i * 2 + 1]);
    return out;
  }

  /** Polylines to compact SVG path data using relative moves */
  function toPathData(lines, precision) {
    const f = Math.pow(10, precision == null ? 1 : precision);
    const r = (v) => Math.round(v * f) / f;
    const num = (v) => String(v).replace(/^(-?)0\./, '$1.');
    let d = '';
    for (const pts of lines) {
      let px = r(pts[0]);
      let py = r(pts[1]);
      let rel = '';
      for (let i = 2; i < pts.length; i += 2) {
        const x = r(pts[i]);
        const y = r(pts[i + 1]);
        rel += ' ' + num(r(x - px)) + ' ' + num(r(y - py));
        px = x;
        py = y;
      }
      d += 'M' + num(r(pts[0])) + ' ' + num(r(pts[1])) + 'l' + rel.slice(1);
    }
    return d.replace(/ -/g, '-');
  }

  return { hashString, createNoise, createTerrain, sampleGrid, march, chain, simplify, toPathData };
});
