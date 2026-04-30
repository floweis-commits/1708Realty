import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#F97316",
        secondary: "#78716C",
        tertiary: "#E6FF1A",
        ink: "#292524",
        line: "#D6D3D1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { none: "0px" },
    },
  },
  plugins: [],
};
export default config;
