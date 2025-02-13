/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          bg: '#111827',      // gray-900
          card: '#1F2937',    // gray-800
          input: '#374151',   // gray-700
          border: '#4B5563',  // gray-600
          text: {
            primary: '#F9FAFB',   // gray-50
            secondary: '#D1D5DB', // gray-300
            muted: '#9CA3AF',     // gray-400
          }
        },
        light: {
          bg: '#F9FAFB',      // gray-50
          card: '#FFFFFF',    // white
          input: '#F3F4F6',   // gray-100
          border: '#E5E7EB',  // gray-200
          text: {
            primary: '#111827',   // gray-900
            secondary: '#4B5563', // gray-600
            muted: '#6B7280',     // gray-500
          }
        }
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 