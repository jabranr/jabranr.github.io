/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**.{html,js,njk,md}',
    './_includes/**/*.{html,js,njk,md}',
    './content/**/*.{html,md,njk,md}'
  ],
  theme: {
    container: {
      center: true
    },
    extend: {}
  },
  plugins: []
};
