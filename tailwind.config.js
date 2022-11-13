/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,js,njk,md}',
    './{_includes,articles,projects}/**/*.{html,js,njk,md}'
  ],
  theme: {
    container: {
      center: true
    },
    extend: {}
  },
  plugins: []
};
