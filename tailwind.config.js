/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#222fb9",
      },
      screens: {
        xs: "475px",
      },
      boxShadow: {
        'custom': '0 0 15px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  safelist: [],
  plugins: [
    require('tailwind-scrollbar'),
  ],
  experimental: {
    optimizeUniversalDefaults: false,
  },
};