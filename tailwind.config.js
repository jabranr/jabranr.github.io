/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,js,njk,md,json}',
    './{_includes,articles,projects}/**/*.{html,js,njk,md,json}'
  ],
  theme: {
    container: {
      center: true
    },
    extend: {}
  },
  plugins: []
};
