/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          50: '#FAF6FA',
          100: '#F4EBF4',
          200: '#E8D5E8',
          300: '#D5B6D5',
          400: '#BD90BD',
          500: '#9E669E',
          600: '#7D477D',
          700: '#5D3A5B', // Primary Brand Plum from reference screenshots
          800: '#4A2A48', // Dark Plum hover
          900: '#341A32',
          950: '#200D1F',
        },
        bgTint: '#F7F4F7', // Soft background tint from UI designs
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(93, 58, 91, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
};
