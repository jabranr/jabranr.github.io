/** @type {import('tailwindcss').Config} */

// Colours are CSS variables (RGB channels) defined in styles/main.css, so light/dark
// switch in one place and work with or without JavaScript.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'selector',
  content: [
    './*.{html,js,njk,md,json}',
    './{_includes,_data,articles,projects}/**/*.{html,js,njk,md,json}',
    './assets/js/**/*.js',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      screens: {
        screen: { raw: 'screen' },
        print: { raw: 'print' },
      },
      colors: {
        paper: token('paper'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        brand: token('brand'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        site: '76rem',
        prose: '42rem',
      },
    },
  },
  plugins: [],
};
