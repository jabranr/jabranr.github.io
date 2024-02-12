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
    extend: {
      backgroundImage: ({ theme }) => ({
        skyBackground:
          'linear-gradient(90deg,#ff7800,#f80032 17.19%,#ff00a0 42.71%,#8c28ff 60%,#0023ff 85%,#1798ff)'
      })
    }
  },
  plugins: []
};
