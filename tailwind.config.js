/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#2d1115',
          gold: '#c4a484',
          cream: '#fefaf0',
          champagne: '#fdf3e7',
          forest: '#1a3c34', // Deep Natural Green
          'accent-yellow': '#fcd34d', // Vibrant Gold/Yellow
          royal: '#4c1d23', // Deep Royal Purple
          navy: '#0f172a', // Midnight Navy
        },
        fontFamily: {
          serif: ['Playfair Display', 'serif'],
          sans: ['Outfit', 'sans-serif'],
        }
      }
    },
  },
  plugins: [],
};
