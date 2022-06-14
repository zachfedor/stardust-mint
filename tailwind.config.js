const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        coiny: ['Coiny', ...defaultTheme.fontFamily.sans],
        hwt: ['hwt-artz', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'brand-purple': 'var(--clr-purple)',
        'brand-pink': 'var(--clr-pink)',
        'brand-yellow': 'var(--clr-yelpink)',
        'brand-blue': 'var(--clr-blue)',
        'brand-green': 'var(--clr-green)',
        'brand-orange': 'var(--clr-orange)',
        'brand-light': 'var(--clr-light)',
        'brand-background': 'var(--clr-background)',
        'brand-gray': 'var(--clr-gray)'
      },
      animation: {
        'pulse-slow': 'pulse 5s linear infinite'
      }
    }
  },
  plugins: []
}

// fontFamily: {
//   hwt: ['hwt-artz', ...defaultTheme.fontFamily.sans],
// },
// colors: {
//   'pastel-green': "var(--clr-green)",
//   'pastel-yelpink': "var(--clr-yelpink)",
//   'pastel-blue': "var(--clr-blue)",
//   'pastel-purple': "var(--clr-purple)",
//   'pastel-bg': "var(--clr-pink)",