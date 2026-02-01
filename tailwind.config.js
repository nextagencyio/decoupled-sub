/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#d1d5db',
            a: {
              color: '#a855f7',
              '&:hover': {
                color: '#c084fc',
              },
            },
            h1: { color: '#f3f4f6' },
            h2: { color: '#f3f4f6' },
            h3: { color: '#f3f4f6' },
            h4: { color: '#f3f4f6' },
            strong: { color: '#f3f4f6' },
            code: { color: '#f3f4f6' },
            blockquote: {
              color: '#9ca3af',
              borderLeftColor: '#a855f7',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
