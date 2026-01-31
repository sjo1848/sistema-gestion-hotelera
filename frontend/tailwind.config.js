/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hotel-blue': '#1e293b',
        'available': '#22c55e',
        'occupied': '#ef4444',
        'dirty': '#eab308',
        'maintenance': '#64748b',
      }
    },
  },
  plugins: [],
}
