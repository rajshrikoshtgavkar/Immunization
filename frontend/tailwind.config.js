/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Healthcare Primary Colors
        gov: {
          primary: '#1e3a8a',      // Deep Navy Blue (authority)
          secondary: '#0369a1',    // Soft Blue (trust)
          accent: '#0891b2',       // Light Cyan (info)
        },
        // Healthcare Specific Colors
        health: {
          green: '#059669',        // Success/Vaccinated
          teal: '#0d9488',         // Patient side primary
          mint: '#10b981',         // Light success
        },
        // Status Colors
        status: {
          success: '#059669',      // Completed/Active
          warning: '#d97706',      // Upcoming/Pending
          danger: '#dc2626',       // Missed/Critical
          info: '#0284c7',         // Information
        },
        // Extended Primary Palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Extended Secondary Palette
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
