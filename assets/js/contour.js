/**
 * Live contour map for elements marked [data-contour-live].
 *
 * The terrain drifts slowly and the pointer raises a hill whose summit rings
 * turn the accent colour. A pre-rendered SVG ([data-contour-static]) shows until
 * the first frame is drawn, and stays as the only map without JavaScript.
 * Reduced motion gets a still map that only moves when the pointer moves.
 */
(function () {
  const Core = window.ContourCore;
  if (!Core) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const CELL = 10;
  const STEP = 0.07;
  const BASE = -1.4;
  const FRAME_MS = 1000 / 30;
  const HILL_HEIGHT = 1.15;
  const HILL_SPREAD = 2 * 85 * 85;
  const SUMMIT_RADIUS = 170 * 170;

  function readColours() {
    const css = getComputedStyle(document.documentElement);
    const rgba = (name, alpha) =>
      'rgba(' + css.getPropertyValue(name).trim().split(/\s+/).join(',') + ',' + alpha + ')';
    return {
      line: rgba('--contour', 0.3),
      index: rgba('--contour', 0.62),
      summit: rgba('--accent', 0.95),
    };
  }

  function init(stage) {
    const canvas = stage.querySelector('canvas');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const seed = Core.hashString(stage.dataset.contourLive || 'jabran.me');
    const posEl = stage.querySelector('[data-contour-pos]');
    const elevEl = stage.querySelector('[data-contour-elev]');
    const restingPos = posEl ? posEl.textContent : '';
    const restingElev = elevEl ? elevEl.textContent : '';
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0, seen: false };

    let width = 0;
    let height = 0;
    let terrain = null;
    let grid = null;
    let colours = readColours();
    let time = 0;
    let running = false;
    let inView = false;
    let lastTick = 0;
    let lastDraw = 0;
    let releaseTimer = 0;
    let queued = false;

    function resize() {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      terrain = Core.createTerrain(seed, { width: width });
      draw();
    }

    function draw() {
      if (!width || !terrain) return;
      const hill = pointer.a * HILL_HEIGHT;
      const px = pointer.x;
      const py = pointer.y;
      const heightAt =
        hill > 0.002
          ? (x, y, t) => {
              const dx = x - px;
              const dy = y - py;
              return terrain(x, y, t) + hill * Math.exp(-(dx * dx + dy * dy) / HILL_SPREAD);
            }
          : terrain;

      grid = Core.sampleGrid(heightAt, width, height, CELL, time, grid && grid.field);

      // Only rings on the hill under the pointer turn the accent colour
      const hasHill = pointer.a > 0.05;
      const summitFrom = hasHill ? terrain(px, py, time) + 0.12 : Infinity;
      const lines = new Path2D();
      const index = new Path2D();
      const summit = new Path2D();

      Core.march(grid, CELL, STEP, BASE, (li, level, x1, y1, x2, y2, cx, cy) => {
        const near = hasHill && level > summitFrom && (cx - px) * (cx - px) + (cy - py) * (cy - py) < SUMMIT_RADIUS;
        const path = near ? summit : li % 5 === 0 ? index : lines;
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
      });

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      ctx.lineWidth = 1;
      ctx.strokeStyle = colours.line;
      ctx.stroke(lines);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = colours.index;
      ctx.stroke(index);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = colours.summit;
      ctx.stroke(summit);

      stage.classList.add('is-live');
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(50, now - (lastTick || now));
      lastTick = now;
      time += dt * 0.001;
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      pointer.a += (pointer.ta - pointer.a) * 0.07;
      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now;
        draw();
      }
      requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion.matches) return;
      running = true;
      lastTick = 0;
      requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
    }

    function drawSoon() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        draw();
      });
    }

    function survey(x, y) {
      if (!posEl || !elevEl) return;
      const lon = -0.36 + (x / width) * 0.42;
      const lat = 51.61 - (y / height) * 0.2;
      posEl.textContent = lat.toFixed(4) + '° N ' + Math.abs(lon).toFixed(4) + '° ' + (lon < 0 ? 'W' : 'E');
      const h = terrain(x, y, time) + HILL_HEIGHT;
      elevEl.textContent = 'Elevation ' + Math.max(0, Math.round((h + 0.9) * 62)) + ' m';
    }

    function moveTo(event) {
      const rect = stage.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      pointer.ta = 1;
      if (!pointer.seen || reduceMotion.matches) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.seen = true;
      }
      if (reduceMotion.matches) {
        pointer.a = 1;
        drawSoon();
      }
      survey(pointer.tx, pointer.ty);
    }

    function release() {
      pointer.ta = 0;
      if (posEl) posEl.textContent = restingPos;
      if (elevEl) elevEl.textContent = restingElev;
      if (reduceMotion.matches) {
        pointer.a = 0;
        drawSoon();
      }
    }

    stage.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') moveTo(event);
    });
    stage.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      moveTo(event);
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(release, 1800);
    });
    stage.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'touch') release();
    });

    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    }).observe(stage);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (inView) start();
    });

    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) stop();
      else if (inView) start();
      drawSoon();
    });

    const recolour = () => {
      colours = readColours();
      drawSoon();
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', recolour);
    new MutationObserver(recolour).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    new ResizeObserver(resize).observe(stage);
  }

  document.querySelectorAll('[data-contour-live]').forEach(init);
})();
