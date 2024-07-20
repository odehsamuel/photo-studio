/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens:{
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      spacing : {
        vsm: '35rem',
        thrqrt: '75%',
        half: "42%",
        hlf: "45%",
        oneqrt: "28%",
        scr: '100vh',
        scrw: '100vw'
      }
    },
  },
  plugins: [],
}