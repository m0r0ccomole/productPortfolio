// Site palette. Read by tailwind.config.js at build time.
// Recolor the whole site by editing the hex values below; nothing in
// /components or /pages hardcodes a brand color.
module.exports = {
  colors: {
    // Brand color: buttons, links, accents, focus outline (400)
    primary: {
      50: '#eff6fb',
      100: '#d9eaf5',
      200: '#b5d4ea',
      300: '#86b7da',
      400: '#5a9bc8',
      500: '#1f5f8b',
      600: '#1a5076',
      700: '#154161',
      800: '#11344e',
      900: '#0d283c',
    },
    // Secondary chrome: badges, retired-project cards
    accent: {
      50: '#fbf7f2',
      100: '#f5ebdd',
      200: '#e9d4b8',
      300: '#d9b88d',
      400: '#c89b66',
      500: '#8a5a2b',
      600: '#754c24',
      700: '#5f3e1d',
      800: '#4b3117',
      900: '#3a2612',
    },
  },
  // Used as bg-gradient-primary, bg-gradient-accent, etc.
  gradients: {
    'gradient-primary': 'linear-gradient(135deg, #1f5f8b 0%, #5a9bc8 100%)',
    'gradient-accent': 'linear-gradient(135deg, #8a5a2b 0%, #c89b66 100%)',
    'gradient-warning': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    'gradient-success': 'linear-gradient(135deg, #22577A 0%, #38A3A5 100%)',
  },
}
