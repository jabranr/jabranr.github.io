/**
 * Command palette: Ctrl/⌘ K or / to search articles, projects and pages, or run an action.
 *
 * Triggers are plain links to /articles/ ([data-cmdk-open]), so without JavaScript
 * (or without <dialog> support) they still go somewhere useful.
 */
(function () {
  const dialog = document.getElementById('cmdk');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const input = document.getElementById('cmdk-input');
  const list = document.getElementById('cmdk-list');
  const email = dialog.dataset.email;
  const isApple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

  document.querySelectorAll('[data-cmdk-mod]').forEach((el) => (el.textContent = isApple ? '⌘' : 'Ctrl'));

  const toast = (message) => window.siteToast && window.siteToast(message);

  function copyEmail() {
    if (!navigator.clipboard) return toast('Email: ' + email);
    navigator.clipboard.writeText(email).then(
      () => toast('Copied ' + email),
      () => toast('Email: ' + email)
    );
  }

  const PAGES = [
    { g: 'Go to', t: 'Home', h: '/', u: '/' },
    { g: 'Go to', t: 'Articles', h: '/articles/', u: '/articles/' },
    { g: 'Go to', t: 'Projects', h: '/projects/', u: '/projects/' },
    { g: 'Go to', t: 'Speaking', h: '/speaking/', u: '/speaking/' },
    { g: 'Go to', t: 'Resume', h: '/resume/', u: '/resume/' },
    { g: 'Actions', t: 'Switch theme', h: 'Light / dark', run: () => window.siteTheme && window.siteTheme.toggle() },
    { g: 'Actions', t: 'Copy email address', h: email, run: copyEmail },
    { g: 'Actions', t: 'Open GitHub profile', h: 'github.com/jabranr', u: dialog.dataset.github },
    { g: 'Actions', t: 'Subscribe with RSS', h: '/feed.xml', u: '/feed.xml' },
  ];

  let content = [];
  let loading = null;
  let results = [];
  let active = 0;

  function load() {
    if (!loading) {
      loading = fetch('/search.json')
        .then((res) => (res.ok ? res.json() : []))
        .then((items) => {
          content = items.map((item) => ({ g: item.g, t: item.t, h: item.y, u: item.u, k: item.k }));
          if (dialog.open) render();
        })
        .catch(() => {
          loading = null;
        });
    }
    return loading;
  }

  const escape = (text) =>
    String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Title substring matches rank first (word starts higher), then tag matches, then tight in-order fuzzy matches
  function score(query, item) {
    const title = item.t.toLowerCase();
    const at = title.indexOf(query);
    if (at >= 0) {
      return { score: 200 - at + (at === 0 || title[at - 1] === ' ' ? 50 : 0), marks: range(at, query.length) };
    }
    const marks = [];
    let gaps = 0;
    let q = 0;
    for (let i = 0; i < title.length && q < query.length; i++) {
      if (title[i] === query[q]) {
        if (marks.length) gaps += i - marks[marks.length - 1] - 1;
        marks.push(i);
        q++;
      }
    }
    if (item.k && item.k.includes(query)) return { score: 80, marks: [] };
    if (q === query.length && gaps <= query.length) return { score: 70 - gaps, marks };
    return null;
  }

  const range = (start, length) => Array.from({ length }, (_, i) => start + i);

  function highlight(text, marks) {
    if (!marks || !marks.length) return escape(text);
    const set = new Set(marks);
    let out = '';
    for (let i = 0; i < text.length; i++) out += set.has(i) ? '<mark>' + escape(text[i]) + '</mark>' : escape(text[i]);
    return out;
  }

  function render() {
    const query = input.value.trim().toLowerCase();

    if (!query) {
      results = [...PAGES, ...content.filter((item) => item.g === 'Articles').slice(0, 5)].map((item) => ({ item }));
    } else {
      results = [...PAGES, ...content]
        .map((item) => {
          const match = score(query, item);
          return match ? { item, match } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 40);
    }

    active = Math.min(active, Math.max(0, results.length - 1));

    if (!results.length) {
      list.innerHTML =
        '<li class="px-3 py-6 text-center text-sm text-muted" role="presentation">Nothing matches “' +
        escape(input.value) +
        '”. Try “maps”, “git” or “php”.</li>';
      input.removeAttribute('aria-activedescendant');
      return;
    }

    let html = '';
    let group = '';
    results.forEach((result, i) => {
      const { item, match } = result;
      if (!query && item.g !== group) {
        group = item.g;
        html +=
          '<li class="eyebrow px-3 pb-1 pt-3" role="presentation">' +
          (group === 'Articles' ? 'Latest articles' : group) +
          '</li>';
      }
      const hint = query ? item.g + ' · ' + item.h : item.h;
      html +=
        '<li id="cmdk-opt-' +
        i +
        '" class="cmdk-item flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-[0.95rem]" role="option" data-i="' +
        i +
        '" aria-selected="' +
        (i === active) +
        '"><span class="min-w-0 truncate">' +
        highlight(item.t, match && match.marks) +
        '</span><span class="shrink-0 font-mono text-xs text-muted">' +
        escape(hint || '') +
        '</span></li>';
    });
    list.innerHTML = html;
    select(active);
  }

  function select(index) {
    active = index;
    list
      .querySelectorAll('.cmdk-item')
      .forEach((el) => el.setAttribute('aria-selected', String(+el.dataset.i === index)));
    input.setAttribute('aria-activedescendant', 'cmdk-opt-' + index);
    const el = document.getElementById('cmdk-opt-' + index);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  function run(result) {
    if (!result) return;
    const { item } = result;
    dialog.close();
    if (item.run) item.run();
    else if (item.u) window.location.href = item.u;
  }

  function open() {
    if (dialog.open) return;
    input.value = '';
    active = 0;
    render();
    dialog.showModal();
    input.focus();
    load();
  }

  input.addEventListener('input', () => {
    active = 0;
    render();
  });

  input.addEventListener('keydown', (event) => {
    const count = results.length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      select((active + 1) % count);
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      select((active - 1 + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(results[active]);
    }
  });

  list.addEventListener('mousemove', (event) => {
    const el = event.target.closest('.cmdk-item');
    if (el && +el.dataset.i !== active) select(+el.dataset.i);
  });

  list.addEventListener('click', (event) => {
    const el = event.target.closest('.cmdk-item');
    if (el) run(results[+el.dataset.i]);
  });

  // a click on the backdrop lands on the <dialog> itself
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll('[data-cmdk-open]').forEach((trigger) =>
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      open();
    })
  );

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    } else if (event.key === '/' && !typing && !dialog.open) {
      event.preventDefault();
      open();
    }
  });

  // warm the index when someone shows intent
  document
    .querySelectorAll('[data-cmdk-open]')
    .forEach((trigger) => trigger.addEventListener('pointerenter', load, { once: true }));
})();
