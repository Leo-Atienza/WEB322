module.exports = {
  content: ["./views/**/*.html"],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: ['cupcake']    // you may choose a different built-in theme
  }
}
