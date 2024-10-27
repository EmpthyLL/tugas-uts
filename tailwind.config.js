module.exports = {
  content: [
    "./**/*.ejs",
    "./node_modules/preline/dist/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        c1: "1000px",
        xs: "380px",
      },
    },
  },
  plugins: [require("preline/plugin"), require("flowbite/plugin")],
};
