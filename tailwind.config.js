/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    fontSize: {
      base: '24px',
      normal: ['16px', '19.68px'],
      medium: ['24px', '29.52px'],
      lg: ['48px', '57.6px'],
    },
    extend: {
    },
  },
  plugins: [
    ('flowbite/plugin'),
  ],
}

