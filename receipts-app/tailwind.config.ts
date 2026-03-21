import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        panel: "#111114",
        line: "#232329",
        smoke: "#a1a1aa",
        receipt: "#e4e4e7",
        alert: "#f59e0b",
        danger: "#fb7185",
      },
      boxShadow: {
        panel: "0 10px 30px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
