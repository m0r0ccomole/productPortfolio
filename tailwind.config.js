const fs = require('fs')
const path = require('path')

// The palette lives with the site owner's content (content/theme.js) so a
// recolor never collides with upstream changes to this file. A fresh copy of
// the project has no content/ folder yet, so fall back to the sample palette.
const ownTheme = path.join(__dirname, 'content', 'theme.js')
const themePath = fs.existsSync(ownTheme) ? ownTheme : path.join(__dirname, 'sample', 'content', 'theme.js')
const theme = require(/* turbopackIgnore: true */ themePath)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: theme.colors,
      backgroundImage: theme.gradients,
      boxShadow: {
        'float': '0 10px 30px rgba(0,0,0,0.1)',
        'float-hover': '0 15px 40px rgba(0,0,0,0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        smooth: '300ms',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} 