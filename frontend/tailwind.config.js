/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "className",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pc: "var(--primary-color)",
        sc: "var(--secondary-color)",
        tc: "var(--tertiary-color)",
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a"},
        white: "#fff",
        gainsboro: "#d9d9d9",
        black: "#000",
        orangered: "#ee2a0f",
        forestgreen: {
          "100": "#149839",
          "200": "#008b27",
        },
        darkgray: "#ad9e9e",
        gray: "#948989",
      },
      spacing: {},
      },
    },
    fontSize: {
      "13xl": "32px",
      "21xl": "40px",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      md: {
        max: "960px",
      },
      sm: {
        max: "420px",
      },
    },
    fontFamily: {
      'body': [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      'sans': [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },

  }

