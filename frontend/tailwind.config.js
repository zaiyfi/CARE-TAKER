/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-fast": "ping 0.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      colors: {
        primary: "#e10990",
        lightPrimary: "#f340ae",
        secondary: "#ff74ca",
        purpleColor: "#9771FF",
        irisBlueColor: "#01B5C5",
        headingColor: "#181A1E",
        textColor: "#4E545F",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
