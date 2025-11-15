/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5f0',
          100: '#f4e9dd',
          200: '#e8d0ba',
          300: '#dbb392',
          400: '#c98f63',
          500: '#6F4E37',
          600: '#5d4230',
          700: '#4a3526',
          800: '#38291d',
          900: '#261c14',
        },
      },
    },
  },
  plugins: [],
}
