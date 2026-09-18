import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFAF6",
          100: "#F7F3EB",
          200: "#EFE8DC",
          300: "#E4D8C4",
        },
        forest: {
          50: "#EAF3ED",
          100: "#CDE4D4",
          200: "#9CC9A9",
          500: "#2D6A4F",
          700: "#1B4332",
          800: "#133124",
          900: "#0B1D15",
        },
        gold: {
          50: "#FDFBF2",
          100: "#FAF5E0",
          200: "#F3E7BA",
          400: "#E0C366",
          500: "#D4AF37",
          600: "#B89326",
          700: "#8C6E19",
        },
        sand: {
          50: "#FAF7F2",
          100: "#F3ECE2",
          200: "#E5D7C5",
          300: "#D4C0A7",
          400: "#BC9F80",
        },
        rosewood: {
          50: "#FDF4F4",
          100: "#FCE8E8",
          200: "#F7C9C9",
          600: "#C44545",
          700: "#9A2E2E",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 67, 50, 0.06)',
        'luxury': '0 10px 30px -4px rgba(212, 175, 55, 0.15)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
export default config;
