/**
 * Small site-wide behaviours: theme switch, toast messages and code copy buttons.
 * The theme class itself is set before first paint by the inline script in base.njk.
 */
(function () {
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function stored() {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function current() {
    return root.classList.contains('dark') ? 'dark' : 'light';
  }

  function syncToggles() {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      button.title = 'Switch to ' + next + ' theme';
    });
  }

  function apply(theme) {
    const change = () => {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      root.style.colorScheme = theme;
      syncToggles();
    };
    if (document.startViewTransition && !reduceMotion.matches) {
      // a skipped transition (e.g. mid-navigation) still applies the change
      document.startViewTransition(change).ready.catch(() => {});
    } else {
      change();
    }
  }

  function set(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // private mode: the choice lasts for this page only
    }
    apply(theme);
  }

  window.siteTheme = {
    toggle: () => set(current() === 'dark' ? 'light' : 'dark'),
    set,
  };

  // follow the OS until the visitor makes a choice
  systemDark.addEventListener('change', (event) => {
    const choice = stored();
    if (choice !== 'light' && choice !== 'dark') apply(event.matches ? 'dark' : 'light');
  });

  document
    .querySelectorAll('[data-theme-toggle]')
    .forEach((button) => button.addEventListener('click', window.siteTheme.toggle));
  syncToggles();

  let toastTimer = 0;
  window.siteToast = function (message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 2600);
  };

  if (navigator.clipboard) {
    document.querySelectorAll('.prose pre').forEach((pre) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.textContent = 'Copy';
      button.addEventListener('click', () => {
        const code = pre.querySelector('code') || pre;
        navigator.clipboard.writeText(code.innerText).then(
          () => {
            button.textContent = 'Copied';
            setTimeout(() => (button.textContent = 'Copy'), 1600);
          },
          () => window.siteToast('Could not copy. Select the code instead.')
        );
      });
      pre.appendChild(button);
    });
  }
})();
