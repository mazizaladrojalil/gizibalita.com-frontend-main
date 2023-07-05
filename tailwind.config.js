/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // colors:{
    //     'colorBurn' : '#FFB4B4',
    //     'colorLight' : '#B41318',
    //     'white' : '#FFFFFF',
    // },
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
