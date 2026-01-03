import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0F6FFF",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f6f8fb",
          foreground: "#5b6470",
        },
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
