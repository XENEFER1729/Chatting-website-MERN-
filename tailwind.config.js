const { Filter } = require('lucide-react');
const { transform } = require('motion');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1476ff",
        "secondary": "#f3f5ff",
        "light": "#f9faff"
      },
      keyframes: {
        starburstl: {
          '0%': { opacity: 0, transform: 'translateX(0px) scale(1.0)' },
          '100%': { opacity: 1, transform: 'translateX(-50px) translateY(-50px) scale(1.9)',filter: 'drop-shadow(0px 0px 3px cyan)' },
        },
        starburstr: {
          '0%': { opacity: 0, transform: 'translateX(0px) scale(1.0)' },
          '100%': { opacity: 1, transform: 'translateX(50px) translateY(50px) scale(1.5)' },
        },
        starburstt: {
          '0%': { opacity: 0, transform: 'translateX(0px) scale(1.0)' },
          '100%': { opacity: 1, transform: 'translateX(-50px) translateY(50px) scale(1.2)' },
        },
        starburstb: {
          '0%': { opacity: 0, transform: 'translateX(0px) scale(1.0)' },
          '100%': { opacity: 1, transform: 'translateX(50px) translateY(-50px) scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(50px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        starburstl: 'starburstl 1s ease-out',
        starburstr: 'starburstr 1s ease-out',
        starburstt: 'starburstt 1s ease-out',
        starburstb: 'starburstb 1s ease-out',
        fadeInUp: 'fadeInUp 1s ease-out',
        gradientShift:"gradientShift 8s ease infinite"
        // wiggle: 'wiggle 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}