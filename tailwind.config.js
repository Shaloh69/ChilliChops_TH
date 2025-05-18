import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        "chili-red": "#E63946",
        "fresh-green": "#2A9D8F",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#F9FAFB", // Light background
            foreground: "#111827", // Light text primary
            primary: {
              50: "#FDF2F3",
              100: "#FCE8EA",
              200: "#F8C4C9",
              300: "#F3A0A9",
              400: "#EF5967",
              500: "#E63946", // Chili Red
              600: "#CF3340",
              700: "#AD2B36",
              800: "#8A222B",
              900: "#711C23",
              DEFAULT: "#E63946",
              foreground: "#FFFFFF",
            },
            secondary: {
              50: "#EFFAF8",
              100: "#DEF5F1",
              200: "#BEE6DE",
              300: "#9DD8CB",
              400: "#5CBBA5",
              500: "#2A9D8F", // Fresh Green
              600: "#268D81",
              700: "#20766B",
              800: "#195E56",
              900: "#154D46",
              DEFAULT: "#2A9D8F",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#2A9D8F", // Use Fresh Green for success
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#E63946", // Use Chili Red for danger
              foreground: "#FFFFFF",
            },
            focus: "#E63946",
            border: "#E5E7EB", // Light mode border
          },
        },

        dark: {
          colors: {
            background: "#121212", // Dark background
            foreground: "#E5E7EB", // Dark text primary
            primary: {
              // Keep same color scale as light mode
              50: "#FDF2F3",
              100: "#FCE8EA",
              200: "#F8C4C9",
              300: "#F3A0A9",
              400: "#EF5967",
              500: "#E63946", // Chili Red
              600: "#CF3340",
              700: "#AD2B36",
              800: "#8A222B",
              900: "#711C23",
              DEFAULT: "#E63946",
              foreground: "#FFFFFF",
            },
            secondary: {
              // Keep same color scale as light mode
              50: "#EFFAF8",
              100: "#DEF5F1",
              200: "#BEE6DE",
              300: "#9DD8CB",
              400: "#5CBBA5",
              500: "#2A9D8F", // Fresh Green
              600: "#268D81",
              700: "#20766B",
              800: "#195E56",
              900: "#154D46",
              DEFAULT: "#2A9D8F",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#2A9D8F", // Use Fresh Green for success
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#E63946", // Use Chili Red for danger
              foreground: "#FFFFFF",
            },
            focus: "#E63946",
            border: "#2C2C2C", // Dark mode border
          },
        },
      },
    }),
  ],
};
