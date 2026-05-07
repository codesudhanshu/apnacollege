/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0d12",
          900: "#11141b",
          800: "#171b25",
          700: "#222837",
        },
        accent: {
          DEFAULT: "#7c5cff",
          soft: "#a294ff",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(124, 92, 255, 0.35)",
      },
    },
  },
  plugins: [],
};
