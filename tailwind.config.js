/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,js,jsx,ts,tsx,ejs}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      screens: {
        c1: "1000px",
        xs: "480px",
      },
    },
  },
  plugins: [require("preline/plugin")],
};
