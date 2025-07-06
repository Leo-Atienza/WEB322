module.exports = {
  //content: ["./views/**/*.html"],
  content: ["./views/**/*.ejs"],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: ['cupcake']    // you may choose a different built-in theme
  }
}
