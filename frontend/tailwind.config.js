/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-fast": "ping 0.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      colors: {
        primary: "#01B5C5",
        lightPrimary: "#B2EBF2",
        secondary: "#FF6B6B",
        lightSecondary: "#FFEAEA",
        purpleColor: "#9771FF",
        irisBlueColor: "#01B5C5",
        headingColor: "#181A1E",
        textColor: "#4E545F",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
