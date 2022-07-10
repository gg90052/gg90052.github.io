/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chBlue: '#3b5fb2',
        chLightblue: '#44b1da',
      },
    },
  },
  daisyui: {
    themes: [
      'light',
      {
        mytheme: {
          primary: '#3b5fb2',
          secondary: '#44b1da',
        }
      }
    ]
  },
  plugins: [require("daisyui")],
}
