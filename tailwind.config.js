/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ct-dark-600": "#222",
        "ct-dark-200": "#575757",
        "ct-dark-100": "#6d6d6d",
        "ct-blue-600": "#2563eb",
        "ct-blue-700": "#1d4ed8",
        "ct-yellow-600": "#ca8a04",
      },
      fontFamily: {
        Poppins: ["Poppins, sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1125px",
          xl: "1125px",
          "2xl": "1125px",
          "3xl": "1500px",
        },
      },
    },
  },
  plugins: [],
};
