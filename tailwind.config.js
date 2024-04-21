/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'false',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#f9f9f9',
          '100': '#ededed',
          '200': '#e1e1e1',
          '300': '#d3d3d3',
          '400': '#c4c4c4',
          '500': '#b3b3b3',
          '600': '#a0a0a0',
          '700': '#898989',
          '800': '#6c6c6c',
          '900': '#3f3f3f',
          '950': '#000000',
        },
        yelllow: '#ffdd2d'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}