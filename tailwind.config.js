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
          'linear-gradient(90deg, rgba(252,176,69,1) 0%, rgba(253,29,29,1) 50%, rgba(131,58,180,1) 100%)'
      })
    }
  },
  plugins: []
};
