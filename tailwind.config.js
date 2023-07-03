/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
     extend: {
            maxWidth: {
                'dashboard-content': 'calc(100% - 15rem)',
            },
            maxHeight: {
                'sidebar-content': 'calc(100vh - 144px)',
            },
        },
  },
  plugins: [],
};
