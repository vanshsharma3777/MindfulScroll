/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1f2937',
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          text: '#e5e5e5',
          muted: '#9ca3af',
          border: '#2d2d2d',
          accent: '#3b82f6',
        },
        light: {
          bg: '#f9fafb',
          card: '#ffffff',
          text: '#1f2937',
          muted: '#6b7280',
          border: '#e5e7eb',
          accent: '#2563eb',
        }
      },
    },
  },
  plugins: [],
} 